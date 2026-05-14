
import { getCache, setCache, TTL } from '../cache/inMemoryCache.js';

const APIFY_TOKEN = process.env.APIFY_API_KEY;

// Yahoo Finance direct API (no key needed for basic data)
const YF_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';

// Map internal symbol IDs to Yahoo Finance tickers
const YAHOO_SYMBOL_MAP = {
  'BTCUSD':       'BTC-USD',
  'ETHUSD':       'ETH-USD',
  'XRPUSD':       'XRP-USD',
  'ADAUSD':       'ADA-USD',
  'SOLUSD':       'SOL-USD',
  'DOTUSD':       'DOT-USD',
  'MATICUSD':     'MATIC-USD',
  'AVAXUSD':      'AVAX-USD',
  'AAPL':         'AAPL',
  'GOOGL':        'GOOGL',
  'MSFT':         'MSFT',
  'AMZN':         'AMZN',
  'TSLA':         'TSLA',
  'NVDA':         'NVDA',
  'NU':           'NU',
  'EURUSD':       'EURUSD=X',
  'GBPUSD':       'GBPUSD=X',
  'USDJPY':       'USDJPY=X',
  'AUDUSD':       'AUDUSD=X',
  'SPX':          '^GSPC',
  'DJI':          '^DJI',
  'NDX':          '^NDX',
  'FTSE':         '^FTSE',
  'ECOPETROL':    'EC',
  'BANCOLOMBIA':  'CIB',
};

const INTERVAL_MAP = {
  '1m':  { interval: '1m',  range: '1d' },
  '5m':  { interval: '5m',  range: '5d' },
  '15m': { interval: '15m', range: '5d' },
  '1h':  { interval: '60m', range: '1mo' },
  '4h':  { interval: '60m', range: '3mo' },
  '1d':  { interval: '1d',  range: '1y' },
};

async function fetchYahooChart(yahooSymbol, interval = '1m', range = '1d') {
  const url = `${YF_BASE}/${yahooSymbol}?interval=${interval}&range=${range}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GlobalTradeLab/1.0)',
      }
    });
    if (!res.ok) throw new Error(`Yahoo Finance HTTP ${res.status}`);
    const data = await res.json();
    return data?.chart?.result?.[0] || null;
  } catch (err) {
    console.error(`[Yahoo] Error fetching ${yahooSymbol}: ${err.message}`);
    return null;
  }
}

/**
 * Fetch historical OHLC candles for a symbol
 * Returns array of { time, open, high, low, close } candles
 */
export async function fetchHistorical(symbolId, timeframe = '1m') {
  const cacheKey = `yahoo:hist:${symbolId}:${timeframe}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const yahooSymbol = YAHOO_SYMBOL_MAP[symbolId];
  if (!yahooSymbol) {
    console.warn(`[Yahoo] No mapping for symbol ${symbolId}`);
    return null;
  }

  const { interval, range } = INTERVAL_MAP[timeframe] || INTERVAL_MAP['1m'];

  console.log(`[Yahoo] Fetching ${symbolId} (${yahooSymbol}) ${interval}/${range}`);
  const result = await fetchYahooChart(yahooSymbol, interval, range);
  if (!result) return null;

  const timestamps = result.timestamp || [];
  const ohlc = result.indicators?.quote?.[0] || {};

  if (timestamps.length === 0) return null;

  const candles = timestamps
    .map((ts, i) => {
      const open  = ohlc.open?.[i];
      const high  = ohlc.high?.[i];
      const low   = ohlc.low?.[i];
      const close = ohlc.close?.[i];
      if (!open || !high || !low || !close) return null;
      return {
        time: new Date(ts * 1000),
        open: parseFloat(open.toFixed(6)),
        high: parseFloat(high.toFixed(6)),
        low:  parseFloat(low.toFixed(6)),
        close: parseFloat(close.toFixed(6)),
        value: parseFloat(close.toFixed(6)),
      };
    })
    .filter(Boolean);

  if (candles.length === 0) return null;

  setCache(cacheKey, candles, TTL.HISTORICAL);
  console.log(`[Yahoo] Fetched ${candles.length} candles for ${symbolId}`);
  return candles;
}

/**
 * Fetch current price from Yahoo Finance (backup for TwelveData)
 */
export async function fetchCurrentPrice(symbolId) {
  const cacheKey = `yahoo:price:${symbolId}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const yahooSymbol = YAHOO_SYMBOL_MAP[symbolId];
  if (!yahooSymbol) return null;

  const result = await fetchYahooChart(yahooSymbol, '1m', '1d');
  if (!result) return null;

  const meta = result.meta;
  const price = meta?.regularMarketPrice || meta?.previousClose;
  if (!price) return null;

  setCache(cacheKey, price, TTL.LIVE_PRICE);
  return price;
}

/**
 * Fetch batch current prices from Yahoo Finance
 */
export async function fetchBatchCurrentPrices(symbolIds) {
  const results = {};
  const batchPromises = symbolIds.map(async (symbolId) => {
    const price = await fetchCurrentPrice(symbolId);
    if (price !== null) results[symbolId] = price;
  });
  await Promise.all(batchPromises);
  return results;
}
