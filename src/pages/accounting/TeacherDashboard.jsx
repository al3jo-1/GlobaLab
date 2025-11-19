import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAccountingContext } from '@/contexts/AccountingContext';
import { Calculator, ArrowLeft, Users, FileCheck, Clock, Eye, Copy, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/accounting-data';
import { useToast } from '@/components/ui/use-toast';

const TeacherDashboard = () => {
  const { user, currentRoom, studentsInClass } = useAccountingContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showSubmissionsDialog, setShowSubmissionsDialog] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [grades, setGrades] = useState({});
  const [codeCopied, setCodeCopied] = useState(false);

  if (!user || !currentRoom) {
    navigate('/accounting/rooms');
    return null;
  }

  if (user.role !== 'teacher') {
    navigate('/accounting/dashboard');
    return null;
  }

  const getStudentProgress = (student) => {
    const assignedCases = student.assignedCases || [];
    const completedCases = assignedCases.filter(c => c.status === 'completed');
    return {
      total: assignedCases.length,
      completed: completedCases.length,
      pending: assignedCases.length - completedCases.length,
    };
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: t('accounting.active', { defaultValue: 'Activo' }), className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' },
      inactive: { label: t('accounting.inactive', { defaultValue: 'Inactivo' }), className: 'bg-slate-500/20 text-slate-400 border-slate-500/50' },
    };

    const config = statusConfig[status] || statusConfig.active;
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const handleViewSubmissions = (student) => {
    setSelectedStudent(student);
    setShowSubmissionsDialog(true);
  };

  const handleCopyCode = () => {
    if (currentRoom?.classCode) {
      navigator.clipboard.writeText(currentRoom.classCode).then(() => {
        setCodeCopied(true);
        toast({
          title: t('common.success', { defaultValue: 'Éxito' }),
          description: t('accounting.code_copied', { defaultValue: 'Código copiado al portapapeles' }),
        });
        setTimeout(() => setCodeCopied(false), 2000);
      });
    }
  };

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
                {t('accounting.student_progress', { defaultValue: 'Progreso de Estudiantes' })}
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {currentRoom.name}
                </h2>
                <p className="text-slate-300">
                  {studentsInClass.length} {t('accounting.students_enrolled', { defaultValue: 'estudiantes inscritos' })}
                </p>
              </div>
              <Button
                onClick={() => navigate('/accounting/cases')}
                className="accounting-btn"
              >
                {t('accounting.manage_cases', { defaultValue: 'Gestionar Casos' })}
              </Button>
            </div>

            {currentRoom?.classCode && (
              <Card className="accounting-card-bg border-emerald-500/30 mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm accounting-text-muted mb-1">
                        {t('accounting.class_code', { defaultValue: 'Código de Sala' })}
                      </p>
                      <p className="text-3xl font-bold text-white font-mono">
                        {currentRoom.classCode}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {t('accounting.share_with_students', { defaultValue: 'Comparte este código con tus estudiantes' })}
                      </p>
                    </div>
                    <Button
                      onClick={handleCopyCode}
                      className="bg-emerald-600 hover:bg-emerald-700"
                      size="lg"
                    >
                      {codeCopied ? (
                        <>
                          <Check className="mr-2 h-5 w-5" />
                          {t('common.copied', { defaultValue: 'Copiado' })}
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-5 w-5" />
                          {t('common.copy', { defaultValue: 'Copiar' })}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="accounting-card-bg border-emerald-500/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm accounting-text-muted">
                      {t('accounting.total_students', { defaultValue: 'Total Estudiantes' })}
                    </CardTitle>
                    <Users className="h-5 w-5 text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-emerald-400">{studentsInClass.length}</p>
                </CardContent>
              </Card>

              <Card className="accounting-card-gradient">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm accounting-text-muted">
                      {t('accounting.analyses_submitted', { defaultValue: 'Análisis Enviados' })}
                    </CardTitle>
                    <FileCheck className="h-5 w-5 text-teal-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-teal-400">
                    {studentsInClass.reduce((sum, s) => sum + (s.analyses?.length || 0), 0)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm accounting-text-muted">
                      {t('accounting.pending_work', { defaultValue: 'Trabajos Pendientes' })}
                    </CardTitle>
                    <Clock className="h-5 w-5 text-amber-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-amber-400">
                    {studentsInClass.reduce((sum, s) => {
                      const assigned = s.assignedCases || [];
                      const pending = assigned.filter(c => c.status === 'pending');
                      return sum + pending.length;
                    }, 0)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-emerald-400">
                  {t('accounting.student_list', { defaultValue: 'Lista de Estudiantes' })}
                </CardTitle>
                <CardDescription>
                  {t('accounting.monitor_progress_desc', { defaultValue: 'Monitorea el progreso de tus estudiantes' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {studentsInClass.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-emerald-500/20">
                        <TableHead className="text-emerald-400">{t('accounting.student_name', { defaultValue: 'Nombre' })}</TableHead>
                        <TableHead className="text-emerald-400">{t('accounting.email', { defaultValue: 'Email' })}</TableHead>
                        <TableHead className="text-emerald-400 text-center">{t('accounting.assigned', { defaultValue: 'Asignados' })}</TableHead>
                        <TableHead className="text-emerald-400 text-center">{t('accounting.completed', { defaultValue: 'Completados' })}</TableHead>
                        <TableHead className="text-emerald-400 text-center">{t('accounting.pending', { defaultValue: 'Pendientes' })}</TableHead>
                        <TableHead className="text-emerald-400 text-center">{t('accounting.status', { defaultValue: 'Estado' })}</TableHead>
                        <TableHead className="text-emerald-400 text-right">{t('accounting.actions', { defaultValue: 'Acciones' })}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsInClass.map((student) => {
                        const progress = getStudentProgress(student);
                        return (
                          <TableRow key={student.id} className="border-emerald-500/10">
                            <TableCell className="font-medium text-white">{student.name}</TableCell>
                            <TableCell className="text-slate-300">{student.email}</TableCell>
                            <TableCell className="text-center text-slate-300">{progress.total}</TableCell>
                            <TableCell className="text-center">
                              <span className="text-emerald-400 font-semibold">{progress.completed}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="text-amber-400 font-semibold">{progress.pending}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              {getStatusBadge('active')}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewSubmissions(student)}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                {t('accounting.view_submissions', { defaultValue: 'Ver Entregas' })}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  navigate('/accounting/cases', { state: { selectedStudentId: student.id } });
                                }}
                                className="text-emerald-400 hover:text-emerald-300"
                              >
                                {t('accounting.assign_case', { defaultValue: 'Asignar' })}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">
                      {t('accounting.no_students', { defaultValue: 'No hay estudiantes en esta sala todavía' })}
                    </p>
                    <p className="text-slate-500 text-sm mt-2">
                      {t('accounting.share_code', { defaultValue: 'Comparte el código de sala' })}: <span className="font-bold text-emerald-400">{currentRoom.classCode}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Dialog open={showSubmissionsDialog} onOpenChange={setShowSubmissionsDialog}>
        <DialogContent className="bg-slate-900 border-emerald-500/20 max-w-4xl max-h-[80vh] overflow-y-auto text-white">
          <DialogHeader>
            <DialogTitle className="text-emerald-400">
              {t('accounting.student_submissions', { defaultValue: 'Entregas del Estudiante' })}: {selectedStudent?.name}
            </DialogTitle>
            <DialogDescription>
              {t('accounting.view_analyses_and_feedback', { defaultValue: 'Ver análisis completados y agregar retroalimentación' })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedStudent?.analyses && selectedStudent.analyses.length > 0 ? (
              selectedStudent.analyses.map((analysis, index) => (
                <Card key={analysis.id} className="bg-slate-800/50 border-emerald-500/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">
                        {analysis.caseName || `Análisis ${index + 1}`}
                      </CardTitle>
                      <Badge className="bg-emerald-500/20 text-emerald-400">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.notes && (
                      <div>
                        <Label className="text-slate-300">{t('accounting.student_notes', { defaultValue: 'Notas del Estudiante' })}:</Label>
                        <p className="text-slate-400 mt-1">{analysis.notes}</p>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-slate-300">{t('accounting.grade', { defaultValue: 'Calificación' })} (0-100):</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={grades[analysis.id] || analysis.grade || ''}
                          onChange={(e) => setGrades({...grades, [analysis.id]: e.target.value})}
                          className="bg-slate-900 border-emerald-500/20 text-white mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-300">{t('accounting.teacher_feedback', { defaultValue: 'Retroalimentación del Profesor' })}:</Label>
                      <Textarea
                        value={feedback[analysis.id] || analysis.feedback || ''}
                        onChange={(e) => setFeedback({...feedback, [analysis.id]: e.target.value})}
                        className="bg-slate-900 border-emerald-500/20 text-white mt-1"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-slate-400 py-8">
                {t('accounting.no_submissions_yet', { defaultValue: 'Este estudiante aún no ha enviado análisis' })}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherDashboard;
