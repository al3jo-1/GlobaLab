import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAccountingContext } from '@/contexts/AccountingContext';
import { Calculator, ArrowLeft, Users, Send } from 'lucide-react';
import CaseCard from '@/components/accounting/CaseCard';

const CaseManager = () => {
  const { user, currentRoom, sampleCases, studentsInClass, assignCase } = useAccountingContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const preSelectedStudentId = location.state?.selectedStudentId;
  
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState(preSelectedStudentId ? [preSelectedStudentId] : []);

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

  const selectedCase = sampleCases.find(c => c.id === selectedCaseId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900">
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
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
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
                    <CardTitle className="text-emerald-400">
                      {t('accounting.available_cases', { defaultValue: 'Casos Disponibles' })}
                    </CardTitle>
                    <CardDescription>
                      {t('accounting.select_case_to_assign', { defaultValue: 'Selecciona un caso para asignar' })}
                    </CardDescription>
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
                          <Label htmlFor="select-all" className="text-slate-200 font-semibold cursor-pointer">
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
                              <Label htmlFor={student.id} className="text-slate-300 cursor-pointer flex-1">
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
                  <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30 mb-4">
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
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white disabled:opacity-50"
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
