import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/accounting-data';
import { FileSpreadsheet, TrendingUp, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StatementViewer = ({ caseData }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('balance');

  const renderBalanceSheet = () => {
    const { balanceSheet } = caseData;
    const currentAssets = Object.values(balanceSheet.assets.current).reduce((a, b) => a + b, 0);
    const nonCurrentAssets = Object.values(balanceSheet.assets.nonCurrent).reduce((a, b) => a + b, 0);
    const totalAssets = currentAssets + nonCurrentAssets;
    
    const currentLiabilities = Object.values(balanceSheet.liabilities.current).reduce((a, b) => a + b, 0);
    const nonCurrentLiabilities = Object.values(balanceSheet.liabilities.nonCurrent).reduce((a, b) => a + b, 0);
    const totalLiabilities = currentLiabilities + nonCurrentLiabilities;
    
    const totalEquity = Object.values(balanceSheet.equity).reduce((a, b) => a + b, 0);

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
            <CardHeader>
              <CardTitle className="text-emerald-400">{t('accounting.assets', { defaultValue: 'Activos' })}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={2} className="font-semibold text-emerald-300">
                      {t('accounting.current_assets', { defaultValue: 'Activos Corrientes' })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">{t('accounting.cash', { defaultValue: 'Efectivo' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheet.assets.current.cash)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">{t('accounting.accounts_receivable', { defaultValue: 'Cuentas por Cobrar' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheet.assets.current.accountsReceivable)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">{t('accounting.inventory', { defaultValue: 'Inventario' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheet.assets.current.inventory)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">{t('accounting.prepaid_expenses', { defaultValue: 'Gastos Prepagados' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheet.assets.current.prepaidExpenses)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold border-t-2 border-emerald-500/30">
                    <TableCell className="pl-6">{t('accounting.total_current', { defaultValue: 'Total Corriente' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(currentAssets)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2} className="font-semibold text-emerald-300 pt-4">
                      {t('accounting.non_current_assets', { defaultValue: 'Activos No Corrientes' })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">{t('accounting.ppe', { defaultValue: 'Prop., Planta y Equipo' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheet.assets.nonCurrent.propertyPlantEquipment)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">{t('accounting.intangibles', { defaultValue: 'Intangibles' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheet.assets.nonCurrent.intangibleAssets)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">{t('accounting.long_term_investments', { defaultValue: 'Inversiones LP' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheet.assets.nonCurrent.longTermInvestments)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold border-t-2 border-emerald-500/30">
                    <TableCell className="pl-6">{t('accounting.total_non_current', { defaultValue: 'Total No Corriente' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(nonCurrentAssets)}</TableCell>
                  </TableRow>
                  <TableRow className="font-bold text-lg border-t-4 border-emerald-500/50">
                    <TableCell>{t('accounting.total_assets', { defaultValue: 'TOTAL ACTIVOS' })}</TableCell>
                    <TableCell className="text-right text-emerald-400">{formatCurrency(totalAssets)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">{t('accounting.liabilities_equity', { defaultValue: 'Pasivos y Patrimonio' })}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={2} className="font-semibold text-amber-300">
                      {t('accounting.current_liabilities', { defaultValue: 'Pasivos Corrientes' })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">{t('accounting.accounts_payable', { defaultValue: 'Cuentas por Pagar' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheet.liabilities.current.accountsPayable)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">{t('accounting.short_term_debt', { defaultValue: 'Deuda CP' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheet.liabilities.current.shortTermDebt)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">{t('accounting.accrued_expenses', { defaultValue: 'Gastos Acumulados' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheet.liabilities.current.accruedExpenses)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold border-t-2 border-amber-500/30">
                    <TableCell className="pl-6">{t('accounting.total_current', { defaultValue: 'Total Corriente' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(currentLiabilities)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2} className="font-semibold text-amber-300 pt-4">
                      {t('accounting.non_current_liabilities', { defaultValue: 'Pasivos No Corrientes' })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">{t('accounting.long_term_debt', { defaultValue: 'Deuda LP' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheet.liabilities.nonCurrent.longTermDebt)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">{t('accounting.deferred_tax', { defaultValue: 'Impuestos Diferidos' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheet.liabilities.nonCurrent.deferredTaxLiabilities)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold border-t-2 border-amber-500/30">
                    <TableCell className="pl-6">{t('accounting.total_non_current', { defaultValue: 'Total No Corriente' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(nonCurrentLiabilities)}</TableCell>
                  </TableRow>
                  <TableRow className="font-bold border-t-2 border-amber-500/30">
                    <TableCell>{t('accounting.total_liabilities', { defaultValue: 'Total Pasivos' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalLiabilities)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2} className="font-semibold text-blue-300 pt-4">
                      {t('accounting.equity', { defaultValue: 'Patrimonio' })}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">{t('accounting.common_stock', { defaultValue: 'Capital Social' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheet.equity.commonStock)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6">{t('accounting.retained_earnings', { defaultValue: 'Utilidades Retenidas' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(balanceSheet.equity.retainedEarnings)}</TableCell>
                  </TableRow>
                  <TableRow className="font-bold border-t-2 border-blue-500/30">
                    <TableCell>{t('accounting.total_equity', { defaultValue: 'Total Patrimonio' })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalEquity)}</TableCell>
                  </TableRow>
                  <TableRow className="font-bold text-lg border-t-4 border-amber-500/50">
                    <TableCell>{t('accounting.total_liabilities_equity', { defaultValue: 'TOTAL PASIVOS + PATRIMONIO' })}</TableCell>
                    <TableCell className="text-right text-amber-400">{formatCurrency(totalLiabilities + totalEquity)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderIncomeStatement = () => {
    const { incomeStatement } = caseData;
    const grossProfit = incomeStatement.revenue - incomeStatement.costOfGoodsSold;
    const operatingExpenses = Object.values(incomeStatement.operatingExpenses).reduce((a, b) => a + b, 0);
    const operatingIncome = grossProfit - operatingExpenses;
    const ebit = operatingIncome + incomeStatement.otherIncome;
    const ebt = ebit - incomeStatement.interestExpense;
    const netIncome = ebt - incomeStatement.taxExpense;

    return (
      <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-emerald-400">{t('accounting.income_statement', { defaultValue: 'Estado de Resultados' })}</CardTitle>
          <CardDescription>{caseData.companyName} - {caseData.year}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow className="font-semibold text-lg">
                <TableCell>{t('accounting.revenue', { defaultValue: 'Ingresos' })}</TableCell>
                <TableCell className="text-right text-emerald-400">{formatCurrency(incomeStatement.revenue)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">{t('accounting.cogs', { defaultValue: 'Costo de Ventas' })}</TableCell>
                <TableCell className="text-right text-red-400">({formatCurrency(incomeStatement.costOfGoodsSold)})</TableCell>
              </TableRow>
              <TableRow className="font-semibold border-t-2 border-emerald-500/30">
                <TableCell>{t('accounting.gross_profit', { defaultValue: 'Utilidad Bruta' })}</TableCell>
                <TableCell className="text-right">{formatCurrency(grossProfit)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} className="font-semibold text-amber-300 pt-4">
                  {t('accounting.operating_expenses', { defaultValue: 'Gastos Operacionales' })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">{t('accounting.selling_expenses', { defaultValue: 'Gastos de Ventas' })}</TableCell>
                <TableCell className="text-right text-red-400">({formatCurrency(incomeStatement.operatingExpenses.selling)})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">{t('accounting.administrative_expenses', { defaultValue: 'Gastos Administrativos' })}</TableCell>
                <TableCell className="text-right text-red-400">({formatCurrency(incomeStatement.operatingExpenses.administrative)})</TableCell>
              </TableRow>
              {incomeStatement.operatingExpenses.researchDevelopment > 0 && (
                <TableRow>
                  <TableCell className="pl-6">{t('accounting.rd_expenses', { defaultValue: 'Investigación y Desarrollo' })}</TableCell>
                  <TableCell className="text-right text-red-400">({formatCurrency(incomeStatement.operatingExpenses.researchDevelopment)})</TableCell>
                </TableRow>
              )}
              <TableRow className="font-semibold border-t-2 border-amber-500/30">
                <TableCell>{t('accounting.operating_income', { defaultValue: 'Utilidad Operacional' })}</TableCell>
                <TableCell className="text-right">{formatCurrency(operatingIncome)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">{t('accounting.other_income', { defaultValue: 'Otros Ingresos' })}</TableCell>
                <TableCell className="text-right text-emerald-400">{formatCurrency(incomeStatement.otherIncome)}</TableCell>
              </TableRow>
              <TableRow className="font-semibold border-t-2 border-emerald-500/30">
                <TableCell>{t('accounting.ebit', { defaultValue: 'EBIT' })}</TableCell>
                <TableCell className="text-right">{formatCurrency(ebit)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">{t('accounting.interest_expense', { defaultValue: 'Gastos Financieros' })}</TableCell>
                <TableCell className="text-right text-red-400">({formatCurrency(incomeStatement.interestExpense)})</TableCell>
              </TableRow>
              <TableRow className="font-semibold border-t-2 border-blue-500/30">
                <TableCell>{t('accounting.ebt', { defaultValue: 'EBT (Utilidad antes de Impuestos)' })}</TableCell>
                <TableCell className="text-right">{formatCurrency(ebt)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">{t('accounting.tax_expense', { defaultValue: 'Impuesto de Renta' })}</TableCell>
                <TableCell className="text-right text-red-400">({formatCurrency(incomeStatement.taxExpense)})</TableCell>
              </TableRow>
              <TableRow className="font-bold text-lg border-t-4 border-emerald-500/50">
                <TableCell>{t('accounting.net_income', { defaultValue: 'UTILIDAD NETA' })}</TableCell>
                <TableCell className="text-right text-emerald-400">{formatCurrency(netIncome)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  const renderCashFlowStatement = () => {
    const { cashFlowStatement } = caseData;
    
    const operatingCashFlow = Object.values(cashFlowStatement.operating).reduce((a, b) => a + b, 0);
    const investingCashFlow = Object.values(cashFlowStatement.investing).reduce((a, b) => a + b, 0);
    const financingCashFlow = Object.values(cashFlowStatement.financing).reduce((a, b) => a + b, 0);
    const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;

    return (
      <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-emerald-400">{t('accounting.cash_flow_statement', { defaultValue: 'Estado de Flujo de Efectivo' })}</CardTitle>
          <CardDescription>{caseData.companyName} - {caseData.year}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2} className="font-semibold text-emerald-300">
                  {t('accounting.operating_activities', { defaultValue: 'Actividades de Operación' })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">{t('accounting.net_income', { defaultValue: 'Utilidad Neta' })}</TableCell>
                <TableCell className="text-right">{formatCurrency(cashFlowStatement.operating.netIncome)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">{t('accounting.depreciation', { defaultValue: 'Depreciación y Amortización' })}</TableCell>
                <TableCell className="text-right">{formatCurrency(cashFlowStatement.operating.depreciation)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">{t('accounting.change_ar', { defaultValue: 'Cambio en Cuentas por Cobrar' })}</TableCell>
                <TableCell className="text-right">
                  {cashFlowStatement.operating.changeInAccountsReceivable >= 0 ? 
                    formatCurrency(cashFlowStatement.operating.changeInAccountsReceivable) : 
                    `(${formatCurrency(Math.abs(cashFlowStatement.operating.changeInAccountsReceivable))})`}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">{t('accounting.change_inventory', { defaultValue: 'Cambio en Inventario' })}</TableCell>
                <TableCell className="text-right">
                  {cashFlowStatement.operating.changeInInventory >= 0 ? 
                    formatCurrency(cashFlowStatement.operating.changeInInventory) : 
                    `(${formatCurrency(Math.abs(cashFlowStatement.operating.changeInInventory))})`}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">{t('accounting.change_ap', { defaultValue: 'Cambio en Cuentas por Pagar' })}</TableCell>
                <TableCell className="text-right">{formatCurrency(cashFlowStatement.operating.changeInAccountsPayable)}</TableCell>
              </TableRow>
              <TableRow className="font-semibold border-t-2 border-emerald-500/30">
                <TableCell>{t('accounting.net_operating_cash', { defaultValue: 'Efectivo Neto de Operación' })}</TableCell>
                <TableCell className="text-right text-emerald-400">{formatCurrency(operatingCashFlow)}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell colSpan={2} className="font-semibold text-blue-300 pt-4">
                  {t('accounting.investing_activities', { defaultValue: 'Actividades de Inversión' })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">{t('accounting.purchase_ppe', { defaultValue: 'Compra de PPE' })}</TableCell>
                <TableCell className="text-right text-red-400">({formatCurrency(Math.abs(cashFlowStatement.investing.purchaseOfPPE))})</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">{t('accounting.purchase_investments', { defaultValue: 'Compra de Inversiones' })}</TableCell>
                <TableCell className="text-right text-red-400">({formatCurrency(Math.abs(cashFlowStatement.investing.purchaseOfInvestments))})</TableCell>
              </TableRow>
              <TableRow className="font-semibold border-t-2 border-blue-500/30">
                <TableCell>{t('accounting.net_investing_cash', { defaultValue: 'Efectivo Neto de Inversión' })}</TableCell>
                <TableCell className="text-right text-red-400">({formatCurrency(Math.abs(investingCashFlow))})</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell colSpan={2} className="font-semibold text-amber-300 pt-4">
                  {t('accounting.financing_activities', { defaultValue: 'Actividades de Financiamiento' })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">{t('accounting.proceeds_debt', { defaultValue: 'Emisión de Deuda' })}</TableCell>
                <TableCell className="text-right">{formatCurrency(cashFlowStatement.financing.proceedsFromDebt)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">{t('accounting.dividends_paid', { defaultValue: 'Dividendos Pagados' })}</TableCell>
                <TableCell className="text-right text-red-400">({formatCurrency(Math.abs(cashFlowStatement.financing.dividendsPaid))})</TableCell>
              </TableRow>
              <TableRow className="font-semibold border-t-2 border-amber-500/30">
                <TableCell>{t('accounting.net_financing_cash', { defaultValue: 'Efectivo Neto de Financiamiento' })}</TableCell>
                <TableCell className="text-right">{formatCurrency(financingCashFlow)}</TableCell>
              </TableRow>
              
              <TableRow className="font-bold text-lg border-t-4 border-emerald-500/50">
                <TableCell>{t('accounting.net_change_cash', { defaultValue: 'CAMBIO NETO EN EFECTIVO' })}</TableCell>
                <TableCell className="text-right text-emerald-400">{formatCurrency(netCashFlow)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="balance" className="data-[state=active]:bg-emerald-500/20">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            {t('accounting.balance_sheet', { defaultValue: 'Balance' })}
          </TabsTrigger>
          <TabsTrigger value="income" className="data-[state=active]:bg-emerald-500/20">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('accounting.income_statement', { defaultValue: 'Resultados' })}
          </TabsTrigger>
          <TabsTrigger value="cashflow" className="data-[state=active]:bg-emerald-500/20">
            <DollarSign className="h-4 w-4 mr-2" />
            {t('accounting.cash_flow', { defaultValue: 'Flujo de Efectivo' })}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="balance" className="mt-6">
          {renderBalanceSheet()}
        </TabsContent>
        <TabsContent value="income" className="mt-6">
          {renderIncomeStatement()}
        </TabsContent>
        <TabsContent value="cashflow" className="mt-6">
          {renderCashFlowStatement()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatementViewer;
