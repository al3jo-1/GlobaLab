import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAccountingContext } from '@/contexts/AccountingContext';
import { Calculator, ArrowLeft, Users, Send, Plus } from 'lucide-react';
import CaseCard from '@/components/accounting/CaseCard';

const CaseManager = () => {
  const { user, currentRoom, sampleCases, studentsInClass, assignCase, createCustomCase } = useAccountingContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const preSelectedStudentId = location.state?.selectedStudentId;
  
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState(preSelectedStudentId ? [preSelectedStudentId] : []);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCase, setNewCase] = useState({
    companyName: '',
    industry: '',
    year: new Date().getFullYear(),
    description: '',
    balanceSheet: {
      assets: {
        current: { cash: 0, accountsReceivable: 0, inventory: 0, prepaidExpenses: 0 },
        nonCurrent: { propertyPlantEquipment: 0, intangibleAssets: 0, longTermInvestments: 0 }
      },
      liabilities: {
        current: { accountsPayable: 0, shortTermDebt: 0, accruedExpenses: 0 },
        nonCurrent: { longTermDebt: 0, deferredTaxLiabilities: 0 }
      },
      equity: { commonStock: 0, retainedEarnings: 0 }
    },
    incomeStatement: {
      revenue: 0,
      costOfGoodsSold: 0,
      operatingExpenses: { selling: 0, administrative: 0, researchDevelopment: 0 },
      otherIncome: 0,
      interestExpense: 0,
      taxExpense: 0
    },
    cashFlowStatement: {
      operating: { netIncome: 0, depreciation: 0, changeInAccountsReceivable: 0, changeInInventory: 0, changeInAccountsPayable: 0 },
      investing: { purchaseOfPPE: 0, purchaseOfInvestments: 0 },
      financing: { proceedsFromDebt: 0, dividendsPaid: 0 }
    }
  });

  if (!user || !currentRoom) {
    navigate('/accounting/rooms');
    return null;
  }

  if (user.role !== 'teacher') {
    navigate('/accounting/dashboard');
    return null;
  }

  const handleSelectCase = (caseData) => {
    setSelectedCaseId(caseData.id);
  };

  const handleStudentToggle = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === studentsInClass.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(studentsInClass.map(s => s.id));
    }
  };

  const handleAssignCase = () => {
    if (selectedCaseId && selectedStudents.length > 0) {
      assignCase(selectedCaseId, selectedStudents);
      setSelectedCaseId(null);
      setSelectedStudents([]);
    }
  };

  const handleCreateCustomCase = () => {
    if (!newCase.companyName || !newCase.industry) {
      return;
    }
    const success = createCustomCase(newCase);
    if (success) {
      setShowCreateDialog(false);
      setNewCase({
        companyName: '',
        industry: '',
        year: new Date().getFullYear(),
        description: '',
        balanceSheet: {
          assets: {
            current: { cash: 0, accountsReceivable: 0, inventory: 0, prepaidExpenses: 0 },
            nonCurrent: { propertyPlantEquipment: 0, intangibleAssets: 0, longTermInvestments: 0 }
          },
          liabilities: {
            current: { accountsPayable: 0, shortTermDebt: 0, accruedExpenses: 0 },
            nonCurrent: { longTermDebt: 0, deferredTaxLiabilities: 0 }
          },
          equity: { commonStock: 0, retainedEarnings: 0 }
        },
        incomeStatement: {
          revenue: 0,
          costOfGoodsSold: 0,
          operatingExpenses: { selling: 0, administrative: 0, researchDevelopment: 0 },
          otherIncome: 0,
          interestExpense: 0,
          taxExpense: 0
        },
        cashFlowStatement: {
          operating: { netIncome: 0, depreciation: 0, changeInAccountsReceivable: 0, changeInInventory: 0, changeInAccountsPayable: 0 },
          investing: { purchaseOfPPE: 0, purchaseOfInvestments: 0 },
          financing: { proceedsFromDebt: 0, dividendsPaid: 0 }
        }
      });
    }
  };

  const selectedCase = sampleCases.find(c => c.id === selectedCaseId);

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
                {t('accounting.case_manager', { defaultValue: 'Gestor de Casos' })}
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
            <h2 className="text-3xl font-bold text-white mb-2">
              {t('accounting.assign_cases_to_students', { defaultValue: 'Asignar Casos a Estudiantes' })}
            </h2>
            <p className="text-slate-300">
              {t('accounting.select_case_and_students', { defaultValue: 'Selecciona un caso y los estudiantes a los que deseas asignarlo' })}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="bg-slate-800/50 border-emerald-500/20 mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-emerald-400">
                          {t('accounting.available_cases', { defaultValue: 'Casos Disponibles' })}
                        </CardTitle>
                        <CardDescription>
                          {t('accounting.select_case_to_assign', { defaultValue: 'Selecciona un caso para asignar' })}
                        </CardDescription>
                      </div>
                      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                        <DialogTrigger asChild>
                          <Button className="business-btn">
                            <Plus className="h-4 w-4 mr-2" />
                            {t('accounting.create_custom_case', { defaultValue: 'Crear Caso Personalizado' })}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-emerald-500/20 max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-emerald-400">
                              {t('accounting.create_custom_case', { defaultValue: 'Crear Caso Personalizado' })}
                            </DialogTitle>
                            <DialogDescription>
                              {t('accounting.create_custom_case_desc', { defaultValue: 'Crea un caso personalizado con datos financieros completos' })}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-foreground">{t('accounting.company_name', { defaultValue: 'Nombre de la Empresa' })}</Label>
                                <Input
                                  value={newCase.companyName}
                                  onChange={(e) => setNewCase({...newCase, companyName: e.target.value})}
                                  className="bg-slate-800 border-emerald-500/20 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-foreground">{t('accounting.industry', { defaultValue: 'Industria' })}</Label>
                                <Input
                                  value={newCase.industry}
                                  onChange={(e) => setNewCase({...newCase, industry: e.target.value})}
                                  className="bg-slate-800 border-emerald-500/20 text-white"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-foreground">{t('accounting.description', { defaultValue: 'Descripción' })}</Label>
                              <Textarea
                                value={newCase.description}
                                onChange={(e) => setNewCase({...newCase, description: e.target.value})}
                                className="bg-slate-800 border-emerald-500/20 text-white"
                                rows={3}
                              />
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-white font-semibold">{t('accounting.current_assets', { defaultValue: 'Activos Corrientes' })}</h4>
                              <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-sm text-slate-400">{t('accounting.cash', { defaultValue: 'Efectivo' })}</Label>
                                  <Input type="number" value={newCase.balanceSheet.assets.current.cash}
                                    onChange={(e) => setNewCase({...newCase, balanceSheet: {...newCase.balanceSheet, assets: {...newCase.balanceSheet.assets, current: {...newCase.balanceSheet.assets.current, cash: parseFloat(e.target.value) || 0}}}})}
                                    className="bg-slate-800 border-emerald-500/20 text-white" />
                                </div>
                                <div>
                                  <Label className="text-sm text-slate-400">{t('accounting.accounts_receivable', { defaultValue: 'Cuentas por Cobrar' })}</Label>
                                  <Input type="number" value={newCase.balanceSheet.assets.current.accountsReceivable}
                                    onChange={(e) => setNewCase({...newCase, balanceSheet: {...newCase.balanceSheet, assets: {...newCase.balanceSheet.assets, current: {...newCase.balanceSheet.assets.current, accountsReceivable: parseFloat(e.target.value) || 0}}}})}
                                    className="bg-slate-800 border-emerald-500/20 text-white" />
                                </div>
                                <div>
                                  <Label className="text-sm text-slate-400">{t('accounting.inventory', { defaultValue: 'Inventario' })}</Label>
                                  <Input type="number" value={newCase.balanceSheet.assets.current.inventory}
                                    onChange={(e) => setNewCase({...newCase, balanceSheet: {...newCase.balanceSheet, assets: {...newCase.balanceSheet.assets, current: {...newCase.balanceSheet.assets.current, inventory: parseFloat(e.target.value) || 0}}}})}
                                    className="bg-slate-800 border-emerald-500/20 text-white" />
                                </div>
                                <div>
                                  <Label className="text-sm text-slate-400">{t('accounting.prepaid_expenses', { defaultValue: 'Gastos Pagados por Anticipado' })}</Label>
                                  <Input type="number" value={newCase.balanceSheet.assets.current.prepaidExpenses}
                                    onChange={(e) => setNewCase({...newCase, balanceSheet: {...newCase.balanceSheet, assets: {...newCase.balanceSheet.assets, current: {...newCase.balanceSheet.assets.current, prepaidExpenses: parseFloat(e.target.value) || 0}}}})}
                                    className="bg-slate-800 border-emerald-500/20 text-white" />
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="border-emerald-500/20">
                                {t('common.cancel', { defaultValue: 'Cancelar' })}
                              </Button>
                              <Button onClick={handleCreateCustomCase} className="accounting-btn">
                                {t('common.create', { defaultValue: 'Crear' })}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  {sampleCases.map((caseData, index) => (
                    <motion.div
                      key={caseData.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                      onClick={() => handleSelectCase(caseData)}
                      className={`cursor-pointer transition-all ${
                        selectedCaseId === caseData.id ? 'ring-2 ring-emerald-500' : ''
                      }`}
                    >
                      <CaseCard caseData={caseData} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="sticky top-24"
              >
                <Card className="bg-slate-800/50 border-emerald-500/20 mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-emerald-400">
                        {t('accounting.select_students', { defaultValue: 'Seleccionar Estudiantes' })}
                      </CardTitle>
                      <Users className="h-5 w-5 text-emerald-400" />
                    </div>
                    <CardDescription>
                      {selectedStudents.length} {t('accounting.selected', { defaultValue: 'seleccionados' })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {studentsInClass.length > 0 ? (
                      <>
                        <div className="flex items-center space-x-2 pb-3 border-b border-emerald-500/20">
                          <Checkbox
                            id="select-all"
                            checked={selectedStudents.length === studentsInClass.length}
                            onCheckedChange={handleSelectAll}
                            className="border-emerald-500/50"
                          />
                          <Label htmlFor="select-all" className="text-foreground font-semibold cursor-pointer">
                            {t('accounting.select_all', { defaultValue: 'Seleccionar Todos' })}
                          </Label>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto space-y-3">
                          {studentsInClass.map((student) => (
                            <div key={student.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={student.id}
                                checked={selectedStudents.includes(student.id)}
                                onCheckedChange={() => handleStudentToggle(student.id)}
                                className="border-emerald-500/50"
                              />
                              <Label htmlFor={student.id} className="text-foreground cursor-pointer flex-1">
                                <div className="flex flex-col">
                                  <span className="font-medium">{student.name}</span>
                                  <span className="text-xs text-slate-500">{student.email}</span>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-slate-400 text-center py-4">
                        {t('accounting.no_students', { defaultValue: 'No hay estudiantes' })}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {selectedCase && (
                  <Card className="accounting-card-bg border-emerald-500/30 mb-4">
                    <CardHeader>
                      <CardTitle className="text-lg text-emerald-400">
                        {t('accounting.selected_case', { defaultValue: 'Caso Seleccionado' })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white font-semibold">{selectedCase.companyName}</p>
                      <p className="text-slate-300 text-sm">{selectedCase.industry}</p>
                    </CardContent>
                  </Card>
                )}

                <Button
                  onClick={handleAssignCase}
                  disabled={!selectedCaseId || selectedStudents.length === 0}
                  className="w-full accounting-btn disabled:opacity-50"
                >
                  <Send className="mr-2 h-5 w-5" />
                  {t('accounting.assign_case', { defaultValue: 'Asignar Caso' })} 
                  {selectedStudents.length > 0 && ` (${selectedStudents.length})`}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseManager;
