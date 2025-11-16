import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { calculateLoanAmortization } from '@/lib/business-data';
import { CreditCard, DollarSign, TrendingUp, ArrowLeft, Calculator, Clock, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

const LoanSimulator = () => {
  const { user, requestLoan, makeLoanPayment } = useBusinessContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showAmortizationDialog, setShowAmortizationDialog] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loanData, setLoanData] = useState({
    amount: 50000,
    interestRate: 8.5,
    term: 24,
    purpose: '',
  });

  if (!user?.company) {
    navigate('/business/dashboard');
    return null;
  }

  const loans = user.company.loans || [];
  const activeLoans = loans.filter(l => l.status === 'active');
  const totalDebt = activeLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
  const monthlyPayments = activeLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);

  const handleRequestLoan = () => {
    if (loanData.amount > 0 && loanData.term > 0) {
      requestLoan(loanData);
      setShowRequestDialog(false);
      setLoanData({
        amount: 50000,
        interestRate: 8.5,
        term: 24,
        purpose: '',
      });
    }
  };

  const handleMakePayment = (loanId) => {
    makeLoanPayment(loanId);
  };

  const viewAmortization = (loan) => {
    setSelectedLoan(loan);
    setShowAmortizationDialog(true);
  };

  const amortization = loanData.amount > 0 && loanData.term > 0 
    ? calculateLoanAmortization(loanData.amount, loanData.interestRate, loanData.term)
    : null;

  const previewAmortization = selectedLoan
    ? calculateLoanAmortization(selectedLoan.amount, selectedLoan.interestRate, selectedLoan.term)
    : null;

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
              <CreditCard className="h-6 w-6 text-violet-400" />
              <h1 className="text-xl font-bold text-white">
                {t('business.loan_simulator', { defaultValue: 'Simulador de Préstamos' })}
              </h1>
            </div>
          </div>
          <Button
            onClick={() => setShowRequestDialog(true)}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
          >
            <DollarSign className="mr-2 h-5 w-5" />
            {t('business.request_loan', { defaultValue: 'Solicitar Préstamo' })}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-4"
        >
          <Card className="bg-slate-800/50 border-violet-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {t('business.total_debt', { defaultValue: 'Deuda Total' })}
              </CardTitle>
              <CreditCard className="h-5 w-5 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${totalDebt.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-violet-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {t('business.monthly_payments', { defaultValue: 'Pagos Mensuales' })}
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${monthlyPayments.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-violet-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {t('business.active_loans', { defaultValue: 'Préstamos Activos' })}
              </CardTitle>
              <Calculator className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeLoans.length}</div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          {loans.length > 0 ? (
            loans.map((loan, index) => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-violet-500/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center">
                          {t('business.loan', { defaultValue: 'Préstamo' })} - ${loan.amount.toLocaleString()}
                          {loan.status === 'paid' && (
                            <span className="ml-3 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                              {t('business.paid', { defaultValue: 'Pagado' })}
                            </span>
                          )}
                          {loan.status === 'active' && (
                            <span className="ml-3 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                              {t('business.active', { defaultValue: 'Activo' })}
                            </span>
                          )}
                        </CardTitle>
                        <p className="text-sm text-slate-400 mt-1">
                          {loan.interestRate}% • {loan.term} {t('business.months', { defaultValue: 'meses' })}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">{t('business.monthly_payment', { defaultValue: 'Pago Mensual' })}</p>
                        <p className="text-white font-semibold">${loan.monthlyPayment.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">{t('business.remaining_balance', { defaultValue: 'Saldo Restante' })}</p>
                        <p className="text-white font-semibold">${loan.remainingBalance.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">{t('business.payments_made', { defaultValue: 'Pagos Realizados' })}</p>
                        <p className="text-white font-semibold">{loan.paymentsMade} / {loan.term}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">{t('business.progress', { defaultValue: 'Progreso' })}</p>
                        <Progress value={(loan.paymentsMade / loan.term) * 100} className="h-2 mt-1" />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {loan.status === 'active' && (
                        <Button
                          onClick={() => handleMakePayment(loan.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          {t('business.make_payment', { defaultValue: 'Hacer Pago' })}
                        </Button>
                      )}
                      <Button
                        onClick={() => viewAmortization(loan)}
                        size="sm"
                        variant="outline"
                      >
                        <Calculator className="mr-2 h-4 w-4" />
                        {t('business.view_amortization', { defaultValue: 'Ver Amortización' })}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="bg-slate-800/50 border-violet-500/20">
              <CardContent className="py-12 text-center">
                <CreditCard className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-4">
                  {t('business.no_loans', { defaultValue: 'No tienes préstamos activos' })}
                </p>
                <Button
                  onClick={() => setShowRequestDialog(true)}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                >
                  <DollarSign className="mr-2 h-5 w-5" />
                  {t('business.request_first_loan', { defaultValue: 'Solicitar Primer Préstamo' })}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="bg-slate-800 border-violet-500/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {t('business.request_loan', { defaultValue: 'Solicitar Préstamo' })}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {t('business.request_loan_description', { defaultValue: 'Configura los términos de tu préstamo' })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="amount" className="text-slate-200">
                  {t('business.loan_amount', { defaultValue: 'Monto del Préstamo' })} *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={loanData.amount}
                  onChange={(e) => setLoanData({ ...loanData, amount: parseInt(e.target.value) || 0 })}
                  className="bg-slate-900/50 border-violet-500/20 text-white"
                  min="1000"
                  step="1000"
                />
              </div>

              <div>
                <Label htmlFor="rate" className="text-slate-200">
                  {t('business.interest_rate', { defaultValue: 'Tasa de Interés' })} (%)
                </Label>
                <Input
                  id="rate"
                  type="number"
                  value={loanData.interestRate}
                  onChange={(e) => setLoanData({ ...loanData, interestRate: parseFloat(e.target.value) || 0 })}
                  className="bg-slate-900/50 border-violet-500/20 text-white"
                  step="0.1"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="term" className="text-slate-200">
                  {t('business.term_months', { defaultValue: 'Plazo (meses)' })} *
                </Label>
                <Input
                  id="term"
                  type="number"
                  value={loanData.term}
                  onChange={(e) => setLoanData({ ...loanData, term: parseInt(e.target.value) || 0 })}
                  className="bg-slate-900/50 border-violet-500/20 text-white"
                  min="6"
                  max="60"
                />
              </div>
            </div>

            {amortization && (
              <Card className="bg-slate-900/50 border-violet-500/20">
                <CardHeader>
                  <CardTitle className="text-sm text-violet-400">
                    {t('business.loan_summary', { defaultValue: 'Resumen del Préstamo' })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">{t('business.monthly_payment', { defaultValue: 'Pago Mensual' })}</p>
                    <p className="text-white font-semibold text-lg">${amortization.monthlyPayment.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">{t('business.total_payment', { defaultValue: 'Pago Total' })}</p>
                    <p className="text-white font-semibold">${amortization.totalPayment.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">{t('business.total_interest', { defaultValue: 'Interés Total' })}</p>
                    <p className="text-orange-400 font-semibold">${amortization.totalInterest.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {user.company.cash < (amortization?.monthlyPayment || 0) && (
              <div className="flex items-start space-x-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-400">
                  {t('business.payment_warning', { 
                    defaultValue: 'Advertencia: Tu efectivo actual podría no ser suficiente para el pago mensual.' 
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                {t('common.cancel', { defaultValue: 'Cancelar' })}
              </Button>
              <Button onClick={handleRequestLoan} className="bg-violet-600 hover:bg-violet-700">
                {t('business.request', { defaultValue: 'Solicitar' })}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAmortizationDialog} onOpenChange={setShowAmortizationDialog}>
        <DialogContent className="bg-slate-800 border-violet-500/20 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {t('business.amortization_schedule', { defaultValue: 'Tabla de Amortización' })}
            </DialogTitle>
          </DialogHeader>
          {previewAmortization && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 px-4 text-slate-400">
                        {t('business.month', { defaultValue: 'Mes' })}
                      </th>
                      <th className="text-right py-2 px-4 text-slate-400">
                        {t('business.payment', { defaultValue: 'Pago' })}
                      </th>
                      <th className="text-right py-2 px-4 text-slate-400">
                        {t('business.principal', { defaultValue: 'Capital' })}
                      </th>
                      <th className="text-right py-2 px-4 text-slate-400">
                        {t('business.interest', { defaultValue: 'Interés' })}
                      </th>
                      <th className="text-right py-2 px-4 text-slate-400">
                        {t('business.balance', { defaultValue: 'Saldo' })}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewAmortization.schedule.map((row) => (
                      <tr key={row.month} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-2 px-4 text-white">{row.month}</td>
                        <td className="py-2 px-4 text-right text-white">${row.payment.toFixed(2)}</td>
                        <td className="py-2 px-4 text-right text-blue-400">${row.principal.toFixed(2)}</td>
                        <td className="py-2 px-4 text-right text-orange-400">${row.interest.toFixed(2)}</td>
                        <td className="py-2 px-4 text-right text-slate-300">${row.balance.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoanSimulator;
