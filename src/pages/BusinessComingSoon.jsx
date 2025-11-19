import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ArrowLeft, Moon, Sun, Sparkles } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import { useTradingContext } from '@/contexts/TradingContext';

const BusinessComingSoon = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTradingContext();

  return (
    <div className="min-h-screen business-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-violet-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg business-icon-bg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">
              <span className="text-white">Business</span>
              <span className="text-violet-400">Lab</span>
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

      {/* Main Content */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto max-w-3xl"
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-2 border-violet-500/20">
            <CardHeader className="text-center pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-6 rounded-2xl business-card-bg flex items-center justify-center border-2 border-violet-500/30"
              >
                <Building2 className="h-12 w-12 text-violet-400" />
              </motion.div>
              <CardTitle className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('coming_soon.business.title', { defaultValue: 'Business Lab' })}
              </CardTitle>
              <CardDescription className="text-xl text-slate-300">
                {t('coming_soon.business.subtitle', { 
                  defaultValue: 'Gestión Empresarial Simulada' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-2 text-violet-400">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <p className="text-2xl font-semibold">
                  {t('coming_soon.message', { defaultValue: 'Próximamente' })}
                </p>
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                {t('coming_soon.business.description', { 
                  defaultValue: 'Estamos creando una plataforma completa de simulación empresarial. Pronto podrás gestionar empresas virtuales, tomar decisiones estratégicas y aprender sobre administración de negocios de forma práctica.' 
                })}
              </p>
              <div className="pt-6">
                <Button
                  onClick={() => navigate('/')}
                  size="lg"
                  className="business-btn font-semibold"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  {t('coming_soon.back_button', { defaultValue: 'Volver a GlobalLab' })}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 px-4 border-t border-violet-500/20 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto text-center">
          <p className="text-slate-400 text-sm">
            © 2025 GlobalLab - {t('globallab.footer.rights', { defaultValue: 'Plataforma Educativa de Simulación' })}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BusinessComingSoon;
