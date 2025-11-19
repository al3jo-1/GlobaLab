import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { Save, FileText } from 'lucide-react';

const AnalysisForm = ({ caseData, ratios, onSave }) => {
  const { t } = useTranslation();
  const [analysis, setAnalysis] = useState({
    liquidityAnalysis: '',
    profitabilityAnalysis: '',
    leverageAnalysis: '',
    efficiencyAnalysis: '',
    overallConclusion: '',
    recommendations: '',
  });

  const handleChange = (field, value) => {
    setAnalysis(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSave({
      ...analysis,
      ratios,
      timestamp: Date.now(),
    });
  };

  const isFormComplete = () => {
    return Object.values(analysis).every(value => value.trim().length > 0);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-emerald-500/20">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 accounting-text-muted" />
          <div>
            <CardTitle className="text-xl accounting-text">
              {t('accounting.financial_analysis', { defaultValue: 'Análisis Financiero' })}
            </CardTitle>
            <CardDescription>
              {caseData.companyName} - {t('accounting.complete_analysis', { defaultValue: 'Completa tu análisis' })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="liquidity" className="accounting-text-muted">
            {t('accounting.liquidity_analysis', { defaultValue: 'Análisis de Liquidez' })}
          </Label>
          <Textarea
            id="liquidity"
            placeholder={t('accounting.liquidity_placeholder', { 
              defaultValue: 'Analiza los ratios de liquidez, capacidad de pago a corto plazo...' 
            })}
            value={analysis.liquidityAnalysis}
            onChange={(e) => handleChange('liquidityAnalysis', e.target.value)}
            className="min-h-24 bg-slate-900/50 border-emerald-500/20 focus:border-emerald-500/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profitability" className="accounting-text-muted">
            {t('accounting.profitability_analysis', { defaultValue: 'Análisis de Rentabilidad' })}
          </Label>
          <Textarea
            id="profitability"
            placeholder={t('accounting.profitability_placeholder', { 
              defaultValue: 'Evalúa los márgenes, ROE, ROA y la eficiencia en generar utilidades...' 
            })}
            value={analysis.profitabilityAnalysis}
            onChange={(e) => handleChange('profitabilityAnalysis', e.target.value)}
            className="min-h-24 bg-slate-900/50 border-emerald-500/20 focus:border-emerald-500/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="leverage" className="accounting-text-muted">
            {t('accounting.leverage_analysis', { defaultValue: 'Análisis de Endeudamiento' })}
          </Label>
          <Textarea
            id="leverage"
            placeholder={t('accounting.leverage_placeholder', { 
              defaultValue: 'Examina el nivel de deuda, estructura de capital y riesgo financiero...' 
            })}
            value={analysis.leverageAnalysis}
            onChange={(e) => handleChange('leverageAnalysis', e.target.value)}
            className="min-h-24 bg-slate-900/50 border-emerald-500/20 focus:border-emerald-500/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="efficiency" className="accounting-text-muted">
            {t('accounting.efficiency_analysis', { defaultValue: 'Análisis de Eficiencia' })}
          </Label>
          <Textarea
            id="efficiency"
            placeholder={t('accounting.efficiency_placeholder', { 
              defaultValue: 'Analiza la rotación de activos, inventario y cuentas por cobrar...' 
            })}
            value={analysis.efficiencyAnalysis}
            onChange={(e) => handleChange('efficiencyAnalysis', e.target.value)}
            className="min-h-24 bg-slate-900/50 border-emerald-500/20 focus:border-emerald-500/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conclusion" className="accounting-text-muted">
            {t('accounting.overall_conclusion', { defaultValue: 'Conclusión General' })}
          </Label>
          <Textarea
            id="conclusion"
            placeholder={t('accounting.conclusion_placeholder', { 
              defaultValue: 'Resume la situación financiera general de la empresa...' 
            })}
            value={analysis.overallConclusion}
            onChange={(e) => handleChange('overallConclusion', e.target.value)}
            className="min-h-24 bg-slate-900/50 border-emerald-500/20 focus:border-emerald-500/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recommendations" className="accounting-text-muted">
            {t('accounting.recommendations', { defaultValue: 'Recomendaciones' })}
          </Label>
          <Textarea
            id="recommendations"
            placeholder={t('accounting.recommendations_placeholder', { 
              defaultValue: 'Proporciona recomendaciones estratégicas y de mejora...' 
            })}
            value={analysis.recommendations}
            onChange={(e) => handleChange('recommendations', e.target.value)}
            className="min-h-24 bg-slate-900/50 border-emerald-500/20 focus:border-emerald-500/40"
          />
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!isFormComplete()}
          className="w-full accounting-btn disabled:opacity-50"
        >
          <Save className="mr-2 h-5 w-5" />
          {t('accounting.save_analysis', { defaultValue: 'Guardar Análisis' })}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AnalysisForm;
