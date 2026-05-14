
import { getCache, setCache, TTL } from '../cache/inMemoryCache.js';

const API_KEY = process.env.TWELVEDATA_API_KEY;
const BASE_URL = 'https://api.twelvedata.com';

// Map internal symbol IDs to TwelveData symbols
const SYMBOL_MAP = {
  'BTCUSD':     'BTC/USD',
  'ETHUSD':     'ETH/USD',
  'XRPUSD':     'XRP/USD',
  'ADAUSD':     'ADA/USD',
  'SOLUSD':     'SOL/USD',
  'DOTUSD':     'DOT/USD',
  'MATICUSD':   'MATIC/USD',
  'AVAXUSD':    'AVAX/USD',
  'AAPL':       'AAPL',
  'GOOGL':      'GOOGL',
  'MSFT':       'MSFT',
  'AMZN':       'AMZN',
  'TSLA':       'TSLA',
  'NVDA':       'NVDA',
  'NU':         'NU',
  'EURUSD':     'EUR/USD',
  'GBPUSD':     'GBP/USD',
  'USDJPY':     'USD/JPY',
  'AUDUSD':     'AUD/USD',
  'SPX':        'SPX',
  'DJI':        'DJI',
  'NDX':        'NDX',
  'FTSE':       'FTSE:LSE',
};

// Symbols that TwelveData supports (exclude Colombian stocks)
export const SUPPORTED_SYMBOLS = Object.keys(SYMBOL_MAP);

// Rate limiting: track requests
let requestsThisMinute = 0;
let minuteResetAt = Date.now() + 60000;
const MAX_PER_MINUTE = 7;

function canMakeRequest() {
  if (Date.now() > minuteResetAt) {
    requestsThisMinute = 0;
    minuteResetAt = Date.now() + 60000;
  }
  return requestsThisMinute < MAX_PER_MINUTE;
}

async function fetchWithRetry(url, retries = 2, delayMs = 2000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (!canMakeRequest()) {
        const waitMs = minuteResetAt - Date.now();
        console.log(`[TwelveData] Rate limit reached, waiting ${Math.ceil(waitMs/1000)}s...`);
        await new Promise(r => setTimeout(r, waitMs + 100));
      }
      requestsThisMinute++;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.status === 'error') throw new Error(data.message);
      return data;
    } catch (err) {
      console.error(`[TwelveData] Attempt ${attempt + 1} failed: ${err.message}`);
      if (attempt < retries) await new Promise(r => setTimeout(r, delayMs * (attempt + 1)));
    }
  }
  return null;
}

/**
 * Fetch a single real-time quote for a symbol
 */
export async function fetchQuote(symbolId) {
  if (!API_KEY) return null;
  const cacheKey = `quote:${symbolId}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const tdSymbol = SYMBOL_MAP[symbolId];
  if (!tdSymbol) return null;

  const url = `${BASE_URL}/price?symbol=${encodeURIComponent(tdSymbol)}&apikey=${API_KEY}`;
  const data = await fetchWithRetry(url);
  if (!data || !data.price) return null;

  const price = parseFloat(data.price);
  setCache(cacheKey, price, TTL.QUOTE);
  return price;
}

/**
 * Fetch batch quotes for multiple symbols in one API call
 * Returns { symbolId: price } map
 */
export async function fetchBatchQuotes(symbolIds) {
  if (!API_KEY) return {};
  const cacheKey = `batch:${symbolIds.sort().join(',')}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const supported = symbolIds.filter(id => SYMBOL_MAP[id]);
  if (supported.length === 0) return {};

  const tdSymbols = supported.map(id => SYMBOL_MAP[id]).join(',');
  const url = `${BASE_URL}/price?symbol=${encodeURIComponent(tdSymbols)}&apikey=${API_KEY}`;
  const data = await fetchWithRetry(url);
  if (!data) return {};

  const result = {};

  // Single symbol response
  if (data.price) {
    result[supported[0]] = parseFloat(data.price);
  } else {
    // Multiple symbols response — keyed by TwelveData symbol
    const reverseMap = Object.fromEntries(
      Object.entries(SYMBOL_MAP).map(([id, td]) => [td, id])
    );
    for (const [tdSym, priceData] of Object.entries(data)) {
      const id = reverseMap[tdSym];
      if (id && priceData?.price) {
        result[id] = parseFloat(priceData.price);
      }
    }
  }

  setCache(cacheKey, result, TTL.BATCH_PRICE);
  console.log(`[TwelveData] Batch fetched ${Object.keys(result).length} prices`);
  return result;
}

/**
 * Fetch historical OHLC time series
 * Returns array of { time, open, high, low, close } candles
 */
export async function fetchTimeSeries(symbolId, interval = '1min', outputsize = 500) {
  if (!API_KEY) return null;
  const cacheKey = `ts:${symbolId}:${interval}:${outputsize}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const tdSymbol = SYMBOL_MAP[symbolId];
  if (!tdSymbol) return null;

  const url = `${BASE_URL}/time_series?symbol=${encodeURIComponent(tdSymbol)}&interval=${interval}&outputsize=${outputsize}&apikey=${API_KEY}`;
  const data = await fetchWithRetry(url);
  if (!data?.values) return null;

  const candles = data.values.reverse().map(v => ({
    time: new Date(v.datetime),
    open: parseFloat(v.open),
    high: parseFloat(v.high),
    low: parseFloat(v.low),
    close: parseFloat(v.close),
    value: parseFloat(v.close),
  }));

  setCache(cacheKey, candles, TTL.HISTORICAL);
  console.log(`[TwelveData] Fetched ${candles.length} candles for ${symbolId}`);
  return candles;
}
