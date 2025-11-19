import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calculator, Building2, Moon, Sun } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import { useTradingContext } from '@/contexts/TradingContext';

const GlobalLabHub = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTradingContext();

  const services = [
    {
      id: 'trading',
      icon: TrendingUp,
      iconColor: 'text-blue-500',
      bgGradient: 'from-blue-500/10 to-indigo-500/10',
      borderColor: 'border-blue-500/20 hover:border-blue-500/40',
      title: t('globallab.trading.title', { defaultValue: 'GlobalTradeLab' }),
      description: t('globallab.trading.description', { defaultValue: 'Simulación de trading educativo' }),
      route: '/trading',
    },
    {
      id: 'accounting',
      icon: Calculator,
      iconColor: 'text-emerald-500',
      bgGradient: 'accounting-subtle-bg',
      borderColor: 'border-emerald-500/20 hover:border-emerald-500/40',
      title: t('globallab.accounting.title', { defaultValue: 'GlobalAccounting Lab' }),
      description: t('globallab.accounting.description', { defaultValue: 'Análisis de estados financieros' }),
      route: '/accounting',
    },
    {
      id: 'business',
      icon: Building2,
      iconColor: 'text-violet-500',
      bgGradient: 'business-subtle-bg',
      borderColor: 'border-violet-500/20 hover:border-violet-500/40',
      title: t('globallab.business.title', { defaultValue: 'GlobalBusiness Lab' }),
      description: t('globallab.business.description', { defaultValue: 'Gestión empresarial simulada' }),
      route: '/business',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-blue-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <h1 className="text-2xl font-bold">
              <span className="text-white">Global</span>
              <span className="text-blue-400">Lab</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-slate-300 hover:text-white"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
            {t('globallab.hero.title', { defaultValue: 'Plataforma de Simulación Empresarial' })}
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            {t('globallab.hero.subtitle', { 
              defaultValue: 'Aprende trading, contabilidad y gestión empresarial en un entorno seguro y educativo' 
            })}
          </p>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-8"
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.id} variants={itemVariants}>
                  <Card 
                    className={`
                      h-full flex flex-col 
                      bg-slate-800/50 backdrop-blur-sm 
                      border-2 ${service.borderColor}
                      transition-all duration-300
                      hover:shadow-xl hover:shadow-blue-500/10
                      hover:-translate-y-2
                    `}
                  >
                    <CardHeader>
                      <div className={`
                        w-16 h-16 rounded-xl mb-4 
                        bg-gradient-to-br ${service.bgGradient}
                        flex items-center justify-center
                        border border-current/10
                      `}>
                        <Icon className={`h-8 w-8 ${service.iconColor}`} />
                      </div>
                      <CardTitle className="text-2xl text-white">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-slate-300 text-base">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Button
                        onClick={() => navigate(service.route)}
                        className={`
                          w-full 
                          bg-gradient-to-r ${service.bgGradient}
                          border border-current/20
                          text-white font-semibold
                          hover:scale-105 transition-transform
                        `}
                        size="lg"
                      >
                        {t('globallab.access_button', { defaultValue: 'Acceder' })}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-blue-500/20">
        <div className="container mx-auto text-center">
          <p className="text-slate-400">
            © 2025 GlobalLab - {t('globallab.footer.rights', { defaultValue: 'Plataforma Educativa de Simulación' })}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GlobalLabHub;
