import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, TrendingUp, Users, School, Globe } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

const LandingPage = () => {
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
        t('landing.plans.starter.feature3', { defaultValue: 'Acceso a todos los mercados' }),
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
        t('landing.plans.professional.feature3', { defaultValue: 'Acceso a todos los mercados' }),
        t('landing.plans.professional.feature4', { defaultValue: 'Reportes avanzados' }),
        t('landing.plans.professional.feature5', { defaultValue: 'Soporte prioritario' }),
      ],
      highlight: true,
    },
    {
      name: t('landing.plans.enterprise.name', { defaultValue: 'Plan Empresarial' }),
      price: '$29',
      period: t('landing.plans.period', { defaultValue: '/mes' }),
      students: 20,
      rooms: 3,
      features: [
        t('landing.plans.enterprise.feature1', { defaultValue: 'Hasta 20 estudiantes' }),
        t('landing.plans.enterprise.feature2', { defaultValue: '3 salas de clase' }),
        t('landing.plans.enterprise.feature3', { defaultValue: 'Acceso a todos los mercados' }),
        t('landing.plans.enterprise.feature4', { defaultValue: 'Reportes personalizados' }),
        t('landing.plans.enterprise.feature5', { defaultValue: 'Soporte 24/7' }),
        t('landing.plans.enterprise.feature6', { defaultValue: 'Simulador avanzado' }),
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
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">
              <span className="text-primary">GlobalTrade</span>
              <span className="text-primary/70">Lab</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button onClick={() => navigate('/trading/login')} variant="default">
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
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight pb-2">
            {t('landing.hero.title', { defaultValue: 'Aprende Trading de Forma Segura' })}
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {t('landing.hero.subtitle', { defaultValue: 'Plataforma educativa de simulación de trading para estudiantes y profesores' })}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <div className="flex items-center space-x-2 text-lg">
              <School className="h-6 w-6 text-primary" />
              <span>{t('landing.hero.for_education', { defaultValue: 'Para Educación' })}</span>
            </div>
            <div className="flex items-center space-x-2 text-lg">
              <Globe className="h-6 w-6 text-primary" />
              <span>{t('landing.hero.multilingual', { defaultValue: 'Multilingüe' })}</span>
            </div>
            <div className="flex items-center space-x-2 text-lg">
              <Users className="h-6 w-6 text-primary" />
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
                    <School className="mr-3 h-8 w-8 text-primary" />
                    {t('landing.features.education.title', { defaultValue: 'Educación Práctica' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t('landing.features.education.description', { 
                      defaultValue: 'Aprende trading sin riesgos con dinero virtual. Ideal para estudiantes que quieren entender los mercados financieros.' 
                    })}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Users className="mr-3 h-8 w-8 text-primary" />
                    {t('landing.features.management.title', { defaultValue: 'Gestión de Salas' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t('landing.features.management.description', { 
                      defaultValue: 'Los profesores pueden crear múltiples salas y gestionar el progreso de sus estudiantes en tiempo real.' 
                    })}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass-card h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <TrendingUp className="mr-3 h-8 w-8 text-primary" />
                    {t('landing.features.markets.title', { defaultValue: 'Mercados Reales' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t('landing.features.markets.description', { 
                      defaultValue: 'Accede a simulaciones de acciones, forex y criptomonedas con datos de mercado actualizados.' 
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
                <Card className={`glass-card h-full flex flex-col ${plan.highlight ? 'border-primary border-2 shadow-lg shadow-primary/20' : ''}`}>
                  {plan.highlight && (
                    <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-semibold rounded-t-lg">
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
                          <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button 
                      className="w-full" 
                      variant={plan.highlight ? 'default' : 'outline'}
                      onClick={() => navigate('/trading/register')}
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
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
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
            {t('landing.cta.subtitle', { defaultValue: 'Únete a GlobalTradeLab y comienza a aprender trading hoy mismo' })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/trading/register')}>
              {t('landing.cta.register', { defaultValue: 'Registrarse Gratis' })}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/trading/login')}>
              {t('landing.cta.login', { defaultValue: 'Iniciar Sesión' })}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-background/50">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 GlobalTradeLab. {t('landing.footer.rights', { defaultValue: 'Todos los derechos reservados.' })}</p>
          <p className="mt-2 text-sm">
            {t('landing.footer.disclaimer', { defaultValue: 'Plataforma educativa - Todo el trading se realiza con dinero virtual.' })}
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <a 
              href="/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline"
            >
              {t('legal.privacy', { defaultValue: 'Política de Privacidad' })}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
