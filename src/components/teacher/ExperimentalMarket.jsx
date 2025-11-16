import React, { useState } from 'react';
import { useTradingContext } from '@/contexts/TradingContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { FlaskConical, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const ExperimentalMarket = () => {
  const { 
    experimentalMode, 
    toggleExperimentalMode, 
    overridePrice, 
    initialSymbols,
    getCurrentPrice,
    socketConnected 
  } = useTradingContext();
  
  const { toast } = useToast();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSD');
  const [newPrice, setNewPrice] = useState('');
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  const handleToggleExperimental = (enabled) => {
    if (enabled && !hasAcknowledged) {
      setShowDisclaimer(true);
    } else if (!enabled) {
      toggleExperimentalMode(false);
      setHasAcknowledged(false);
    }
  };

  const handleAcknowledge = () => {
    setHasAcknowledged(true);
    setShowDisclaimer(false);
    toggleExperimentalMode(true);
  };

  const handleOverridePrice = () => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Precio Inválido",
        description: "Por favor ingresa un precio válido mayor a cero",
        variant: "destructive",
      });
      return;
    }

    overridePrice(selectedSymbol, price);
    toast({
      title: "Precio Modificado",
      description: `${selectedSymbol}: ${price.toFixed(2)}`,
    });
    setNewPrice('');
  };

  const currentPrice = getCurrentPrice(selectedSymbol);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className={`glass-card ${experimentalMode ? 'border-yellow-500 border-2' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <FlaskConical className="mr-2 h-6 w-6 text-yellow-500" />
                Aula Experimental
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="experimental-mode" className="text-sm">
                  {experimentalMode ? 'Activado' : 'Desactivado'}
                </Label>
                <Switch
                  id="experimental-mode"
                  checked={experimentalMode}
                  onCheckedChange={handleToggleExperimental}
                  disabled={!socketConnected}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!socketConnected ? (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                <p className="text-sm text-yellow-600">
                  ⚠️ No conectado al servidor. El modo experimental requiere conexión en tiempo real.
                </p>
              </div>
            ) : experimentalMode ? (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-700">Modo Experimental Activo</p>
                      <p className="text-xs text-yellow-600 mt-1">
                        Los precios modificados manualmente afectarán a todos los estudiantes en la sala.
                        Usa esta función con propósitos educativos únicamente.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="symbol-select">Activo</Label>
                    <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                      <SelectTrigger id="symbol-select">
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

                  <div>
                    <Label htmlFor="current-price">Precio Actual</Label>
                    <Input
                      id="current-price"
                      value={currentPrice.toFixed(4)}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-price">Nuevo Precio</Label>
                    <Input
                      id="new-price"
                      type="number"
                      step="0.01"
                      placeholder="Ingresa el nuevo precio"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleOverridePrice()}
                    />
                  </div>

                  <Button 
                    onClick={handleOverridePrice}
                    className="w-full"
                    variant="default"
                  >
                    Modificar Precio
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  Activa el modo experimental para modificar precios manualmente
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Esta función permite simular escenarios específicos de mercado para fines educativos
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <AlertDialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-yellow-500" />
              Advertencia: Modo Experimental
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Estás a punto de activar el <strong>Modo Experimental</strong>. Este modo te permite
                modificar manualmente los precios de los activos en tiempo real.
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500 rounded p-3 space-y-2">
                <p className="text-sm font-semibold text-yellow-700">Consideraciones importantes:</p>
                <ul className="text-xs text-yellow-600 space-y-1 ml-4 list-disc">
                  <li>Los cambios afectarán a todos los estudiantes en la sala inmediatamente</li>
                  <li>Los precios modificados permanecerán hasta que desactives el modo experimental</li>
                  <li>Esta función es exclusivamente para propósitos educativos y de simulación</li>
                  <li>Los estudiantes serán notificados cuando el modo experimental esté activo</li>
                </ul>
              </div>
              <p className="text-sm">
                ¿Comprendes y aceptas usar esta función de manera responsable?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDisclaimer(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAcknowledge} className="bg-yellow-600 hover:bg-yellow-700">
              Entiendo y Acepto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExperimentalMarket;
