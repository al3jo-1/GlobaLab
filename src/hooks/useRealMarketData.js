import { useEffect, useCallback } from 'react';

const RETRY_DELAYS = [2000, 5000, 10000]; // ms between retries

/**
 * Fetch with retry — waits for the backend to be ready on cold starts.
 */
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
      return null; // non-retryable HTTP error
    } catch {
      if (i < retries) {
        await new Promise(r => setTimeout(r, RETRY_DELAYS[i] ?? 10000));
      }
    }
  }
  return null;
}

/**
 * Fetches real historical OHLC data from the backend for a given symbol/timeframe.
 * Uses relative /api path — Vite proxies it to the backend on port 3000.
 */
export async function fetchRealHistory(symbolId, timeframe = '1m') {
  try {
    const res = await fetchWithRetry(`/api/history/${symbolId}?timeframe=${timeframe}`);
    if (!res) return null;
    const candles = await res.json();
    if (!Array.isArray(candles) || candles.length === 0) return null;
    return candles.map(c => ({ ...c, time: new Date(c.time), value: c.close }));
  } catch {
    return null;
  }
}

/**
 * Fetches a real-time quote for one symbol.
 * Uses relative /api path — Vite proxies it to the backend on port 3000.
 */
export async function fetchRealQuote(symbolId) {
  try {
    const res = await fetchWithRetry(`/api/quote/${symbolId}`);
    if (!res) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Hook — seeds market data with real historical candles from the backend on mount.
 * Falls back silently; existing simulation continues if the API is unavailable.
 *
 * @param {string[]} prioritySymbols  - Symbol IDs to seed
 * @param {Function} setMarketData    - State setter from TradingContext
 * @param {boolean}  enabled          - Whether to run (default: true)
 */
export function useRealMarketData(prioritySymbols, setMarketData, enabled = true) {
  const seedHistoricalData = useCallback(async () => {
    if (!enabled) return;
    for (const symbolId of prioritySymbols) {
      const candles = await fetchRealHistory(symbolId, '1m');
      if (candles && candles.length > 0) {
        setMarketData(prev => ({ ...prev, [symbolId]: candles }));
      }
      // Small delay between requests to avoid bursting the backend
      await new Promise(r => setTimeout(r, 400));
    }
  }, [prioritySymbols, setMarketData, enabled]);

  useEffect(() => {
    // Wait 3 s to let socket connect first and backend warm up
    const timer = setTimeout(seedHistoricalData, 3000);
    return () => clearTimeout(timer);
  }, [seedHistoricalData]);
}
