import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatPercentage, formatRatio } from '@/lib/accounting-data';

const RatioCard = ({ title, value, benchmark, isPercentage = false, description, trend }) => {
  const isBetter = value > benchmark;
  const isNeutral = Math.abs(value - benchmark) < 0.01;

  const getTrendIcon = () => {
    if (isNeutral) return <Minus className="h-5 w-5 accounting-text-tertiary" />;
    return isBetter ? 
      <TrendingUp className="h-5 w-5 accounting-text-muted" /> : 
      <TrendingDown className="h-5 w-5 text-red-500" />;
  };

  const getColorClass = () => {
    if (isNeutral) return 'accounting-text-tertiary';
    return isBetter ? 'accounting-text-muted' : 'text-red-500';
  };

  const displayValue = isPercentage ? formatPercentage(value) : formatRatio(value);
  const displayBenchmark = isPercentage ? formatPercentage(benchmark) : formatRatio(benchmark);

  return (
    <Card className="accounting-card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg accounting-text">{title}</CardTitle>
          {getTrendIcon()}
        </div>
        {description && (
          <CardDescription className="text-xs accounting-text-tertiary">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className={`text-3xl font-bold ${getColorClass()}`}>
            {displayValue}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="accounting-text-tertiary">Benchmark:</span>
            <span className="text-muted-foreground">{displayBenchmark}</span>
          </div>
          {trend && (
            <div className="flex items-center text-xs accounting-text-tertiary">
              <span className="mr-1">Tendencia:</span>
              <span className={trend > 0 ? 'accounting-text-muted' : trend < 0 ? 'text-red-400 light:text-red-700' : 'accounting-text-tertiary'}>
                {trend > 0 ? '+' : ''}{formatPercentage(trend, 1)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RatioCard;
