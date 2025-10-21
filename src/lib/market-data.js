
export const COP_TO_USD_RATE = 1 / 4000; // Approx. 4000 COP per 1 USD

export const generateMarketData = (symbol, currency = 'USD', baseVolatility = 0.02, numPoints = 2000) => {
  let basePrice;
  
  switch (symbol) {
    case 'BTCUSD': basePrice = 60000; break;
    case 'ETHUSD': basePrice = 3500; break;
    // Colombian Stocks in COP
    case 'ECOPETROL': basePrice = 2300; break; // COP
    case 'BANCOLOMBIA': basePrice = 35000; break; // COP
    case 'PFBCOLOM': basePrice = 29000; break; // COP
    case 'GRUPOARGOS': basePrice = 11000; break; // COP
    case 'GRUPOSURA': basePrice = 27000; break; // COP
    case 'PFGRUPSURA': basePrice = 20000; break; // COP
    case 'ISA': basePrice = 17000; break; // COP
    case 'CEMARGOS': basePrice = 4500; break; // COP
    case 'CORFICOLCF': basePrice = 15000; break; // COP
    case 'GRUPOAVAL': basePrice = 600; break; // COP
    case 'CELSIA': basePrice = 3800; break; // COP
    case 'GRUPONUTRESA': basePrice = 45000; break; // COP
    case 'EXITO': basePrice = 3000; break; // COP
    case 'DAVIVIENDA': basePrice = 25000; break; // COP
    case 'MINEROS': basePrice = 3000; break; // COP
    // USD Stocks & Crypto
    case 'NU': basePrice = 11.50; break; // USD
    case 'XRPUSD': basePrice = 0.52; break; // USD
    case 'ADAUSD': basePrice = 0.45; break; // USD
    case 'SOLUSD': basePrice = 150; break; // USD
    default: basePrice = 100; // USD default
  }
  
  const data = [];
  const now = new Date();
  let lastClose = basePrice;
  
  for (let i = 0; i < numPoints; i++) {
    const time = new Date(now.getTime() - (numPoints - i) * 60000); 
    
    let open = lastClose * (1 + (Math.random() * baseVolatility * 0.2 - baseVolatility * 0.1));
    let close = open * (1 + (Math.random() * baseVolatility - baseVolatility * 0.5));
    
    let high = Math.max(open, close) * (1 + Math.random() * baseVolatility * 0.3);
    let low = Math.min(open, close) * (1 - Math.random() * baseVolatility * 0.3);

    open = Math.max(currency === 'COP' ? 1 : 0.0001, parseFloat(open.toFixed(currency === 'COP' ? 0 : 4)));
    high = Math.max(currency === 'COP' ? 1 : 0.0001, parseFloat(high.toFixed(currency === 'COP' ? 0 : 4)));
    low = Math.max(currency === 'COP' ? 1 : 0.0001, parseFloat(low.toFixed(currency === 'COP' ? 0 : 4)));
    close = Math.max(currency === 'COP' ? 1 : 0.0001, parseFloat(close.toFixed(currency === 'COP' ? 0 : 4)));
    
    lastClose = close;
    
    data.push({
      time,
      open,
      high,
      low,
      close,
      value: close, 
      currency 
    });
  }
  
  return data;
};

export const formatCurrency = (value, currency = 'USD', decimals) => {
  if (value === undefined || value === null || isNaN(value)) {
    value = 0;
  }

  let minFractionDigits, maxFractionDigits;

  if (typeof decimals === 'number') {
    minFractionDigits = decimals;
    maxFractionDigits = decimals;
  } else {
    if (currency === 'COP') {
      minFractionDigits = 0;
      maxFractionDigits = 0;
    } else if (value !== 0 && Math.abs(value) < 0.01 && currency === 'USD') {
      minFractionDigits = Math.max(2, Math.min(6, (value.toString().split('.')[1] || '').length));
      maxFractionDigits = minFractionDigits;
    } else if (value !== 0 && Math.abs(value) < 1 && currency === 'USD') {
      minFractionDigits = Math.min(4, Math.max(2, (value.toString().split('.')[1] || '').length));
      maxFractionDigits = minFractionDigits;
    } else {
      minFractionDigits = 2;
      maxFractionDigits = 2;
    }
  }

  return new Intl.NumberFormat('es-CO', { 
    style: 'currency',
    currency: currency,
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
};

export const formatPercentage = (value) => {
  if (value === undefined || value === null || isNaN(value)) {
    value = 0;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100); 
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Fecha inválida";
  }
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
