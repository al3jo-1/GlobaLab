import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { calculateCompanyKPIs } from '@/lib/business-data';
import { 
  Building2, Users, DollarSign, TrendingUp, TrendingDown,
  Briefcase, CreditCard, Brain, ArrowLeft, Settings, Home
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import LanguageSelector from '@/components/LanguageSelector';

const BusinessDashboard = () => {
  const { user, currentRoom } = useBusinessContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (user?.role === 'teacher') {
      navigate('/business/teacher');
    }
  }, [user, navigate]);

  if (!user?.company) {
    navigate('/business/company');
    return null;
  }

  const kpis = calculateCompanyKPIs(user.company);

  const revenueData = user.company.revenue?.slice(-12).map((item, index) => ({
    month: `Mes ${index + 1}`,
    revenue: item.amount,
  })) || [];

  const financialData = [
    { name: t('business.revenue', { defaultValue: 'Ingresos' }), value: kpis.monthlyRevenue },
    { name: t('business.expenses', { defaultValue: 'Gastos' }), value: kpis.monthlyExpenses },
    { name: t('business.profit', { defaultValue: 'Utilidad' }), value: kpis.netProfit },
  ];

  const KPICard = ({ title, value, icon: Icon, trend, color = 'violet' }) => (
    <Card className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-${color}-500/20`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
        <Icon className={`h-5 w-5 text-${color}-400 light:text-${color}-700`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold business-text">
          {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-sm mt-1 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen business-bg">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-violet-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg business-icon-bg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold business-text">{user.company.name}</h1>
                <p className="text-xs text-slate-400">{currentRoom?.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/business/rooms')}
              className="text-slate-300 hover:text-white"
            >
              <Home className="h-5 w-5 mr-2" />
              {t('business.back_to_rooms', { defaultValue: 'Volver a Salas' })}
            </Button>
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/business/company')}
              className="text-slate-300 hover:text-white"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <KPICard
            title={t('business.cash_balance', { defaultValue: 'Efectivo' })}
            value={kpis.cash}
            icon={DollarSign}
            color="emerald"
          />
          <KPICard
            title={t('business.monthly_revenue', { defaultValue: 'Ingresos Mensuales' })}
            value={kpis.monthlyRevenue}
            icon={TrendingUp}
            trend={5.2}
            color="blue"
          />
          <KPICard
            title={t('business.net_profit', { defaultValue: 'Utilidad Neta' })}
            value={kpis.netProfit}
            icon={TrendingUp}
            trend={kpis.profitMargin}
            color={kpis.netProfit >= 0 ? 'green' : 'red'}
          />
          <KPICard
            title={t('business.employees', { defaultValue: 'Empleados' })}
            value={kpis.employeeCount}
            icon={Users}
            color="violet"
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-800/50 border-violet-500/20">
              <CardHeader>
                <CardTitle className="business-text">
                  {t('business.revenue_trend', { defaultValue: 'Tendencia de Ingresos' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #8B5CF6' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
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
                <CardTitle className="business-text">
                  {t('business.financial_overview', { defaultValue: 'Resumen Financiero' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #8B5CF6' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Bar dataKey="value" fill="#8B5CF6" />
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
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Button
            onClick={() => navigate('/business/workforce')}
            className="h-24 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 hover:border-blue-500/50 business-text flex-col"
            variant="outline"
          >
            <Users className="h-8 w-8 mb-2 text-blue-400 light:text-blue-700" />
            <span>{t('business.manage_workforce', { defaultValue: 'Gestionar Personal' })}</span>
          </Button>

          <Button
            onClick={() => navigate('/business/loans')}
            className="h-24 business-card-success business-text flex-col"
            variant="outline"
          >
            <CreditCard className="h-8 w-8 mb-2 text-emerald-400 light:text-emerald-700" />
            <span>{t('business.loan_simulator', { defaultValue: 'Simulador de Préstamos' })}</span>
          </Button>

          <Button
            onClick={() => navigate('/business/decisions')}
            className="h-24 business-card-info business-text flex-col"
            variant="outline"
          >
            <Brain className="h-8 w-8 mb-2 business-text-muted" />
            <span>{t('business.decision_center', { defaultValue: 'Centro de Decisiones' })}</span>
          </Button>

          {user.role === 'teacher' && (
            <Button
              onClick={() => navigate('/business/teacher')}
              className="h-24 bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 hover:border-amber-500/50 business-text flex-col"
              variant="outline"
            >
              <Briefcase className="h-8 w-8 mb-2 text-amber-400 light:text-amber-700" />
              <span>{t('business.teacher_panel', { defaultValue: 'Panel Docente' })}</span>
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
