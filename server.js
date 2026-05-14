import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import OpenAI from 'openai';
import { promises as fs } from 'fs';

// Internal providers & cache
import { fetchTimeSeries } from './backend/providers/twelvedata.js';
import { fetchHistorical, fetchBatchCurrentPrices } from './backend/providers/yahoo.js';
import { getCache, setCache, TTL } from './backend/cache/inMemoryCache.js';
import { bulkUpsertAssetCache, getCachedHistorical, setCachedHistorical, logApiUsage } from './backend/providers/supabase.js';

// Global scheduler (1 batch per 60 s, replaces per-symbol polling)
import {
  startScheduler,
  onPriceUpdate,
  getPrice,
  getAllPrices,
  setFallbackPrice,
  getSchedulerMetrics,
  PRIORITY_SYMBOLS,
} from './backend/scheduler.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));

// ─── OpenAI ──────────────────────────────────────────────────────────────────
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// ─── Market State (persisted to disk) ────────────────────────────────────────
const MARKET_STATE_FILE = 'market-state.json';
const marketState = { lastUpdate: Date.now(), symbols: {} };

const FALLBACK_PRICES = {
  BTCUSD: 79000, ETHUSD: 2250, XRPUSD: 0.55, ADAUSD: 0.45,
  SOLUSD: 90,   DOTUSD: 8.5,  MATICUSD: 0.9, AVAXUSD: 40,
  ECOPETROL: 10.5, BANCOLOMBIA: 28, PFBCOLOM: 24,
  GRUPOARGOS: 7, GRUPOSURA: 18, PFGRUPSURA: 14,
  ISA: 12, CEMARGOS: 3.5, CORFICOLCF: 11,
  GRUPOAVAL: 0.95, CELSIA: 3.2, GRUPONUTRESA: 22,
  EXITO: 2.8, DAVIVIENDA: 17, MINEROS: 2.5,
  NU: 14.5, AAPL: 298, GOOGL: 180, MSFT: 430,
  AMZN: 220, TSLA: 290, NVDA: 226,
  EURUSD: 1.172, GBPUSD: 1.33, USDJPY: 149, AUDUSD: 0.65,
  SPX: 5900, DJI: 43000, NDX: 20500, FTSE: 8300,
};

async function loadMarketState() {
  try {
    const data = await fs.readFile(MARKET_STATE_FILE, 'utf-8');
    const loaded = JSON.parse(data);
    marketState.lastUpdate = loaded.lastUpdate;
    marketState.symbols = loaded.symbols || {};
    console.log(`[Market] Loaded ${Object.keys(marketState.symbols).length} symbols from disk`);
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('[Market] Load error:', err.message);
  }
}

async function saveMarketState() {
  try {
    marketState.lastUpdate = Date.now();
    await fs.writeFile(MARKET_STATE_FILE, JSON.stringify(marketState, null, 2));
  } catch (err) {
    console.error('[Market] Save error:', err.message);
  }
}

function getPersistedPrice(symbolId) {
  // Prefer live price from scheduler, then persisted, then fallback
  const live = getPrice(symbolId);
  if (live) return live.price;
  return marketState.symbols[symbolId]?.lastClose || FALLBACK_PRICES[symbolId] || 100;
}

function updatePersistedPrice(symbolId, price) {
  marketState.symbols[symbolId] = { lastClose: price, lastUpdate: Date.now() };
}

// ─── Candle Generation ────────────────────────────────────────────────────────
const SIMULATION_EFFECTS = {
  crisis_2007: { volatilityMultiplier: 2.5, trendMultiplier: -0.0005 },
  ww2:         { volatilityMultiplier: 3.0, trendMultiplier: -0.0008 },
  '9_11':      { volatilityMultiplier: 4.0, trendMultiplier: -0.001  },
  elections:   { volatilityMultiplier: 2.0, trendMultiplier: 0       },
};

function generateCandle(symbol, lastCandle, baseVolatility, simulationParams) {
  const lastClose = lastCandle?.close || getPersistedPrice(symbol.id);
  let volatility = baseVolatility;
  let trend = 0;

  if (simulationParams) {
    volatility *= simulationParams.volatilityMultiplier;
    trend = simulationParams.trendMultiplier;
  }

  const newTime = new Date(lastCandle ? lastCandle.time.getTime() + 60000 : Date.now());
  let open  = lastClose * (1 + (Math.random() * volatility * 0.2 - volatility * 0.1) + trend);
  let close = open     * (1 + (Math.random() * volatility - volatility * 0.5) + trend);
  let high  = Math.max(open, close) * (1 + Math.random() * volatility * 0.3);
  let low   = Math.min(open, close) * (1 - Math.random() * volatility * 0.3);

  open  = Math.max(0.0001, open);
  close = Math.max(0.0001, close);
  high  = Math.max(0.0001, high);
  low   = Math.max(0.0001, low);

  updatePersistedPrice(symbol.id, close);
  return { time: newTime, open, high, low, close, value: close };
}

// ─── Room State ───────────────────────────────────────────────────────────────
const roomsState = new Map();

function getRoomState(roomCode) {
  if (!roomsState.has(roomCode)) {
    roomsState.set(roomCode, {
      marketData: {},
      priceOverrides: {},
      activeSimulation: null,
      experimentalMode: false,
      pendingOrders: [],
      notifications: [],
      priceAlarms: [],
      connectedUsers: new Set(),
    });
  }
  return roomsState.get(roomCode);
}

const SYMBOLS = [
  { id: 'BTCUSD',       baseVolatility: 0.03   },
  { id: 'ETHUSD',       baseVolatility: 0.04   },
  { id: 'XRPUSD',       baseVolatility: 0.05   },
  { id: 'ADAUSD',       baseVolatility: 0.045  },
  { id: 'SOLUSD',       baseVolatility: 0.055  },
  { id: 'DOTUSD',       baseVolatility: 0.048  },
  { id: 'MATICUSD',     baseVolatility: 0.052  },
  { id: 'AVAXUSD',      baseVolatility: 0.056  },
  { id: 'ECOPETROL',    baseVolatility: 0.015  },
  { id: 'BANCOLOMBIA',  baseVolatility: 0.01   },
  { id: 'PFBCOLOM',     baseVolatility: 0.011  },
  { id: 'GRUPOARGOS',   baseVolatility: 0.012  },
  { id: 'GRUPOSURA',    baseVolatility: 0.011  },
  { id: 'PFGRUPSURA',   baseVolatility: 0.01   },
  { id: 'ISA',          baseVolatility: 0.013  },
  { id: 'CEMARGOS',     baseVolatility: 0.014  },
  { id: 'CORFICOLCF',   baseVolatility: 0.012  },
  { id: 'GRUPOAVAL',    baseVolatility: 0.009  },
  { id: 'CELSIA',       baseVolatility: 0.013  },
  { id: 'GRUPONUTRESA', baseVolatility: 0.01   },
  { id: 'EXITO',        baseVolatility: 0.018  },
  { id: 'DAVIVIENDA',   baseVolatility: 0.011  },
  { id: 'MINEROS',      baseVolatility: 0.022  },
  { id: 'NU',           baseVolatility: 0.025  },
  { id: 'AAPL',         baseVolatility: 0.018  },
  { id: 'GOOGL',        baseVolatility: 0.02   },
  { id: 'MSFT',         baseVolatility: 0.016  },
  { id: 'AMZN',         baseVolatility: 0.022  },
  { id: 'TSLA',         baseVolatility: 0.035  },
  { id: 'NVDA',         baseVolatility: 0.028  },
  { id: 'EURUSD',       baseVolatility: 0.008  },
  { id: 'GBPUSD',       baseVolatility: 0.009  },
  { id: 'USDJPY',       baseVolatility: 0.0085 },
  { id: 'AUDUSD',       baseVolatility: 0.0095 },
  { id: 'SPX',          baseVolatility: 0.012  },
  { id: 'DJI',          baseVolatility: 0.011  },
  { id: 'NDX',          baseVolatility: 0.015  },
  { id: 'FTSE',         baseVolatility: 0.01   },
];

function updateRoomMarketData(roomCode) {
  const roomState = getRoomState(roomCode);
  const sim = roomState.activeSimulation;
  const simulationParams = sim && Date.now() < sim.endTime
    ? SIMULATION_EFFECTS[sim.type]
    : null;

  SYMBOLS.forEach(symbol => {
    if (!roomState.marketData[symbol.id]) roomState.marketData[symbol.id] = [];
    const lastCandle = roomState.marketData[symbol.id].slice(-1)[0];
    const newCandle = generateCandle(symbol, lastCandle, symbol.baseVolatility, simulationParams);

    if (roomState.priceOverrides[symbol.id]) {
      newCandle.close = roomState.priceOverrides[symbol.id];
      newCandle.value = newCandle.close;
      newCandle.high  = Math.max(newCandle.high, newCandle.close);
      newCandle.low   = Math.min(newCandle.low, newCandle.close);
    }

    roomState.marketData[symbol.id].push(newCandle);
    // Keep last 2000 candles in memory
    if (roomState.marketData[symbol.id].length > 2000) {
      roomState.marketData[symbol.id] = roomState.marketData[symbol.id].slice(-2000);
    }
  });

  return roomState.marketData;
}

function checkPendingOrders(roomCode) {
  const roomState = getRoomState(roomCode);
  const executed = [];

  roomState.pendingOrders.forEach((order, i) => {
    const price = roomState.marketData[order.symbol]?.slice(-1)[0]?.close;
    if (!price) return;
    const hit =
      (order.side === 'BUY'  && price <= order.triggerPrice) ||
      (order.side === 'SELL' && price >= order.triggerPrice);
    if (hit) executed.push({ ...order, executionPrice: price, _index: i });
  });

  executed.reverse().forEach(order => {
    roomState.pendingOrders.splice(order._index, 1);
    io.to(roomCode).emit('order_executed', order);
    roomState.notifications.push({
      id: `notif_${Date.now()}_${Math.random()}`,
      userId: order.userId,
      type: 'order_executed',
      message: `${order.side} Limit ejecutado: ${order.symbol} a ${order.executionPrice.toFixed(2)}`,
      timestamp: Date.now(),
      read: false,
    });
  });
}

function checkPriceAlarms(roomCode) {
  const roomState = getRoomState(roomCode);
  roomState.priceAlarms.forEach((alarm, i) => {
    if (alarm.triggered) return;
    const price = roomState.marketData[alarm.symbol]?.slice(-1)[0]?.close;
    if (!price) return;
    const hit =
      (alarm.condition === 'above' && price >= alarm.price) ||
      (alarm.condition === 'below' && price <= alarm.price);
    if (hit) {
      roomState.priceAlarms[i].triggered = true;
      io.to(roomCode).emit('alarm_triggered', alarm);
      roomState.notifications.push({
        id: `notif_${Date.now()}_${Math.random()}`,
        userId: alarm.userId,
        type: 'alarm_triggered',
        message: `Alarma: ${alarm.symbol} ${alarm.condition === 'above' ? 'superó' : 'cayó bajo'} ${alarm.price.toFixed(2)}`,
        timestamp: Date.now(),
        read: false,
      });
    }
  });
}

// ─── Scheduler → broadcast live prices to all rooms ──────────────────────────
onPriceUpdate((livePrices) => {
  // Anchor simulated candle base prices to real-market values
  for (const [symbolId, price] of Object.entries(livePrices)) {
    updatePersistedPrice(symbolId, price);
  }
  saveMarketState().catch(() => {});

  // Send a lightweight "live_prices" event — NOT the full candle history
  if (io.engine.clientsCount > 0) {
    io.emit('live_prices', livePrices);
  }
});

// ─── Socket.IO ────────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('[Socket] Client connected:', socket.id);

  socket.on('join_room', ({ roomCode, userId, userName, role }) => {
    if (!roomCode) return;
    socket.join(roomCode);
    const roomState = getRoomState(roomCode);
    roomState.connectedUsers.add({ id: userId, name: userName, role, socketId: socket.id });

    socket.emit('room_state', {
      marketData: roomState.marketData,
      priceOverrides: roomState.priceOverrides,
      activeSimulation: roomState.activeSimulation,
      experimentalMode: roomState.experimentalMode,
      pendingOrders: roomState.pendingOrders.filter(o => o.userId === userId),
      notifications: roomState.notifications.filter(n => n.userId === userId),
      priceAlarms: roomState.priceAlarms.filter(a => a.userId === userId),
      livePrices: getAllPrices(),
    });
    console.log(`[Room] ${userName} (${role}) joined ${roomCode}`);
  });

  socket.on('leave_room', (roomCode) => {
    if (!roomCode) return;
    socket.leave(roomCode);
    const rs = roomsState.get(roomCode);
    if (rs) {
      rs.connectedUsers = new Set([...rs.connectedUsers].filter(u => u.socketId !== socket.id));
    }
  });

  socket.on('start_simulation', ({ roomCode, simulationType, duration }) => {
    const rs = getRoomState(roomCode);
    rs.activeSimulation = { type: simulationType, startTime: Date.now(), endTime: Date.now() + duration };
    io.to(roomCode).emit('simulation_started', rs.activeSimulation);
  });

  socket.on('stop_simulation', (roomCode) => {
    getRoomState(roomCode).activeSimulation = null;
    io.to(roomCode).emit('simulation_stopped');
  });

  socket.on('toggle_experimental_mode', ({ roomCode, enabled }) => {
    const rs = getRoomState(roomCode);
    rs.experimentalMode = enabled;
    if (!enabled) rs.priceOverrides = {};
    io.to(roomCode).emit('experimental_mode_changed', { enabled });
  });

  socket.on('override_price', ({ roomCode, symbol, price }) => {
    const rs = getRoomState(roomCode);
    if (!rs.experimentalMode) return;
    rs.priceOverrides[symbol] = price;
    io.to(roomCode).emit('price_overridden', { symbol, price });
  });

  socket.on('create_pending_order', ({ roomCode, order }) => {
    const rs = getRoomState(roomCode);
    const newOrder = { ...order, id: `order_${Date.now()}_${Math.random()}`, createdAt: Date.now(), status: 'pending' };
    rs.pendingOrders.push(newOrder);
    socket.emit('order_created', newOrder);
  });

  socket.on('cancel_pending_order', ({ roomCode, orderId }) => {
    const rs = getRoomState(roomCode);
    const idx = rs.pendingOrders.findIndex(o => o.id === orderId);
    if (idx !== -1) { rs.pendingOrders.splice(idx, 1); socket.emit('order_cancelled', { orderId }); }
  });

  socket.on('create_price_alarm', ({ roomCode, alarm }) => {
    const rs = getRoomState(roomCode);
    const newAlarm = { ...alarm, id: `alarm_${Date.now()}_${Math.random()}`, createdAt: Date.now(), triggered: false };
    rs.priceAlarms.push(newAlarm);
    socket.emit('alarm_created', newAlarm);
  });

  socket.on('delete_price_alarm', ({ roomCode, alarmId }) => {
    const rs = getRoomState(roomCode);
    const idx = rs.priceAlarms.findIndex(a => a.id === alarmId);
    if (idx !== -1) { rs.priceAlarms.splice(idx, 1); socket.emit('alarm_deleted', { alarmId }); }
  });

  socket.on('student_trade', ({ roomCode, trade, teacherId }) => {
    const rs = getRoomState(roomCode);
    const notification = {
      id: `notif_${Date.now()}_${Math.random()}`,
      userId: teacherId,
      type: 'student_trade',
      message: `${trade.studentName} ${trade.type === 'open' ? 'abrió' : 'cerró'} posición ${trade.positionType} en ${trade.symbol}`,
      timestamp: Date.now(),
      read: false,
      tradeData: trade,
    };
    rs.notifications.push(notification);
    io.to(roomCode).emit('new_notification', { userId: teacherId, notification });
  });

  socket.on('mark_notification_read', ({ roomCode, notificationId }) => {
    const rs = getRoomState(roomCode);
    const notif = rs.notifications.find(n => n.id === notificationId);
    if (notif) { notif.read = true; socket.emit('notification_updated', notif); }
  });

  socket.on('disconnect', () => {
    console.log('[Socket] Client disconnected:', socket.id);
    roomsState.forEach(rs => {
      rs.connectedUsers = new Set([...rs.connectedUsers].filter(u => u.socketId !== socket.id));
    });
  });
});

// ─── Market Broadcast Loop (candle generation every 5 s) ─────────────────────
// Real prices come from scheduler every 60 s via live_prices event.
// This loop ONLY generates the next simulated candle — no external API calls.
setInterval(() => {
  roomsState.forEach((roomState, roomCode) => {
    if (roomState.connectedUsers.size > 0) {
      const updated = updateRoomMarketData(roomCode);
      io.to(roomCode).emit('market_update', updated);
      checkPendingOrders(roomCode);
      checkPriceAlarms(roomCode);
    }
  });
}, 5000);

// ─── REST API Routes ──────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiEnabled:        !!process.env.OPENAI_API_KEY,
    twelvedataEnabled:!!process.env.TWELVEDATA_API_KEY,
    supabaseEnabled:  !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    symbolCount:      Object.keys(marketState.symbols).length,
    scheduler:        getSchedulerMetrics(),
  });
});

app.get('/api/market-state', (req, res) => {
  res.json({
    ...marketState,
    livePrices: getAllPrices(),
    symbolCount: Object.keys(marketState.symbols).length,
  });
});

// Live quote (served from scheduler cache, no extra API call)
app.get('/api/quote/:symbol', (req, res) => {
  const { symbol } = req.params;
  const live = getPrice(symbol.toUpperCase());
  if (live) return res.json({ symbol, price: live.price, source: 'live', timestamp: live.ts });
  const price = getPersistedPrice(symbol.toUpperCase());
  res.json({ symbol, price, source: 'cached', timestamp: Date.now() });
});

// Batch quotes (served from scheduler cache, no extra API call)
app.get('/api/quotes', (req, res) => {
  const symbolsParam = req.query.symbols;
  if (!symbolsParam) return res.status(400).json({ error: 'symbols query param required' });
  const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase());
  const result = {};
  symbols.forEach(s => {
    const live = getPrice(s);
    result[s] = {
      price:  live?.price ?? getPersistedPrice(s),
      source: live ? 'live' : 'cached',
    };
  });
  res.json(result);
});

/**
 * Historical OHLC endpoint
 * Supports dynamic timeframes → longer ranges:
 *   1m  → 1 day
 *   5m  → 5 days
 *   15m → 1 month
 *   1h  → 6 months
 *   1d  → 2 years
 *   1w  → 5 years
 *   1M  → max
 *
 * Cache strategy: in-memory (fast) → Supabase (persistent) → Yahoo fetch
 */
app.get('/api/history/:symbol', async (req, res) => {
  const symbol    = req.params.symbol.toUpperCase();
  const timeframe = req.query.timeframe || '1m';

  // 1. In-memory cache
  const cacheKey = `api:history:${symbol}:${timeframe}`;
  const mem = getCache(cacheKey);
  if (mem) return res.json(mem);

  // 2. Supabase historical_cache
  try {
    const sbCached = await getCachedHistorical(symbol, timeframe);
    if (sbCached && sbCached.length > 0) {
      setCache(cacheKey, sbCached, TTL.HISTORICAL);
      return res.json(sbCached);
    }
  } catch (_) {}

  // 3. Fetch from Yahoo Finance (primary source for history)
  let candles = null;
  try {
    candles = await fetchHistorical(symbol, timeframe);
    if (candles?.length > 0) {
      await logApiUsage('yahoo', `history_${timeframe}`, 1);
    }
  } catch (err) {
    console.error(`[History] Yahoo failed for ${symbol} [${timeframe}]:`, err.message);
  }

  // 4. Fallback to TwelveData time series (intraday only, costs 1 credit)
  if (!candles || candles.length === 0) {
    try {
      const intervalMap = { '1m': '1min', '5m': '5min', '15m': '15min', '1h': '1h', '1d': '1day' };
      const tdInterval = intervalMap[timeframe];
      if (tdInterval) {
        candles = await fetchTimeSeries(symbol, tdInterval, 500);
        if (candles?.length > 0) await logApiUsage('twelvedata', `timeseries_${timeframe}`, 1);
      }
    } catch (err) {
      console.error(`[History] TwelveData fallback failed for ${symbol}:`, err.message);
    }
  }

  if (!candles || candles.length === 0) {
    return res.status(404).json({ error: `No historical data for ${symbol} [${timeframe}]` });
  }

  // 5. Cache result (memory + Supabase)
  const ttl = ['1m','5m','15m'].includes(timeframe) ? TTL.HISTORICAL : TTL.HISTORICAL_D;
  setCache(cacheKey, candles, ttl);
  setCachedHistorical(symbol, timeframe, candles).catch(() => {});

  res.json(candles);
});

// Scheduler metrics endpoint
app.get('/api/metrics', (req, res) => {
  res.json(getSchedulerMetrics());
});

// AI Chat
const SYSTEM_PROMPT_ES = `Eres un experto asistente de educación financiera y trading. Tu objetivo es enseñar conceptos de finanzas, inversión y trading de manera clara y educativa.
Características: explicaciones detalladas pero comprensibles para estudiantes, ejemplos prácticos, énfasis en gestión de riesgos y educación responsable.
Temas: acciones, bonos, ETFs, criptomonedas, blockchain, análisis técnico y fundamental, gestión de riesgos, psicología del trading, forex, indicadores. Siempre sé claro, paciente y educativo.`;

const SYSTEM_PROMPT_EN = `You are an expert financial education and trading assistant. Teach finance, investment and trading concepts clearly and educationally. Be detailed but understandable for students, use practical examples, emphasize risk management. Topics: stocks, bonds, ETFs, crypto, blockchain, technical/fundamental analysis, risk management, trading psychology, forex, indicators. Always be clear, patient and educational.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'es' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    if (!openai) return res.json({ error: 'AI service not configured', fallback: true, response: null });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: language === 'es' ? SYSTEM_PROMPT_ES : SYSTEM_PROMPT_EN },
        { role: 'user',   content: message },
      ],
      max_tokens: 500,
    });
    res.json({ response: completion.choices[0].message.content, model: 'gpt-4o', enhanced: true });
  } catch (err) {
    console.error('[Chat] OpenAI error:', err.message);
    res.json({ error: err.message, fallback: true, response: null });
  }
});

// ─── Boot Sequence ────────────────────────────────────────────────────────────
(async () => {
  await loadMarketState();

  // Seed all symbols with fallback prices (overridden by scheduler)
  SYMBOLS.forEach(s => {
    const p = marketState.symbols[s.id]?.lastClose || FALLBACK_PRICES[s.id] || 100;
    setFallbackPrice(s.id, p);
    if (!marketState.symbols[s.id]) updatePersistedPrice(s.id, p);
  });

  // Start the global 60 s price scheduler
  startScheduler();

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running on port ${PORT}`);
    console.log(`[Server] AI: ${!!process.env.OPENAI_API_KEY} | TwelveData: ${!!process.env.TWELVEDATA_API_KEY} | Supabase: ${!!(process.env.SUPABASE_URL)}`);
  });
})();
