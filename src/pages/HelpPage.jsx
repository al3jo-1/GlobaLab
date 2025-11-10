
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTradingContext } from '@/contexts/TradingContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { HelpCircle, LifeBuoy, Mail, UserCheck, Copy, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import FinancialChatbot from '@/components/chatbot/FinancialChatbot';

const HelpPage = () => {
  const { user, allUsers, currentRoom } = useTradingContext();
  const { t } = useTranslation();
  const { toast } = useToast();
  const developerEmail = "Master@globaltradelab.online";
  let teacherEmail = null;
  let teacherName = null;

  if (user?.role === 'student' && currentRoom && currentRoom.ownerId) {
    const teacher = allUsers.find(u => u.id === currentRoom.ownerId);
    if (teacher) {
      teacherEmail = teacher.email;
      teacherName = teacher.name;
    }
  }

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: t('common.success'),
        description: t('common.copy', { defaultValue: 'Copied to clipboard' }),
      });
    }).catch(err => {
      toast({
        title: t('common.error'),
        description: t('common.copy_error', { defaultValue: 'Unable to copy' }),
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
            {t('navigation.help')}
          </CardTitle>
          <CardDescription>
            {t('help.description', { defaultValue: 'Find contact information and useful resources.' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div className="p-6 border border-border rounded-lg bg-background/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MessageCircle className="mr-2 h-5 w-5 text-primary/80" />
              {t('chatbot.title', { defaultValue: 'Asistente de Educación Financiera' })}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('chatbot.description', { defaultValue: 'Pregúntame sobre trading, inversiones y conceptos financieros' })}
            </p>
            <FinancialChatbot />
          </div>
          
          {user?.role === 'student' && teacherEmail && (
            <div className="p-6 border border-border rounded-lg bg-background/50">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <UserCheck className="mr-2 h-5 w-5 text-primary/80" />
                {t('help.teacher_title', { defaultValue: 'Tu Docente' })}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {t('help.teacher_contact', { defaultValue: 'Si tienes preguntas sobre la clase, contacta a tu docente:' })}
              </p>
              {teacherName && (
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md mb-2">
                  <span className="text-sm text-muted-foreground">Nombre:</span>
                  <span className="text-sm font-medium">{teacherName}</span>
                </div>
              )}
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
              {t('help.developer_support', { defaultValue: 'Technical Support (Developer)' })}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {t('help.developer_support_desc', { defaultValue: 'For technical issues, bugs or suggestions contact:' })}
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
              {t('help.faq', { defaultValue: 'FAQ (Coming soon)' })}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('help.faq_desc', { defaultValue: 'We are working on a FAQ section. Check back soon!' })}
            </p>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HelpPage;
