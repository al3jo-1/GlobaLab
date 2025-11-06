import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatPercentage } from '@/lib/market-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import ChartControls from './ChartControls';
import { useTradingContext } from '@/contexts/TradingContext';


const ChartHeader = ({
  currentSymbolInfo,
  selectedSymbol,
  currentPrice,
  priceChange,
  priceChangePercent,
  currency,
  chartType, setChartType,
  activeTool, setActiveTool,
  isFullScreen, toggleFullScreen,
  toggleIndicators,
  clearDrawings,
  hasDrawings,
  currentTimeframe, setCurrentTimeframe
}) => {
  const { initialSymbols, setSelectedSymbol } = useTradingContext();
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 mb-2 border-b border-border ${isFullScreen ? 'pt-0' : ''}`}>
      <div className="mb-2 sm:mb-0">
        <div className="flex items-center">
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="text-lg font-bold h-9 pl-2 pr-1 w-auto">
              <SelectValue placeholder={t('markets.search')} />
            </SelectTrigger>
            <SelectContent>
              {initialSymbols.map(s => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} ({s.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <span>{currentSymbolInfo?.name || selectedSymbol}</span>
          <span className="mx-1.5">•</span>
          <span>{currentSymbolInfo?.type?.toUpperCase()}</span>
          <span className="mx-1.5">•</span>
          <span>{currency}</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:items-end items-start w-full sm:w-auto">
        <div className="flex items-baseline">
          <p className="text-xl sm:text-2xl font-bold mr-2">
            {formatCurrency(currentPrice, currency)}
          </p>
          <p className={`text-sm font-medium flex items-center ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
            {priceChange >= 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {formatCurrency(Math.abs(priceChange), currency, priceChange === 0 ? 2 : (Math.abs(currentPrice) < 1 ? 4 : 2))}
            <span className="ml-1.5">({formatPercentage(priceChangePercent)})</span>
          </p>
        </div>
        <div className="mt-1 flex items-center space-x-1">
          <ChartControls 
            chartType={chartType} 
            setChartType={setChartType}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            isFullScreen={isFullScreen}
            toggleFullScreen={toggleFullScreen}
            toggleIndicators={toggleIndicators}
            currentTimeframe={currentTimeframe}
            setCurrentTimeframe={setCurrentTimeframe}
          />
           {hasDrawings && (
             <Button variant="ghost" size="icon" onClick={clearDrawings} title={t('chart.clear_drawings', { defaultValue: 'Clear drawings' })}>
               <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
           )}
        </div>
      </div>
    </div>
  );
};

export default ChartHeader;