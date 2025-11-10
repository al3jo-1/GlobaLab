
import { useState, useEffect } from 'react';
import { COP_TO_USD_RATE } from '@/lib/market-data';

const TradeFormLogic = ({
  selectedSymbol,
  openPosition,
  user,
  getCurrentPrice,
  initialSymbols,
  toast,
  assetCurrency, 
  userCurrency 
}) => {
  const [tradeMode, setTradeMode] = useState('amount'); 
  const [amount, setAmount] = useState(''); 
  const [quantity, setQuantity] = useState(''); 

  const [tradeType, setTradeType] = useState('BUY');
  const [justification, setJustification] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState('');

  const currentPriceInAssetCurrency = getCurrentPrice(selectedSymbol); 

  const currentPriceUSD = assetCurrency === 'COP' 
    ? currentPriceInAssetCurrency * COP_TO_USD_RATE 
    : currentPriceInAssetCurrency;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Archivo demasiado grande",
          description: "El tamaño máximo del archivo es 2MB.",
          variant: "destructive",
        });
        setAttachment(null);
        setAttachmentName('');
        if (e.target) e.target.value = null;
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        toast({
          title: "Formato de archivo no válido",
          description: "Solo se permiten imágenes PNG, JPG o JPEG.",
          variant: "destructive",
        });
        setAttachment(null);
        setAttachmentName('');
        if (e.target) e.target.value = null;
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(reader.result);
        setAttachmentName(file.name);
      };
      reader.readAsDataURL(file);
    } else {
      setAttachment(null);
      setAttachmentName('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let investmentAmountUSD = 0;

    if (tradeMode === 'amount') {
      investmentAmountUSD = parseFloat(amount);
      if (isNaN(investmentAmountUSD) || investmentAmountUSD <= 0) {
        toast({ title: "Monto inválido", description: `Ingresa un monto válido en ${userCurrency}.`, variant: "destructive" });
        return;
      }
    } else { 
      const numShares = parseFloat(quantity);
      if (isNaN(numShares) || numShares <= 0) {
        toast({ title: "Cantidad inválida", description: "Ingresa una cantidad válida de acciones.", variant: "destructive" });
        return;
      }
      // Calculate cost in USD using currentPriceUSD
      if (currentPriceUSD <= 0) {
         toast({ title: "Precio Inválido", description: "El precio del activo (en USD) no puede ser cero para calcular el costo.", variant: "destructive" });
        return;
      }
      investmentAmountUSD = numShares * currentPriceUSD;
    }

    if (!justification.trim()) {
      toast({ title: "Justificación requerida", description: "Por favor, escribe una justificación para esta operación.", variant: "destructive" });
      return;
    }

    const success = openPosition(
      selectedSymbol,
      tradeType,
      investmentAmountUSD, 
      currentPriceInAssetCurrency, // Pass the asset's original price
      justification,
      attachmentName,
      attachment
    );

    if (success) {
      setAmount('');
      setQuantity('');
      setJustification('');
      setAttachment(null);
      setAttachmentName('');
       const fileInputBuy = document.getElementById('BUY-attachment');
       if (fileInputBuy) fileInputBuy.value = null;
       const fileInputSell = document.getElementById('SELL-attachment');
       if (fileInputSell) fileInputSell.value = null;
    }
  };

  let totalCostUSDCalculated = 0;
  if (tradeMode === 'quantity' && parseFloat(quantity) > 0 && currentPriceUSD > 0) {
    totalCostUSDCalculated = parseFloat(quantity) * currentPriceUSD;
  } else if (tradeMode === 'amount' && parseFloat(amount) > 0) {
    totalCostUSDCalculated = parseFloat(amount);
  }

  return {
    tradeMode, setTradeMode,
    amount, setAmount,
    quantity, setQuantity,
    tradeType, setTradeType,
    justification, setJustification,
    attachment, setAttachment,
    attachmentName, setAttachmentName,
    handleFileChange,
    handleSubmit,
    totalCostUSD: totalCostUSDCalculated,
    currentPriceInAssetCurrency, // expose this for UI
    currentPriceUSD // expose this for UI if needed
  };
};

export default TradeFormLogic;
