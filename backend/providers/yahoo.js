/**
 * Yahoo Finance provider
 * Primary source for historical OHLC data (no API key required).
 * Supports intraday up to 60-day range and daily/weekly/monthly up to max history.
 */

import { getCache, setCache, TTL } from '../cache/inMemoryCache.js';

const YF_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';

// Internal ID → Yahoo Finance ticker
export const YAHOO_SYMBOL_MAP = {
  'BTCUSD':     'BTC-USD',
  'ETHUSD':     'ETH-USD',
  'XRPUSD':     'XRP-USD',
  'ADAUSD':     'ADA-USD',
  'SOLUSD':     'SOL-USD',
  'DOTUSD':     'DOT-USD',
  'MATICUSD':   'MATIC-USD',
  'AVAXUSD':    'AVAX-USD',
  'AAPL':       'AAPL',
  'GOOGL':      'GOOGL',
  'MSFT':       'MSFT',
  'AMZN':       'AMZN',
  'TSLA':       'TSLA',
  'NVDA':       'NVDA',
  'NU':         'NU',
  'EURUSD':     'EURUSD=X',
  'GBPUSD':     'GBPUSD=X',
  'USDJPY':     'USDJPY=X',
  'AUDUSD':     'AUDUSD=X',
  'SPX':        '^GSPC',
  'DJI':        '^DJI',
  'NDX':        '^NDX',
  'FTSE':       '^FTSE',
  'ECOPETROL':  'EC',
  'BANCOLOMBIA':'CIB',
};

/**
 * Timeframe → { interval, range } mapping
 * Supports dynamic timeframe expansion:
 * - 1m  → last day (intraday)
 * - 5m  → last 5 days
 * - 15m → last month
 * - 1h  → last 6 months
 * - 4h  → last 6 months (60m bars, client aggregates)
 * - 1d  → 2 years daily bars  ← default 6 months loaded
 * - 1w  → 5 years weekly bars
 * - 1M  → max monthly bars
 */
export const TIMEFRAME_MAP = {
  '1m':  { interval: '1m',  range: '1d',   ttl: TTL.HISTORICAL   },
  '5m':  { interval: '5m',  range: '5d',   ttl: TTL.HISTORICAL   },
  '15m': { interval: '15m', range: '1mo',  ttl: TTL.HISTORICAL   },
  '1h':  { interval: '60m', range: '6mo',  ttl: TTL.HISTORICAL_D },
  '4h':  { interval: '60m', range: '6mo',  ttl: TTL.HISTORICAL_D },
  '1d':  { interval: '1d',  range: '2y',   ttl: TTL.HISTORICAL_D },
  '1w':  { interval: '1wk', range: '5y',   ttl: TTL.HISTORICAL_D },
  '1M':  { interval: '1mo', range: 'max',  ttl: TTL.HISTORICAL_D },
};

async function fetchYahooChart(yahooSymbol, interval, range) {
  const url = `${YF_BASE}/${encodeURIComponent(yahooSymbol)}?interval=${interval}&range=${range}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GlobalTradeLab/1.0)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data?.chart?.result?.[0] ?? null;
  } catch (err) {
    console.error(`[Yahoo] Error fetching ${yahooSymbol} (${interval}/${range}): ${err.message}`);
    return null;
  }
}

function parseCandles(result) {
  const timestamps = result.timestamp ?? [];
  const ohlc = result.indicators?.quote?.[0] ?? {};
  return timestamps
    .map((ts, i) => {
      const open  = ohlc.open?.[i];
      const high  = ohlc.high?.[i];
      const low   = ohlc.low?.[i];
      const close = ohlc.close?.[i];
      if (!open || !high || !low || !close) return null;
      return {
        time:  new Date(ts * 1000),
        open:  parseFloat(open.toFixed(6)),
        high:  parseFloat(high.toFixed(6)),
        low:   parseFloat(low.toFixed(6)),
        close: parseFloat(close.toFixed(6)),
        value: parseFloat(close.toFixed(6)),
      };
    })
    .filter(Boolean);
}

/**
 * Fetch historical OHLC candles for a symbol.
 * Automatically selects the right interval/range for the requested timeframe.
 */
export async function fetchHistorical(symbolId, timeframe = '1m') {
  const tf = TIMEFRAME_MAP[timeframe] ?? TIMEFRAME_MAP['1m'];
  const cacheKey = `yahoo:hist:${symbolId}:${timeframe}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const yahooSymbol = YAHOO_SYMBOL_MAP[symbolId];
  if (!yahooSymbol) {
    console.warn(`[Yahoo] No mapping for symbol: ${symbolId}`);
    return null;
  }

  console.log(`[Yahoo] Fetching ${symbolId} (${yahooSymbol}) ${tf.interval}/${tf.range}`);
  const result = await fetchYahooChart(yahooSymbol, tf.interval, tf.range);
  if (!result) return null;

  const candles = parseCandles(result);
  if (candles.length === 0) return null;

  setCache(cacheKey, candles, tf.ttl);
  console.log(`[Yahoo] Fetched ${candles.length} candles for ${symbolId} [${timeframe}]`);
  return candles;
}

/**
 * Fetch current price (last close from meta).
 */
export async function fetchCurrentPrice(symbolId) {
  const cacheKey = `yahoo:price:${symbolId}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const yahooSymbol = YAHOO_SYMBOL_MAP[symbolId];
  if (!yahooSymbol) return null;

  const result = await fetchYahooChart(yahooSymbol, '1m', '1d');
  if (!result) return null;

  const price = result.meta?.regularMarketPrice ?? result.meta?.previousClose;
  if (!price) return null;

  setCache(cacheKey, price, TTL.LIVE_PRICE);
  return price;
}

/**
 * Fetch current prices for multiple symbols in parallel.
 */
export async function fetchBatchCurrentPrices(symbolIds) {
  const results = {};
  await Promise.all(symbolIds.map(async (id) => {
    const price = await fetchCurrentPrice(id);
    if (price != null) results[id] = price;
  }));
  return results;
}
