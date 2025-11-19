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
  const { user, currentRoom, logout } = useAccountingContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!user || !currentRoom) {
    navigate('/accounting/rooms');
    return null;
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
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: t('accounting.ratio_calculator', { defaultValue: 'Calculadora de Ratios' }),
      description: t('accounting.calculate_ratios', { defaultValue: 'Calcular ratios financieros' }),
      icon: PieChart,
      path: '/accounting/ratios',
      color: 'from-emerald-600 to-teal-600',
    },
    {
      title: t('accounting.my_analyses', { defaultValue: 'Mis Análisis' }),
      description: t('accounting.view_history', { defaultValue: 'Ver historial de análisis' }),
      icon: BarChart3,
      path: '/accounting/history',
      color: 'from-teal-500 to-emerald-600',
    },
  ] : [
    {
      title: t('accounting.case_manager', { defaultValue: 'Gestor de Casos' }),
      description: t('accounting.assign_cases', { defaultValue: 'Crear y asignar casos' }),
      icon: BookOpen,
      path: '/accounting/cases',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: t('accounting.student_progress', { defaultValue: 'Progreso de Estudiantes' }),
      description: t('accounting.monitor_students', { defaultValue: 'Monitorear análisis' }),
      icon: Users,
      path: '/accounting/teacher',
      color: 'from-emerald-600 to-teal-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-emerald-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{currentRoom.name}</h1>
                <p className="text-xs text-slate-400">{user.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/accounting/rooms')}
              className="text-slate-300 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t('accounting.back_to_rooms', { defaultValue: 'Volver a Salas' })}
            </Button>
            <LanguageSelector />
            <Button
              variant="ghost"
              onClick={logout}
              className="text-slate-300 hover:text-white"
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
            <h2 className="text-4xl font-bold text-white mb-4">
              {user.role === 'teacher' 
                ? t('accounting.teacher_dashboard', { defaultValue: 'Panel de Profesor' })
                : t('accounting.student_dashboard', { defaultValue: 'Panel de Estudiante' })
              }
            </h2>
            {user.role === 'student' && (
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-slate-300">
                      {t('accounting.assigned_cases', { defaultValue: 'Casos Asignados' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-emerald-400">{assignedCases.length}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border-teal-500/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-slate-300">
                      {t('accounting.pending_cases', { defaultValue: 'Casos Pendientes' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-teal-400">{pendingCases.length}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border-emerald-600/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-slate-300">
                      {t('accounting.completed_analyses', { defaultValue: 'Análisis Completados' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-emerald-400">{completedAnalyses.length}</p>
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
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-emerald-500/20 hover:border-emerald-500/40 transition-all hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer h-full"
                    onClick={() => navigate(card.path)}
                  >
                    <CardHeader>
                      <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${card.color} bg-opacity-20 flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-slate-100">{card.title}</CardTitle>
                      <CardDescription className="text-slate-400">{card.description}</CardDescription>
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
              <h3 className="text-2xl font-bold text-white mb-6">
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
