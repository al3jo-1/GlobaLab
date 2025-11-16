
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { generateMarketData, COP_TO_USD_RATE } from '@/lib/market-data';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMarketDataUpdater } from '@/hooks/useMarketDataUpdater';
import { useAuthManager } from '@/hooks/useAuthManager';
import { usePortfolioManager } from '@/hooks/usePortfolioManager';
import { useChartPreferences } from '@/hooks/useChartPreferences';
import { useAutomationEngine } from '@/hooks/useAutomationEngine';
import { useSocketManager } from '@/hooks/useSocketManager';


const TradingContext = createContext({});

export const useTradingContext = () => useContext(TradingContext);

const generateClassCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const TradingProvider = ({ children }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [allUsers, setAllUsers, saveAllUsers] = useLocalStorage('allTradingUsers', []);
  const [currentUserEmail, setCurrentUserEmail, saveCurrentUserEmail] = useLocalStorage('currentTradingUserEmail', null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [activeSimulation, setActiveSimulationState] = useLocalStorage('activeTradingSimulation', null);
  const [theme, setThemeState] = useLocalStorage('theme', 'dark');
  const { preferences: chartPreferences, updatePreferences: updateChartPreferences, resetToDefaults: resetChartPreferences } = useChartPreferences();


  const currentUser = allUsers.find(u => u.email === currentUserEmail) || null;
  
  const initialSymbols = [
    { id: 'BTCUSD', name: 'Bitcoin', price: 0, change: 0, currency: 'USD', type: 'crypto', baseVolatility: 0.03, featured: true },
    { id: 'ETHUSD', name: 'Ethereum', price: 0, change: 0, currency: 'USD', type: 'crypto', baseVolatility: 0.04, featured: true },
    { id: 'XRPUSD', name: 'Ripple', price: 0, change: 0, currency: 'USD', type: 'crypto', baseVolatility: 0.05 },
    { id: 'ADAUSD', name: 'Cardano', price: 0, change: 0, currency: 'USD', type: 'crypto', baseVolatility: 0.045 },
    { id: 'SOLUSD', name: 'Solana', price: 0, change: 0, currency: 'USD', type: 'crypto', baseVolatility: 0.055 },
    { id: 'DOTUSD', name: 'Polkadot', price: 0, change: 0, currency: 'USD', type: 'crypto', baseVolatility: 0.048 },
    { id: 'MATICUSD', name: 'Polygon', price: 0, change: 0, currency: 'USD', type: 'crypto', baseVolatility: 0.052 },
    { id: 'AVAXUSD', name: 'Avalanche', price: 0, change: 0, currency: 'USD', type: 'crypto', baseVolatility: 0.056 },
    
    { id: 'ECOPETROL', name: 'Ecopetrol', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.015 },
    { id: 'BANCOLOMBIA', name: 'Bancolombia', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.01, featured: true },
    { id: 'PFBCOLOM', name: 'Bancolombia Pref.', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.011 },
    { id: 'GRUPOARGOS', name: 'Grupo Argos', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.012 },
    { id: 'GRUPOSURA', name: 'Grupo Sura', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.011 },
    { id: 'PFGRUPSURA', name: 'Grupo Sura Pref.', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.01 },
    { id: 'ISA', name: 'ISA', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.013 },
    { id: 'CEMARGOS', name: 'Cementos Argos', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.014 },
    { id: 'CORFICOLCF', name: 'Corficolombiana', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.012 },
    { id: 'GRUPOAVAL', name: 'Grupo Aval', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.009 },
    { id: 'CELSIA', name: 'Celsia', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.013 },
    { id: 'GRUPONUTRESA', name: 'Grupo Nutresa', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.01 },
    { id: 'EXITO', name: 'Almacenes Éxito', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.018 },
    { id: 'DAVIVIENDA', name: 'Davivienda Pref.', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.011 },
    { id: 'MINEROS', name: 'Mineros S.A.', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.022 },
    { id: 'NU', name: 'Nu Holdings', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.025 },
    { id: 'AAPL', name: 'Apple Inc.', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.018, featured: true },
    { id: 'GOOGL', name: 'Alphabet Inc.', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.02 },
    { id: 'MSFT', name: 'Microsoft Corp.', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.016 },
    { id: 'AMZN', name: 'Amazon.com Inc.', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.022 },
    { id: 'TSLA', name: 'Tesla Inc.', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.035 },
    { id: 'NVDA', name: 'NVIDIA Corp.', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.028 },
    
    { id: 'EURUSD', name: 'Euro vs Dólar', price: 0, change: 0, currency: 'USD', type: 'forex', baseVolatility: 0.008, featured: true },
    { id: 'GBPUSD', name: 'Libra vs Dólar', price: 0, change: 0, currency: 'USD', type: 'forex', baseVolatility: 0.009 },
    { id: 'USDJPY', name: 'Dólar vs Yen', price: 0, change: 0, currency: 'USD', type: 'forex', baseVolatility: 0.0085 },
    { id: 'AUDUSD', name: 'Dólar Australiano', price: 0, change: 0, currency: 'USD', type: 'forex', baseVolatility: 0.0095 },
    
    { id: 'SPX', name: 'S&P 500', price: 0, change: 0, currency: 'USD', type: 'index', baseVolatility: 0.012, featured: true },
    { id: 'DJI', name: 'Dow Jones', price: 0, change: 0, currency: 'USD', type: 'index', baseVolatility: 0.011 },
    { id: 'NDX', name: 'NASDAQ 100', price: 0, change: 0, currency: 'USD', type: 'index', baseVolatility: 0.015 },
    { id: 'FTSE', name: 'FTSE 100', price: 0, change: 0, currency: 'USD', type: 'index', baseVolatility: 0.01 },
  ];

  const [marketData, setMarketData] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSD');
  const [isLoadingMarket, setIsLoadingMarket] = useState(true);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    setIsLoadingAuth(false);
  }, [currentUserEmail]);


  const updateUserInList = (updatedUser) => {
    setAllUsers(prevUsers => {
      const newUsers = prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
      saveAllUsers(newUsers);
      return newUsers;
    });
  };

  const setActiveSimulation = (simulation) => {
    setActiveSimulationState(simulation);
  };


  const { login, logout, register } = useAuthManager({
    allUsers, 
    setAllUsers, 
    setCurrentUserEmail,
    saveCurrentUserEmail,
    toast, 
    generateClassCode,
    t
  });

  const currentRoom = currentUser?.rooms?.find(r => r.id === currentUser.selectedRoomId);

  const socketManager = useSocketManager({
    currentUser,
    currentRoom,
    setMarketData,
    setActiveSimulation,
    toast,
  });

  const { openPosition, closePosition } = usePortfolioManager({
    currentUser, 
    updateUser: updateUserInList,
    toast, 
    marketData, 
    symbols: initialSymbols,
    copToUsdRate: COP_TO_USD_RATE,
    notifyStudentTrade: socketManager.notifyStudentTrade,
    currentRoom,
  });

  useEffect(() => {
    const initialData = {};
    initialSymbols.forEach(symbol => {
      initialData[symbol.id] = generateMarketData(symbol.id, symbol.currency, symbol.baseVolatility);
    });
    setMarketData(initialData);
    setIsLoadingMarket(false);
  }, []);

  useMarketDataUpdater(setMarketData, initialSymbols, activeSimulation, !socketManager.isConnected);
  
  useAutomationEngine(
    currentUser?.positions || [],
    marketData,
    closePosition,
    toast
  );
  
  useEffect(() => {
    if (currentUserEmail && !allUsers.find(u => u.email === currentUserEmail)) {
      setCurrentUserEmail(null);
      saveCurrentUserEmail(null);
    }
  }, [currentUserEmail, allUsers, setCurrentUserEmail, saveCurrentUserEmail]);

  const getCurrentPrice = useCallback((symbolId) => {
    if (!marketData[symbolId] || marketData[symbolId].length === 0) return 0;
    return marketData[symbolId].slice(-1)[0].close; 
  }, [marketData]);

  const calculateChange = useCallback((symbolId) => {
    if (!marketData[symbolId] || marketData[symbolId].length < 2) return 0;
    const currentCandle = marketData[symbolId].slice(-1)[0];
    const previousCandle = marketData[symbolId].slice(-2)[0];
    if (!currentCandle || !previousCandle || previousCandle.close === 0) return 0;
    return ((currentCandle.close - previousCandle.close) / previousCandle.close) * 100;
  }, [marketData]);

  const getSymbolData = useCallback(() => {
    return initialSymbols.map(symbol => ({
      ...symbol,
      price: getCurrentPrice(symbol.id),
      change: calculateChange(symbol.id),
    }));
  }, [initialSymbols, getCurrentPrice, calculateChange]);

  const PLAN_LIMITS = {
    starter: { maxRooms: 1, maxStudents: 10 },
    professional: { maxRooms: 2, maxStudents: 15 },
    enterprise: { maxRooms: 3, maxStudents: 20 },
  };

  const getUserPlan = () => {
    if (!currentUser || currentUser.role !== 'teacher') {
      return { maxRooms: 999, maxStudents: 999 };
    }
    return PLAN_LIMITS[currentUser.plan] || PLAN_LIMITS.starter;
  };

  const createRoom = (roomName) => {
    if (!currentUser || currentUser.role !== 'teacher') {
      toast({
        title: t('common.error'),
        description: t('auth.error_teacher_only'),
        variant: "destructive",
      });
      return false;
    }

    const plan = getUserPlan();
    if ((currentUser.rooms || []).length >= plan.maxRooms) {
      toast({
        title: t('auth.limit_reached'),
        description: t('auth.limit_reached_message', { max: plan.maxRooms }),
        variant: "destructive",
      });
      return false;
    }

    const roomCode = generateClassCode();
    const newRoom = {
      id: `room_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: roomName,
      classCode: roomCode,
      createdAt: Date.now(),
      ownerId: currentUser.id,
      studentCount: 0,
    };

    const updatedUser = {
      ...currentUser,
      rooms: [...(currentUser.rooms || []), newRoom],
      balance: 10000,
      positions: [],
      transactions: [],
    };

    if (!updatedUser.selectedRoomId) {
      updatedUser.selectedRoomId = newRoom.id;
    }

    updateUserInList(updatedUser);
    return true;
  };

  const joinRoom = (roomCode) => {
    if (!currentUser || currentUser.role !== 'student') {
      toast({
        title: t('common.error'),
        description: t('auth.error_student_only'),
        variant: "destructive",
      });
      return false;
    }

    const teacher = allUsers.find(u => u.role === 'teacher' && (u.rooms || []).some(r => r.classCode === roomCode));
    if (!teacher) {
      toast({
        title: t('auth.invalid_code'),
        description: t('auth.invalid_code_message'),
        variant: "destructive",
      });
      return false;
    }

    const teacherRoom = teacher.rooms.find(r => r.classCode === roomCode);
    const alreadyJoined = (currentUser.rooms || []).some(r => r.classCode === roomCode);

    if (alreadyJoined) {
      toast({
        title: t('auth.already_joined'),
        description: t('auth.already_joined_message'),
        variant: "destructive",
      });
      return false;
    }

    const joinedRoom = {
      id: teacherRoom.id,
      name: teacherRoom.name,
      classCode: teacherRoom.classCode,
      ownerId: teacher.id,
      joinedAt: Date.now(),
    };

    const updatedStudent = {
      ...currentUser,
      rooms: [...(currentUser.rooms || []), joinedRoom],
      balance: currentUser.balance || 10000,
      positions: currentUser.positions || [],
      transactions: currentUser.transactions || [],
      selectedRoomId: joinedRoom.id,
    };

    const updatedTeacher = {
      ...teacher,
      rooms: teacher.rooms.map(r => 
        r.id === teacherRoom.id 
          ? { ...r, studentCount: (r.studentCount || 0) + 1 }
          : r
      ),
    };

    setAllUsers(prevUsers => {
      const newUsers = prevUsers.map(u => {
        if (u.id === updatedStudent.id) return updatedStudent;
        if (u.id === updatedTeacher.id) return updatedTeacher;
        return u;
      });
      saveAllUsers(newUsers);
      return newUsers;
    });

    return true;
  };

  const deleteRoom = (roomId) => {
    if (!currentUser) return false;

    if (currentUser.role === 'teacher') {
      const updatedRooms = (currentUser.rooms || []).filter(r => r.id !== roomId);
      const updatedUser = {
        ...currentUser,
        rooms: updatedRooms,
        selectedRoomId: currentUser.selectedRoomId === roomId 
          ? (updatedRooms.length > 0 ? updatedRooms[0].id : null)
          : currentUser.selectedRoomId,
      };
      updateUserInList(updatedUser);
    } else {
      const updatedRooms = (currentUser.rooms || []).filter(r => r.id !== roomId);
      const updatedUser = {
        ...currentUser,
        rooms: updatedRooms,
        selectedRoomId: currentUser.selectedRoomId === roomId 
          ? (updatedRooms.length > 0 ? updatedRooms[0].id : null)
          : currentUser.selectedRoomId,
      };
      updateUserInList(updatedUser);
    }

    return true;
  };

  const selectRoom = (roomId) => {
    if (!currentUser) return false;

    const roomExists = (currentUser.rooms || []).some(r => r.id === roomId);
    if (!roomExists) {
      toast({
        title: "Error",
        description: "La sala no existe",
        variant: "destructive",
      });
      return false;
    }

    const updatedUser = {
      ...currentUser,
      selectedRoomId: roomId,
    };
    updateUserInList(updatedUser);
    return true;
  };

  const studentsInClass = currentUser?.role === 'teacher' && currentRoom
    ? allUsers.filter(u => 
        u.role === 'student' && 
        (u.rooms || []).some(r => r.classCode === currentRoom.classCode)
      ) 
    : [];

  const value = {
    user: currentUser,
    balance: currentUser?.balance || 0,
    positions: currentUser?.positions || [],
    transactions: currentUser?.transactions || [],
    allUsers,
    studentsInClass,
    marketData,
    selectedSymbol,
    symbols: getSymbolData(),
    initialSymbols,
    isLoading: isLoadingAuth || isLoadingMarket,
    login,
    logout,
    register,
    openPosition,
    closePosition,
    getCurrentPrice,
    setSelectedSymbol,
    activeSimulation,
    setActiveSimulation: socketManager.isConnected ? socketManager.startSimulation : setActiveSimulation,
    stopSimulation: socketManager.stopSimulation,
    theme,
    toggleTheme,
    chartPreferences,
    updateChartPreferences,
    resetChartPreferences,
    copToUsdRate: COP_TO_USD_RATE,
    createRoom,
    joinRoom,
    deleteRoom,
    selectRoom,
    getUserPlan,
    currentRoom,
    socketConnected: socketManager.isConnected,
    experimentalMode: socketManager.experimentalMode,
    toggleExperimentalMode: socketManager.toggleExperimentalMode,
    overridePrice: socketManager.overridePrice,
    pendingOrders: socketManager.pendingOrders,
    createPendingOrder: socketManager.createPendingOrder,
    cancelPendingOrder: socketManager.cancelPendingOrder,
    notifications: socketManager.notifications,
    markNotificationRead: socketManager.markNotificationRead,
    priceAlarms: socketManager.priceAlarms,
    createPriceAlarm: socketManager.createPriceAlarm,
    deletePriceAlarm: socketManager.deletePriceAlarm,
  };
  
  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
};
