import React from 'react';
import { useTradingContext } from '@/contexts/TradingContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import TransactionHistory from '@/components/TransactionHistory';
import { formatCurrency } from '@/lib/market-data';
import { motion } from 'framer-motion';

const StudentPortfolioPage = () => {
  const { user, transactions, positions, getCurrentPrice, initialSymbols } = useTradingContext();

  if (!user) {
    return <p>Cargando información del portafolio...</p>;
  }

  const initialBalance = user.initialBalance || 10000; // Assume 10000 if not set

  const openPositionsValue = positions.reduce((acc, pos) => {
    const currentPrice = getCurrentPrice(pos.symbol);
    const shares = pos.amount / pos.entryPrice; // Assuming amount is total value at entry
    const currentValue = shares * currentPrice;
    
    if (pos.type === 'BUY') {
      return acc + (currentValue - pos.amount); // Profit/Loss on current value vs entry value
    } else { // SELL
      return acc + (pos.amount - currentValue); // Profit/Loss on current value vs entry value (inverted for sell)
    }
  }, 0);

  const totalPortfolioValue = user.balance + openPositionsValue + positions.reduce((sum, p) => sum + p.amount, 0) ;
  const totalProfitOrLoss = totalPortfolioValue - initialBalance;
  const totalProfitOrLossPercentage = initialBalance !== 0 ? (totalProfitOrLoss / initialBalance) * 100 : 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <motion.div initial="hidden" animate="visible" variants={cardVariants}>
        <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight text-foreground mb-6">
          Mi Portafolio
        </motion.h1>

        <motion.div variants={cardVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <motion.div variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total del Portafolio</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalPortfolioValue, 'USD')}</div>
                <p className="text-xs text-muted-foreground">
                  Saldo + Valor de posiciones abiertas
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Disponible</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(user.balance, 'USD')}</div>
                <p className="text-xs text-muted-foreground">
                  Dinero disponible para operar
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ganancia/Pérdida Total</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalProfitOrLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(totalProfitOrLoss, 'USD')}
                </div>
                <p className={`text-xs ${totalProfitOrLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {totalProfitOrLossPercentage.toFixed(2)}% desde el inicio
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posiciones Abiertas</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{positions.length}</div>
                <p className="text-xs text-muted-foreground">
                  Número de operaciones activas
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="glass-card w-full">
          <CardHeader>
            <CardTitle>Historial Completo de Transacciones</CardTitle>
            <CardDescription>
              Todas tus operaciones registradas, ordenadas por fecha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full">
              <TransactionHistory limit={Infinity} showTitle={false} />
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StudentPortfolioPage;