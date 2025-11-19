import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { DECISION_SCENARIOS } from '@/lib/business-data';
import { Brain, ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const DecisionCenter = () => {
  const { user, currentRoom, recordDecision, updateCompany } = useBusinessContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showScenarioDialog, setShowScenarioDialog] = useState(false);

  if (!user?.company) {
    navigate('/business/dashboard');
    return null;
  }

  const scenarios = currentRoom?.scenarios || [];
  const allScenarios = [...DECISION_SCENARIOS, ...scenarios];
  const decisions = user.company.decisions || [];

  const handleOpenScenario = (scenario) => {
    setSelectedScenario(scenario);
    setShowScenarioDialog(true);
  };

  const handleMakeDecision = (option) => {
    if (!selectedScenario) return;

    recordDecision(selectedScenario.id, {
      optionId: option.id,
      optionLabel: option.label,
      effects: option.effects,
    });

    const updates = { ...user.company };
    if (option.effects.cash) {
      updates.cash = (updates.cash || 0) + option.effects.cash;
    }
    if (option.effects.debt) {
      const newLoan = {
        id: `loan_${Date.now()}`,
        amount: option.effects.debt,
        interestRate: 8.5,
        term: 24,
        status: 'active',
        paymentsMade: 0,
        remainingBalance: option.effects.debt,
        monthlyPayment: option.effects.debt * (0.085 / 12 * Math.pow(1 + 0.085 / 12, 24)) / (Math.pow(1 + 0.085 / 12, 24) - 1),
        requestedAt: Date.now(),
      };
      updates.loans = [...(updates.loans || []), newLoan];
    }

    updateCompany(updates);
    setShowScenarioDialog(false);
    setSelectedScenario(null);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'opportunity':
        return <Lightbulb className="h-5 w-5" />;
      case 'crisis':
        return <AlertTriangle className="h-5 w-5" />;
      case 'challenge':
        return <Brain className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'opportunity':
        return 'emerald';
      case 'crisis':
        return 'red';
      case 'challenge':
        return 'amber';
      default:
        return 'violet';
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      easy: 'bg-green-500/20 text-green-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      hard: 'bg-red-500/20 text-red-400',
    };
    return colors[difficulty] || colors.medium;
  };

  const hasDecided = (scenarioId) => {
    return decisions.some(d => d.scenarioId === scenarioId);
  };

  return (
    <div className="min-h-screen business-bg">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-violet-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/business/dashboard')}
              className="text-slate-300 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-violet-400" />
              <h1 className="text-xl font-bold text-white">
                {t('business.decision_center', { defaultValue: 'Centro de Decisiones' })}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-slate-800/50 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-white">
                {t('business.available_scenarios', { defaultValue: 'Escenarios Disponibles' })}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t('business.scenarios_description', { 
                  defaultValue: 'Toma decisiones estratégicas que impactarán el futuro de tu empresa' 
                })}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {allScenarios.map((scenario, index) => {
            const decided = hasDecided(scenario.id);
            const decision = decisions.find(d => d.scenarioId === scenario.id);

            return (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-${getCategoryColor(scenario.category)}-500/20 hover:border-${getCategoryColor(scenario.category)}-500/40 transition-all`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-${getCategoryColor(scenario.category)}-500/20`}>
                        {getCategoryIcon(scenario.category)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getDifficultyBadge(scenario.difficulty)}>
                          {scenario.difficulty}
                        </Badge>
                        {decided && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-white">{scenario.title}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {scenario.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300 mb-4">{scenario.context}</p>
                    {decided ? (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <p className="text-sm text-green-400 font-medium mb-1">
                          {t('business.decision_made', { defaultValue: 'Decisión tomada' })}:
                        </p>
                        <p className="text-sm text-slate-300">{decision.optionLabel}</p>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleOpenScenario(scenario)}
                        className="w-full business-btn"
                      >
                        {t('business.view_options', { defaultValue: 'Ver Opciones' })}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {allScenarios.length === 0 && (
          <Card className="bg-slate-800/50 border-violet-500/20">
            <CardContent className="py-12 text-center">
              <Brain className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                {t('business.no_scenarios', { defaultValue: 'No hay escenarios disponibles en este momento' })}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showScenarioDialog} onOpenChange={setShowScenarioDialog}>
        <DialogContent className="bg-slate-800 border-violet-500/20 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">{selectedScenario?.title}</DialogTitle>
            <DialogDescription className="text-slate-400 text-base">
              {selectedScenario?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedScenario && (
            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-violet-500/20">
                <p className="text-slate-300">{selectedScenario.context}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-white font-semibold">
                  {t('business.your_options', { defaultValue: 'Tus Opciones' })}:
                </h3>
                {selectedScenario.options.map((option) => (
                  <Card
                    key={option.id}
                    className="bg-slate-900/50 border-violet-500/20 hover:border-violet-500/40 transition-all cursor-pointer"
                    onClick={() => handleMakeDecision(option)}
                  >
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{option.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-300">{option.effects.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {option.effects.cash && (
                          <Badge className={option.effects.cash > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {option.effects.cash > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                            Efectivo: ${Math.abs(option.effects.cash).toLocaleString()}
                          </Badge>
                        )}
                        {option.effects.monthlyRevenue && (
                          <Badge className={option.effects.monthlyRevenue > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}>
                            Ingresos: {option.effects.monthlyRevenue > 0 ? '+' : ''}{option.effects.monthlyRevenue}
                          </Badge>
                        )}
                        {option.effects.monthlyExpenses && (
                          <Badge className={option.effects.monthlyExpenses < 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            Gastos: {option.effects.monthlyExpenses > 0 ? '+' : ''}{option.effects.monthlyExpenses}
                          </Badge>
                        )}
                        {option.effects.debt && (
                          <Badge className="bg-red-500/20 text-red-400">
                            Deuda: +${option.effects.debt.toLocaleString()}
                          </Badge>
                        )}
                        {option.effects.marketShare && (
                          <Badge className="bg-purple-500/20 text-purple-400">
                            Participación: +{(option.effects.marketShare * 100).toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setShowScenarioDialog(false)}>
                  {t('common.cancel', { defaultValue: 'Cancelar' })}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DecisionCenter;
