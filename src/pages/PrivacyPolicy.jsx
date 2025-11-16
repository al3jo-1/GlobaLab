import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Users, Mail, Calendar, Cookie } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import LanguageSelector from '@/components/LanguageSelector';
import { useTradingContext } from '@/contexts/TradingContext';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTradingContext();

  const sections = [
    {
      id: 'introduction',
      icon: Shield,
      title: t('privacy.introduction.title', { defaultValue: 'Introducción' }),
      content: t('privacy.introduction.content', { 
        defaultValue: 'En GlobalTradeLab, nos comprometemos a proteger tu privacidad y la seguridad de tus datos personales. Esta política de privacidad explica qué información recopilamos, cómo la usamos y tus derechos con respecto a tus datos personales.' 
      })
    },
    {
      id: 'collection',
      icon: FileText,
      title: t('privacy.collection.title', { defaultValue: 'Información que Recopilamos' }),
      content: [
        {
          subtitle: t('privacy.collection.account.title', { defaultValue: 'Datos de Cuenta' }),
          text: t('privacy.collection.account.content', { 
            defaultValue: 'Recopilamos información básica cuando te registras, incluyendo tu nombre, correo electrónico y tipo de cuenta (estudiante o docente). Esta información se almacena localmente en tu navegador.' 
          })
        },
        {
          subtitle: t('privacy.collection.usage.title', { defaultValue: 'Datos de Uso de la Plataforma' }),
          text: t('privacy.collection.usage.content', { 
            defaultValue: 'Registramos tus actividades de trading simulado, incluyendo posiciones abiertas, historial de transacciones, saldo de portafolio y configuraciones de la plataforma. Toda esta información es educativa y se almacena localmente.' 
          })
        },
        {
          subtitle: t('privacy.collection.technical.title', { defaultValue: 'Datos Técnicos' }),
          text: t('privacy.collection.technical.content', { 
            defaultValue: 'Utilizamos localStorage del navegador para almacenar preferencias como idioma, tema (oscuro/claro), y configuraciones de gráficos. No recopilamos información de identificación personal adicional.' 
          })
        }
      ]
    },
    {
      id: 'usage',
      icon: Eye,
      title: t('privacy.usage.title', { defaultValue: 'Cómo Usamos tu Información' }),
      content: [
        {
          subtitle: t('privacy.usage.education.title', { defaultValue: 'Propósitos Educativos' }),
          text: t('privacy.usage.education.content', { 
            defaultValue: 'Tu información se utiliza exclusivamente para fines educativos: permitir la simulación de trading, seguimiento de tu progreso, y facilitar la interacción entre docentes y estudiantes en el entorno de aprendizaje.' 
          })
        },
        {
          subtitle: t('privacy.usage.improvement.title', { defaultValue: 'Mejora de Servicios' }),
          text: t('privacy.usage.improvement.content', { 
            defaultValue: 'Analizamos patrones de uso agregados y anónimos para mejorar la experiencia del usuario, optimizar funcionalidades y desarrollar nuevas características educativas.' 
          })
        },
        {
          subtitle: t('privacy.usage.communication.title', { defaultValue: 'Comunicación' }),
          text: t('privacy.usage.communication.content', { 
            defaultValue: 'Podemos usar tu correo electrónico para enviarte notificaciones importantes sobre la plataforma, actualizaciones de seguridad, o información relevante para tu experiencia educativa.' 
          })
        }
      ]
    },
    {
      id: 'sharing',
      icon: Users,
      title: t('privacy.sharing.title', { defaultValue: 'Compartir Información' }),
      content: t('privacy.sharing.content', { 
        defaultValue: 'GlobalTradeLab es una plataforma educativa que NO comparte, vende ni alquila tu información personal a terceros. Tus datos permanecen privados y solo son accesibles para ti y, en el caso de estudiantes, para tus docentes dentro del contexto de la sala de clase virtual. Los docentes pueden ver el rendimiento y actividad de trading de sus estudiantes únicamente con fines educativos.' 
      })
    },
    {
      id: 'security',
      icon: Lock,
      title: t('privacy.security.title', { defaultValue: 'Seguridad de Datos' }),
      content: t('privacy.security.content', { 
        defaultValue: 'Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos. Dado que toda la información se almacena localmente en tu navegador usando localStorage, tienes control total sobre tus datos. Te recomendamos usar contraseñas seguras y mantener tu navegador actualizado. No almacenamos información sensible en servidores externos.' 
      })
    },
    {
      id: 'cookies',
      icon: Cookie,
      title: t('privacy.cookies.title', { defaultValue: 'Cookies y Tecnologías Similares' }),
      content: [
        {
          subtitle: t('privacy.cookies.localStorage.title', { defaultValue: 'LocalStorage' }),
          text: t('privacy.cookies.localStorage.content', { 
            defaultValue: 'Utilizamos localStorage del navegador para almacenar tu sesión, preferencias de usuario, datos de portafolio y configuraciones. Esta información permanece en tu dispositivo y puede ser eliminada en cualquier momento desde la configuración de tu navegador.' 
          })
        },
        {
          subtitle: t('privacy.cookies.sessionStorage.title', { defaultValue: 'SessionStorage' }),
          text: t('privacy.cookies.sessionStorage.content', { 
            defaultValue: 'Usamos sessionStorage para mantener información temporal durante tu sesión activa. Esta información se elimina automáticamente cuando cierras el navegador.' 
          })
        },
        {
          subtitle: t('privacy.cookies.essential.title', { defaultValue: 'Cookies Esenciales' }),
          text: t('privacy.cookies.essential.content', { 
            defaultValue: 'Solo utilizamos cookies técnicas esenciales necesarias para el funcionamiento básico de la plataforma (autenticación, preferencias de idioma). No usamos cookies de publicidad o seguimiento de terceros.' 
          })
        }
      ]
    },
    {
      id: 'rights',
      icon: Shield,
      title: t('privacy.rights.title', { defaultValue: 'Derechos del Usuario' }),
      content: t('privacy.rights.content', { 
        defaultValue: 'Tienes derecho a: (1) Acceder a tus datos personales almacenados en la plataforma, (2) Rectificar información incorrecta o incompleta, (3) Eliminar tu cuenta y todos los datos asociados en cualquier momento, (4) Exportar tus datos de trading para análisis personal, (5) Oponerte al procesamiento de tus datos para ciertos propósitos, (6) Retirar tu consentimiento en cualquier momento. Para ejercer estos derechos, puedes gestionar tu información desde la sección de Configuración o contactarnos directamente.' 
      })
    },
    {
      id: 'changes',
      icon: Calendar,
      title: t('privacy.changes.title', { defaultValue: 'Cambios a esta Política' }),
      content: t('privacy.changes.content', { 
        defaultValue: 'Podemos actualizar esta política de privacidad periódicamente para reflejar cambios en nuestras prácticas o por razones legales. Te notificaremos sobre cambios significativos a través de la plataforma o por correo electrónico. La fecha de la última actualización se indica al final de este documento.' 
      })
    },
    {
      id: 'contact',
      icon: Mail,
      title: t('privacy.contact.title', { defaultValue: 'Contacto' }),
      content: t('privacy.contact.content', { 
        defaultValue: 'Si tienes preguntas sobre esta política de privacidad, el manejo de tus datos personales, o deseas ejercer tus derechos, puedes contactarnos a través de: Email: support@globaltradelab.com. Nos comprometemos a responder tus consultas en un plazo de 48 horas hábiles.' 
      })
    }
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
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold">
              <span className="text-primary">GlobalTrade</span>
              <span className="text-primary/70">Lab</span>
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSelector />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto text-center max-w-4xl"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('privacy.hero.title', { defaultValue: 'Política de Privacidad' })}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-6">
            {t('privacy.hero.subtitle', { 
              defaultValue: 'Tu privacidad es importante para nosotros. Conoce cómo protegemos tus datos.' 
            })}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('privacy.hero.last_updated', { defaultValue: 'Última actualización' })}: {t('privacy.hero.date', { defaultValue: '16 de Noviembre de 2025' })}
          </p>
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div key={section.id} variants={itemVariants}>
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl md:text-3xl">
                        <IconComponent className="mr-3 h-8 w-8 text-primary flex-shrink-0" />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground space-y-4">
                      {typeof section.content === 'string' ? (
                        <p className="text-base leading-relaxed">{section.content}</p>
                      ) : (
                        <div className="space-y-6">
                          {section.content.map((item, idx) => (
                            <div key={idx}>
                              <h4 className="font-semibold text-foreground mb-2 text-lg">
                                {item.subtitle}
                              </h4>
                              <p className="text-base leading-relaxed">{item.text}</p>
                              {idx < section.content.length - 1 && (
                                <Separator className="mt-4" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto text-center max-w-3xl"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            {t('privacy.cta.title', { defaultValue: '¿Tienes preguntas?' })}
          </h3>
          <p className="text-lg text-muted-foreground mb-6">
            {t('privacy.cta.subtitle', { 
              defaultValue: 'Estamos aquí para ayudarte con cualquier duda sobre tu privacidad y seguridad.' 
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => window.location.href = 'mailto:support@globaltradelab.com'}>
              <Mail className="mr-2 h-5 w-5" />
              {t('privacy.cta.contact', { defaultValue: 'Contáctanos' })}
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.close()}>
              {t('privacy.cta.close', { defaultValue: 'Cerrar' })}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-background/50">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; 2025 GlobalTradeLab. {t('privacy.footer.rights', { defaultValue: 'Todos los derechos reservados.' })}</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
