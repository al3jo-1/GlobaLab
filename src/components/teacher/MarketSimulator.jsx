import React from 'react';
import { useTradingContext } from '@/contexts/TradingContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, ShieldAlert, CalendarDays, Activity, XCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';

const SIMULATION_EVENTS = [
  { id: 'crisis_2007', name: 'Crisis Financiera 2007-2008', icon: <ShieldAlert className="mr-2 h-5 w-5 text-red-500" />, durationText: "5 min" },
  { id: 'ww2', name: 'Impacto Guerra Mundial (Sim.)', icon: <ShieldAlert className="mr-2 h-5 w-5 text-red-700" />, durationText: "10 min" },
  { id: '9_11', name: 'Impacto Atentado Mayor (Sim.)', icon: <Zap className="mr-2 h-5 w-5 text-orange-500" />, durationText: "3 min" },
  { id: 'elections', name: 'Periodo Electoral (Sim.)', icon: <CalendarDays className="mr-2 h-5 w-5 text-blue-500" />, durationText: "2 min" },
];

const SIMULATION_EFFECTS_DURATIONS = {
  'crisis_2007': 300000, 
  'ww2': 600000,
  '9_11': 180000,
  'elections': 120000, 
};

const MarketSimulator = () => {
  const { activeSimulation, setActiveSimulation, stopSimulation, socketConnected } = useTradingContext();
  const { toast } = useToast();

  const handleStartSimulation = (eventId) => {
    if (activeSimulation) {
      toast({
        title: "Simulación en Curso",
        description: "Ya hay una simulación activa. Por favor, espera a que termine o cancélala.",
        variant: "destructive",
      });
      return;
    }
    const duration = SIMULATION_EFFECTS_DURATIONS[eventId];
    
    if (socketConnected && setActiveSimulation) {
      setActiveSimulation(eventId, duration);
    } else {
      setActiveSimulation({ type: eventId, startTime: Date.now(), endTime: Date.now() + duration });
      const eventDetails = SIMULATION_EVENTS.find(e => e.id === eventId);
      toast({
        title: "Simulación Iniciada",
        description: `Se ha iniciado la simulación: ${eventDetails?.name}. Duración: ${eventDetails?.durationText}.`,
      });
    }
  };

  const handleStopSimulation = () => {
    if (socketConnected && stopSimulation) {
      stopSimulation();
    } else {
      setActiveSimulation(null);
      toast({
        title: "Simulación Detenida",
        description: "La simulación de mercado ha sido detenida manualmente.",
        variant: "default",
      });
    }
  };
  
  React.useEffect(() => {
    let timer;
    if (activeSimulation && Date.now() >= activeSimulation.endTime) {
      toast({
        title: "Simulación Finalizada",
        description: `La simulación "${SIMULATION_EVENTS.find(e => e.id === activeSimulation.type)?.name}" ha terminado.`,
      });
      setActiveSimulation(null);
    } else if (activeSimulation) {
      timer = setTimeout(() => {
        if (Date.now() >= activeSimulation.endTime) {
           toast({
            title: "Simulación Finalizada",
            description: `La simulación "${SIMULATION_EVENTS.find(e => e.id === activeSimulation.type)?.name}" ha terminado.`,
          });
          setActiveSimulation(null);
        }
      }, activeSimulation.endTime - Date.now());
    }
    return () => clearTimeout(timer);
  }, [activeSimulation, setActiveSimulation, toast]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-6 w-6 text-primary" />
            Simulador de Eventos de Mercado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Inicia simulaciones de eventos históricos para observar su impacto (simplificado) en el mercado.
            Estas simulaciones afectarán temporalmente la volatilidad y tendencia de los precios.
          </p>
          
          {activeSimulation && (
            <div className="mb-6 p-4 border border-yellow-500 bg-yellow-500/10 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-yellow-600">Simulación Activa:</h3>
                  <p className="text-sm text-yellow-700">
                    {SIMULATION_EVENTS.find(e => e.id === activeSimulation.type)?.name}
                  </p>
                  <p className="text-xs text-yellow-600">
                    Tiempo restante: {Math.max(0, Math.round((activeSimulation.endTime - Date.now()) / 1000 / 60))} min
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleStopSimulation}>
                  <XCircle className="mr-2 h-4 w-4" /> Detener
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SIMULATION_EVENTS.map((event) => (
              <Button
                key={event.id}
                variant="outline"
                className="justify-start h-auto py-3 px-4 text-left items-center"
                onClick={() => handleStartSimulation(event.id)}
                disabled={!!activeSimulation && activeSimulation.type !== event.id}
              >
                {event.icon}
                <div>
                  <p className="font-medium">{event.name}</p>
                  <p className="text-xs text-muted-foreground">Duración aprox: {event.durationText}</p>
                </div>
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Nota: Las duraciones son aproximadas y la simulación es una representación simplificada.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MarketSimulator;