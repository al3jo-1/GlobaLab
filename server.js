import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const SYSTEM_PROMPT = `Eres un experto asistente de educación financiera y trading. Tu objetivo es enseñar conceptos de finanzas, inversión y trading de manera clara y educativa. 

Características de tus respuestas:
- Explicaciones detalladas pero comprensibles para estudiantes
- Ejemplos prácticos y relevantes
- Énfasis en la gestión de riesgos y educación responsable
- Información actualizada sobre mercados financieros
- Respuestas en el idioma del usuario (español, inglés, etc.)

Temas que dominas:
- Acciones, bonos, ETFs y otros instrumentos financieros
- Criptomonedas y blockchain
- Análisis técnico y fundamental
- Gestión de riesgos y diversificación
- Psicología del trading
- Mercados forex
- Indicadores y estrategias de trading
- Conceptos económicos básicos

Siempre recuerda que estás educando a estudiantes, así que sé claro, paciente y educativo.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'es' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || !openai) {
      console.log('OpenAI API key not configured, using fallback mode');
      return res.json({ 
        error: 'AI service not configured',
        fallback: true,
        response: null
      });
    }

    const systemPrompt = language === 'es' ? SYSTEM_PROMPT : 
      `You are an expert financial education and trading assistant. Your goal is to teach finance, investment and trading concepts clearly and educationally.

Your response characteristics:
- Detailed but understandable explanations for students
- Practical and relevant examples
- Emphasis on risk management and responsible education
- Updated information on financial markets
- Responses in the user's language

Topics you master:
- Stocks, bonds, ETFs and other financial instruments
- Cryptocurrencies and blockchain
- Technical and fundamental analysis
- Risk management and diversification
- Trading psychology
- Forex markets
- Trading indicators and strategies
- Basic economic concepts

Always remember you are educating students, so be clear, patient and educational.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({ 
      response: aiResponse,
      model: 'gpt-5',
      enhanced: true 
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Return fallback response if API fails
    const errorMessage = error?.status === 429 
      ? 'OpenAI quota exceeded. Using fallback mode.'
      : error.message;
    
    res.json({ 
      error: errorMessage,
      fallback: true,
      response: null
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    aiEnabled: !!process.env.OPENAI_API_KEY 
  });
});

const roomsState = new Map();

const SIMULATION_EFFECTS = {
  'crisis_2007': { volatilityMultiplier: 2.5, trendMultiplier: -0.0005, duration: 300000 },
  'ww2': { volatilityMultiplier: 3, trendMultiplier: -0.0008, duration: 600000 },
  '9_11': { volatilityMultiplier: 4, trendMultiplier: -0.001, duration: 180000 },
  'elections': { volatilityMultiplier: 2, trendMultiplier: 0, duration: 120000 },
};

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

function generateCandleUpdate(symbol, lastCandle, baseVolatility, simulationParams) {
  const lastClose = lastCandle?.close || 100;
  let currentVolatility = baseVolatility;
  let trend = 0;

  if (simulationParams) {
    currentVolatility *= simulationParams.volatilityMultiplier;
    trend = simulationParams.trendMultiplier;
  }

  const newTime = new Date(lastCandle ? lastCandle.time.getTime() + 60000 : Date.now());
  
  let open = lastClose * (1 + (Math.random() * currentVolatility * 0.2 - currentVolatility * 0.1) + trend);
  let close = open * (1 + (Math.random() * currentVolatility - currentVolatility * 0.5) + trend);
  let high = Math.max(open, close) * (1 + Math.random() * currentVolatility * 0.3);
  let low = Math.min(open, close) * (1 - Math.random() * currentVolatility * 0.3);

  open = Math.max(0.0001, open);
  close = Math.max(0.0001, close);
  high = Math.max(0.0001, high);
  low = Math.max(0.0001, low);

  return { time: newTime, open, high, low, close, value: close };
}

function updateRoomMarketData(roomCode, symbols) {
  const roomState = getRoomState(roomCode);
  const simulationParams = roomState.activeSimulation && 
    Date.now() < roomState.activeSimulation.endTime 
      ? SIMULATION_EFFECTS[roomState.activeSimulation.type] 
      : null;

  symbols.forEach(symbol => {
    if (!roomState.marketData[symbol.id]) {
      roomState.marketData[symbol.id] = [];
    }

    const lastCandle = roomState.marketData[symbol.id].slice(-1)[0];
    const newCandle = generateCandleUpdate(symbol, lastCandle, symbol.baseVolatility, simulationParams);
    
    if (roomState.priceOverrides[symbol.id]) {
      newCandle.close = roomState.priceOverrides[symbol.id];
      newCandle.high = Math.max(newCandle.high, newCandle.close);
      newCandle.low = Math.min(newCandle.low, newCandle.close);
    }

    roomState.marketData[symbol.id].push(newCandle);

    if (roomState.marketData[symbol.id].length > 2000) {
      roomState.marketData[symbol.id] = roomState.marketData[symbol.id].slice(-2000);
    }
  });

  return roomState.marketData;
}

function checkPendingOrders(roomCode, io) {
  const roomState = getRoomState(roomCode);
  const executedOrders = [];

  roomState.pendingOrders.forEach((order, index) => {
    const currentPrice = roomState.marketData[order.symbol]?.slice(-1)[0]?.close;
    if (!currentPrice) return;

    let shouldExecute = false;

    if (order.side === 'BUY' && currentPrice <= order.triggerPrice) {
      shouldExecute = true;
    } else if (order.side === 'SELL' && currentPrice >= order.triggerPrice) {
      shouldExecute = true;
    }

    if (shouldExecute) {
      executedOrders.push({ ...order, executionPrice: currentPrice });
      roomState.pendingOrders.splice(index, 1);
    }
  });

  executedOrders.forEach(order => {
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

function checkPriceAlarms(roomCode, io) {
  const roomState = getRoomState(roomCode);
  const triggeredAlarms = [];

  roomState.priceAlarms.forEach((alarm, index) => {
    const currentPrice = roomState.marketData[alarm.symbol]?.slice(-1)[0]?.close;
    if (!currentPrice) return;

    let shouldTrigger = false;

    if (alarm.condition === 'above' && currentPrice >= alarm.price) {
      shouldTrigger = true;
    } else if (alarm.condition === 'below' && currentPrice <= alarm.price) {
      shouldTrigger = true;
    }

    if (shouldTrigger && !alarm.triggered) {
      triggeredAlarms.push(alarm);
      roomState.priceAlarms[index].triggered = true;
    }
  });

  triggeredAlarms.forEach(alarm => {
    io.to(roomCode).emit('alarm_triggered', alarm);
    
    roomState.notifications.push({
      id: `notif_${Date.now()}_${Math.random()}`,
      userId: alarm.userId,
      type: 'alarm_triggered',
      message: `Alarma activada: ${alarm.symbol} ${alarm.condition === 'above' ? 'superó' : 'cayó por debajo de'} ${alarm.price.toFixed(2)}`,
      timestamp: Date.now(),
      read: false,
    });
  });
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_room', (data) => {
    const { roomCode, userId, userName, role } = data;
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

    console.log(`User ${userName} (${role}) joined room ${roomCode}`);
  });

  socket.on('leave_room', (roomCode) => {
    if (!roomCode) return;
    socket.leave(roomCode);
    const roomState = roomsState.get(roomCode);
    if (roomState) {
      roomState.connectedUsers = new Set(
        Array.from(roomState.connectedUsers).filter(u => u.socketId !== socket.id)
      );
    }
  });

  socket.on('start_simulation', (data) => {
    const { roomCode, simulationType, duration } = data;
    const roomState = getRoomState(roomCode);
    
    roomState.activeSimulation = {
      type: simulationType,
      startTime: Date.now(),
      endTime: Date.now() + duration,
    };

    io.to(roomCode).emit('simulation_started', roomState.activeSimulation);
    console.log(`Simulation ${simulationType} started in room ${roomCode}`);
  });

  socket.on('stop_simulation', (roomCode) => {
    const roomState = getRoomState(roomCode);
    roomState.activeSimulation = null;
    io.to(roomCode).emit('simulation_stopped');
    console.log(`Simulation stopped in room ${roomCode}`);
  });

  socket.on('toggle_experimental_mode', (data) => {
    const { roomCode, enabled } = data;
    const roomState = getRoomState(roomCode);
    roomState.experimentalMode = enabled;
    
    if (!enabled) {
      roomState.priceOverrides = {};
    }

    io.to(roomCode).emit('experimental_mode_changed', { enabled });
    console.log(`Experimental mode ${enabled ? 'enabled' : 'disabled'} in room ${roomCode}`);
  });

  socket.on('override_price', (data) => {
    const { roomCode, symbol, price } = data;
    const roomState = getRoomState(roomCode);
    
    if (!roomState.experimentalMode) return;

    roomState.priceOverrides[symbol] = price;
    io.to(roomCode).emit('price_overridden', { symbol, price });
    console.log(`Price override in room ${roomCode}: ${symbol} = ${price}`);
  });

  socket.on('create_pending_order', (data) => {
    const { roomCode, order } = data;
    const roomState = getRoomState(roomCode);
    
    const newOrder = {
      ...order,
      id: `order_${Date.now()}_${Math.random()}`,
      createdAt: Date.now(),
      status: 'pending',
    };

    roomState.pendingOrders.push(newOrder);
    socket.emit('order_created', newOrder);
    console.log(`Pending order created in room ${roomCode}:`, newOrder);
  });

  socket.on('cancel_pending_order', (data) => {
    const { roomCode, orderId } = data;
    const roomState = getRoomState(roomCode);
    
    const index = roomState.pendingOrders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      roomState.pendingOrders.splice(index, 1);
      socket.emit('order_cancelled', { orderId });
    }
  });

  socket.on('create_price_alarm', (data) => {
    const { roomCode, alarm } = data;
    const roomState = getRoomState(roomCode);
    
    const newAlarm = {
      ...alarm,
      id: `alarm_${Date.now()}_${Math.random()}`,
      createdAt: Date.now(),
      triggered: false,
    };

    roomState.priceAlarms.push(newAlarm);
    socket.emit('alarm_created', newAlarm);
    console.log(`Price alarm created in room ${roomCode}:`, newAlarm);
  });

  socket.on('delete_price_alarm', (data) => {
    const { roomCode, alarmId } = data;
    const roomState = getRoomState(roomCode);
    
    const index = roomState.priceAlarms.findIndex(a => a.id === alarmId);
    if (index !== -1) {
      roomState.priceAlarms.splice(index, 1);
      socket.emit('alarm_deleted', { alarmId });
    }
  });

  socket.on('student_trade', (data) => {
    const { roomCode, trade, teacherId } = data;
    const roomState = getRoomState(roomCode);
    
    roomState.notifications.push({
      id: `notif_${Date.now()}_${Math.random()}`,
      userId: teacherId,
      type: 'student_trade',
      message: `${trade.studentName} ${trade.type === 'open' ? 'abrió' : 'cerró'} posición ${trade.positionType} en ${trade.symbol}`,
      timestamp: Date.now(),
      read: false,
      tradeData: trade,
    });

    io.to(roomCode).emit('new_notification', {
      userId: teacherId,
      notification: roomState.notifications[roomState.notifications.length - 1],
    });
  });

  socket.on('mark_notification_read', (data) => {
    const { roomCode, notificationId } = data;
    const roomState = getRoomState(roomCode);
    
    const notification = roomState.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      socket.emit('notification_updated', notification);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const SYMBOLS = [
  { id: 'BTCUSD', name: 'Bitcoin', baseVolatility: 0.03, type: 'crypto' },
  { id: 'ETHUSD', name: 'Ethereum', baseVolatility: 0.04, type: 'crypto' },
  { id: 'XRPUSD', name: 'Ripple', baseVolatility: 0.05, type: 'crypto' },
  { id: 'ADAUSD', name: 'Cardano', baseVolatility: 0.045, type: 'crypto' },
  { id: 'SOLUSD', name: 'Solana', baseVolatility: 0.055, type: 'crypto' },
  { id: 'ECOPETROL', name: 'Ecopetrol', baseVolatility: 0.015, type: 'stock' },
  { id: 'BANCOLOMBIA', name: 'Bancolombia', baseVolatility: 0.01, type: 'stock' },
  { id: 'AAPL', name: 'Apple Inc.', baseVolatility: 0.018, type: 'stock' },
  { id: 'EURUSD', name: 'Euro vs Dólar', baseVolatility: 0.008, type: 'forex' },
  { id: 'SPX', name: 'S&P 500', baseVolatility: 0.012, type: 'index' },
];

setInterval(() => {
  roomsState.forEach((roomState, roomCode) => {
    if (roomState.connectedUsers.size > 0) {
      const updatedMarketData = updateRoomMarketData(roomCode, SYMBOLS);
      io.to(roomCode).emit('market_update', updatedMarketData);
      
      checkPendingOrders(roomCode, io);
      checkPriceAlarms(roomCode, io);
    }
  });
}, 5000);

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`AI enabled: ${!!process.env.OPENAI_API_KEY}`);
  console.log(`WebSocket server ready`);
});
