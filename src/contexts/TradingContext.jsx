
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { generateMarketData, COP_TO_USD_RATE } from '@/lib/market-data';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMarketDataUpdater } from '@/hooks/useMarketDataUpdater';
import { useAuthManager } from '@/hooks/useAuthManager';
import { usePortfolioManager } from '@/hooks/usePortfolioManager';


const TradingContext = createContext({});

export const useTradingContext = () => useContext(TradingContext);

const generateClassCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const TradingProvider = ({ children }) => {
  const { toast } = useToast();
  
  const [allUsers, setAllUsers, saveAllUsers] = useLocalStorage('allTradingUsers', []);
  const [currentUserEmail, setCurrentUserEmail, saveCurrentUserEmail] = useLocalStorage('currentTradingUserEmail', null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [activeSimulation, setActiveSimulationState] = useLocalStorage('activeTradingSimulation', null);
  const [theme, setThemeState] = useLocalStorage('theme', 'dark');


  const currentUser = allUsers.find(u => u.email === currentUserEmail) || null;
  
  const initialSymbols = [
    { id: 'BTCUSD', name: 'Bitcoin', price: 0, change: 0, currency: 'USD', type: 'crypto', baseVolatility: 0.03 },
    { id: 'ETHUSD', name: 'Ethereum', price: 0, change: 0, currency: 'USD', type: 'crypto', baseVolatility: 0.04 },
    { id: 'ECOPETROL', name: 'Ecopetrol', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.015 },
    { id: 'BANCOLOMBIA', name: 'Bancolombia', price: 0, change: 0, currency: 'USD', type: 'stock', baseVolatility: 0.01 },
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
    { id: 'XRPUSD', name: 'Ripple', price: 0, change: 0, currency: 'USD', type: 'crypto', baseVolatility: 0.05 },
    { id: 'ADAUSD', name: 'Cardano', price: 0, change: 0, currency: 'USD', type: 'crypto', baseVolatility: 0.045 },
    { id: 'SOLUSD', name: 'Solana', price: 0, change: 0, currency: 'USD', type: 'crypto', baseVolatility: 0.055 },
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
    generateClassCode
  });

  const { openPosition, closePosition } = usePortfolioManager({
    currentUser, 
    updateUser: updateUserInList,
    toast, 
    marketData, 
    symbols: initialSymbols,
    copToUsdRate: COP_TO_USD_RATE
  });

  useEffect(() => {
    const initialData = {};
    initialSymbols.forEach(symbol => {
      initialData[symbol.id] = generateMarketData(symbol.id, symbol.currency, symbol.baseVolatility);
    });
    setMarketData(initialData);
    setIsLoadingMarket(false);
  }, []);

  useMarketDataUpdater(setMarketData, initialSymbols, activeSimulation);
  
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

  const studentsInClass = currentUser?.role === 'teacher' 
    ? allUsers.filter(u => u.role === 'student' && u.joinedClassCode === currentUser.classCode) 
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
    setActiveSimulation,
    theme,
    toggleTheme,
    copToUsdRate: COP_TO_USD_RATE,
  };
  
  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
};
