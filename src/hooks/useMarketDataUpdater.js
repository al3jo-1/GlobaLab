import { useEffect } from 'react';

const SIMULATION_EFFECTS = {
  'crisis_2007': { volatilityMultiplier: 2.5, trendMultiplier: -0.0005, duration: 300000 }, 
  'ww2': { volatilityMultiplier: 3, trendMultiplier: -0.0008, duration: 600000 },
  '9_11': { volatilityMultiplier: 4, trendMultiplier: -0.001, duration: 180000 },
  'elections': { volatilityMultiplier: 2, trendMultiplier: 0, duration: 120000 }, 
};


export const useMarketDataUpdater = (setMarketData, symbols, activeSimulation) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData => {
        const newData = { ...prevData };
        const simulationParams = activeSimulation ? SIMULATION_EFFECTS[activeSimulation.type] : null;

        Object.keys(newData).forEach(symbolId => {
          if (!newData[symbolId] || newData[symbolId].length === 0) return;
          
          const lastCandle = newData[symbolId].slice(-1)[0];
          const lastClose = lastCandle.close;

          const symbolInfo = symbols.find(s => s.id === symbolId);
          let baseVolatility = symbolInfo?.baseVolatility || 0.02;
          
          let currentVolatility = baseVolatility;
          let trend = 0;

          if (simulationParams && activeSimulation && Date.now() < activeSimulation.endTime) {
            currentVolatility *= simulationParams.volatilityMultiplier;
            trend = simulationParams.trendMultiplier;
            if (symbolInfo && symbolInfo.type === 'crypto') { 
              trend *= 1.5; 
            }
          }


          const newTime = new Date(lastCandle.time.getTime() + 60000); 
          
          let open = lastClose * (1 + (Math.random() * currentVolatility * 0.2 - currentVolatility * 0.1) + trend);
          let close = open * (1 + (Math.random() * currentVolatility - currentVolatility * 0.5) + trend);
          
          let high = Math.max(open, close) * (1 + Math.random() * currentVolatility * 0.3);
          let low = Math.min(open, close) * (1 - Math.random() * currentVolatility * 0.3);
          
          open = Math.max(0.0001, open);
          close = Math.max(0.0001, close);
          high = Math.max(0.0001, high);
          low = Math.max(0.0001, low);

          newData[symbolId] = [
            ...newData[symbolId],
            { 
              time: newTime, 
              open,
              high,
              low,
              close,
              value: close,
              currency: symbolInfo?.currency
            }
          ];
          
          // Keep a rolling window of data, e.g., last 2000 points
          const maxPoints = 2000; 
          if (newData[symbolId].length > maxPoints) {
            newData[symbolId] = newData[symbolId].slice(-maxPoints);
          }
        });
        return newData;
      });
    }, 5000); // Update interval remains 5 seconds
    
    return () => clearInterval(interval);
  }, [setMarketData, symbols, activeSimulation]);
};