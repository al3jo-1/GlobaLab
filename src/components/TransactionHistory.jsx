import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTradingContext } from '@/contexts/TradingContext';
import { formatCurrency, formatDate } from '@/lib/market-data';
import { ArrowUpRight, ArrowDownRight, FileText, Image as ImageIcon } from 'lucide-react';

const TransactionHistory = ({ limit }) => {
  const { transactions, symbols, user } = useTradingContext();
  const { t } = useTranslation();
  
  if (!transactions || transactions.length === 0) {
    return (
      <div className="glass-card rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">{t('trading.history')}</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>{t('history.empty', { defaultValue: 'No transactions yet.' })}</p>
          <p className="text-sm mt-2">{t('history.hint', { defaultValue: 'Your trades will appear here.' })}</p>
        </div>
      </div>
    );
  }
  
  const displayTransactions = limit ? transactions.slice().reverse().slice(0, limit) : transactions.slice().reverse();

  return (
    <div className="glass-card rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">
        {limit ? t('history.latest', { count: limit, defaultValue: `Latest ${limit} transactions` }) : t('trading.history')}
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
                    {isOpen ? t('history.open', { defaultValue: 'Open' }) : t('history.close', { defaultValue: 'Close' })} ({isBuy ? t('trading.buy') : t('trading.sell')}) • {formatDate(transaction.date)}
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
                      ? `${t('trading.price')}: ${formatCurrency(transaction.price, currency)}`
                      : `${formatCurrency(transaction.entryPrice, currency)} → ${formatCurrency(transaction.closePrice, currency)}`
                    }
                  </p>
                </div>
              </div>
              
              {transaction.justification && (
                <div className="text-xs mt-2 pt-2 border-t border-border/60">
                  <p className="flex items-center mb-0.5 text-muted-foreground"><FileText className="h-3 w-3 mr-1" /> {t('trading.justification', { defaultValue: 'Justification' })}:</p>
                  <p className="italic pl-1">{transaction.justification}</p>
                  {transaction.attachmentName && (
                    <div className="mt-2">
                      <p className="text-xs flex items-center pl-1 mb-1"><ImageIcon className="h-3 w-3 mr-1" /> {t('history.attachment', { defaultValue: 'Attachment' })}: {transaction.attachmentName}</p>
                      {transaction.attachmentData && (
                        <img 
                          src={transaction.attachmentData} 
                          alt={transaction.attachmentName} 
                          className="mt-1 max-w-full h-auto rounded-md border border-border max-h-32 object-contain cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => window.open(transaction.attachmentData, '_blank')}
                        />
                      )}
                    </div>
                  )}
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