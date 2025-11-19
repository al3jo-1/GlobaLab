import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Building2, Users, Briefcase, Globe, DollarSign, TrendingUp, UserPlus } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

const BusinessLandingPage = () => {
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
        t('business.landing.plans.starter.feature3', { defaultValue: 'Gestión empresarial básica' }),
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
        t('business.landing.plans.professional.feature3', { defaultValue: 'Simulador avanzado de empresas' }),
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
        t('business.landing.plans.enterprise.feature3', { defaultValue: 'Escenarios personalizados' }),
        t('landing.plans.enterprise.feature4', { defaultValue: 'Reportes personalizados' }),
        t('landing.plans.enterprise.feature5', { defaultValue: 'Soporte 24/7' }),
        t('business.landing.plans.enterprise.feature6', { defaultValue: 'Análisis de mercado avanzado' }),
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
    <div className="min-h-screen gradient-bg business-theme">
      <style dangerouslySetInnerHTML={{__html: `
        .business-theme {
          --primary: 262 83% 58%;
          --primary-foreground: 0 0% 100%;
        }
        .business-gradient {
          background: linear-gradient(to right, hsl(262 83% 58%), hsl(262 83% 68%));
        }
      `}} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-violet-500" />
            <h1 className="text-2xl font-bold">
              <span className="text-violet-500">GlobalBusiness</span>
              <span className="text-violet-500/70"> Lab</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button 
              onClick={() => navigate('/business/login')} 
              className="bg-violet-600 hover:bg-violet-700 text-white"
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
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Building2 className="h-16 w-16 text-violet-500" />
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="text-violet-500">GlobalBusiness</span>
              <span className="text-violet-400/80"> Lab</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {t('business.landing.hero.subtitle', { 
              defaultValue: 'Plataforma educativa interactiva para aprender administración de empresas mediante simulación práctica' 
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-violet-600 hover:bg-violet-700 text-white text-lg px-8"
              onClick={() => navigate('/business/register')}
            >
              {t('landing.start_free', { defaultValue: 'Comenzar Gratis' })}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-violet-500 text-violet-500 hover:bg-violet-500/10 text-lg px-8"
              onClick={() => navigate('/business/login')}
            >
              {t('landing.login', { defaultValue: 'Iniciar Sesión' })}
            </Button>
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
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              {t('business.landing.features.title', { defaultValue: 'Características Principales' })}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('business.landing.features.subtitle', { 
                defaultValue: 'Todo lo que necesitas para enseñar administración de empresas de forma interactiva' 
              })}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="glass-card border-violet-500/20 hover:border-violet-500/40 transition-all h-full">
                <CardHeader>
                  <Building2 className="h-12 w-12 text-violet-500 mb-4" />
                  <CardTitle className="text-violet-500">
                    {t('business.landing.features.company_management.title', { defaultValue: 'Gestión Empresarial' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {t('business.landing.features.company_management.description', { 
                      defaultValue: 'Crea y administra empresas virtuales con estructura organizacional completa' 
                    })}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass-card border-violet-500/20 hover:border-violet-500/40 transition-all h-full">
                <CardHeader>
                  <UserPlus className="h-12 w-12 text-violet-500 mb-4" />
                  <CardTitle className="text-violet-500">
                    {t('business.landing.features.workforce.title', { defaultValue: 'Contratación de Personal' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {t('business.landing.features.workforce.description', { 
                      defaultValue: 'Gestiona recursos humanos, salarios, y productividad del personal' 
                    })}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass-card border-violet-500/20 hover:border-violet-500/40 transition-all h-full">
                <CardHeader>
                  <DollarSign className="h-12 w-12 text-violet-500 mb-4" />
                  <CardTitle className="text-violet-500">
                    {t('business.landing.features.loans.title', { defaultValue: 'Simulador de Préstamos' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {t('business.landing.features.loans.description', { 
                      defaultValue: 'Solicita préstamos bancarios y aprende a gestionar la deuda empresarial' 
                    })}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass-card border-violet-500/20 hover:border-violet-500/40 transition-all h-full">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-violet-500 mb-4" />
                  <CardTitle className="text-violet-500">
                    {t('business.landing.features.decisions.title', { defaultValue: 'Toma de Decisiones' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {t('business.landing.features.decisions.description', { 
                      defaultValue: 'Analiza escenarios y toma decisiones estratégicas que impactan tu empresa' 
                    })}
                  </CardDescription>
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
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              {t('landing.pricing.title', { defaultValue: 'Planes de Precios' })}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('landing.pricing.subtitle', { defaultValue: 'Elige el plan perfecto para tu institución' })}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {plans.map((plan, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className={`glass-card h-full ${plan.highlight ? 'border-violet-500 shadow-lg shadow-violet-500/20' : 'border-violet-500/20'}`}>
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-violet-500">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <CardDescription className="text-base mt-2">
                      {plan.students} {t('landing.pricing.students', { defaultValue: 'estudiantes' })} • {plan.rooms} {t('landing.pricing.rooms', { defaultValue: 'salas' })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-violet-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full mt-6 ${plan.highlight ? 'bg-violet-600 hover:bg-violet-700' : 'bg-violet-600/80 hover:bg-violet-600'}`}
                      onClick={() => navigate('/business/register')}
                    >
                      {t('landing.pricing.select_plan', { defaultValue: 'Seleccionar Plan' })}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 business-section-bg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('business.landing.cta.title', { defaultValue: '¿Listo para transformar la educación empresarial?' })}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('business.landing.cta.subtitle', { 
              defaultValue: 'Únete a GlobalBusiness Lab y lleva tus clases de administración al siguiente nivel' 
            })}
          </p>
          <Button 
            size="lg" 
            className="bg-white text-violet-600 hover:bg-gray-100 text-lg px-8"
            onClick={() => navigate('/business/register')}
          >
            {t('landing.cta.button', { defaultValue: 'Comenzar Ahora' })}
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-background/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 GlobalBusiness Lab. {t('landing.footer.rights', { defaultValue: 'Todos los derechos reservados' })}.</p>
        </div>
      </footer>
    </div>
  );
};

export default BusinessLandingPage;
