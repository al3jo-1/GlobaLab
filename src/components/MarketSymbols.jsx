import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTradingContext } from '@/contexts/TradingContext';
import { formatCurrency, formatPercentage } from '@/lib/market-data';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Landmark, Bitcoin, Briefcase, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filteredSymbols = useMemo(() => {
    return symbols.filter(symbol => {
      const matchesSearch = searchTerm === '' || 
        symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        symbol.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = activeFilter === 'all' || symbol.type === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [symbols, searchTerm, activeFilter]);
  
  const filterButtons = [
    { id: 'all', label: t('markets.all', 'All') },
    { id: 'stock', label: t('markets.stocks', 'Stocks') },
    { id: 'crypto', label: t('markets.crypto', 'Cryptocurrency') },
    { id: 'forex', label: t('markets.forex', 'Forex') },
    { id: 'index', label: t('markets.index', 'Index') }
  ];
  
  return (
    <div className="glass-card rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">{t('markets.title')}</h2>
      
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('markets.search_placeholder', 'Search by name or symbol...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-2 mb-3 flex-wrap">
        {filterButtons.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              activeFilter === filter.id 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary/50 hover:bg-secondary'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredSymbols.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            {t('markets.no_results') || 'No results found'}
          </p>
        ) : (
          filteredSymbols.map((symbol) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default MarketSymbols;