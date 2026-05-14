
export const COP_TO_USD_RATE = 1 / 4000; // Approx. 4000 COP per 1 USD

export const generateMarketData = (symbol, currency = 'USD', baseVolatility = 0.02, numPoints = 2000) => {
  let basePrice;
  
  switch (symbol) {
    // Crypto (live-anchored — backend overrides these with real TwelveData prices)
    case 'BTCUSD':    basePrice = 79000;  break;
    case 'ETHUSD':    basePrice = 3400;   break;
    case 'XRPUSD':   basePrice = 0.55;   break;
    case 'ADAUSD':   basePrice = 0.45;   break;
    case 'SOLUSD':   basePrice = 170;    break;
    case 'DOTUSD':   basePrice = 8.5;    break;
    case 'MATICUSD': basePrice = 0.9;    break;
    case 'AVAXUSD':  basePrice = 40;     break;
    // US Stocks
    case 'NU':    basePrice = 14.5;  break;
    case 'AAPL':  basePrice = 215;   break;
    case 'GOOGL': basePrice = 180;   break;
    case 'MSFT':  basePrice = 430;   break;
    case 'AMZN':  basePrice = 220;   break;
    case 'TSLA':  basePrice = 290;   break;
    case 'NVDA':  basePrice = 950;   break;
    // Forex
    case 'EURUSD': basePrice = 1.085; break;
    case 'GBPUSD': basePrice = 1.27;  break;
    case 'USDJPY': basePrice = 149;   break;
    case 'AUDUSD': basePrice = 0.65;  break;
    // Indices
    case 'SPX':  basePrice = 5800;  break;
    case 'DJI':  basePrice = 43000; break;
    case 'NDX':  basePrice = 20500; break;
    case 'FTSE': basePrice = 8300;  break;
    // Colombian Stocks (USD equivalents via US-listed ADRs/proxies)
    case 'ECOPETROL':    basePrice = 10.5; break;
    case 'BANCOLOMBIA':  basePrice = 28;   break;
    case 'PFBCOLOM':     basePrice = 24;   break;
    case 'GRUPOARGOS':   basePrice = 7;    break;
    case 'GRUPOSURA':    basePrice = 18;   break;
    case 'PFGRUPSURA':   basePrice = 14;   break;
    case 'ISA':          basePrice = 12;   break;
    case 'CEMARGOS':     basePrice = 3.5;  break;
    case 'CORFICOLCF':   basePrice = 11;   break;
    case 'GRUPOAVAL':    basePrice = 0.95; break;
    case 'CELSIA':       basePrice = 3.2;  break;
    case 'GRUPONUTRESA': basePrice = 22;   break;
    case 'EXITO':        basePrice = 2.8;  break;
    case 'DAVIVIENDA':   basePrice = 17;   break;
    case 'MINEROS':      basePrice = 2.5;  break;
    default: basePrice = 100;
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
