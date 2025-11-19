import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { calculateCompanyKPIs } from '@/lib/business-data';
import { useToast } from '@/components/ui/use-toast';
import { Briefcase, Users, TrendingUp, Settings, Plus, ArrowLeft, Building2, Brain, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TeacherDashboard = () => {
  const { user, studentsInClass, currentRoom, addScenario, updateMarketConditions } = useBusinessContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [showScenarioDialog, setShowScenarioDialog] = useState(false);
  const [showMarketDialog, setShowMarketDialog] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [scenarioData, setScenarioData] = useState({
    title: '',
    category: 'challenge',
    difficulty: 'medium',
    description: '',
    context: '',
  });
  const [marketData, setMarketData] = useState({
    interestRate: currentRoom?.marketConditions?.interestRate || 5.0,
    economicGrowth: currentRoom?.marketConditions?.economicGrowth || 2.5,
    inflationRate: currentRoom?.marketConditions?.inflationRate || 3.0,
    marketDemand: currentRoom?.marketConditions?.marketDemand || 'normal',
  });

  if (user?.role !== 'teacher') {
    navigate('/business/dashboard');
    return null;
  }

  const studentCompanies = studentsInClass
    .filter(s => s.company)
    .map(s => ({
      studentName: s.name,
      companyName: s.company.name,
      kpis: calculateCompanyKPIs(s.company),
    }));

  const handleCreateScenario = () => {
    if (scenarioData.title && scenarioData.description) {
      addScenario({
        ...scenarioData,
        options: [],
      });
      setShowScenarioDialog(false);
      setScenarioData({
        title: '',
        category: 'challenge',
        difficulty: 'medium',
        description: '',
        context: '',
      });
    }
  };

  const handleUpdateMarket = () => {
    updateMarketConditions(marketData);
    setShowMarketDialog(false);
  };

  const handleCopyCode = () => {
    if (currentRoom?.classCode) {
      navigator.clipboard.writeText(currentRoom.classCode).then(() => {
        setCodeCopied(true);
        toast({
          title: t('common.success', { defaultValue: 'Éxito' }),
          description: t('business.code_copied', { defaultValue: 'Código copiado al portapapeles' }),
        });
        setTimeout(() => setCodeCopied(false), 2000);
      });
    }
  };

  const rankingData = studentCompanies
    .sort((a, b) => b.kpis.netProfit - a.kpis.netProfit)
    .map((company, index) => ({
      rank: index + 1,
      ...company,
    }));

  const comparisonData = studentCompanies.map(company => ({
    name: company.companyName,
    cash: company.kpis.cash,
    profit: company.kpis.netProfit,
    employees: company.kpis.employeeCount,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900">
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
              <Briefcase className="h-6 w-6 text-violet-400" />
              <div>
                <h1 className="text-xl font-bold text-white">
                  {t('business.teacher_dashboard', { defaultValue: 'Panel Docente' })}
                </h1>
                <p className="text-xs text-slate-400">{currentRoom?.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowMarketDialog(true)}
              variant="outline"
              size="sm"
              className="text-white border-violet-500/30"
            >
              <Settings className="mr-2 h-4 w-4" />
              {t('business.market_conditions', { defaultValue: 'Condiciones' })}
            </Button>
            <Button
              onClick={() => setShowScenarioDialog(true)}
              size="sm"
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('business.create_scenario', { defaultValue: 'Crear Escenario' })}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {currentRoom?.classCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-violet-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300 mb-1">
                      {t('business.class_code', { defaultValue: 'Código de Sala' })}
                    </p>
                    <p className="text-3xl font-bold text-white font-mono">
                      {currentRoom.classCode}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {t('business.share_with_students', { defaultValue: 'Comparte este código con tus estudiantes' })}
                    </p>
                  </div>
                  <Button
                    onClick={handleCopyCode}
                    className="bg-violet-600 hover:bg-violet-700"
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
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-4 gap-4"
        >
          <Card className="bg-slate-800/50 border-violet-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {t('business.total_students', { defaultValue: 'Total Estudiantes' })}
              </CardTitle>
              <Users className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{studentsInClass.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-violet-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {t('business.companies_created', { defaultValue: 'Empresas Creadas' })}
              </CardTitle>
              <Building2 className="h-5 w-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{studentCompanies.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-violet-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {t('business.scenarios', { defaultValue: 'Escenarios' })}
              </CardTitle>
              <Brain className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{currentRoom?.scenarios?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-violet-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {t('business.avg_performance', { defaultValue: 'Rendimiento Prom.' })}
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {studentCompanies.length > 0
                  ? ((studentCompanies.reduce((sum, c) => sum + c.kpis.profitMargin, 0) / studentCompanies.length).toFixed(1) + '%')
                  : 'N/A'}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-800/50 border-violet-500/20">
              <CardHeader>
                <CardTitle className="text-white">
                  {t('business.performance_ranking', { defaultValue: 'Ranking de Rendimiento' })}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {t('business.ranking_description', { defaultValue: 'Ordenado por utilidad neta' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rankingData.slice(0, 10).map((company) => (
                    <div
                      key={company.studentName}
                      className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          company.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                          company.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                          company.rank === 3 ? 'bg-amber-700/20 text-amber-600' :
                          'bg-slate-700/20 text-slate-400'
                        }`}>
                          {company.rank}
                        </div>
                        <div>
                          <p className="text-white font-medium">{company.companyName}</p>
                          <p className="text-xs text-slate-400">{company.studentName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${company.kpis.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${company.kpis.netProfit.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-400">
                          {company.kpis.profitMargin.toFixed(1)}% margen
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {rankingData.length === 0 && (
                  <p className="text-center text-slate-400 py-8">
                    {t('business.no_data', { defaultValue: 'No hay datos disponibles aún' })}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-violet-500/20">
              <CardHeader>
                <CardTitle className="text-white">
                  {t('business.company_comparison', { defaultValue: 'Comparación de Empresas' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #8B5CF6' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Bar dataKey="profit" fill="#10B981" name="Utilidad" />
                    <Bar dataKey="employees" fill="#8B5CF6" name="Empleados" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-800/50 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-white">
                {t('business.detailed_overview', { defaultValue: 'Vista Detallada' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-400">{t('business.student', { defaultValue: 'Estudiante' })}</TableHead>
                      <TableHead className="text-slate-400">{t('business.company', { defaultValue: 'Empresa' })}</TableHead>
                      <TableHead className="text-slate-400 text-right">{t('business.cash', { defaultValue: 'Efectivo' })}</TableHead>
                      <TableHead className="text-slate-400 text-right">{t('business.profit', { defaultValue: 'Utilidad' })}</TableHead>
                      <TableHead className="text-slate-400 text-right">{t('business.employees', { defaultValue: 'Empleados' })}</TableHead>
                      <TableHead className="text-slate-400 text-right">{t('business.debt', { defaultValue: 'Deuda' })}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentCompanies.map((company) => (
                      <TableRow key={company.studentName} className="border-slate-700/50">
                        <TableCell className="text-white">{company.studentName}</TableCell>
                        <TableCell className="text-slate-300">{company.companyName}</TableCell>
                        <TableCell className="text-right text-emerald-400">${company.kpis.cash.toLocaleString()}</TableCell>
                        <TableCell className={`text-right font-semibold ${company.kpis.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${company.kpis.netProfit.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-blue-400">{company.kpis.employeeCount}</TableCell>
                        <TableCell className="text-right text-orange-400">${company.kpis.totalDebt.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {studentCompanies.length === 0 && (
                  <p className="text-center text-slate-400 py-8">
                    {t('business.no_companies', { defaultValue: 'Los estudiantes aún no han creado empresas' })}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={showScenarioDialog} onOpenChange={setShowScenarioDialog}>
        <DialogContent className="bg-slate-800 border-violet-500/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {t('business.create_scenario', { defaultValue: 'Crear Escenario' })}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {t('business.scenario_description', { defaultValue: 'Crea un escenario de decisión para tus estudiantes' })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-slate-200">
                {t('business.title', { defaultValue: 'Título' })} *
              </Label>
              <Input
                id="title"
                value={scenarioData.title}
                onChange={(e) => setScenarioData({ ...scenarioData, title: e.target.value })}
                className="bg-slate-900/50 border-violet-500/20 text-white"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-slate-200">
                  {t('business.category', { defaultValue: 'Categoría' })} *
                </Label>
                <Select 
                  value={scenarioData.category} 
                  onValueChange={(value) => setScenarioData({ ...scenarioData, category: value })}
                >
                  <SelectTrigger className="bg-slate-900/50 border-violet-500/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-violet-500/20">
                    <SelectItem value="opportunity" className="text-white">Oportunidad</SelectItem>
                    <SelectItem value="crisis" className="text-white">Crisis</SelectItem>
                    <SelectItem value="challenge" className="text-white">Reto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty" className="text-slate-200">
                  {t('business.difficulty', { defaultValue: 'Dificultad' })} *
                </Label>
                <Select 
                  value={scenarioData.difficulty} 
                  onValueChange={(value) => setScenarioData({ ...scenarioData, difficulty: value })}
                >
                  <SelectTrigger className="bg-slate-900/50 border-violet-500/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-violet-500/20">
                    <SelectItem value="easy" className="text-white">Fácil</SelectItem>
                    <SelectItem value="medium" className="text-white">Medio</SelectItem>
                    <SelectItem value="hard" className="text-white">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-slate-200">
                {t('business.description', { defaultValue: 'Descripción' })} *
              </Label>
              <Textarea
                id="description"
                value={scenarioData.description}
                onChange={(e) => setScenarioData({ ...scenarioData, description: e.target.value })}
                className="bg-slate-900/50 border-violet-500/20 text-white min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="context" className="text-slate-200">
                {t('business.context', { defaultValue: 'Contexto' })}
              </Label>
              <Textarea
                id="context"
                value={scenarioData.context}
                onChange={(e) => setScenarioData({ ...scenarioData, context: e.target.value })}
                className="bg-slate-900/50 border-violet-500/20 text-white min-h-[80px]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowScenarioDialog(false)}>
                {t('common.cancel', { defaultValue: 'Cancelar' })}
              </Button>
              <Button onClick={handleCreateScenario} className="bg-violet-600 hover:bg-violet-700">
                {t('common.create', { defaultValue: 'Crear' })}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showMarketDialog} onOpenChange={setShowMarketDialog}>
        <DialogContent className="bg-slate-800 border-violet-500/20">
          <DialogHeader>
            <DialogTitle className="text-white">
              {t('business.market_conditions', { defaultValue: 'Condiciones de Mercado' })}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {t('business.market_description', { defaultValue: 'Ajusta los parámetros del mercado simulado' })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="interest" className="text-slate-200">
                {t('business.interest_rate', { defaultValue: 'Tasa de Interés' })} (%)
              </Label>
              <Input
                id="interest"
                type="number"
                value={marketData.interestRate}
                onChange={(e) => setMarketData({ ...marketData, interestRate: parseFloat(e.target.value) || 0 })}
                className="bg-slate-900/50 border-violet-500/20 text-white"
                step="0.1"
              />
            </div>

            <div>
              <Label htmlFor="growth" className="text-slate-200">
                {t('business.economic_growth', { defaultValue: 'Crecimiento Económico' })} (%)
              </Label>
              <Input
                id="growth"
                type="number"
                value={marketData.economicGrowth}
                onChange={(e) => setMarketData({ ...marketData, economicGrowth: parseFloat(e.target.value) || 0 })}
                className="bg-slate-900/50 border-violet-500/20 text-white"
                step="0.1"
              />
            </div>

            <div>
              <Label htmlFor="inflation" className="text-slate-200">
                {t('business.inflation_rate', { defaultValue: 'Tasa de Inflación' })} (%)
              </Label>
              <Input
                id="inflation"
                type="number"
                value={marketData.inflationRate}
                onChange={(e) => setMarketData({ ...marketData, inflationRate: parseFloat(e.target.value) || 0 })}
                className="bg-slate-900/50 border-violet-500/20 text-white"
                step="0.1"
              />
            </div>

            <div>
              <Label htmlFor="demand" className="text-slate-200">
                {t('business.market_demand', { defaultValue: 'Demanda de Mercado' })}
              </Label>
              <Select 
                value={marketData.marketDemand} 
                onValueChange={(value) => setMarketData({ ...marketData, marketDemand: value })}
              >
                <SelectTrigger className="bg-slate-900/50 border-violet-500/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-violet-500/20">
                  <SelectItem value="low" className="text-white">Baja</SelectItem>
                  <SelectItem value="normal" className="text-white">Normal</SelectItem>
                  <SelectItem value="high" className="text-white">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowMarketDialog(false)}>
                {t('common.cancel', { defaultValue: 'Cancelar' })}
              </Button>
              <Button onClick={handleUpdateMarket} className="bg-violet-600 hover:bg-violet-700">
                {t('common.save', { defaultValue: 'Guardar' })}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherDashboard;
