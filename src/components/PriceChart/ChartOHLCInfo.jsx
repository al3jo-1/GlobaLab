import React from 'react';
import { formatCurrency } from '@/lib/market-data';

const ChartOHLCInfo = ({ ohlc, currency }) => {
  if (!ohlc || Object.keys(ohlc).length === 0) return null;
  
  const formatValue = (value) => formatCurrency(value, currency, value < 1 && value !== 0 ? 4 : 2);

  return (
    <div className="text-xs text-muted-foreground text-right mb-2">
      <p>A: {formatValue(ohlc.open)}</p>
      <p>M: {formatValue(ohlc.high)}</p>
      <p>m: {formatValue(ohlc.low)}</p>
      <p>C: {formatValue(ohlc.close)}</p>
    </div>
  );
};

export default ChartOHLCInfo;