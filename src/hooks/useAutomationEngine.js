import { useEffect, useRef } from 'react';

export const useAutomationEngine = (positions, marketData, closePosition, toast) => {
  const executedRulesRef = useRef(new Set());
  const latestPositionsRef = useRef(positions);
  const latestMarketDataRef = useRef(marketData);
  const latestClosePositionRef = useRef(closePosition);
  const latestToastRef = useRef(toast);

  useEffect(() => {
    latestPositionsRef.current = positions;
  }, [positions]);

  useEffect(() => {
    latestMarketDataRef.current = marketData;
  }, [marketData]);

  useEffect(() => {
    latestClosePositionRef.current = closePosition;
  }, [closePosition]);

  useEffect(() => {
    latestToastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const currentPositions = latestPositionsRef.current;
      const currentMarketData = latestMarketDataRef.current;
      const currentClosePosition = latestClosePositionRef.current;
      const currentToast = latestToastRef.current;

      if (!currentPositions || !currentMarketData || !currentClosePosition) return;

      for (const position of currentPositions) {
        if (!position.automation) continue;

        const symbolMarketData = currentMarketData[position.symbol];
        if (!symbolMarketData || symbolMarketData.length === 0) continue;

        const currentPrice = symbolMarketData[symbolMarketData.length - 1].close;
        const { takeProfit, stopLoss, buyLimit, sellLimit } = position.automation;
        const ruleKey = `${position.id}`;

        if (executedRulesRef.current.has(ruleKey)) continue;

        let shouldClose = false;
        let reason = '';

        if (position.type === 'BUY') {
          if (takeProfit && currentPrice >= takeProfit) {
            shouldClose = true;
            reason = `Take Profit alcanzado (${currentPrice.toFixed(2)} >= ${takeProfit})`;
          } else if (stopLoss && currentPrice <= stopLoss) {
            shouldClose = true;
            reason = `Stop Loss alcanzado (${currentPrice.toFixed(2)} <= ${stopLoss})`;
          } else if (buyLimit && currentPrice <= buyLimit) {
            shouldClose = true;
            reason = `Buy Limit alcanzado (${currentPrice.toFixed(2)} <= ${buyLimit})`;
          }
        } else if (position.type === 'SELL') {
          if (takeProfit && currentPrice <= takeProfit) {
            shouldClose = true;
            reason = `Take Profit alcanzado (${currentPrice.toFixed(2)} <= ${takeProfit})`;
          } else if (stopLoss && currentPrice >= stopLoss) {
            shouldClose = true;
            reason = `Stop Loss alcanzado (${currentPrice.toFixed(2)} >= ${stopLoss})`;
          } else if (sellLimit && currentPrice >= sellLimit) {
            shouldClose = true;
            reason = `Sell Limit alcanzado (${currentPrice.toFixed(2)} >= ${sellLimit})`;
          }
        }

        if (shouldClose) {
          try {
            const success = await Promise.resolve(currentClosePosition(position.id));
            
            if (success) {
              executedRulesRef.current.add(ruleKey);
              
              currentToast({
                title: "Automatización Ejecutada",
                description: `${position.symbol}: ${reason}`,
                variant: "default"
              });
            }
          } catch (error) {
            console.error(`Automation engine failed to close position ${position.id}:`, error);
          }
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!positions) return;
    
    const currentPositionIds = new Set(positions.map(p => p.id));
    const executedIds = Array.from(executedRulesRef.current);
    
    executedIds.forEach(id => {
      if (!currentPositionIds.has(id)) {
        executedRulesRef.current.delete(id);
      }
    });
  }, [positions]);
};
