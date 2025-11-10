
import { LineStyle } from 'lightweight-charts';

export const getChartOptions = (theme, isFullScreen, chartContainerRef, isMainChartWithPane = false) => ({
  layout: {
    background: { color: 'transparent' },
    textColor: theme === 'dark' ? '#d1d5db' : '#1f2937',
  },
  grid: {
    vertLines: { color: theme === 'dark' ? 'rgba(42, 46, 57, 0.6)' : 'rgba(229, 231, 235, 0.6)' },
    horzLines: { color: theme === 'dark' ? 'rgba(42, 46, 57, 0.6)' : 'rgba(229, 231, 235, 0.6)' },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
    borderColor: theme === 'dark' ? 'rgba(75, 85, 99, 0.7)' : 'rgba(209, 213, 219, 0.7)',
  },
  rightPriceScale: {
    borderColor: theme === 'dark' ? 'rgba(75, 85, 99, 0.7)' : 'rgba(209, 213, 219, 0.7)',
  },
  crosshair: {
    mode: 0,
    vertLine: {
        style: LineStyle.Dotted,
        color: theme === 'dark' ? '#9ca3af' : '#4b5563',
        labelBackgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
    },
    horzLine: {
        style: LineStyle.Dotted,
        color: theme === 'dark' ? '#9ca3af' : '#4b5563',
        labelBackgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
    },
  },
  width: chartContainerRef.current?.clientWidth || 0,
  height: isFullScreen 
    ? window.innerHeight - (isMainChartWithPane ? 200 : 100) 
    : (isMainChartWithPane ? 300 : 400),
  handleScroll: {
      mouseWheel: true,
      pressedMouseMove: true,
      horzTouchDrag: true,
      vertTouchDrag: true,
  },
  handleScale: {
      axisPressedMouseMove: {
          time: true,
          price: true,
      },
      mouseWheel: true,
      pinch: true,
  },
});

export const getSeriesOptions = (type, chartPreferences = null) => {
  const preferences = chartPreferences || {
    upColor: '#22c55e',
    downColor: '#ef4444',
    wickUpColor: '#22c55e',
    wickDownColor: '#ef4444',
    borderUpColor: '#22c55e',
    borderDownColor: '#ef4444',
  };

  switch (type) {
    case 'line':
      return {
        color: '#2962FF',
        lineWidth: 2,
      };
    case 'heikinashi':
      return {
        upColor: preferences.upColor,
        downColor: preferences.downColor,
        borderVisible: true,
        wickVisible: true,
        borderDownColor: preferences.borderDownColor || preferences.downColor,
        borderUpColor: preferences.borderUpColor || preferences.upColor,
        wickDownColor: preferences.wickDownColor,
        wickUpColor: preferences.wickUpColor,
      };
    case 'candlestick':
    default:
      return {
        upColor: preferences.upColor,
        downColor: preferences.downColor,
        borderDownColor: preferences.borderDownColor || preferences.downColor,
        borderUpColor: preferences.borderUpColor || preferences.upColor,
        wickDownColor: preferences.wickDownColor,
        wickUpColor: preferences.wickUpColor,
      };
  }
};

export const convertToHeikinAshi = (data) => {
  if (!data || data.length === 0) return [];
  const heikinAshiData = [];
  for (let i = 0; i < data.length; i++) {
    const current = data[i];
    const prevHA = i > 0 ? heikinAshiData[i-1] : null;
    
    const haClose = (current.open + current.high + current.low + current.close) / 4;
    const haOpen = prevHA ? (prevHA.open + prevHA.close) / 2 : (current.open + current.close) / 2;
    const haHigh = Math.max(current.high, haOpen, haClose);
    const haLow = Math.min(current.low, haOpen, haClose);

    heikinAshiData.push({
      time: current.time, 
      open: haOpen,
      high: haHigh,
      low: haLow,
      close: haClose,
    });
  }
  return heikinAshiData.map(d => ({
      ...d,
      open: isNaN(d.open) ? 0 : parseFloat(d.open.toFixed(4)),
      high: isNaN(d.high) ? 0 : parseFloat(d.high.toFixed(4)),
      low: isNaN(d.low) ? 0 : parseFloat(d.low.toFixed(4)),
      close: isNaN(d.close) ? 0 : parseFloat(d.close.toFixed(4)),
  }));
};

export const formatPriceDataForChart = (marketSymbolData, chartType) => {
  if (!marketSymbolData || marketSymbolData.length === 0) return [];
  
  let dataToSet = marketSymbolData.map(item => ({
    time: item.time.getTime() / 1000,
    open: parseFloat(item.open) || 0,
    high: parseFloat(item.high) || 0,
    low: parseFloat(item.low) || 0,
    close: parseFloat(item.close) || 0,
    value: parseFloat(item.close) || 0, 
  }));

  if (chartType === 'heikinashi') {
    dataToSet = convertToHeikinAshi(dataToSet);
  } else if (chartType === 'line') {
    dataToSet = dataToSet.map(d => ({ time: d.time, value: d.close || 0 }));
  }
  
  return dataToSet.map(d => {
    const common = { time: d.time };
    if (chartType === 'line') {
      return { ...common, value: d.value === undefined || isNaN(d.value) ? 0 : parseFloat(d.value.toFixed(4)) };
    }
    return {
      ...common,
      open: d.open === undefined || isNaN(d.open) ? 0 : parseFloat(d.open.toFixed(4)),
      high: d.high === undefined || isNaN(d.high) ? 0 : parseFloat(d.high.toFixed(4)),
      low: d.low === undefined || isNaN(d.low) ? 0 : parseFloat(d.low.toFixed(4)),
      close: d.close === undefined || isNaN(d.close) ? 0 : parseFloat(d.close.toFixed(4)),
    };
  });
};

export const getPriceFormat = (lastPrice, currency) => {
  let precision = 2;
  let minMove = 0.01;

  if (currency === 'COP') {
    precision = 0;
    minMove = 1;
  } else if (lastPrice < 1 && lastPrice !== 0) {
    precision = 4;
    minMove = 0.0001;
  } else if (lastPrice < 10 && lastPrice !== 0) {
    precision = 3;
    minMove = 0.001;
  }
  return { type: 'price', precision, minMove };
};


export const calculateEMA = (data, period) => {
  if (!data || data.length < period) return [];
  const k = 2 / (period + 1);
  const emaArray = [];
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += (data[i] || 0);
  }
  emaArray.push(sum / period);
  for (let i = period; i < data.length; i++) {
    const ema = ((data[i]||0) * k) + ((emaArray[emaArray.length - 1]||0) * (1 - k));
    emaArray.push(ema);
  }
  return emaArray;
};

export const calculateMACD = (data, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) => {
  if (!data || data.length < longPeriod + signalPeriod -1) return { macdLine: [], signalLine: [], histogram: [] };
  
  const validData = data.map(d => d || 0);
  const emaShort = calculateEMA(validData, shortPeriod);
  const emaLong = calculateEMA(validData, longPeriod);

  const macdLine = [];
  
  const shortEmaAligned = emaShort.slice(longPeriod - shortPeriod);

  const maxLength = Math.min(shortEmaAligned.length, emaLong.length);
  for (let i = 0; i < maxLength; i++) {
      macdLine.push((shortEmaAligned[i]||0) - (emaLong[i]||0));
  }
  
  const signalLine = calculateEMA(macdLine, signalPeriod);
  
  const histogram = [];
  const macdLineAlignedForHistogram = macdLine.slice(macdLine.length - signalLine.length);


  const histMaxLength = Math.min(macdLineAlignedForHistogram.length, signalLine.length);
  for (let i = 0; i < histMaxLength; i++) {
    histogram.push((macdLineAlignedForHistogram[i]||0) - (signalLine[i]||0));
  }
  
  return { macdLine, signalLine, histogram };
};

export const applyDrawingToChart = (chart, drawingObject, currency) => {
  if (!chart || !drawingObject || !drawingObject.points || drawingObject.points.length < 2) {
    return null;
  }

  const [startPoint, endPoint] = drawingObject.points;
  const lineData = [
    { time: startPoint.time, value: startPoint.price },
    { time: endPoint.time, value: endPoint.price }
  ];

  const priceFormat = getPriceFormat(startPoint.price, currency);

  if (drawingObject.type === 'trendline') {
    const lineSeries = chart.addLineSeries({
      color: 'rgba(50, 150, 255, 0.7)', 
      lineWidth: 2,
      lastValueVisible: false,
      priceLineVisible: false,
      priceFormat: priceFormat,
      lineStyle: LineStyle.Solid, 
      crosshairMarkerVisible: false,
    });
    lineSeries.setData(lineData);
    return lineSeries;
  }
  return null; 
};

export const aggregateDataForTimeframe = (data, timeframe) => {
  if (!data || data.length === 0) return [];
  
  const ensureNumericOHLCV = (p) => ({
    ...p,
    open: parseFloat(p.open) || 0,
    high: parseFloat(p.high) || 0,
    low: parseFloat(p.low) || 0,
    close: parseFloat(p.close) || 0,
    value: parseFloat(p.close) || 0,
  });

  if (timeframe === "1M" || timeframe.endsWith("S")) return data.map(ensureNumericOHLCV);

  const timeframeMinutes = {
    "5M": 5, "15M": 15, "30M": 30,
    "1H": 60, "2H": 120, "4H": 240,
    "1D": 1440, 
  }[timeframe];

  if (!timeframeMinutes) return data.map(ensureNumericOHLCV); 

  const aggregated = [];
  let currentBucket = [];
  let bucketStartTime = null;

  for (const rawPoint of data) {
    const point = ensureNumericOHLCV(rawPoint);
    const pointTime = point.time.getTime();

    if (!bucketStartTime) {
      bucketStartTime = Math.floor(pointTime / (timeframeMinutes * 60000)) * (timeframeMinutes * 60000);
    }

    if (pointTime < bucketStartTime + timeframeMinutes * 60000) {
      currentBucket.push(point);
    } else {
      if (currentBucket.length > 0) {
        const open = currentBucket[0].open;
        const close = currentBucket[currentBucket.length - 1].close;
        const high = Math.max(...currentBucket.map(p => p.high));
        const low = Math.min(...currentBucket.map(p => p.low));
        aggregated.push({
          time: new Date(bucketStartTime),
          open, high, low, close,
          value: close,
          currency: currentBucket[0].currency
        });
      }
      currentBucket = [point];
      bucketStartTime = Math.floor(pointTime / (timeframeMinutes * 60000)) * (timeframeMinutes * 60000);
    }
  }

  if (currentBucket.length > 0) {
     const open = currentBucket[0].open;
     const close = currentBucket[currentBucket.length - 1].close;
     const high = Math.max(...currentBucket.map(p => p.high));
     const low = Math.min(...currentBucket.map(p => p.low));
     aggregated.push({
       time: new Date(bucketStartTime),
       open, high, low, close,
       value: close,
       currency: currentBucket[0].currency
     });
  }
  return aggregated;
};
