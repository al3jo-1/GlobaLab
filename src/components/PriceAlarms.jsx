import React, { useState } from 'react';
import { useTradingContext } from '@/contexts/TradingContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Trash2, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/lib/market-data';

const PriceAlarms = () => {
  const {
    priceAlarms,
    createPriceAlarm,
    deletePriceAlarm,
    initialSymbols,
    getCurrentPrice,
    selectedSymbol,
    socketConnected
  } = useTradingContext();

  const [newAlarmSymbol, setNewAlarmSymbol] = useState(selectedSymbol || 'BTCUSD');
  const [newAlarmPrice, setNewAlarmPrice] = useState('');
  const [newAlarmCondition, setNewAlarmCondition] = useState('above');

  const handleCreateAlarm = () => {
    const price = parseFloat(newAlarmPrice);
    if (isNaN(price) || price <= 0) {
      return;
    }

    createPriceAlarm({
      symbol: newAlarmSymbol,
      price,
      condition: newAlarmCondition,
    });

    setNewAlarmPrice('');
  };

  const handleDeleteAlarm = (alarmId) => {
    deletePriceAlarm(alarmId);
  };

  const currentPrice = getCurrentPrice(newAlarmSymbol);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5 text-primary" />
          Alarmas de Precio
          {priceAlarms.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
              {priceAlarms.filter(a => !a.triggered).length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!socketConnected && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500 rounded-lg">
              <p className="text-sm text-yellow-600">
                ⚠️ Las alarmas requieren conexión al servidor
              </p>
            </div>
          )}

          <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
            <h3 className="font-semibold text-sm flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Alarma
            </h3>
            
            <div>
              <Label htmlFor="alarm-symbol">Activo</Label>
              <Select value={newAlarmSymbol} onValueChange={setNewAlarmSymbol}>
                <SelectTrigger id="alarm-symbol">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {initialSymbols.map(symbol => (
                    <SelectItem key={symbol.id} value={symbol.id}>
                      {symbol.name} ({symbol.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="alarm-condition">Condición</Label>
                <Select value={newAlarmCondition} onValueChange={setNewAlarmCondition}>
                  <SelectTrigger id="alarm-condition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">
                      <div className="flex items-center">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Por encima de
                      </div>
                    </SelectItem>
                    <SelectItem value="below">
                      <div className="flex items-center">
                        <TrendingDown className="mr-2 h-4 w-4" />
                        Por debajo de
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="alarm-price">Precio</Label>
                <Input
                  id="alarm-price"
                  type="number"
                  step="0.01"
                  placeholder={currentPrice.toFixed(2)}
                  value={newAlarmPrice}
                  onChange={(e) => setNewAlarmPrice(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateAlarm()}
                />
              </div>
            </div>

            <Button
              onClick={handleCreateAlarm}
              className="w-full"
              disabled={!socketConnected || !newAlarmPrice}
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Alarma
            </Button>

            <p className="text-xs text-muted-foreground">
              Precio actual: {currentPrice.toFixed(4)}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Alarmas Activas</h3>
            <ScrollArea className="h-[300px]">
              {priceAlarms.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    No hay alarmas configuradas
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-2 pr-4">
                    {priceAlarms.map((alarm, index) => (
                      <motion.div
                        key={alarm.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`p-3 rounded-lg border ${
                          alarm.triggered
                            ? 'bg-green-500/10 border-green-500'
                            : 'bg-card border-muted'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              {alarm.condition === 'above' ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                              <span className="font-semibold text-sm">{alarm.symbol}</span>
                              {alarm.triggered && (
                                <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded">
                                  Activada
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {alarm.condition === 'above' ? 'Por encima de' : 'Por debajo de'}{' '}
                              <span className="font-semibold">{alarm.price.toFixed(4)}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(alarm.createdAt)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAlarm(alarm.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceAlarms;
