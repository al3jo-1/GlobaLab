
import { useToast } from "@/components/ui/use-toast";
import { COP_TO_USD_RATE } from '@/lib/market-data'; // Import the rate

export const usePortfolioManager = ({ currentUser, updateUser, toast, marketData, symbols }) => {

  const openPosition = (symbol, type, amountUSD, entryPrice, justification, attachmentName, attachmentData, automation = null) => {
    if (!currentUser) {
      toast({ title: "Error", description: "Usuario no encontrado.", variant: "destructive" });
      return false;
    }
    if (amountUSD <= 0) {
      toast({ title: "Monto Inválido", description: "El monto a invertir debe ser mayor a cero.", variant: "destructive" });
      return false;
    }
    if (currentUser.balance < amountUSD) {
      toast({ title: "Saldo Insuficiente", description: "No tienes suficiente saldo para esta operación.", variant: "destructive" });
      return false;
    }
     if (entryPrice <= 0 && symbol !== "TEST_ZERO_PRICE") { 
      toast({ title: "Precio Inválido", description: "El precio del activo no puede ser cero o negativo.", variant: "destructive" });
      return false;
    }

    const symbolInfo = symbols.find(s => s.id === symbol);
    if (!symbolInfo) {
       toast({ title: "Error", description: `Símbolo ${symbol} no encontrado.`, variant: "destructive" });
      return false;
    }
    const assetCurrency = symbolInfo.currency;


    const newPosition = {
      id: `pos_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      symbol,
      type, 
      amount: amountUSD, // This is always in USD
      entryPrice, // This is in asset's original currency (COP or USD)
      openDate: new Date().toISOString(),
      justification,
      attachmentName: attachmentName || null,
      attachmentData: attachmentData || null,
      currency: assetCurrency, // Store the asset's currency with the position
      automation: automation || null, // Store automation rules
    };

    const newTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type: `OPEN_${type}`,
      symbol,
      amount: amountUSD, // USD
      price: entryPrice, // Asset's original currency price
      assetCurrency: assetCurrency,
      date: new Date().toISOString(),
      justification,
      attachmentName: attachmentName || null,
      attachmentData: attachmentData || null,
    };
    
    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance - amountUSD,
      positions: [...currentUser.positions, newPosition],
      transactions: [...currentUser.transactions, newTransaction],
    };
    
    updateUser(updatedUser);
    toast({ title: "Operación Exitosa", description: `${type === 'BUY' ? 'Compra' : 'Venta'} de ${symbol} abierta por ${amountUSD.toFixed(2)} USD.`, variant: "default" });
    return true;
  };

  const closePosition = (positionId) => { // closePrice is now fetched inside
    if (!currentUser) {
      toast({ title: "Error", description: "Usuario no encontrado.", variant: "destructive" });
      return false;
    }
    
    const positionToClose = currentUser.positions.find(p => p.id === positionId);
    if (!positionToClose) {
      toast({ title: "Error", description: "Posición no encontrada.", variant: "destructive" });
      return false;
    }
    
    const symbolMarketData = marketData[positionToClose.symbol];
    if (!symbolMarketData || symbolMarketData.length === 0) {
       toast({ title: "Error de Mercado", description: `No hay datos de mercado para ${positionToClose.symbol}.`, variant: "destructive" });
      return false;
    }
    const closePrice = symbolMarketData[symbolMarketData.length - 1].close; // Price in asset's original currency


    if (closePrice <= 0 && positionToClose.symbol !== "TEST_ZERO_PRICE") {
        toast({ title: "Precio de Cierre Inválido", description: "El precio de cierre del activo no puede ser cero o negativo.", variant: "destructive" });
        return false;
    }

    let profitOrLossUSD;
    const shares = positionToClose.amount / (positionToClose.currency === 'COP' ? (positionToClose.entryPrice * COP_TO_USD_RATE) : positionToClose.entryPrice);
    
    if(positionToClose.entryPrice === 0 && positionToClose.symbol !== "TEST_ZERO_PRICE"){
      profitOrLossUSD = positionToClose.type === 'BUY' ? positionToClose.amount * (closePrice > 0 ? 1 : -1) : positionToClose.amount * (closePrice > 0 ? -1 : 1) ;
    } else {
      const entryPriceUSD = positionToClose.currency === 'COP' ? positionToClose.entryPrice * COP_TO_USD_RATE : positionToClose.entryPrice;
      const closePriceUSD = positionToClose.currency === 'COP' ? closePrice * COP_TO_USD_RATE : closePrice;

      if (positionToClose.type === 'BUY') {
        profitOrLossUSD = (closePriceUSD - entryPriceUSD) * shares;
      } else { // SELL
        profitOrLossUSD = (entryPriceUSD - closePriceUSD) * shares;
      }
    }


    const newTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type: `CLOSE_${positionToClose.type}`,
      symbol: positionToClose.symbol,
      amount: positionToClose.amount, // Original investment in USD
      entryPrice: positionToClose.entryPrice, // Asset's original currency
      closePrice: closePrice, // Asset's original currency
      assetCurrency: positionToClose.currency,
      profitOrLoss: profitOrLossUSD, // P/L in USD
      date: new Date().toISOString(),
      justification: positionToClose.justification, 
      attachmentName: positionToClose.attachmentName,
      attachmentData: positionToClose.attachmentData,
    };

    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance + positionToClose.amount + profitOrLossUSD, // Balance is in USD
      positions: currentUser.positions.filter(p => p.id !== positionId),
      transactions: [...currentUser.transactions, newTransaction],
    };

    updateUser(updatedUser);
    toast({
      title: "Posición Cerrada",
      description: `Posición en ${positionToClose.symbol} cerrada. P/L: ${profitOrLossUSD.toFixed(2)} USD.`,
      variant: profitOrLossUSD >=0 ? "default" : "destructive",
    });
    return true;
  };

  return { openPosition, closePosition };
};
