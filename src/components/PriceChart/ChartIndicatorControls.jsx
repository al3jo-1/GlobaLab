import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, BarChart2 } from 'lucide-react';

const ChartIndicatorControls = ({
  showPanel,
  showEMA, setShowEMA,
  emaPeriod, setEmaPeriod,
  showMACD, setShowMACD
}) => {
  const { t } = useTranslation();
  if (!showPanel) return null;

  return (
    <div className="p-2 border-t border-b border-border my-2 flex flex-wrap gap-4 items-end text-xs">
      <div className="flex items-center space-x-2">
        <Button variant={showEMA ? "secondary" : "outline"} size="sm" onClick={() => setShowEMA(!showEMA)}>
          <LineChart className="h-4 w-4 mr-1" /> EMA
        </Button>
        {showEMA && (
          <div className="flex items-center space-x-1">
            <Label htmlFor="emaPeriod" className="mb-0">{t('chart.period', { defaultValue: 'Period' })}:</Label>
            <Input 
              type="number" 
              id="emaPeriod" 
              value={emaPeriod} 
              onChange={(e) => setEmaPeriod(parseInt(e.target.value) || 1)} 
              className="h-8 w-16 text-xs"
              min="1"
            />
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button variant={showMACD ? "secondary" : "outline"} size="sm" onClick={() => setShowMACD(!showMACD)}>
          <BarChart2 className="h-4 w-4 mr-1" /> MACD
        </Button>
      </div>
    </div>
  );
};

export default ChartIndicatorControls;