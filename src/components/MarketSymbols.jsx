import React from 'react';
import { useTradingContext } from '@/contexts/TradingContext';
import { formatCurrency, formatPercentage } from '@/lib/market-data';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Landmark, Bitcoin, Briefcase } from 'lucide-react';

const SymbolIcon = ({ type }) => {
  if (type === 'stock') {
    return <Landmark className="h-5 w-5 mr-2 text-blue-400" />;
  }
  if (type === 'crypto') {
    return <Bitcoin className="h-5 w-5 mr-2 text-yellow-400" />;
  }
  if (type === 'index') {
    return <Briefcase className="h-5 w-5 mr-2 text-green-400" />;
  }
  return null;
};

const MarketSymbols = () => {
  const { symbols, setSelectedSymbol, selectedSymbol } = useTradingContext();
  
  return (
    <div className="glass-card rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Mercados</h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {symbols.map((symbol) => (
          <motion.div
            key={symbol.id}
            className={`p-3 rounded-md cursor-pointer transition-colors ${
              selectedSymbol === symbol.id ? 'bg-primary/20' : 'hover:bg-secondary/50'
            }`}
            onClick={() => setSelectedSymbol(symbol.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <SymbolIcon type={symbol.type} />
                <div>
                  <p className="font-medium">{symbol.name}</p>
                  <p className="text-xs text-muted-foreground">{symbol.id} - {symbol.currency}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(symbol.price, symbol.currency)}</p>
                <p className={`text-sm flex items-center justify-end ${
                  symbol.change >= 0 ? 'price-up' : 'price-down'
                }`}>
                  {symbol.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {formatPercentage(symbol.change)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MarketSymbols;