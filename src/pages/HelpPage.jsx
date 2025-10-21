
import React from 'react';
import { useTradingContext } from '@/contexts/TradingContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { HelpCircle, LifeBuoy, Mail, UserCheck, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const HelpPage = () => {
  const { user, allUsers } = useTradingContext();
  const { toast } = useToast();
  const developerEmail = "alejo.madera123@gmail.com";
  let teacherEmail = null;

  if (user?.role === 'student' && user.joinedClassCode) {
    const teacher = allUsers.find(u => u.role === 'teacher' && u.classCode === user.joinedClassCode);
    if (teacher) {
      teacherEmail = teacher.email;
    }
  }

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "¡Copiado!",
        description: `${type} copiado al portapapeles.`,
      });
    }).catch(err => {
      toast({
        title: "Error al copiar",
        description: `No se pudo copiar el ${type}.`,
        variant: "destructive",
      });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8"
    >
      <Card className="glass-card max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <LifeBuoy className="mr-3 h-7 w-7 text-primary" />
            Centro de Ayuda
          </CardTitle>
          <CardDescription>
            Encuentra información de contacto y recursos útiles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {user?.role === 'student' && teacherEmail && (
            <div className="p-6 border border-border rounded-lg bg-background/50">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <UserCheck className="mr-2 h-5 w-5 text-primary/80" />
                Contacto de tu Docente
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Si tienes preguntas específicas sobre la clase o el contenido, puedes contactar a tu docente:
              </p>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                <span className="text-sm font-medium">{teacherEmail}</span>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(teacherEmail, "Correo del docente")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="p-6 border border-border rounded-lg bg-background/50">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Mail className="mr-2 h-5 w-5 text-primary/80" />
              Soporte Técnico (Desarrollador)
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Para problemas técnicos con la plataforma, errores o sugerencias, contacta al desarrollador:
            </p>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
               <span className="text-sm font-medium">{developerEmail}</span>
               <Button variant="ghost" size="icon" onClick={() => copyToClipboard(developerEmail, "Correo de soporte")}>
                  <Copy className="h-4 w-4" />
                </Button>
            </div>
          </div>

          <div className="p-6 border border-border rounded-lg bg-background/50">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-primary/80" />
              Preguntas Frecuentes (Próximamente)
            </h3>
            <p className="text-sm text-muted-foreground">
              Estamos trabajando en una sección de preguntas frecuentes para resolver tus dudas comunes rápidamente. ¡Vuelve pronto!
            </p>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HelpPage;
