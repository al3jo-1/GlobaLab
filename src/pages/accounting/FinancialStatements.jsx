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
      <header className="fixed top-0 left-0 right-0 z-50 accounting-header-bg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/accounting/dashboard')}
              className="accounting-ghost-btn"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg accounting-icon-bg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold accounting-heading">
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
            <Card className="accounting-card">
              <CardHeader>
                <CardTitle className="accounting-text-muted">
                  {t('accounting.select_case', { defaultValue: 'Seleccionar Caso' })}
                </CardTitle>
                <CardDescription>
                  {t('accounting.choose_case_to_analyze', { defaultValue: 'Elige un caso para analizar sus estados financieros' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {assignedCases.length > 0 ? (
                  <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
                    <SelectTrigger className="w-full accounting-input">
                      <SelectValue placeholder={t('accounting.select_case', { defaultValue: 'Seleccionar Caso' })} />
                    </SelectTrigger>
                    <SelectContent className="accounting-select">
                      {assignedCases.map((caseData) => (
                        <SelectItem key={caseData.id} value={caseData.id}>
                          {caseData.companyName} - {caseData.industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="accounting-text-tertiary">
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
              <Card className="accounting-card mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl accounting-heading">{selectedCase.companyName}</CardTitle>
                  <CardDescription className="text-lg">
                    {selectedCase.industry} - {selectedCase.year}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="accounting-text-secondary">{selectedCase.description}</p>
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
