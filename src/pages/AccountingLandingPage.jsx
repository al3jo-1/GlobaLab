import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Calculator, Users, School, Globe, FileSpreadsheet, PieChart, Receipt } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

const AccountingLandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const plans = [
    {
      name: t('landing.plans.starter.name', { defaultValue: 'Plan Inicial' }),
      price: '$10',
      period: t('landing.plans.period', { defaultValue: '/mes' }),
      students: 10,
      rooms: 1,
      features: [
        t('landing.plans.starter.feature1', { defaultValue: 'Hasta 10 estudiantes' }),
        t('landing.plans.starter.feature2', { defaultValue: '1 sala de clase' }),
        t('accounting.landing.plans.starter.feature3', { defaultValue: 'Estados financieros básicos' }),
        t('landing.plans.starter.feature4', { defaultValue: 'Reportes básicos' }),
      ],
      highlight: false,
    },
    {
      name: t('landing.plans.professional.name', { defaultValue: 'Plan Profesional' }),
      price: '$19',
      period: t('landing.plans.period', { defaultValue: '/mes' }),
      students: 15,
      rooms: 2,
      features: [
        t('landing.plans.professional.feature1', { defaultValue: 'Hasta 15 estudiantes' }),
        t('landing.plans.professional.feature2', { defaultValue: '2 salas de clase' }),
        t('accounting.landing.plans.professional.feature3', { defaultValue: 'Análisis completo de estados financieros' }),
        t('landing.plans.professional.feature4', { defaultValue: 'Reportes avanzados' }),
        t('landing.plans.professional.feature5', { defaultValue: 'Soporte prioritario' }),
      ],
      highlight: true,
    },
    {
      name: t('landing.plans.enterprise.name', { defaultValue: 'Plan Empresarial' }),
      price: '$29',
      period: t('landing.plans.period', { defaultValue: '/mes' }),
      students: 30,
      rooms: 3,
      features: [
        t('landing.plans.enterprise.feature1', { defaultValue: 'Hasta 30 estudiantes' }),
        t('landing.plans.enterprise.feature2', { defaultValue: '3 salas de clase' }),
        t('accounting.landing.plans.enterprise.feature3', { defaultValue: 'Casos personalizados de análisis fiscal' }),
        t('landing.plans.enterprise.feature4', { defaultValue: 'Reportes personalizados' }),
        t('landing.plans.enterprise.feature5', { defaultValue: 'Soporte 24/7' }),
        t('accounting.landing.plans.enterprise.feature6', { defaultValue: 'Simulador fiscal avanzado' }),
      ],
      highlight: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen gradient-bg accounting-theme">
      <style dangerouslySetInnerHTML={{__html: `
        .accounting-theme {
          --primary: 142 76% 36%;
          --primary-foreground: 0 0% 100%;
        }
        .accounting-gradient {
          background: linear-gradient(to right, hsl(142 76% 36%), hsl(142 76% 46%));
        }
      `}} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-emerald-500" />
            <h1 className="text-2xl font-bold">
              <span className="text-emerald-500">GlobalAccounting</span>
              <span className="text-emerald-500/70"> Lab</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button 
              onClick={() => navigate('/accounting/login')} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {t('landing.access', { defaultValue: 'Acceder' })}
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
          <h2 className="text-5xl md:text-6xl font-bold mb-6 accounting-text-gradient leading-tight pb-2">
            {t('accounting.landing.hero.title', { defaultValue: 'Domina la Contabilidad y Análisis Financiero' })}
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {t('accounting.landing.hero.subtitle', { defaultValue: 'Plataforma educativa para aprender gestión fiscal, estados financieros y análisis contable' })}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <div className="flex items-center space-x-2 text-lg">
              <School className="h-6 w-6 text-emerald-500" />
              <span>{t('landing.hero.for_education', { defaultValue: 'Para Educación' })}</span>
            </div>
            <div className="flex items-center space-x-2 text-lg">
              <Globe className="h-6 w-6 text-emerald-500" />
              <span>{t('landing.hero.multilingual', { defaultValue: 'Multilingüe' })}</span>
            </div>
            <div className="flex items-center space-x-2 text-lg">
              <Users className="h-6 w-6 text-emerald-500" />
              <span>{t('landing.hero.collaborative', { defaultValue: 'Colaborativo' })}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background/50">
        <div className="container mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants}>
              <Card className="glass-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <FileSpreadsheet className="mr-3 h-8 w-8 text-emerald-500" />
                    {t('accounting.landing.features.statements.title', { defaultValue: 'Estados Financieros' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t('accounting.landing.features.statements.description', { 
                      defaultValue: 'Analiza balances, estados de resultados y flujos de efectivo en empresas simuladas.' 
                    })}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <PieChart className="mr-3 h-8 w-8 text-emerald-500" />
                    {t('accounting.landing.features.analysis.title', { defaultValue: 'Análisis Fiscal' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t('accounting.landing.features.analysis.description', { 
                      defaultValue: 'Calcula impuestos, detecta errores y aprende gestión fiscal práctica.' 
                    })}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Receipt className="mr-3 h-8 w-8 text-emerald-500" />
                    {t('accounting.landing.features.payroll.title', { defaultValue: 'Gestión de Nómina' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t('accounting.landing.features.payroll.description', { 
                      defaultValue: 'Practica cálculos de nómina, deducciones y gestión de recursos humanos.' 
                    })}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold mb-4">
              {t('landing.pricing.title', { defaultValue: 'Planes para Profesores' })}
            </h3>
            <p className="text-xl text-muted-foreground">
              {t('landing.pricing.subtitle', { defaultValue: 'Elige el plan que mejor se adapte a tus necesidades' })}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {plans.map((plan, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className={`glass-card h-full flex flex-col ${plan.highlight ? 'border-emerald-500 border-2 shadow-lg shadow-emerald-500/20' : ''}`}>
                  {plan.highlight && (
                    <div className="bg-emerald-600 text-white text-center py-2 text-sm font-semibold rounded-t-lg">
                      {t('landing.pricing.recommended', { defaultValue: 'Recomendado' })}
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2">
                      {plan.students} {t('landing.pricing.students', { defaultValue: 'estudiantes' })} • {plan.rooms} {plan.rooms === 1 ? t('landing.pricing.room', { defaultValue: 'sala' }) : t('landing.pricing.rooms', { defaultValue: 'salas' })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button 
                      className={`w-full ${plan.highlight ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'}`}
                      variant={plan.highlight ? 'default' : 'outline'}
                      onClick={() => navigate('/accounting/register')}
                    >
                      {t('landing.pricing.get_started', { defaultValue: 'Comenzar' })}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 accounting-section-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            {t('landing.cta.title', { defaultValue: '¿Listo para comenzar?' })}
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('accounting.landing.cta.subtitle', { defaultValue: 'Únete a GlobalAccounting Lab y domina la contabilidad hoy mismo' })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/accounting/register')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {t('landing.cta.register', { defaultValue: 'Registrarse Gratis' })}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/accounting/login')}
              className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
            >
              {t('landing.cta.login', { defaultValue: 'Iniciar Sesión' })}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-background/50">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 GlobalAccounting Lab. {t('landing.footer.rights', { defaultValue: 'Todos los derechos reservados.' })}</p>
          <p className="mt-2 text-sm">
            {t('accounting.landing.footer.disclaimer', { defaultValue: 'Plataforma educativa - Todos los datos son simulados para fines educativos.' })}
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <a 
              href="/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-500 transition-colors underline"
            >
              {t('legal.privacy', { defaultValue: 'Política de Privacidad' })}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AccountingLandingPage;
