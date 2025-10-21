import React from 'react';
import { useTradingContext } from '@/contexts/TradingContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatPercentage } from '@/lib/market-data';
import { TrendingUp, TrendingDown, Landmark, Bitcoin, Briefcase, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const SymbolIcon = ({ type }) => {
  if (type === 'stock') return <Landmark className="h-5 w-5 mr-2 text-blue-400" />;
  if (type === 'crypto') return <Bitcoin className="h-5 w-5 mr-2 text-yellow-400" />;
  if (type === 'index') return <Briefcase className="h-5 w-5 mr-2 text-green-400" />;
  return null;
};

const TeacherMarkets = () => {
  const { symbols } = useTradingContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-6 w-6 text-primary" />
            Vista General de Mercados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Aquí puedes ver el estado actual de todos los activos disponibles en la plataforma.
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activo</TableHead>
                  <TableHead className="text-right">Precio Actual</TableHead>
                  <TableHead className="text-right">Variación (24h)</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Moneda</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {symbols.map((symbol) => (
                  <TableRow key={symbol.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <SymbolIcon type={symbol.type} />
                        <div>
                          <p className="font-medium">{symbol.name}</p>
                          <p className="text-xs text-muted-foreground">{symbol.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(symbol.price, symbol.currency)}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${symbol.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <div className="flex items-center justify-end">
                        {symbol.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        {formatPercentage(symbol.change)}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{symbol.type}</TableCell>
                    <TableCell>{symbol.currency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TeacherMarkets;