
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, LineStyle } from 'lightweight-charts';
import { useTradingContext } from '@/contexts/TradingContext';
import ChartHeader from './PriceChart/ChartHeader';
import ChartOHLCInfo from './PriceChart/ChartOHLCInfo';
import ChartIndicatorControls from './PriceChart/ChartIndicatorControls';
import { 
  getChartOptions, 
  getSeriesOptions, 
  formatPriceDataForChart, 
  getPriceFormat,
  calculateEMA,
  calculateMACD,
  applyDrawingToChart,
  aggregateDataForTimeframe
} from './PriceChart/utils';

const PriceChart = () => {
  const chartContainerRef = useRef(null);
  const macdChartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const macdChartRef = useRef(null);
  const seriesRef = useRef(null);
  const emaSeriesRef = useRef(null);
  const macdSeriesRef = useRef(null);
  const signalSeriesRef = useRef(null);
  const histogramSeriesRef = useRef(null);

  const { marketData, selectedSymbol, initialSymbols, chartPreferences, setSelectedTimeframe } = useTradingContext();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chartType, setChartType] = useState('candlestick'); 
  const [activeTool, setActiveTool] = useState(null);
  const [tempDrawingPoints, setTempDrawingPoints] = useState([]);
  const [drawingObjects, setDrawingObjects] = useState([]);
  const drawingSeriesRefs = useRef([]);

  const [showIndicatorPanel, setShowIndicatorPanel] = useState(false);
  const [emaPeriod, setEmaPeriod] = useState(20);
  const [showEMA, setShowEMA] = useState(false);
  const [showMACD, setShowMACD] = useState(false);
  const [currentTimeframe, setCurrentTimeframe] = useState('1D');

  // Map chart display timeframe → backend fetch timeframe (Yahoo Finance / TwelveData)
  const CHART_TF_TO_BACKEND = {
    '1S':  '1m',
    '30S': '1m',
    '1M':  '1m',
    '5M':  '5m',
    '15M': '15m',
    '30M': '15m',
    '1H':  '1h',
    '2H':  '1h',
    '4H':  '4h',
    '1D':  '1d',
    '1W':  '1w',
    '1MO': '1M',
  };

  // Called by ChartControls — updates display AND triggers backend fetch if needed
  const handleTimeframeChange = useCallback((displayTf) => {
    setCurrentTimeframe(displayTf);
    const backendTf = CHART_TF_TO_BACKEND[displayTf] ?? '1d';
    setSelectedTimeframe(backendTf);
  }, [setSelectedTimeframe]);

  const currentSymbolInfo = initialSymbols.find(s => s.id === selectedSymbol);
  const currency = currentSymbolInfo ? currentSymbolInfo.currency : 'USD';

  const clearDrawingObjects = () => {
    drawingSeriesRefs.current.forEach(series => {
      if (chartRef.current && series) {
        try { chartRef.current.removeSeries(series); } catch (e) {}
      }
    });
    drawingSeriesRefs.current = [];
    setDrawingObjects([]);
    setActiveTool(null);
    setTempDrawingPoints([]);
  };
  
  const handleChartClick = useCallback((param) => {
    if (!activeTool || !param.point || !param.time || !seriesRef.current) return;
    
    const price = seriesRef.current.coordinateToPrice(param.point.y);
    if (price === null) return;

    const newPoint = { time: param.time, price: price, logical: param.logical };

    setTempDrawingPoints(prev => {
      const updatedPoints = [...prev, newPoint];
      if (updatedPoints.length === 2 && activeTool === 'trendline') {
        const newDrawing = {
          id: Date.now(),
          type: activeTool,
          points: [...updatedPoints] 
        };
        setDrawingObjects(prevDrawings => [...prevDrawings, newDrawing]);
        setActiveTool(null); 
        return []; 
      }
      return updatedPoints;
    });
  }, [activeTool]);

  const cleanupChart = (chartInstance, seriesArray) => {
    if (chartInstance) {
      seriesArray.forEach(series => {
        if (series.current && chartInstance) {
          try { chartInstance.removeSeries(series.current); } catch (e) {}
          series.current = null;
        }
      });
      try { chartInstance.remove(); } catch (e) {}
    }
    return null;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const chartOptions = getChartOptions(currentTheme, isFullScreen, chartContainerRef, !!showMACD);
    chartRef.current = createChart(chartContainerRef.current, chartOptions);
    chartRef.current.subscribeClick(handleChartClick);

    if (showMACD && macdChartContainerRef.current) {
      const macdChartOptions = {
        ...getChartOptions(currentTheme, isFullScreen, macdChartContainerRef, false),
        height: 100,
        rightPriceScale: { visible: true },
        timeScale: { visible: false }, 
      };
      macdChartRef.current = createChart(macdChartContainerRef.current, macdChartOptions);
      if(chartRef.current && macdChartRef.current) {
        chartRef.current.timeScale().subscribeVisibleLogicalRangeChange(range => {
          if(macdChartRef.current?.timeScale) macdChartRef.current.timeScale().setVisibleLogicalRange(range);
        });
        macdChartRef.current.timeScale().subscribeVisibleLogicalRangeChange(range => {
          if(chartRef.current?.timeScale) chartRef.current.timeScale().setVisibleLogicalRange(range);
        });
      }
    } else if (macdChartRef.current) {
      macdChartRef.current = cleanupChart(macdChartRef.current, [macdSeriesRef, signalSeriesRef, histogramSeriesRef]);
    }

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: isFullScreen ? window.innerHeight - (showMACD ? 200 : 100) : (showMACD ? 300 : 400),
        });
      }
      if (macdChartRef.current && macdChartContainerRef.current) {
        macdChartRef.current.applyOptions({
          width: macdChartContainerRef.current.clientWidth,
          height: 100,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    
    const themeObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.attributeName === 'class') {
          const newTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
          if (chartRef.current) chartRef.current.applyOptions(getChartOptions(newTheme, isFullScreen, chartContainerRef, !!showMACD));
          if (macdChartRef.current) macdChartRef.current.applyOptions(getChartOptions(newTheme, isFullScreen, macdChartContainerRef, false));
        }
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      themeObserver.disconnect();
      if(chartRef.current) {
        try { chartRef.current.unsubscribeClick(handleChartClick); } catch(e){}
      }
      chartRef.current = cleanupChart(chartRef.current, [seriesRef, emaSeriesRef, ...drawingSeriesRefs.current.map(s => ({current: s}))]);
      macdChartRef.current = cleanupChart(macdChartRef.current, [macdSeriesRef, signalSeriesRef, histogramSeriesRef]);
      drawingSeriesRefs.current = [];
    };
  }, [isFullScreen, showMACD, handleChartClick]);

  useEffect(() => {
    if (!chartRef.current || !marketData[selectedSymbol] || !chartContainerRef.current) {
      return;
    }
    
    const baseData = marketData[selectedSymbol] || [];
    if (baseData.length === 0) {
        if (seriesRef.current) seriesRef.current.setData([]);
        if (emaSeriesRef.current) emaSeriesRef.current.setData([]);
        if (macdChartRef.current) {
            if(macdSeriesRef.current) macdSeriesRef.current.setData([]);
            if(signalSeriesRef.current) signalSeriesRef.current.setData([]);
            if(histogramSeriesRef.current) histogramSeriesRef.current.setData([]);
        }
        return;
    }
    const aggregatedData = aggregateDataForTimeframe(baseData, currentTimeframe);
    if (aggregatedData.length === 0) {
        if (seriesRef.current) seriesRef.current.setData([]);
        return;
    }

    // Main price series
    if (seriesRef.current) { 
        try { chartRef.current.removeSeries(seriesRef.current); } catch (e) {}
        seriesRef.current = null;
    }
    const seriesOpt = getSeriesOptions(chartType, chartPreferences);
    seriesRef.current = chartType === 'line' ? chartRef.current.addLineSeries(seriesOpt) : chartRef.current.addCandlestickSeries(seriesOpt);
    
    const dataToSet = formatPriceDataForChart(aggregatedData, chartType);
    if (dataToSet && dataToSet.length > 0) {
        seriesRef.current.setData(dataToSet);
    } else {
        seriesRef.current.setData([]); 
    }
    
    // EMA Series
    if (emaSeriesRef.current) try { chartRef.current.removeSeries(emaSeriesRef.current); emaSeriesRef.current = null;} catch(e){}
    if (showEMA && aggregatedData.length >= emaPeriod) {
      const emaData = calculateEMA(aggregatedData.map(d=>d.close), emaPeriod).map((value, index) => ({
        time: aggregatedData[index + emaPeriod - 1].time.getTime() / 1000, value }));
      if (emaData && emaData.length > 0) {
        emaSeriesRef.current = chartRef.current.addLineSeries({ color: 'rgba(255, 0, 255, 0.8)', lineWidth: 1, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false });
        emaSeriesRef.current.setData(emaData);
      }
    }

    // MACD Series
    if (macdChartRef.current) {
        if (macdSeriesRef.current) try { macdChartRef.current.removeSeries(macdSeriesRef.current); macdSeriesRef.current=null;} catch(e){}
        if (signalSeriesRef.current) try { macdChartRef.current.removeSeries(signalSeriesRef.current); signalSeriesRef.current=null;} catch(e){}
        if (histogramSeriesRef.current) try { macdChartRef.current.removeSeries(histogramSeriesRef.current); histogramSeriesRef.current=null;} catch(e){}

        if (showMACD && aggregatedData.length >= 26 + 9 -1) { 
            const macdResult = calculateMACD(aggregatedData.map(d => d.close));
            
            const alignTime = (dataArray, baseAggregatedData, offset) => 
                dataArray.map((value, index) => {
                    const aggIndex = index + offset;
                    if (aggIndex < baseAggregatedData.length && baseAggregatedData[aggIndex] && baseAggregatedData[aggIndex].time) {
                        return { time: baseAggregatedData[aggIndex].time.getTime() / 1000, value };
                    }
                    return null; 
                }).filter(item => item !== null);

            const macdLineData = alignTime(macdResult.macdLine, aggregatedData, 26 - 1);
            const signalLineData = alignTime(macdResult.signalLine, aggregatedData, 26 + 9 - 2);
            const histogramData = alignTime(macdResult.histogram, aggregatedData, 26 + 9 - 2)
                .map(item => ({ ...item, color: item.value >= 0 ? 'rgba(0, 150, 136, 0.5)' : 'rgba(255, 82, 82, 0.5)' }));

            if (macdLineData.length > 0) {
                macdSeriesRef.current = macdChartRef.current.addLineSeries({ color: 'blue', lineWidth: 1, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false });
                macdSeriesRef.current.setData(macdLineData);
            }
            if (signalLineData.length > 0) {
                signalSeriesRef.current = macdChartRef.current.addLineSeries({ color: 'orange', lineWidth: 1, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false });
                signalSeriesRef.current.setData(signalLineData);
            }
            if (histogramData.length > 0) {
                histogramSeriesRef.current = macdChartRef.current.addHistogramSeries({ priceLineVisible: false, lastValueVisible: false });
                histogramSeriesRef.current.setData(histogramData);
            }
            if (macdChartRef.current.timeScale) macdChartRef.current.timeScale().fitContent();
        }
    }
    
    // Drawing Objects
    drawingSeriesRefs.current.forEach(s => { if (chartRef.current && s) try { chartRef.current.removeSeries(s); } catch(e){}});
    drawingSeriesRefs.current = [];
    drawingObjects.forEach(obj => {
      if (chartRef.current) {
        const newDrawingSeries = applyDrawingToChart(chartRef.current, obj, currency);
        if (newDrawingSeries) drawingSeriesRefs.current.push(newDrawingSeries);
      }
    });

    const lastValidPrice = dataToSet.length > 0 ? (dataToSet[dataToSet.length - 1]?.close ?? dataToSet[dataToSet.length - 1]?.value ?? 0) : 0;
    const priceFormat = getPriceFormat(lastValidPrice, currency);

    if (seriesRef.current) seriesRef.current.applyOptions({ priceFormat });
    if (chartRef.current?.timeScale) chartRef.current.timeScale().fitContent();

  }, [marketData, selectedSymbol, currency, chartType, isFullScreen, showEMA, emaPeriod, showMACD, drawingObjects, currentSymbolInfo, currentTimeframe]);
  
  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  const marketSymbolData = marketData[selectedSymbol] || [];
  const currentOHLC = marketSymbolData.length > 0 ? marketSymbolData[marketSymbolData.length - 1] : {};
  const previousOHLC = marketSymbolData.length > 1 ? marketSymbolData[marketSymbolData.length - 2] : {};
  const currentPrice = currentOHLC.close || 0;
  const prevPrice = previousOHLC.close || 0;
  const priceChange = currentPrice - prevPrice;
  const priceChangePercent = prevPrice !== 0 ? (priceChange / prevPrice) * 100 : 0;
  
  const chartWrapperClass = isFullScreen 
    ? "fixed inset-0 bg-background z-50 p-4 flex flex-col" 
    : "glass-card rounded-lg p-4 h-auto flex flex-col";

  return (
    <div className={chartWrapperClass}>
      <ChartHeader 
        currentSymbolInfo={currentSymbolInfo}
        selectedSymbol={selectedSymbol}
        currentPrice={currentPrice}
        priceChange={priceChange}
        priceChangePercent={priceChangePercent}
        currency={currency}
        chartType={chartType}
        setChartType={setChartType}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        isFullScreen={isFullScreen}
        toggleFullScreen={toggleFullScreen}
        toggleIndicators={() => setShowIndicatorPanel(!showIndicatorPanel)}
        clearDrawings={clearDrawingObjects}
        hasDrawings={drawingObjects.length > 0 || tempDrawingPoints.length > 0}
        currentTimeframe={currentTimeframe}
        setCurrentTimeframe={handleTimeframeChange}
      />
      {!isFullScreen && <ChartOHLCInfo ohlc={currentOHLC} currency={currency} />}
      
      <ChartIndicatorControls
        showPanel={showIndicatorPanel}
        showEMA={showEMA}
        setShowEMA={setShowEMA}
        emaPeriod={emaPeriod}
        setEmaPeriod={setEmaPeriod}
        showMACD={showMACD}
        setShowMACD={setShowMACD}
      />

      <div 
        className="flex-grow chart-container" 
        ref={chartContainerRef}
        style={{ height: isFullScreen ? `calc(100vh - ${showMACD ? 200 : 100}px)` : (showMACD ? '300px' : '400px') }}
      ></div>
      {showMACD && (
        <div 
          className="macd-chart-container h-[100px] mt-1" 
          ref={macdChartContainerRef}
        ></div>
      )}
    </div>
  );
};

export default PriceChart;
