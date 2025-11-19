import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAccountingContext } from '@/contexts/AccountingContext';
import { Calculator, ArrowLeft, FileText, Calendar, TrendingUp, Eye } from 'lucide-react';
import { calculateRatios, formatCurrency, formatPercentage } from '@/lib/accounting-data';

const AccountingHistory = () => {
  const { user, currentRoom } = useAccountingContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  if (!user || !currentRoom) {
    navigate('/accounting/rooms');
    return null;
  }

  if (user.role !== 'student') {
    navigate('/accounting/dashboard');
    return null;
  }

  const analyses = user.analyses || [];
  const assignedCases = user.assignedCases || [];

  const handleViewAnalysis = (analysis) => {
    setSelectedAnalysis(analysis);
    setShowDetailDialog(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: t('accounting.completed', { defaultValue: 'Completado' }), className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' },
      pending: { label: t('accounting.pending', { defaultValue: 'Pendiente' }), className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
      reviewed: { label: t('accounting.reviewed', { defaultValue: 'Revisado' }), className: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
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
                {t('accounting.my_analyses', { defaultValue: 'Mis Análisis' })}
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
              {t('accounting.analysis_history', { defaultValue: 'Historial de Análisis' })}
            </h2>
            <p className="text-slate-300">
              {analyses.length} {t('accounting.completed_analyses', { defaultValue: 'análisis completados' })}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="accounting-card-bg border-emerald-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm accounting-text-muted">
                  {t('accounting.total_analyses', { defaultValue: 'Total Análisis' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-emerald-400">{analyses.length}</p>
              </CardContent>
            </Card>

            <Card className="accounting-card-gradient">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm accounting-text-muted">
                  {t('accounting.assigned_cases', { defaultValue: 'Casos Asignados' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-teal-400">{assignedCases.length}</p>
              </CardContent>
            </Card>

            <Card className="accounting-card-gradient">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm accounting-text-muted">
                  {t('accounting.pending_cases', { defaultValue: 'Casos Pendientes' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-400">
                  {assignedCases.filter(c => c.status === 'pending').length}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-emerald-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="mr-2 h-5 w-5 text-emerald-400" />
                {t('accounting.completed_analyses', { defaultValue: 'Análisis Completados' })}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t('accounting.view_past_analyses', { defaultValue: 'Revisa tus análisis anteriores' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyses.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">
                    {t('accounting.no_analyses_yet', { defaultValue: 'Aún no has completado ningún análisis' })}
                  </p>
                  <Button
                    onClick={() => navigate('/accounting/statements')}
                    className="mt-4 accounting-btn"
                  >
                    {t('accounting.start_analysis', { defaultValue: 'Comenzar Análisis' })}
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-emerald-500/20 hover:bg-emerald-500/5">
                      <TableHead className="text-slate-300">{t('accounting.company', { defaultValue: 'Empresa' })}</TableHead>
                      <TableHead className="text-slate-300">{t('accounting.date', { defaultValue: 'Fecha' })}</TableHead>
                      <TableHead className="text-slate-300">{t('accounting.status', { defaultValue: 'Estado' })}</TableHead>
                      <TableHead className="text-slate-300">{t('accounting.score', { defaultValue: 'Puntuación' })}</TableHead>
                      <TableHead className="text-slate-300 text-right">{t('common.actions', { defaultValue: 'Acciones' })}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyses.map((analysis, index) => (
                      <TableRow key={index} className="border-emerald-500/10 hover:bg-emerald-500/5">
                        <TableCell className="text-white font-medium">
                          {analysis.companyName || `Case ${index + 1}`}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {analysis.date ? new Date(analysis.date).toLocaleDateString() : t('accounting.not_available', { defaultValue: 'N/A' })}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(analysis.status || 'completed')}
                        </TableCell>
                        <TableCell className="text-white">
                          {analysis.score ? `${analysis.score}/100` : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewAnalysis(analysis)}
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {t('common.view', { defaultValue: 'Ver' })}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {assignedCases.length > 0 && (
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-emerald-500/20 mt-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-yellow-400" />
                  {t('accounting.pending_cases', { defaultValue: 'Casos Pendientes' })}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {t('accounting.complete_assigned_cases', { defaultValue: 'Completa los casos asignados por tu docente' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignedCases.filter(c => c.status === 'pending').map((caseItem, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="text-white font-semibold">{caseItem.title || `Case ${index + 1}`}</h3>
                        <p className="text-slate-400 text-sm">{caseItem.description || t('accounting.no_description', { defaultValue: 'Sin descripción' })}</p>
                      </div>
                      <Button
                        onClick={() => navigate('/accounting/statements', { state: { selectedCase: caseItem } })}
                        className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                      >
                        {t('accounting.start', { defaultValue: 'Iniciar' })}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 border-emerald-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-emerald-400" />
              {selectedAnalysis?.companyName || t('accounting.analysis_detail', { defaultValue: 'Detalle del Análisis' })}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedAnalysis?.date ? new Date(selectedAnalysis.date).toLocaleDateString() : ''}
            </DialogDescription>
          </DialogHeader>
          {selectedAnalysis && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <h4 className="text-emerald-400 font-semibold mb-2">{t('accounting.status', { defaultValue: 'Estado' })}</h4>
                  <p className="text-white">{getStatusBadge(selectedAnalysis.status || 'completed')}</p>
                </div>
                {selectedAnalysis.score && (
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <h4 className="text-blue-400 font-semibold mb-2">{t('accounting.score', { defaultValue: 'Puntuación' })}</h4>
                    <p className="text-white text-2xl font-bold">{selectedAnalysis.score}/100</p>
                  </div>
                )}
              </div>
              {selectedAnalysis.feedback && (
                <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                  <h4 className="text-slate-300 font-semibold mb-2">{t('accounting.teacher_feedback', { defaultValue: 'Retroalimentación del Docente' })}</h4>
                  <p className="text-slate-400">{selectedAnalysis.feedback}</p>
                </div>
              )}
              {selectedAnalysis.ratios && (
                <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                  <h4 className="text-slate-300 font-semibold mb-2">{t('accounting.calculated_ratios', { defaultValue: 'Ratios Calculados' })}</h4>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    {Object.entries(selectedAnalysis.ratios).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="text-slate-400">{key}: </span>
                        <span className="text-white font-semibold">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountingHistory;
