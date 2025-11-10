import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Sun, Moon, Palette, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import LanguageSelector from '@/components/LanguageSelector';
import { useTradingContext } from '@/contexts/TradingContext';
import { useToast } from '@/components/ui/use-toast';

const SettingsPage = ({ currentTheme, toggleTheme }) => {
  const { t } = useTranslation();
  const { chartPreferences, updateChartPreferences, resetChartPreferences } = useTradingContext();
  const { toast } = useToast();
  const [tempPreferences, setTempPreferences] = useState(chartPreferences);

  const handleColorChange = (key, value) => {
    setTempPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSavePreferences = () => {
    updateChartPreferences(tempPreferences);
    toast({
      title: "Preferencias guardadas",
      description: "Los colores del gráfico se han actualizado correctamente.",
    });
  };

  const handleResetPreferences = () => {
    const defaults = {
      upColor: '#22c55e',
      downColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
    };
    resetChartPreferences();
    setTempPreferences(defaults);
    toast({
      title: "Preferencias restablecidas",
      description: "Los colores del gráfico se han restablecido a los valores por defecto.",
    });
  };

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
            {t('settings.title')}
          </CardTitle>
          <CardDescription>
            Personaliza la apariencia de la plataforma GlobalTradeLab.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3 p-6 border border-border rounded-lg bg-background/50">
            <Label className="text-lg font-medium">
              {t('settings.language')}
            </Label>
            <p className="text-sm text-muted-foreground">
              Selecciona el idioma preferido para la interfaz.
            </p>
            <div className="pt-2">
              <LanguageSelector />
            </div>
          </div>

          <div className="space-y-3 p-6 border border-border rounded-lg bg-background/50">
            <Label htmlFor="theme-toggle" className="text-lg font-medium">
              {t('settings.theme')}
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

          <div className="space-y-4 p-6 border border-border rounded-lg bg-background/50">
            <Label className="text-lg font-medium">
              Preferencias del Gráfico
            </Label>
            <p className="text-sm text-muted-foreground">
              Personaliza los colores de las velas en los gráficos de precios.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="upColor">Color Vela Alcista</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="upColor"
                    type="color"
                    value={tempPreferences.upColor}
                    onChange={(e) => handleColorChange('upColor', e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <span className="text-sm font-mono text-muted-foreground">{tempPreferences.upColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="downColor">Color Vela Bajista</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="downColor"
                    type="color"
                    value={tempPreferences.downColor}
                    onChange={(e) => handleColorChange('downColor', e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <span className="text-sm font-mono text-muted-foreground">{tempPreferences.downColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wickUpColor">Color Mecha Alcista</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="wickUpColor"
                    type="color"
                    value={tempPreferences.wickUpColor}
                    onChange={(e) => handleColorChange('wickUpColor', e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <span className="text-sm font-mono text-muted-foreground">{tempPreferences.wickUpColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wickDownColor">Color Mecha Bajista</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="wickDownColor"
                    type="color"
                    value={tempPreferences.wickDownColor}
                    onChange={(e) => handleColorChange('wickDownColor', e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <span className="text-sm font-mono text-muted-foreground">{tempPreferences.wickDownColor}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSavePreferences} className="flex-1">
                <Palette className="mr-2 h-4 w-4" />
                Guardar Preferencias
              </Button>
              <Button onClick={handleResetPreferences} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Restablecer
              </Button>
            </div>
          </div>
          
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SettingsPage;