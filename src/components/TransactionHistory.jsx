import React from 'react';
import { useTradingContext } from '@/contexts/TradingContext';
import { formatCurrency, formatDate } from '@/lib/market-data';
import { ArrowUpRight, ArrowDownRight, FileText, Image as ImageIcon } from 'lucide-react';

const TransactionHistory = ({ limit }) => {
  const { transactions, symbols, user } = useTradingContext();
  
  if (!transactions || transactions.length === 0) {
    return (
      <div className="glass-card rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Historial de Transacciones</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>No hay transacciones registradas.</p>
          <p className="text-sm mt-2">Tus operaciones aparecerán aquí.</p>
        </div>
      </div>
    );
  }
  
  const displayTransactions = limit ? transactions.slice().reverse().slice(0, limit) : transactions.slice().reverse();

  return (
    <div className="glass-card rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">
        {limit ? `Últimas ${limit} Transacciones` : 'Historial de Transacciones'}
      </h2>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {displayTransactions.map((transaction) => {
          const currentSymbolInfo = symbols.find(s => s.id === transaction.symbol);
          const currency = currentSymbolInfo ? currentSymbolInfo.currency : 'USD';
          
          const isBuy = transaction.type.includes('BUY');
          const isOpen = transaction.type.includes('OPEN');
          const isProfit = !isOpen && transaction.profitOrLoss >= 0;

          return (
            <div 
              key={transaction.id}
              className="border border-border rounded-md p-3"
            >
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{transaction.symbol}</span>
                    {isBuy ? (
                      <ArrowUpRight className="h-4 w-4 ml-1 text-success" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 ml-1 text-destructive" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isOpen ? 'Apertura' : 'Cierre'} ({isBuy ? 'Compra' : 'Venta'}) • {formatDate(transaction.date)}
                  </p>
                </div>
                <div className="text-right">
                  {isOpen ? (
                    <p className="font-medium">
                      {formatCurrency(transaction.amount, currency)}
                    </p>
                  ) : (
                    <p className={`font-medium ${isProfit ? 'price-up' : 'price-down'}`}>
                      {isProfit ? '+' : ''}{formatCurrency(transaction.profitOrLoss, currency)}
                    </p>
                  )}
                   <p className="text-xs text-muted-foreground">
                    {isOpen 
                      ? `Precio: ${formatCurrency(transaction.price, currency)}`
                      : `${formatCurrency(transaction.entryPrice, currency)} → ${formatCurrency(transaction.closePrice, currency)}`
                    }
                  </p>
                </div>
              </div>
              
              {transaction.justification && (
                <div className="text-xs mt-2 pt-2 border-t border-border/60">
                  <p className="flex items-center mb-0.5 text-muted-foreground"><FileText className="h-3 w-3 mr-1" /> Justificación:</p>
                  <p className="italic pl-1">{transaction.justification}</p>
                   {transaction.attachmentName && <p className="text-xs mt-1 flex items-center pl-1"><ImageIcon className="h-3 w-3 mr-1" /> Adjunto: {transaction.attachmentName}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionHistory;