import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi, Info } from 'lucide-react';
import { useTradingContext } from '@/contexts/TradingContext';

const ConnectionStatus = () => {
  const { socketConnected } = useTradingContext();

  if (socketConnected) {
    return null;
  }

  return (
    <Alert className="mb-4 border-yellow-600 bg-yellow-500/10">
      <WifiOff className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-600 font-medium">
        <div className="flex flex-col gap-2">
          <p>Sin conexión al servidor en tiempo real</p>
          <p className="text-sm font-normal">
            Funciones limitadas: Las alarmas de precio, modo experimental y sincronización en tiempo real no están disponibles. Los datos se guardan localmente.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionStatus;
