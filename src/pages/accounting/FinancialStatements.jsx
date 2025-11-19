import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAccountingContext } from '@/contexts/AccountingContext';
import { Calculator, ArrowLeft } from 'lucide-react';
import StatementViewer from '@/components/accounting/StatementViewer';

const FinancialStatements = () => {
  const { user, currentRoom } = useAccountingContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const initialCase = location.state?.selectedCase;
  const assignedCases = user?.assignedCases || [];
  
  const [selectedCaseId, setSelectedCaseId] = useState(initialCase?.id || (assignedCases[0]?.id || null));

  if (!user || !currentRoom) {
    navigate('/accounting/rooms');
    return null;
  }

  const selectedCase = assignedCases.find(c => c.id === selectedCaseId);

  return (
    <div className="min-h-screen accounting-bg">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-emerald-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/accounting/dashboard')}
              className="text-slate-300 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg accounting-icon-bg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">
                {t('accounting.financial_statements', { defaultValue: 'Estados Financieros' })}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <section className="min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card className="bg-slate-800/50 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-emerald-400">
                  {t('accounting.select_case', { defaultValue: 'Seleccionar Caso' })}
                </CardTitle>
                <CardDescription>
                  {t('accounting.choose_case_to_analyze', { defaultValue: 'Elige un caso para analizar sus estados financieros' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {assignedCases.length > 0 ? (
                  <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
                    <SelectTrigger className="w-full bg-slate-900/50 border-emerald-500/20 text-white">
                      <SelectValue placeholder={t('accounting.select_case', { defaultValue: 'Seleccionar Caso' })} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-emerald-500/20">
                      {assignedCases.map((caseData) => (
                        <SelectItem key={caseData.id} value={caseData.id} className="text-white">
                          {caseData.companyName} - {caseData.industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-slate-400">
                    {t('accounting.no_assigned_cases', { defaultValue: 'No tienes casos asignados. Contacta a tu profesor.' })}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {selectedCase && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-slate-800/50 border-emerald-500/20 mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{selectedCase.companyName}</CardTitle>
                  <CardDescription className="text-lg">
                    {selectedCase.industry} - {selectedCase.year}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{selectedCase.description}</p>
                </CardContent>
              </Card>

              <StatementViewer caseData={selectedCase} />

              <div className="mt-8 flex justify-end">
                <Button
                  onClick={() => navigate('/accounting/ratios', { state: { selectedCase } })}
                  className="accounting-btn"
                >
                  {t('accounting.calculate_ratios', { defaultValue: 'Calcular Ratios' })}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FinancialStatements;
