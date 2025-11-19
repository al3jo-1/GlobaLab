import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatPercentage, formatRatio } from '@/lib/accounting-data';

const RatioCard = ({ title, value, benchmark, isPercentage = false, description, trend }) => {
  const isBetter = value > benchmark;
  const isNeutral = Math.abs(value - benchmark) < 0.01;

  const getTrendIcon = () => {
    if (isNeutral) return <Minus className="h-5 w-5 text-slate-400" />;
    return isBetter ? 
      <TrendingUp className="h-5 w-5 accounting-text-muted" /> : 
      <TrendingDown className="h-5 w-5 text-red-400 light:text-red-700" />;
  };

  const getColorClass = () => {
    if (isNeutral) return 'text-slate-400';
    return isBetter ? 'accounting-text-muted' : 'text-red-400 light:text-red-700';
  };

  const displayValue = isPercentage ? formatPercentage(value) : formatRatio(value);
  const displayBenchmark = isPercentage ? formatPercentage(benchmark) : formatRatio(benchmark);

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-emerald-500/20 hover:border-emerald-500/40 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg accounting-text">{title}</CardTitle>
          {getTrendIcon()}
        </div>
        {description && (
          <CardDescription className="text-xs text-slate-400">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className={`text-3xl font-bold ${getColorClass()}`}>
            {displayValue}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Benchmark:</span>
            <span className="text-muted-foreground">{displayBenchmark}</span>
          </div>
          {trend && (
            <div className="flex items-center text-xs text-slate-400">
              <span className="mr-1">Tendencia:</span>
              <span className={trend > 0 ? 'accounting-text-muted' : trend < 0 ? 'text-red-400 light:text-red-700' : 'text-slate-400'}>
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
