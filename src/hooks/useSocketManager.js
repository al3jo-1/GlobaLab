import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

// Threshold: if we haven't received live_prices in 3 min, status → 'degraded'
const DEGRADED_THRESHOLD_MS = 3 * 60 * 1000;

export const useSocketManager = ({
  currentUser,
  currentRoom,
  setMarketData,
  setActiveSimulation,
  setLivePrices,
  toast
}) => {
  const socketRef      = useRef(null);
  const [isConnected,  setIsConnected]  = useState(false);
  const [lastDataAt,   setLastDataAt]   = useState(null);
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [experimentalMode, setExperimentalMode] = useState(false);
  const [pendingOrders,    setPendingOrders]    = useState([]);
  const [notifications,    setNotifications]    = useState([]);
  const [priceAlarms,      setPriceAlarms]      = useState([]);

  // Recompute socketStatus whenever connection or lastDataAt changes
  useEffect(() => {
    if (!isConnected) { setSocketStatus('disconnected'); return; }
    if (!lastDataAt)  { setSocketStatus('connected');    return; }
    const age = Date.now() - lastDataAt;
    setSocketStatus(age > DEGRADED_THRESHOLD_MS ? 'degraded' : 'live');
  }, [isConnected, lastDataAt]);

  // Periodically recheck degraded status (in case no events fire)
  useEffect(() => {
    if (!isConnected) return;
    const id = setInterval(() => {
      if (!lastDataAt) return;
      const age = Date.now() - lastDataAt;
      setSocketStatus(age > DEGRADED_THRESHOLD_MS ? 'degraded' : 'live');
    }, 30_000);
    return () => clearInterval(id);
  }, [isConnected, lastDataAt]);

  useEffect(() => {
    const BACKEND_URL = window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : `https://${window.location.hostname.split('.')[0]}-3000.${window.location.hostname.split('.').slice(1).join('.')}`;

    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      reconnectionAttempts: Infinity,
      timeout: 20000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      if (currentUser && currentRoom) {
        socket.emit('join_room', {
          roomCode: currentRoom.classCode,
          userId:   currentUser.id,
          userName: currentUser.name,
          role:     currentUser.role,
        });
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setSocketStatus('disconnected');
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
      setSocketStatus('disconnected');
    });

    socket.on('room_state', (state) => {
      if (state.marketData && Object.keys(state.marketData).length > 0) {
        const formatted = {};
        Object.keys(state.marketData).forEach(sym => {
          formatted[sym] = state.marketData[sym].map(c => ({ ...c, time: new Date(c.time) }));
        });
        setMarketData(formatted);
      }
      if (state.activeSimulation) setActiveSimulation(state.activeSimulation);

      // Bootstrap livePrices from room_state if server sent them
      if (state.livePrices && setLivePrices) {
        const now = Date.now();
        setLivePrices(prev => {
          const next = { ...prev };
          for (const [sym, d] of Object.entries(state.livePrices)) {
            const price = typeof d === 'number' ? d : d.price;
            const pct   = typeof d === 'object' ? (d.percentChange ?? 0) : 0;
            if (price > 0) next[sym] = { price, percentChange: pct, ts: now, source: 'live' };
          }
          return next;
        });
        setLastDataAt(now);
      }

      setExperimentalMode(state.experimentalMode || false);
      setPendingOrders(state.pendingOrders   || []);
      setNotifications(state.notifications   || []);
      setPriceAlarms(state.priceAlarms       || []);
    });

    socket.on('market_update', (marketData) => {
      const formatted = {};
      Object.keys(marketData).forEach(sym => {
        formatted[sym] = marketData[sym].map(c => ({ ...c, time: new Date(c.time) }));
      });
      setMarketData(formatted);
    });

    // live_prices: scheduler broadcasts {price, percentChange, ts} every 60 s
    socket.on('live_prices', (prices) => {
      const now = Date.now();
      setLastDataAt(now);
      setSocketStatus('live');

      // 1. Update live price store (used by MarketSymbols)
      if (setLivePrices) {
        setLivePrices(prev => {
          const next = { ...prev };
          for (const [sym, d] of Object.entries(prices)) {
            const price = typeof d === 'number' ? d : d.price;
            const pct   = typeof d === 'object' ? (d.percentChange ?? 0) : 0;
            if (price > 0) next[sym] = { price, percentChange: pct, ts: now, source: 'live' };
          }
          return next;
        });
      }

      // 2. Update last candle in chart data (lightweight — no full rerender)
      setMarketData(prev => {
        const next = { ...prev };
        for (const [sym, d] of Object.entries(prices)) {
          const price = typeof d === 'number' ? d : d.price;
          if (!price || price <= 0) continue;
          if (!next[sym] || next[sym].length === 0) continue;
          const arr  = [...next[sym]];
          const last = { ...arr[arr.length - 1] };
          last.close = price;
          last.value = price;
          last.high  = Math.max(last.high, price);
          last.low   = Math.min(last.low,  price);
          arr[arr.length - 1] = last;
          next[sym] = arr;
        }
        return next;
      });
    });

    socket.on('simulation_started', (simulation) => {
      setActiveSimulation(simulation);
      toast({ title: 'Simulación Iniciada', description: 'Simulación de mercado activa' });
    });

    socket.on('simulation_stopped', () => {
      setActiveSimulation(null);
      toast({ title: 'Simulación Detenida', description: 'La simulación ha finalizado' });
    });

    socket.on('experimental_mode_changed', ({ enabled }) => {
      setExperimentalMode(enabled);
      toast({
        title:   enabled ? 'Modo Experimental Activado'   : 'Modo Experimental Desactivado',
        description: enabled
          ? 'El docente puede modificar precios manualmente'
          : 'Los precios vuelven a seguir el mercado normal',
        variant: enabled ? 'default' : 'destructive',
      });
    });

    socket.on('price_overridden', ({ symbol, price }) => {
      toast({ title: 'Precio Modificado', description: `${symbol}: ${price.toFixed(2)} (modo experimental)` });
    });

    socket.on('order_created', (order) => {
      setPendingOrders(prev => [...prev, order]);
      toast({
        title:       'Orden Pendiente Creada',
        description: `${order.side} Limit en ${order.symbol} a ${order.triggerPrice.toFixed(2)}`,
      });
    });

    socket.on('order_executed', (order) => {
      setPendingOrders(prev => prev.filter(o => o.id !== order.id));
      toast({
        title:       'Orden Ejecutada',
        description: `${order.side} Limit: ${order.symbol} ejecutado a ${order.executionPrice.toFixed(2)}`,
      });
    });

    socket.on('order_cancelled', ({ orderId }) => {
      setPendingOrders(prev => prev.filter(o => o.id !== orderId));
    });

    socket.on('alarm_created', (alarm) => {
      setPriceAlarms(prev => [...prev, alarm]);
      toast({
        title:       'Alarma Creada',
        description: `${alarm.symbol} ${alarm.condition === 'above' ? 'por encima de' : 'por debajo de'} ${alarm.price.toFixed(2)}`,
      });
    });

    socket.on('alarm_triggered', (alarm) => {
      toast({
        title:       '🔔 Alarma Activada',
        description: `${alarm.symbol} ${alarm.condition === 'above' ? 'superó' : 'cayó por debajo de'} ${alarm.price.toFixed(2)}`,
      });
    });

    socket.on('alarm_deleted', ({ alarmId }) => {
      setPriceAlarms(prev => prev.filter(a => a.id !== alarmId));
    });

    socket.on('new_notification', ({ userId, notification }) => {
      if (userId === currentUser?.id) {
        setNotifications(prev => [notification, ...prev]);
        toast({
          title:       notification.type === 'student_trade' ? '📊 Operación de Estudiante' : '📬 Nueva Notificación',
          description: notification.message,
        });
      }
    });

    socket.on('notification_updated', (notification) => {
      setNotifications(prev => prev.map(n => n.id === notification.id ? notification : n));
    });

    return () => {
      if (currentRoom) socket.emit('leave_room', currentRoom.classCode);
      socket.disconnect();
    };
  }, [currentUser?.id, currentRoom?.classCode]);

  // Rejoin room after reconnection
  useEffect(() => {
    if (socketRef.current && currentUser && currentRoom && isConnected) {
      socketRef.current.emit('join_room', {
        roomCode: currentRoom.classCode,
        userId:   currentUser.id,
        userName: currentUser.name,
        role:     currentUser.role,
      });
    }
  }, [currentUser?.id, currentRoom?.classCode, isConnected]);

  const startSimulation = (simulationType, duration) => {
    if (!socketRef.current || !currentRoom) return;
    socketRef.current.emit('start_simulation', { roomCode: currentRoom.classCode, simulationType, duration });
  };

  const stopSimulation = () => {
    if (!socketRef.current || !currentRoom) return;
    socketRef.current.emit('stop_simulation', currentRoom.classCode);
  };

  const toggleExperimentalMode = (enabled) => {
    if (!socketRef.current || !currentRoom) return;
    socketRef.current.emit('toggle_experimental_mode', { roomCode: currentRoom.classCode, enabled });
  };

  const overridePrice = (symbol, price) => {
    if (!socketRef.current || !currentRoom) return;
    socketRef.current.emit('override_price', { roomCode: currentRoom.classCode, symbol, price });
  };

  const createPendingOrder = (order) => {
    if (!socketRef.current || !currentRoom) return;
    socketRef.current.emit('create_pending_order', { roomCode: currentRoom.classCode, order: { ...order, userId: currentUser.id } });
  };

  const cancelPendingOrder = (orderId) => {
    if (!socketRef.current || !currentRoom) return;
    socketRef.current.emit('cancel_pending_order', { roomCode: currentRoom.classCode, orderId });
  };

  const createPriceAlarm = (alarm) => {
    if (!socketRef.current || !currentRoom) return;
    socketRef.current.emit('create_price_alarm', { roomCode: currentRoom.classCode, alarm: { ...alarm, userId: currentUser.id } });
  };

  const deletePriceAlarm = (alarmId) => {
    if (!socketRef.current || !currentRoom) return;
    socketRef.current.emit('delete_price_alarm', { roomCode: currentRoom.classCode, alarmId });
  };

  const notifyStudentTrade = (trade, teacherId) => {
    if (!socketRef.current || !currentRoom) return;
    socketRef.current.emit('student_trade', { roomCode: currentRoom.classCode, trade, teacherId });
  };

  const markNotificationRead = (notificationId) => {
    if (!socketRef.current || !currentRoom) return;
    socketRef.current.emit('mark_notification_read', { roomCode: currentRoom.classCode, notificationId });
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  return {
    isConnected,
    socketStatus,
    lastDataAt,
    experimentalMode,
    pendingOrders,
    notifications,
    priceAlarms,
    startSimulation,
    stopSimulation,
    toggleExperimentalMode,
    overridePrice,
    createPendingOrder,
    cancelPendingOrder,
    createPriceAlarm,
    deletePriceAlarm,
    notifyStudentTrade,
    markNotificationRead,
  };
};
