import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage = ({ currentTheme, toggleTheme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8"
    >
      <Card className="glass-card max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Palette className="mr-3 h-7 w-7 text-primary" />
            Configuración de Apariencia
          </CardTitle>
          <CardDescription>
            Personaliza la apariencia de la plataforma GlobalTradeLab.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3 p-6 border border-border rounded-lg bg-background/50">
            <Label htmlFor="theme-toggle" className="text-lg font-medium">
              Tema de la Plataforma
            </Label>
            <p className="text-sm text-muted-foreground">
              Selecciona entre el tema claro o el tema oscuro para tu comodidad visual.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <Button
                id="theme-toggle"
                onClick={toggleTheme}
                variant="outline"
                className="w-full md:w-auto justify-center"
              >
                {currentTheme === 'light' ? (
                  <Moon className="mr-2 h-5 w-5" />
                ) : (
                  <Sun className="mr-2 h-5 w-5" />
                )}
                Cambiar a Tema {currentTheme === 'light' ? 'Oscuro' : 'Claro'}
              </Button>
              <span className="text-sm text-muted-foreground">
                Tema actual: <span className="font-semibold capitalize">{currentTheme}</span>
              </span>
            </div>
          </div>

          <div className="space-y-3 p-6 border border-border rounded-lg bg-background/50">
            <Label className="text-lg font-medium">
              Preferencias del Gráfico (Próximamente)
            </Label>
            <p className="text-sm text-muted-foreground">
              En futuras actualizaciones, podrás personalizar los colores y estilos de los gráficos aquí.
            </p>
             <Button variant="secondary" disabled>Ajustar Colores del Gráfico</Button>
          </div>
          
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SettingsPage;