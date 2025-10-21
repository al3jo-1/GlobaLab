import { useState, useEffect, useCallback } from 'react';
import { formatCurrency } from '@/lib/market-data';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue, setValue]; 
};

export const useMarketDataUpdater = (setMarketData, symbols) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData => {
        const newData = { ...prevData };
        Object.keys(newData).forEach(symbolId => {
          if (!newData[symbolId] || newData[symbolId].length === 0) return;
          
          const lastCandle = newData[symbolId].slice(-1)[0];
          const lastClose = lastCandle.close;

          const symbolInfo = symbols.find(s => s.id === symbolId);
          let volatility = 0.02; 
          if (symbolInfo && symbolInfo.type === 'stock') volatility = 0.005;
          if (symbolInfo && symbolInfo.currency === 'COP') volatility = 0.01;


          const newTime = new Date(lastCandle.time.getTime() + 60000);
          const open = lastClose * (1 + (Math.random() * volatility * 0.2 - volatility * 0.1));
          const close = open * (1 + (Math.random() * volatility - volatility * 0.5));
          const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.3);
          const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.3);
          
          newData[symbolId] = [
            ...newData[symbolId],
            { 
              time: newTime, 
              open: Math.max(0.0001, open),
              high: Math.max(0.0001, high),
              low: Math.max(0.0001, low),
              close: Math.max(0.0001, close),
              value: close,
              currency: symbolInfo?.currency
            }
          ];
          
          if (newData[symbolId].length > 100) {
            newData[symbolId] = newData[symbolId].slice(-100);
          }
        });
        return newData;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [setMarketData, symbols]);
};

export const useAuthManager = ({ allUsers, setAllUsers, setCurrentUserEmail, toast, generateClassCode }) => {
  const login = (loginData) => {
    const userExists = allUsers.find(u => u.email === loginData.email && u.password === loginData.password);
    if (userExists) {
      setCurrentUserEmail(userExists.email);
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido de nuevo, ${userExists.name}!`,
      });
      return true;
    } else {
      toast({
        title: "Error de inicio de sesión",
        description: "Correo electrónico o contraseña incorrectos.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const logout = () => {
    setCurrentUserEmail(null);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };
  
  const register = (userData) => {
    const userExists = allUsers.find(u => u.email === userData.email);
    if (userExists) {
      toast({
        title: "Error de registro",
        description: "Este correo electrónico ya está registrado.",
        variant: "destructive",
      });
      return null;
    }

    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, 
      role: userData.role,
      balance: 10000,
      positions: [],
      transactions: [],
      classCode: userData.role === 'teacher' ? generateClassCode() : null,
      joinedClassCode: userData.role === 'student' ? userData.joinedClassCode || null : null,
    };

    if (userData.role === 'student' && userData.joinedClassCode) {
      const teacherExists = allUsers.find(u => u.role === 'teacher' && u.classCode === userData.joinedClassCode);
      if (!teacherExists) {
        toast({
          title: "Código de Sala Inválido",
          description: "El código de sala ingresado no existe. Puedes registrarte sin código.",
          variant: "destructive",
        });
        newUser.joinedClassCode = null; 
      }
    }
    
    setAllUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUserEmail(newUser.email);
    
    toast({
      title: "Registro exitoso",
      description: `Bienvenido, ${newUser.name}! Tu cuenta ha sido creada. ${newUser.classCode ? `Tu código de sala es: ${newUser.classCode}` : ''}`,
    });
    return newUser;
  };

  return { login, logout, register };
};

export const usePortfolioManager = ({ currentUser, updateUser, toast, marketData, symbols }) => {
  const openPosition = (symbol, type, amount, price) => {
    if (!currentUser) return false;

    if (amount <= 0) {
      toast({
        title: "Error",
        description: "El monto debe ser mayor a cero",
        variant: "destructive",
      });
      return false;
    }
    
    if (amount > currentUser.balance) {
      toast({
        title: "Fondos insuficientes",
        description: "No tienes suficiente saldo para esta operación",
        variant: "destructive",
      });
      return false;
    }
    
    const symbolInfo = symbols.find(s => s.id === symbol);
    const currency = symbolInfo ? symbolInfo.currency : 'USD';

    const newPosition = {
      id: Date.now().toString(),
      symbol,
      type,
      amount,
      entryPrice: price,
      openTime: new Date().toISOString(),
      currency: currency,
    };
    
    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance - amount,
      positions: [...currentUser.positions, newPosition],
      transactions: [
        ...currentUser.transactions,
        {
          id: Date.now().toString(),
          type: 'OPEN',
          position: newPosition,
          time: new Date().toISOString(),
        }
      ]
    };
    updateUser(updatedUser);
    
    toast({
      title: "Posición abierta",
      description: `Has abierto una posición ${type === 'BUY' ? 'de compra' : 'de venta'} en ${symbol}`,
    });
    
    return true;
  };
  
  const closePosition = (positionId, currentPrice) => {
    if (!currentUser) return;

    const position = currentUser.positions.find(p => p.id === positionId);
    
    if (!position) {
      toast({
        title: "Error",
        description: "Posición no encontrada",
        variant: "destructive",
      });
      return;
    }
    
    const priceDiff = position.type === 'BUY' 
      ? currentPrice - position.entryPrice 
      : position.entryPrice - currentPrice;
    
    const profitPercentage = position.entryPrice !== 0 ? priceDiff / position.entryPrice : 0;
    const profit = position.amount * profitPercentage;
    const returnAmount = position.amount + profit;
    
    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance + returnAmount,
      positions: currentUser.positions.filter(p => p.id !== positionId),
      transactions: [
        ...currentUser.transactions,
        {
          id: Date.now().toString(),
          type: 'CLOSE',
          position: {
            ...position,
            exitPrice: currentPrice,
            closeTime: new Date().toISOString(),
            profit,
          },
          time: new Date().toISOString(),
        }
      ]
    };
    updateUser(updatedUser);
        
    toast({
      title: profit >= 0 ? "Ganancia" : "Pérdida",
      description: `Has cerrado la posición con ${profit >= 0 ? 'una ganancia' : 'una pérdida'} de ${formatCurrency(Math.abs(profit), position.currency)}`,
      variant: profit >= 0 ? "default" : "destructive",
    });
  };

  return { openPosition, closePosition };
};