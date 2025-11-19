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
import { COMPANY_TYPES, INDUSTRIES, SAMPLE_COMPANIES } from '@/lib/business-data';
import { Building2, Sparkles, DollarSign } from 'lucide-react';

const CompanyBuilder = () => {
  const { user, createCompany } = useBusinessContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [companyData, setCompanyData] = useState({
    name: '',
    type: 'SAS',
    industry: 'technology',
    initialCapital: 100000,
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = createCompany(companyData);
    if (success) {
      navigate('/business/dashboard');
    }
  };

  const loadTemplate = (template) => {
    setCompanyData({
      name: template.name,
      type: template.type,
      industry: template.industry,
      initialCapital: template.initialCapital,
      description: template.description,
    });
  };

  if (user?.role === 'teacher') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-violet-500/20 max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white mb-2">
              {t('business.teacher_no_company', { defaultValue: 'Acceso Solo para Estudiantes' })}
            </CardTitle>
            <CardDescription className="text-slate-300">
              {t('business.teacher_no_company_desc', { 
                defaultValue: 'Los profesores pueden ver y monitorear las empresas de los estudiantes, pero no pueden crear su propia empresa.'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/business/teacher')}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600"
            >
              {t('business.go_to_teacher_dashboard', { defaultValue: 'Ir al Panel de Profesor' })}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.company) {
    navigate('/business/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-violet-500/20">
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center border-2 border-violet-500/30">
                <Building2 className="h-10 w-10 text-violet-400" />
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2">
                {t('business.create_company', { defaultValue: 'Crear Tu Empresa' })}
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                {t('business.create_company_description', { 
                  defaultValue: 'Define tu empresa virtual y comienza tu simulación empresarial' 
                })}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-violet-400 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  {t('business.templates', { defaultValue: 'Plantillas de Empresa' })}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {SAMPLE_COMPANIES.map((template) => (
                    <Card
                      key={template.name}
                      className="bg-slate-900/50 border-violet-500/20 cursor-pointer hover:border-violet-500/40 transition-all"
                      onClick={() => loadTemplate(template)}
                    >
                      <CardHeader>
                        <CardTitle className="text-sm text-slate-200">{template.name}</CardTitle>
                        <CardDescription className="text-xs">{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-xs text-slate-400">
                        {template.type} • {INDUSTRIES.find(i => i.value === template.industry)?.label} • ${template.initialCapital.toLocaleString()}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-200">
                      {t('business.company_name', { defaultValue: 'Nombre de la Empresa' })} *
                    </Label>
                    <Input
                      id="name"
                      value={companyData.name}
                      onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                      placeholder="Ej: TechStart Inc."
                      className="bg-slate-900/50 border-violet-500/20 text-white"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type" className="text-slate-200">
                        {t('business.company_type', { defaultValue: 'Tipo de Empresa' })} *
                      </Label>
                      <Select 
                        value={companyData.type} 
                        onValueChange={(value) => setCompanyData({ ...companyData, type: value })}
                      >
                        <SelectTrigger className="bg-slate-900/50 border-violet-500/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-violet-500/20">
                          {COMPANY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="text-white">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="industry" className="text-slate-200">
                        {t('business.industry', { defaultValue: 'Industria' })} *
                      </Label>
                      <Select 
                        value={companyData.industry} 
                        onValueChange={(value) => setCompanyData({ ...companyData, industry: value })}
                      >
                        <SelectTrigger className="bg-slate-900/50 border-violet-500/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-violet-500/20">
                          {INDUSTRIES.map((industry) => (
                            <SelectItem key={industry.value} value={industry.value} className="text-white">
                              {industry.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="capital" className="text-slate-200 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {t('business.initial_capital', { defaultValue: 'Capital Inicial' })} *
                    </Label>
                    <Input
                      id="capital"
                      type="number"
                      value={companyData.initialCapital}
                      onChange={(e) => setCompanyData({ ...companyData, initialCapital: parseInt(e.target.value) || 0 })}
                      min="10000"
                      step="10000"
                      className="bg-slate-900/50 border-violet-500/20 text-white"
                      required
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      ${companyData.initialCapital.toLocaleString()} USD
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-slate-200">
                      {t('business.description', { defaultValue: 'Descripción' })}
                    </Label>
                    <Textarea
                      id="description"
                      value={companyData.description}
                      onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                      placeholder={t('business.description_placeholder', { 
                        defaultValue: 'Describe brevemente el giro de negocio de tu empresa...' 
                      })}
                      className="bg-slate-900/50 border-violet-500/20 text-white min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/business/dashboard')}
                    className="flex-1"
                  >
                    {t('common.cancel', { defaultValue: 'Cancelar' })}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                  >
                    {t('business.create_company_button', { defaultValue: 'Crear Empresa' })}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyBuilder;
