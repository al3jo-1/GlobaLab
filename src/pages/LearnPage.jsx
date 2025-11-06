import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Lightbulb, BookOpen, Brain, BarChart3, ShieldCheck, Zap, Users, TrendingUp } from 'lucide-react';

const LearnPage = () => {
  const { t } = useTranslation();
  const learningSections = [
    {
      id: 'basics',
      title: t('learn.basics.title', { defaultValue: 'Conceptos Básicos del Trading' }),
      icon: <BookOpen className="h-5 w-5 mr-2" />,
      content: [
        { 
          title: t('learn.basics.what_is_trading.title', { defaultValue: '¿Qué es el Trading?' }), 
          text: t('learn.basics.what_is_trading.text', { defaultValue: 'El trading es la actividad de comprar y vender instrumentos financieros (acciones, divisas, criptomonedas, etc.) con el objetivo de obtener ganancias a partir de las fluctuaciones de sus precios. Se diferencia de la inversión a largo plazo por su enfoque en beneficios a corto o medio plazo.' }),
          image: "conceptual illustration of trading charts and graphs"
        },
        { 
          title: t('learn.basics.common_orders.title', { defaultValue: 'Tipos de Órdenes Comunes' }), 
          text: t('learn.basics.common_orders.text', { defaultValue: 'Orden de Mercado: Compra/venta al mejor precio disponible. Orden Límite: Compra/venta a un precio específico o mejor. Orden Stop-Loss: Vende automáticamente si el precio cae a un nivel para limitar pérdidas. Orden Take-Profit: Vende automáticamente si el precio alcanza un objetivo de ganancia.' }),
          image: "diagram explaining different types of stock market orders"
        },
        { 
          title: t('learn.basics.financial_assets.title', { defaultValue: '¿Qué son los Activos Financieros?' }), 
          text: t('learn.basics.financial_assets.text', { defaultValue: 'Son instrumentos que representan un valor monetario. Incluyen acciones (participación en una empresa), bonos (deuda), divisas (monedas de países), materias primas (oro, petróleo) y criptomonedas (activos digitales).' }),
          image: "collage of various financial assets like stocks bonds and crypto"
        },
        { 
          title: t('learn.basics.candles.title', { defaultValue: 'Lectura de Gráficos de Velas' }), 
          text: t('learn.basics.candles.text', { defaultValue: 'Las velas japonesas muestran el precio de apertura, cierre, máximo y mínimo de un activo en un período. El cuerpo de la vela indica la diferencia entre apertura y cierre (verde/alcista si cierra más alto, rojo/bajista si cierra más bajo). Las "mechas" muestran los precios extremos.' }),
          image: "detailed japanese candlestick chart with labels"
        },
      ]
    },
    {
      id: 'strategies',
      title: t('learn.strategies.title', { defaultValue: 'Estrategias de Trading Populares' }),
      icon: <Zap className="h-5 w-5 mr-2" />,
      content: [
        { 
          title: t('learn.strategies.scalping.title', { defaultValue: 'Scalping' }), 
          text: t('learn.strategies.scalping.text', { defaultValue: 'Objetivo: Ganancias muy pequeñas en múltiples operaciones de muy corta duración (segundos a minutos). Requiere: Alta concentración, ejecución rápida, spreads bajos. Ideal para: Mercados líquidos y traders que pueden tomar decisiones rápidas bajo presión.' }),
          image: "fast-paced scalping trading setup with multiple monitors"
        },
        { 
          title: t('learn.strategies.day.title', { defaultValue: 'Day Trading' }), 
          text: t('learn.strategies.day.text', { defaultValue: 'Objetivo: Beneficios de movimientos de precios intradía, cerrando todas las posiciones antes del cierre del mercado. Requiere: Análisis técnico, seguimiento constante del mercado. Ideal para: Traders dedicados que pueden monitorear el mercado durante el día.' }),
          image: "day trader analyzing charts on a computer screen"
        },
        { 
          title: t('learn.strategies.swing.title', { defaultValue: 'Swing Trading' }), 
          text: t('learn.strategies.swing.text', { defaultValue: 'Objetivo: Capturar "swings" o movimientos de precios que duran de unos días a varias semanas. Requiere: Análisis técnico y fundamental, paciencia. Ideal para: Personas con menos tiempo para monitoreo constante pero que pueden analizar mercados regularmente.' }),
          image: "swing trading chart showing price swings over days"
        },
        { 
          title: t('learn.strategies.position.title', { defaultValue: 'Position Trading' }), 
          text: t('learn.strategies.position.text', { defaultValue: 'Objetivo: Beneficios de tendencias a largo plazo (meses o años). Requiere: Análisis fundamental profundo, paciencia extrema, capacidad para soportar fluctuaciones. Ideal para: Inversores con un horizonte temporal largo.' }),
          image: "long-term position trading chart with a clear uptrend"
        },
      ]
    },
    {
      id: 'risk_management',
      title: t('learn.risk.title', { defaultValue: 'Gestión de Riesgos Esencial' }),
      icon: <ShieldCheck className="h-5 w-5 mr-2" />,
      content: [
        { 
          title: t('learn.risk.rule.title', { defaultValue: 'La Regla del 1-2%' }), 
          text: t('learn.risk.rule.text', { defaultValue: 'Nunca arriesgues más del 1% o 2% de tu capital total de trading en una sola operación. Esto te protege de pérdidas catastróficas y te permite seguir operando incluso después de una racha perdedora.' }),
          image: "visual representation of the 1-2 percent risk rule in trading"
        },
        { 
          title: t('learn.risk.stoploss.title', { defaultValue: 'Uso de Stop-Loss' }), 
          text: t('learn.risk.stoploss.text', { defaultValue: 'Siempre define un nivel de stop-loss antes de entrar en una operación. Es el precio al que saldrás automáticamente si el mercado se mueve en tu contra, limitando tu pérdida potencial.' }),
          image: "chart showing a stop-loss order placement"
        },
        { 
          title: t('learn.risk.rr.title', { defaultValue: 'Ratio Riesgo/Beneficio' }), 
          text: t('learn.risk.rr.text', { defaultValue: 'Busca operaciones donde la ganancia potencial sea al menos 2 o 3 veces mayor que la pérdida potencial (ej. arriesgar $50 para ganar $100 o $150). Esto significa que no necesitas acertar todas tus operaciones para ser rentable.' }),
          image: "diagram illustrating risk-reward ratio in trading"
        },
        { 
          title: t('learn.risk.diversification.title', { defaultValue: 'Diversificación (con Cautela)' }), 
          text: t('learn.risk.diversification.text', { defaultValue: 'No pongas todos tus huevos en la misma canasta. Sin embargo, en trading activo, una sobre-diversificación puede diluir el enfoque. Concéntrate en activos que entiendas bien.' }),
          image: "concept of diversification with a portfolio of different assets"
        },
      ]
    },
    {
      id: 'psychology',
      title: t('learn.psychology.title', { defaultValue: 'Psicología del Trading' }),
      icon: <Brain className="h-5 w-5 mr-2" />,
      content: [
        { 
          title: t('learn.psychology.fear_greed.title', { defaultValue: 'Manejo del Miedo y la Avaricia' }), 
          text: t('learn.psychology.fear_greed.text', { defaultValue: 'El miedo puede hacerte cerrar operaciones ganadoras prematuramente o evitar buenas oportunidades. La avaricia puede llevarte a tomar riesgos excesivos o a no tomar ganancias. Reconoce estas emociones y opera según tu plan, no tus impulsos.' }),
          image: "abstract representation of fear and greed in financial markets"
        },
        { 
          title: t('learn.psychology.discipline.title', { defaultValue: 'La Importancia de la Disciplina' }), 
          text: t('learn.psychology.discipline.text', { defaultValue: 'Sigue tu plan de trading consistentemente, incluso cuando sea difícil. La disciplina es lo que separa a los traders exitosos de los que no lo son. Evita las operaciones impulsivas.' }),
          image: "trader calmly following a trading plan"
        },
        { 
          title: t('learn.psychology.accept_losses.title', { defaultValue: 'Aceptar las Pérdidas' }), 
          text: t('learn.psychology.accept_losses.text', { defaultValue: 'Las pérdidas son parte inevitable del trading. No te las tomes como algo personal. Aprende de ellas y sigue adelante. Intentar "recuperar" pérdidas rápidamente suele llevar a más pérdidas (revenge trading).' }),
          image: "concept of accepting losses as part of trading"
        },
        { 
          title: t('learn.psychology.patience.title', { defaultValue: 'Paciencia y Perspectiva' }), 
          text: t('learn.psychology.patience.text', { defaultValue: 'No todas las condiciones de mercado son operables. A veces, la mejor operación es no operar. Espera configuraciones de alta probabilidad. El trading es un maratón, no un sprint.' }),
          image: "serene image representing patience in trading like a bonsai tree"
        },
      ]
    },
    {
      id: 'technical_analysis',
      title: t('learn.ta.title', { defaultValue: 'Análisis Técnico Básico' }),
      icon: <BarChart3 className="h-5 w-5 mr-2" />,
      content: [
        { 
          title: t('learn.ta.sr.title', { defaultValue: 'Soportes y Resistencias' }), 
          text: t('learn.ta.sr.text', { defaultValue: 'Soporte: Nivel de precio donde el interés de compra es suficientemente fuerte para superar la presión de venta, deteniendo una caída. Resistencia: Nivel donde la presión de venta supera a la de compra, deteniendo un alza. Identificarlos ayuda a definir entradas y salidas.' }),
          image: "chart with clear support and resistance levels marked"
        },
        { 
          title: t('learn.ta.trendlines.title', { defaultValue: 'Líneas de Tendencia' }), 
          text: t('learn.ta.trendlines.text', { defaultValue: 'Se dibujan conectando mínimos ascendentes en una tendencia alcista, o máximos descendentes en una bajista. Ayudan a visualizar la dirección del mercado y pueden actuar como soportes/resistencias dinámicas.' }),
          image: "trading chart showing uptrend and downtrend lines"
        },
        { 
          title: t('learn.ta.ma.title', { defaultValue: 'Medias Móviles (MA)' }), 
          text: t('learn.ta.ma.text', { defaultValue: 'Suavizan los datos de precios para mostrar la dirección de la tendencia. Una MA simple (SMA) promedia los precios de cierre de un período. Una MA exponencial (EMA) da más peso a los precios recientes. Cruces de MAs pueden generar señales.' }),
          image: "chart with simple and exponential moving averages"
        },
        { 
          title: t('learn.ta.volume.title', { defaultValue: 'Volumen' }), 
          text: t('learn.ta.volume.text', { defaultValue: 'El número de acciones/contratos negociados en un período. Un aumento de volumen en la dirección de la tendencia la confirma. Un volumen bajo en un movimiento puede indicar debilidad.' }),
          image: "price chart with a volume indicator at the bottom"
        },
      ]
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6"
    >
      <Card className="glass-card w-full mx-auto shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center mb-2">
            <Lightbulb className="h-8 w-8 mr-3 text-yellow-400" />
            <CardTitle className="text-3xl font-bold">{t('learn.center', { defaultValue: 'Centro de Aprendizaje' })}</CardTitle>
          </div>
          <CardDescription className="text-md text-muted-foreground">
            {t('learn.subtitle', { defaultValue: 'Expande tus conocimientos de trading y mejora tus habilidades.' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6">
              {learningSections.map(section => (
                <TabsTrigger key={section.id} value={section.id} className="text-xs sm:text-sm">
                  {section.icon} {section.title.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {learningSections.map(section => (
              <TabsContent key={section.id} value={section.id}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center">
                    {section.icon} {section.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.content.map(item => (
                      <Card key={item.title} className="hover:shadow-lg transition-shadow duration-300 bg-card/50">
                        <CardHeader>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <img  
                            alt={item.title} 
                            className="w-full h-40 object-cover rounded-md mb-4 shadow-sm"
                           src="https://images.unsplash.com/photo-1618044733300-9472054094ee" />
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LearnPage;