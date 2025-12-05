import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAccountingContext } from '@/contexts/AccountingContext';
import { Calculator, FileText, PieChart, BarChart3, ArrowLeft, LogOut, Users, BookOpen } from 'lucide-react';
import CaseCard from '@/components/accounting/CaseCard';
import LanguageSelector from '@/components/LanguageSelector';

const AccountingDashboard = () => {
  const { user, currentRoom, logout, isLoading } = useAccountingContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!isLoading && user?.role === 'teacher') {
      navigate('/accounting/teacher');
    }
  }, [user, navigate, isLoading]);

  React.useEffect(() => {
    if (!isLoading && (!user || !currentRoom)) {
      navigate('/accounting/rooms');
    }
  }, [user, currentRoom, navigate, isLoading]);

  if (isLoading || !user || !currentRoom) {
    return (
      <div className="min-h-screen accounting-bg flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-lg accounting-icon-bg flex items-center justify-center mx-auto mb-4">
            <Calculator className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-bold accounting-text">Cargando...</h2>
        </div>
      </div>
    );
  }

  const assignedCases = user.assignedCases || [];
  const completedAnalyses = user.analyses || [];
  const pendingCases = assignedCases.filter(c => c.status === 'pending');

  const handleAnalyzeCase = (caseData) => {
    navigate('/accounting/statements', { state: { selectedCase: caseData } });
  };

  const dashboardCards = user.role === 'student' ? [
    {
      title: t('accounting.financial_statements', { defaultValue: 'Estados Financieros' }),
      description: t('accounting.view_statements', { defaultValue: 'Ver y analizar estados financieros' }),
      icon: FileText,
      path: '/accounting/statements',
    },
    {
      title: t('accounting.ratio_calculator', { defaultValue: 'Calculadora de Ratios' }),
      description: t('accounting.calculate_ratios', { defaultValue: 'Calcular ratios financieros' }),
      icon: PieChart,
      path: '/accounting/ratios',
    },
    {
      title: t('accounting.my_analyses', { defaultValue: 'Mis Análisis' }),
      description: t('accounting.view_history', { defaultValue: 'Ver historial de análisis' }),
      icon: BarChart3,
      path: '/accounting/history',
    },
  ] : [
    {
      title: t('accounting.case_manager', { defaultValue: 'Gestor de Casos' }),
      description: t('accounting.assign_cases', { defaultValue: 'Crear y asignar casos' }),
      icon: BookOpen,
      path: '/accounting/cases',
    },
    {
      title: t('accounting.student_progress', { defaultValue: 'Progreso de Estudiantes' }),
      description: t('accounting.monitor_students', { defaultValue: 'Monitorear análisis' }),
      icon: Users,
      path: '/accounting/teacher',
    },
  ];

  return (
    <div className="min-h-screen accounting-bg">
      <header className="fixed top-0 left-0 right-0 z-50 accounting-header-bg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg accounting-icon-bg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold accounting-text">{currentRoom.name}</h1>
                <p className="text-xs accounting-text-tertiary">{user.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/accounting/rooms')}
              className="accounting-ghost-btn"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t('accounting.back_to_rooms', { defaultValue: 'Volver a Salas' })}
            </Button>
            <LanguageSelector />
            <Button
              variant="ghost"
              onClick={logout}
              className="accounting-ghost-btn"
            >
              <LogOut className="h-5 w-5 mr-2" />
              {t('auth.logout', { defaultValue: 'Salir' })}
            </Button>
          </div>
        </div>
      </header>

      <section className="min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold accounting-text mb-4">
              {user.role === 'teacher' 
                ? t('accounting.teacher_dashboard', { defaultValue: 'Panel de Profesor' })
                : t('accounting.student_dashboard', { defaultValue: 'Panel de Estudiante' })
              }
            </h2>
            {user.role === 'student' && (
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <Card className="accounting-card-bg border-emerald-500/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm accounting-text-muted">
                      {t('accounting.assigned_cases', { defaultValue: 'Casos Asignados' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold accounting-text-muted">{assignedCases.length}</p>
                  </CardContent>
                </Card>
                <Card className="accounting-card-gradient">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm accounting-text-muted">
                      {t('accounting.pending_cases', { defaultValue: 'Casos Pendientes' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold accounting-text-muted">{pendingCases.length}</p>
                  </CardContent>
                </Card>
                <Card className="accounting-card-dark-bg border-emerald-600/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm accounting-text-muted">
                      {t('accounting.completed_analyses', { defaultValue: 'Análisis Completados' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold accounting-text-muted">{completedAnalyses.length}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {dashboardCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                >
                  <Card 
                    className="accounting-card-hover cursor-pointer h-full"
                    onClick={() => navigate(card.path)}
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg accounting-icon-bg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl accounting-text">{card.title}</CardTitle>
                      <CardDescription className="accounting-text-tertiary">{card.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {user.role === 'student' && assignedCases.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold accounting-text mb-6">
                {t('accounting.recent_cases', { defaultValue: 'Casos Recientes' })}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignedCases.slice(0, 3).map((caseData, index) => (
                  <motion.div
                    key={caseData.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    <CaseCard 
                      caseData={caseData} 
                      onSelect={handleAnalyzeCase}
                      showStatus={true}
                      status={caseData.status}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AccountingDashboard;
