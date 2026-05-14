import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import OpenAI from 'openai';
import { promises as fs } from 'fs';

// Internal providers & cache
import { fetchBatchQuotes, fetchTimeSeries, SUPPORTED_SYMBOLS } from './backend/providers/twelvedata.js';
import { fetchHistorical, fetchCurrentPrice, fetchBatchCurrentPrices } from './backend/providers/yahoo.js';
import { getCache, setCache, TTL } from './backend/cache/inMemoryCache.js';
import { bulkUpsertAssetCache } from './backend/providers/supabase.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
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
  BTCUSD: 95000, ETHUSD: 3400, XRPUSD: 0.55, ADAUSD: 0.45,
  SOLUSD: 170, DOTUSD: 8.5, MATICUSD: 0.9, AVAXUSD: 40,
  ECOPETROL: 10.5, BANCOLOMBIA: 28, PFBCOLOM: 24,
  GRUPOARGOS: 7, GRUPOSURA: 18, PFGRUPSURA: 14,
  ISA: 12, CEMARGOS: 3.5, CORFICOLCF: 11,
  GRUPOAVAL: 0.95, CELSIA: 3.2, GRUPONUTRESA: 22,
  EXITO: 2.8, DAVIVIENDA: 17, MINEROS: 2.5,
  NU: 14.5, AAPL: 215, GOOGL: 180, MSFT: 430,
  AMZN: 220, TSLA: 290, NVDA: 950,
  EURUSD: 1.085, GBPUSD: 1.27, USDJPY: 149, AUDUSD: 0.65,
  SPX: 5800, DJI: 43000, NDX: 20500, FTSE: 8300,
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
  return marketState.symbols[symbolId]?.lastClose || FALLBACK_PRICES[symbolId] || 100;
}

function updatePersistedPrice(symbolId, price) {
  marketState.symbols[symbolId] = { lastClose: price, lastUpdate: Date.now() };
}

// ─── Real Price Engine ────────────────────────────────────────────────────────
// Priority symbols — keep to ≤7 per batch call (TwelveData free tier: 8 credits/min)
const PRIORITY_SYMBOLS = [
  'BTCUSD', 'ETHUSD', 'AAPL', 'EURUSD', 'SPX', 'NVDA', 'SOLUSD'
];

let lastRealPriceFetch = 0;
const REAL_PRICE_INTERVAL = 5 * 60 * 1000; // fetch real prices every 5 minutes

async function refreshRealPrices() {
  const now = Date.now();
  if (now - lastRealPriceFetch < REAL_PRICE_INTERVAL) return;
  lastRealPriceFetch = now;

  console.log('[Market] Refreshing real prices from TwelveData...');
  try {
    // Batch fetch from TwelveData
    const realPrices = await fetchBatchQuotes(PRIORITY_SYMBOLS);

    // Fallback to Yahoo for any that failed
    const missing = PRIORITY_SYMBOLS.filter(s => !realPrices[s]);
    if (missing.length > 0) {
      console.log(`[Market] Falling back to Yahoo for: ${missing.join(', ')}`);
      const yahooPrices = await fetchBatchCurrentPrices(missing);
      Object.assign(realPrices, yahooPrices);
    }

    // Apply real prices — anchor the simulation to real market levels
    let updatedCount = 0;
    for (const [symbolId, price] of Object.entries(realPrices)) {
      if (price && price > 0) {
        updatePersistedPrice(symbolId, price);
        updatedCount++;
      }
    }

    // Persist to Supabase asset_cache
    await bulkUpsertAssetCache(
      Object.fromEntries(
        Object.entries(realPrices).filter(([, p]) => p > 0)
      )
    );

    console.log(`[Market] Updated ${updatedCount} real prices`);
    await saveMarketState();
  } catch (err) {
    console.error('[Market] Price refresh error:', err.message);
  }
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
  { id: 'BTCUSD',      baseVolatility: 0.03  },
  { id: 'ETHUSD',      baseVolatility: 0.04  },
  { id: 'XRPUSD',      baseVolatility: 0.05  },
  { id: 'ADAUSD',      baseVolatility: 0.045 },
  { id: 'SOLUSD',      baseVolatility: 0.055 },
  { id: 'DOTUSD',      baseVolatility: 0.048 },
  { id: 'MATICUSD',    baseVolatility: 0.052 },
  { id: 'AVAXUSD',     baseVolatility: 0.056 },
  { id: 'ECOPETROL',   baseVolatility: 0.015 },
  { id: 'BANCOLOMBIA', baseVolatility: 0.01  },
  { id: 'PFBCOLOM',    baseVolatility: 0.011 },
  { id: 'GRUPOARGOS',  baseVolatility: 0.012 },
  { id: 'GRUPOSURA',   baseVolatility: 0.011 },
  { id: 'PFGRUPSURA',  baseVolatility: 0.01  },
  { id: 'ISA',         baseVolatility: 0.013 },
  { id: 'CEMARGOS',    baseVolatility: 0.014 },
  { id: 'CORFICOLCF',  baseVolatility: 0.012 },
  { id: 'GRUPOAVAL',   baseVolatility: 0.009 },
  { id: 'CELSIA',      baseVolatility: 0.013 },
  { id: 'GRUPONUTRESA',baseVolatility: 0.01  },
  { id: 'EXITO',       baseVolatility: 0.018 },
  { id: 'DAVIVIENDA',  baseVolatility: 0.011 },
  { id: 'MINEROS',     baseVolatility: 0.022 },
  { id: 'NU',          baseVolatility: 0.025 },
  { id: 'AAPL',        baseVolatility: 0.018 },
  { id: 'GOOGL',       baseVolatility: 0.02  },
  { id: 'MSFT',        baseVolatility: 0.016 },
  { id: 'AMZN',        baseVolatility: 0.022 },
  { id: 'TSLA',        baseVolatility: 0.035 },
  { id: 'NVDA',        baseVolatility: 0.028 },
  { id: 'EURUSD',      baseVolatility: 0.008 },
  { id: 'GBPUSD',      baseVolatility: 0.009 },
  { id: 'USDJPY',      baseVolatility: 0.0085},
  { id: 'AUDUSD',      baseVolatility: 0.0095},
  { id: 'SPX',         baseVolatility: 0.012 },
  { id: 'DJI',         baseVolatility: 0.011 },
  { id: 'NDX',         baseVolatility: 0.015 },
  { id: 'FTSE',        baseVolatility: 0.01  },
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
    });
    console.log(`[Room] ${userName} (${role}) joined ${roomCode}`);
  });

  socket.on('leave_room', (roomCode) => {
    if (!roomCode) return;
    socket.leave(roomCode);
    const rs = roomsState.get(roomCode);
    if (rs) rs.connectedUsers = new Set(
      [...rs.connectedUsers].filter(u => u.socketId !== socket.id)
    );
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

// ─── Market Broadcast Loop (every 5s) ────────────────────────────────────────
setInterval(async () => {
  await refreshRealPrices(); // no-op if called too recently
  roomsState.forEach((roomState, roomCode) => {
    if (roomState.connectedUsers.size > 0) {
      const updated = updateRoomMarketData(roomCode);
      io.to(roomCode).emit('market_update', updated);
      checkPendingOrders(roomCode);
      checkPriceAlarms(roomCode);
    }
  });
}, 5000);

// Save state every 30s
setInterval(saveMarketState, 30000);

// ─── REST API Routes ──────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiEnabled: !!process.env.OPENAI_API_KEY,
    twelvedataEnabled: !!process.env.TWELVEDATA_API_KEY,
    supabaseEnabled: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    symbolCount: Object.keys(marketState.symbols).length,
  });
});

// Current market state
app.get('/api/market-state', (req, res) => {
  res.json({
    ...marketState,
    symbolCount: Object.keys(marketState.symbols).length,
  });
});

// Real-time quote for a single symbol
app.get('/api/quote/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const cacheKey = `api:quote:${symbol}`;
  const cached = getCache(cacheKey);
  if (cached) return res.json(cached);

  // First try TwelveData
  let price = null;
  try {
    const { fetchQuote } = await import('./backend/providers/twelvedata.js');
    price = await fetchQuote(symbol);
  } catch (_) {}

  // Fallback to Yahoo
  if (!price) {
    try {
      price = await fetchCurrentPrice(symbol);
    } catch (_) {}
  }

  // Fallback to persisted/simulated price
  if (!price) {
    price = getPersistedPrice(symbol);
  }

  const result = { symbol, price, source: price ? 'live' : 'simulated', timestamp: Date.now() };
  setCache(cacheKey, result, TTL.QUOTE);
  res.json(result);
});

// Batch quotes for multiple symbols
app.get('/api/quotes', async (req, res) => {
  const symbolsParam = req.query.symbols;
  if (!symbolsParam) return res.status(400).json({ error: 'symbols query param required' });
  const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase());

  const cacheKey = `api:quotes:${symbols.sort().join(',')}`;
  const cached = getCache(cacheKey);
  if (cached) return res.json(cached);

  const prices = await fetchBatchQuotes(symbols.filter(s => SUPPORTED_SYMBOLS.includes(s)));

  // Fill remaining with persisted prices
  const result = {};
  symbols.forEach(s => {
    result[s] = { price: prices[s] || getPersistedPrice(s), source: prices[s] ? 'live' : 'simulated' };
  });

  setCache(cacheKey, result, TTL.BATCH_PRICE);
  res.json(result);
});

// Historical OHLC data
app.get('/api/history/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const timeframe = req.query.timeframe || '1m';

  const cacheKey = `api:history:${symbol}:${timeframe}`;
  const cached = getCache(cacheKey);
  if (cached) return res.json(cached);

  // Try Yahoo Finance first (more historical data)
  let candles = null;
  try {
    candles = await fetchHistorical(symbol, timeframe);
  } catch (err) {
    console.error(`[History] Yahoo failed for ${symbol}:`, err.message);
  }

  // Fallback to TwelveData time series
  if (!candles || candles.length === 0) {
    try {
      const intervalMap = { '1m': '1min', '5m': '5min', '15m': '15min', '1h': '1h', '1d': '1day' };
      candles = await fetchTimeSeries(symbol, intervalMap[timeframe] || '1min', 500);
    } catch (err) {
      console.error(`[History] TwelveData failed for ${symbol}:`, err.message);
    }
  }

  if (!candles || candles.length === 0) {
    return res.status(404).json({ error: `No historical data for ${symbol}` });
  }

  setCache(cacheKey, candles, TTL.HISTORICAL);
  res.json(candles);
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

    if (!openai) {
      return res.json({ error: 'AI service not configured', fallback: true, response: null });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: language === 'es' ? SYSTEM_PROMPT_ES : SYSTEM_PROMPT_EN },
        { role: 'user', content: message }
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

  // Seed any missing symbols with fallback prices
  SYMBOLS.forEach(s => {
    if (!marketState.symbols[s.id]) {
      updatePersistedPrice(s.id, FALLBACK_PRICES[s.id] || 100);
    }
  });

  // Kick off first real-price fetch immediately
  console.log('[Market] Fetching initial real prices...');
  await refreshRealPrices();

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running on port ${PORT}`);
    console.log(`[Server] AI: ${!!process.env.OPENAI_API_KEY} | TwelveData: ${!!process.env.TWELVEDATA_API_KEY} | Supabase: ${!!(process.env.SUPABASE_URL)}`);
  });
})();
