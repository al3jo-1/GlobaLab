import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const CaseCard = ({ caseData, onSelect, showStatus = false, status = 'pending' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getStatusBadge = () => {
    const statusConfig = {
      pending: { label: t('accounting.pending', { defaultValue: 'Pendiente' }), className: 'bg-amber-500/20 border-amber-500/50 text-amber-400 light:text-amber-700' },
      in_progress: { label: t('accounting.in_progress', { defaultValue: 'En Progreso' }), className: 'bg-teal-500/20 border-teal-500/50 text-teal-400 light:text-teal-700' },
      completed: { label: t('accounting.completed', { defaultValue: 'Completado' }), className: 'bg-emerald-500/20 border-emerald-500/50 accounting-text-muted' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-emerald-500/20 hover:border-emerald-500/40 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg accounting-card-bg flex items-center justify-center border border-emerald-500/30">
              <Building2 className="h-5 w-5 accounting-text-muted" />
            </div>
            <div>
              <CardTitle className="text-lg accounting-text">{caseData.companyName}</CardTitle>
              <CardDescription className="text-sm text-slate-400">{caseData.industry}</CardDescription>
            </div>
          </div>
          {showStatus && getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{caseData.description}</p>
        
        <div className="flex items-center space-x-4 text-xs text-slate-400">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{caseData.year}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="h-3 w-3" />
            <span>ID: {caseData.id}</span>
          </div>
        </div>

        {onSelect && (
          <Button 
            onClick={() => onSelect(caseData)}
            className="w-full accounting-btn"
          >
            {t('accounting.analyze_case', { defaultValue: 'Analizar Caso' })}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CaseCard;
