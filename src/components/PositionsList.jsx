
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTradingContext } from '@/contexts/TradingContext';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, COP_TO_USD_RATE } from '@/lib/market-data';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const PositionsList = () => {
  const { user, positions, closePosition, getCurrentPrice, symbols } = useTradingContext();
  const { t } = useTranslation();
  
  if (!positions || positions.length === 0) {
    return (
      <div className="glass-card rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">{t('trading.positions')}</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>{t('positions.empty', { defaultValue: 'No open positions.' })}</p>
          <p className="text-sm mt-2">{t('positions.hint', { defaultValue: 'Open a trade to get started.' })}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass-card rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">{t('trading.positions')}</h2>
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {positions.map((position) => {
          const currentSymbolInfo = symbols.find(s => s.id === position.symbol);
          const assetCurrency = position.currency || (currentSymbolInfo ? currentSymbolInfo.currency : 'USD');
          const currentPriceInAssetCurrency = getCurrentPrice(position.symbol);

          const entryPriceUSD = assetCurrency === 'COP' ? position.entryPrice * COP_TO_USD_RATE : position.entryPrice;
          const currentPriceUSD = assetCurrency === 'COP' ? currentPriceInAssetCurrency * COP_TO_USD_RATE : currentPriceInAssetCurrency;
          
          const shares = position.amount / entryPriceUSD; // position.amount is always in USD
          
          let unrealizedPL_USD;
          if (position.type === 'BUY') {
            unrealizedPL_USD = (currentPriceUSD - entryPriceUSD) * shares;
          } else { // SELL
            unrealizedPL_USD = (entryPriceUSD - currentPriceUSD) * shares;
          }
          
          let percentageChange = 0;
          if (entryPriceUSD !== 0) {
            percentageChange = (unrealizedPL_USD / position.amount) * 100;
          }
          
          const isProfit = unrealizedPL_USD >= 0;
          const valueColorClass = isProfit ? 'text-green-500' : 'text-red-500';
          
          return (
            <motion.div 
              key={position.id}
              className="border border-border rounded-md p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{position.symbol}</span>
                    {position.type === 'BUY' ? (
                      <ArrowUpRight className="h-4 w-4 ml-1 text-success" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 ml-1 text-destructive" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {position.type === 'BUY' ? t('trading.buy') : t('trading.sell')} • {formatDate(position.openDate)}
                  </p>
                </div>
                {user?.role === 'student' ? (
                  <div className="text-right">
                    <p className={`font-medium ${valueColorClass}`}>
                      {isProfit ? '+' : ''}{formatCurrency(unrealizedPL_USD, 'USD')}
                    </p>
                    <p className={`text-sm ${valueColorClass}`}>
                      {isProfit ? '+' : ''}{percentageChange.toFixed(2)}%
                    </p>
                  </div>
                ) : (
                  <div className="text-right">
                    <p className={`font-medium ${isProfit ? 'price-up' : 'price-down'}`}>
                      {isProfit ? '+' : ''}{formatCurrency(unrealizedPL_USD, 'USD')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isProfit ? '+' : ''}{percentageChange.toFixed(2)}%
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <p className="text-muted-foreground">{t('trading.amount')} (USD)</p>
                  <p className="font-medium">{formatCurrency(position.amount, 'USD')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('trading.price')} ({assetCurrency})</p>
                  <p className="font-medium">{formatCurrency(position.entryPrice, assetCurrency)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('trading.market_price')} ({assetCurrency})</p>
                  <p className="font-medium">{formatCurrency(currentPriceInAssetCurrency, assetCurrency)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('dashboard.total_value')}</p>
                  <p className="font-medium">{formatCurrency(position.amount + unrealizedPL_USD, 'USD')}</p>
                </div>
              </div>
              
              {position.justification && (
                <div className="text-sm mb-3 p-2 bg-muted/50 rounded-md">
                  <p className="text-muted-foreground text-xs">{t('trading.justification', { defaultValue: 'Justification' })}:</p>
                  <p className="italic">{position.justification}</p>
                   {position.attachmentName && <p className="text-xs mt-1">Adjunto: {position.attachmentName}</p>}
                </div>
              )}

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => closePosition(position.id)}
              >
                {t('positions.close', { defaultValue: 'Close position' })}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PositionsList;
