import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAccountingContext } from '@/contexts/AccountingContext';
import { calculateRatios } from '@/lib/accounting-data';
import { Calculator, ArrowLeft, TrendingUp, DollarSign, Scale, Zap } from 'lucide-react';
import RatioCard from '@/components/accounting/RatioCard';
import AnalysisForm from '@/components/accounting/AnalysisForm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RatioCalculator = () => {
  const { user, currentRoom, saveAnalysis } = useAccountingContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const initialCase = location.state?.selectedCase;
  const assignedCases = user?.assignedCases || [];
  
  const [selectedCaseId, setSelectedCaseId] = useState(initialCase?.id || (assignedCases[0]?.id || null));
  const [activeTab, setActiveTab] = useState('liquidity');

  if (!user || !currentRoom) {
    navigate('/accounting/rooms');
    return null;
  }

  const selectedCase = assignedCases.find(c => c.id === selectedCaseId);
  const ratios = selectedCase ? calculateRatios(selectedCase) : null;

  const handleSaveAnalysis = (analysisData) => {
    if (selectedCase) {
      saveAnalysis(selectedCase.id, analysisData);
      navigate('/accounting/dashboard');
    }
  };

  const renderLiquidityRatios = () => {
    if (!ratios) return null;

    const chartData = [
      { name: t('accounting.current_ratio', { defaultValue: 'Razón Corriente' }), value: ratios.liquidity.currentRatio },
      { name: t('accounting.quick_ratio', { defaultValue: 'Prueba Ácida' }), value: ratios.liquidity.quickRatio },
      { name: t('accounting.cash_ratio', { defaultValue: 'Razón de Efectivo' }), value: ratios.liquidity.cashRatio },
    ];

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <RatioCard
            title={t('accounting.current_ratio', { defaultValue: 'Razón Corriente' })}
            value={ratios.liquidity.currentRatio}
            benchmark={2.0}
            description={t('accounting.current_ratio_desc', { defaultValue: 'Activos corrientes / Pasivos corrientes' })}
          />
          <RatioCard
            title={t('accounting.quick_ratio', { defaultValue: 'Prueba Ácida' })}
            value={ratios.liquidity.quickRatio}
            benchmark={1.0}
            description={t('accounting.quick_ratio_desc', { defaultValue: 'Activos líquidos / Pasivos corrientes' })}
          />
          <RatioCard
            title={t('accounting.cash_ratio', { defaultValue: 'Razón de Efectivo' })}
            value={ratios.liquidity.cashRatio}
            benchmark={0.5}
            description={t('accounting.cash_ratio_desc', { defaultValue: 'Efectivo / Pasivos corrientes' })}
          />
        </div>
        <Card className="accounting-chart-card">
          <CardHeader>
            <CardTitle className="accounting-text-muted">
              {t('accounting.liquidity_chart', { defaultValue: 'Gráfico de Liquidez' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #10b981' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="value" fill="#10b981" name={t('accounting.ratio', { defaultValue: 'Ratio' })} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderProfitabilityRatios = () => {
    if (!ratios) return null;

    const chartData = [
      { name: t('accounting.gross_margin', { defaultValue: 'Margen Bruto' }), value: ratios.profitability.grossMargin },
      { name: t('accounting.operating_margin', { defaultValue: 'Margen Operacional' }), value: ratios.profitability.operatingMargin },
      { name: t('accounting.net_margin', { defaultValue: 'Margen Neto' }), value: ratios.profitability.netMargin },
      { name: 'ROA', value: ratios.profitability.roa },
      { name: 'ROE', value: ratios.profitability.roe },
    ];

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          <RatioCard
            title={t('accounting.gross_margin', { defaultValue: 'Margen Bruto' })}
            value={ratios.profitability.grossMargin}
            benchmark={40}
            isPercentage={true}
            description={t('accounting.gross_margin_desc', { defaultValue: 'Utilidad bruta / Ingresos' })}
          />
          <RatioCard
            title={t('accounting.operating_margin', { defaultValue: 'Margen Operacional' })}
            value={ratios.profitability.operatingMargin}
            benchmark={15}
            isPercentage={true}
            description={t('accounting.operating_margin_desc', { defaultValue: 'EBIT / Ingresos' })}
          />
          <RatioCard
            title={t('accounting.net_margin', { defaultValue: 'Margen Neto' })}
            value={ratios.profitability.netMargin}
            benchmark={10}
            isPercentage={true}
            description={t('accounting.net_margin_desc', { defaultValue: 'Utilidad neta / Ingresos' })}
          />
          <RatioCard
            title="ROA"
            value={ratios.profitability.roa}
            benchmark={8}
            isPercentage={true}
            description={t('accounting.roa_desc', { defaultValue: 'Utilidad / Activos totales' })}
          />
          <RatioCard
            title="ROE"
            value={ratios.profitability.roe}
            benchmark={15}
            isPercentage={true}
            description={t('accounting.roe_desc', { defaultValue: 'Utilidad / Patrimonio' })}
          />
        </div>
        <Card className="accounting-chart-card">
          <CardHeader>
            <CardTitle className="accounting-text-muted">
              {t('accounting.profitability_chart', { defaultValue: 'Gráfico de Rentabilidad' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #10b981' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="value" fill="#10b981" name={t('accounting.percentage', { defaultValue: 'Porcentaje' })} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLeverageRatios = () => {
    if (!ratios) return null;

    const chartData = [
      { name: t('accounting.debt_to_equity', { defaultValue: 'Deuda/Patrimonio' }), value: ratios.leverage.debtToEquity },
      { name: t('accounting.debt_to_assets', { defaultValue: 'Deuda/Activos' }), value: ratios.leverage.debtToAssets },
      { name: t('accounting.equity_multiplier', { defaultValue: 'Multiplicador' }), value: ratios.leverage.equityMultiplier },
      { name: t('accounting.interest_coverage', { defaultValue: 'Cobertura Int.' }), value: ratios.leverage.interestCoverage },
    ];

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RatioCard
            title={t('accounting.debt_to_equity', { defaultValue: 'Deuda / Patrimonio' })}
            value={ratios.leverage.debtToEquity}
            benchmark={1.5}
            description={t('accounting.debt_to_equity_desc', { defaultValue: 'Pasivos / Patrimonio' })}
          />
          <RatioCard
            title={t('accounting.debt_to_assets', { defaultValue: 'Deuda / Activos' })}
            value={ratios.leverage.debtToAssets}
            benchmark={60}
            isPercentage={true}
            description={t('accounting.debt_to_assets_desc', { defaultValue: 'Pasivos / Activos' })}
          />
          <RatioCard
            title={t('accounting.equity_multiplier', { defaultValue: 'Multiplicador' })}
            value={ratios.leverage.equityMultiplier}
            benchmark={2.0}
            description={t('accounting.equity_multiplier_desc', { defaultValue: 'Activos / Patrimonio' })}
          />
          <RatioCard
            title={t('accounting.interest_coverage', { defaultValue: 'Cobertura Int.' })}
            value={ratios.leverage.interestCoverage}
            benchmark={5.0}
            description={t('accounting.interest_coverage_desc', { defaultValue: 'EBIT / Intereses' })}
          />
        </div>
        <Card className="accounting-chart-card">
          <CardHeader>
            <CardTitle className="accounting-text-muted">
              {t('accounting.leverage_chart', { defaultValue: 'Gráfico de Endeudamiento' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #10b981' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="value" fill="#f59e0b" name={t('accounting.ratio', { defaultValue: 'Ratio' })} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderEfficiencyRatios = () => {
    if (!ratios) return null;

    const chartData = [
      { name: t('accounting.asset_turnover', { defaultValue: 'Rotación Activos' }), value: ratios.efficiency.assetTurnover },
      { name: t('accounting.inventory_turnover', { defaultValue: 'Rotación Inventario' }), value: ratios.efficiency.inventoryTurnover },
      { name: t('accounting.receivables_turnover', { defaultValue: 'Rotación CxC' }), value: ratios.efficiency.receivablesTurnover },
    ];

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <RatioCard
            title={t('accounting.asset_turnover', { defaultValue: 'Rotación de Activos' })}
            value={ratios.efficiency.assetTurnover}
            benchmark={1.5}
            description={t('accounting.asset_turnover_desc', { defaultValue: 'Ventas / Activos totales' })}
          />
          <RatioCard
            title={t('accounting.inventory_turnover', { defaultValue: 'Rotación de Inventario' })}
            value={ratios.efficiency.inventoryTurnover}
            benchmark={6.0}
            description={t('accounting.inventory_turnover_desc', { defaultValue: 'Costo ventas / Inventario' })}
          />
          <RatioCard
            title={t('accounting.receivables_turnover', { defaultValue: 'Rotación CxC' })}
            value={ratios.efficiency.receivablesTurnover}
            benchmark={8.0}
            description={t('accounting.receivables_turnover_desc', { defaultValue: 'Ventas / Cuentas por cobrar' })}
          />
        </div>
        <Card className="accounting-chart-card">
          <CardHeader>
            <CardTitle className="accounting-text-muted">
              {t('accounting.efficiency_chart', { defaultValue: 'Gráfico de Eficiencia' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #10b981' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="value" fill="#14b8a6" name={t('accounting.times', { defaultValue: 'Veces' })} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  };

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
                {t('accounting.ratio_calculator', { defaultValue: 'Calculadora de Ratios' })}
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
              </CardHeader>
              <CardContent>
                {assignedCases.length > 0 ? (
                  <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
                    <SelectTrigger className="w-full accounting-input">
                      <SelectValue />
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
                    {t('accounting.no_assigned_cases', { defaultValue: 'No tienes casos asignados.' })}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {selectedCase && ratios && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="accounting-card mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl accounting-heading">{selectedCase.companyName}</CardTitle>
                  <CardDescription className="text-lg">
                    {t('accounting.financial_ratios_analysis', { defaultValue: 'Análisis de Ratios Financieros' })}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
                <TabsList className="grid w-full grid-cols-4 accounting-tabs">
                  <TabsTrigger value="liquidity" className="data-[state=active]:bg-emerald-500/20">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {t('accounting.liquidity', { defaultValue: 'Liquidez' })}
                  </TabsTrigger>
                  <TabsTrigger value="profitability" className="data-[state=active]:bg-emerald-500/20">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {t('accounting.profitability', { defaultValue: 'Rentabilidad' })}
                  </TabsTrigger>
                  <TabsTrigger value="leverage" className="data-[state=active]:bg-emerald-500/20">
                    <Scale className="h-4 w-4 mr-2" />
                    {t('accounting.leverage', { defaultValue: 'Endeudamiento' })}
                  </TabsTrigger>
                  <TabsTrigger value="efficiency" className="data-[state=active]:bg-emerald-500/20">
                    <Zap className="h-4 w-4 mr-2" />
                    {t('accounting.efficiency', { defaultValue: 'Eficiencia' })}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="liquidity" className="mt-6">
                  {renderLiquidityRatios()}
                </TabsContent>
                <TabsContent value="profitability" className="mt-6">
                  {renderProfitabilityRatios()}
                </TabsContent>
                <TabsContent value="leverage" className="mt-6">
                  {renderLeverageRatios()}
                </TabsContent>
                <TabsContent value="efficiency" className="mt-6">
                  {renderEfficiencyRatios()}
                </TabsContent>
              </Tabs>

              <AnalysisForm caseData={selectedCase} ratios={ratios} onSave={handleSaveAnalysis} />
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RatioCalculator;
