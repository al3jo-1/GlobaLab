import { useEffect, useCallback, useRef } from 'react';

const RETRY_DELAYS = [3000, 6000, 12000];

/**
 * Fetch with retry — tolerates backend cold-start race conditions.
 */
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
      return null;
    } catch {
      if (i < retries) await new Promise(r => setTimeout(r, RETRY_DELAYS[i] ?? 12000));
    }
  }
  return null;
}

/**
 * Timeframe → Yahoo-compatible query params used by the backend.
 * Longer timeframes return proportionally more historical candles.
 *
 * 1m  → 1 day   (~250 candles)
 * 5m  → 5 days
 * 15m → 1 month
 * 1h  → 6 months
 * 4h  → 6 months (60m bars)
 * 1d  → 2 years  ← default chart view
 * 1w  → 5 years
 * 1M  → max history
 */
export const SUPPORTED_TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M'];

/**
 * Fetch real historical OHLC data from the backend.
 * Uses relative /api path — Vite proxies to backend:3000.
 */
export async function fetchRealHistory(symbolId, timeframe = '1d') {
  try {
    const res = await fetchWithRetry(`/api/history/${symbolId}?timeframe=${timeframe}`);
    if (!res) return null;
    const candles = await res.json();
    if (!Array.isArray(candles) || candles.length === 0) return null;
    return candles.map(c => ({
      ...c,
      time:  new Date(c.time),
      value: c.close,
    }));
  } catch {
    return null;
  }
}

/**
 * Fetch a real-time quote for one symbol (served from scheduler cache on backend).
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
 * Fetch live prices for multiple symbols from the backend batch endpoint.
 * No extra API calls — served from the 60 s scheduler cache.
 */
export async function fetchLivePrices(symbolIds) {
  try {
    const res = await fetchWithRetry(`/api/quotes?symbols=${symbolIds.join(',')}`);
    if (!res) return {};
    return await res.json();
  } catch {
    return {};
  }
}

/**
 * Hook — seeds market data with real historical candles from the backend.
 * - Runs once on mount (3 s delay to let socket connect first)
 * - Supports dynamic timeframe changes
 * - Does NOT refetch if data for this symbol+timeframe is already present
 * - Appends incremental updates from live_prices socket events
 *
 * @param {string[]} prioritySymbols  - Symbol IDs to seed first
 * @param {Function} setMarketData    - State setter from TradingContext
 * @param {boolean}  enabled          - Whether to run (default: true)
 * @param {string}   timeframe        - Timeframe to load ('1m','1d','1w', etc.)
 */
export function useRealMarketData(
  prioritySymbols,
  setMarketData,
  enabled = true,
  timeframe = '1d'
) {
  const loadedRef = useRef(new Set()); // track which symbol+tf combos are loaded
  const abortRef  = useRef(false);

  const seedHistoricalData = useCallback(async () => {
    if (!enabled) return;
    abortRef.current = false;

    for (const symbolId of prioritySymbols) {
      if (abortRef.current) break;
      const key = `${symbolId}:${timeframe}`;
      if (loadedRef.current.has(key)) continue; // already loaded

      const candles = await fetchRealHistory(symbolId, timeframe);
      if (candles && candles.length > 0) {
        setMarketData(prev => ({ ...prev, [symbolId]: candles }));
        loadedRef.current.add(key);
      }

      // Stagger requests to avoid bursting the backend
      if (!abortRef.current) await new Promise(r => setTimeout(r, 300));
    }
  }, [prioritySymbols, setMarketData, enabled, timeframe]);

  useEffect(() => {
    // Reset loaded tracking when timeframe changes
    loadedRef.current = new Set();
    abortRef.current  = false;

    // Wait 3 s — let socket connect and backend warm up first
    const timer = setTimeout(seedHistoricalData, 3000);
    return () => {
      clearTimeout(timer);
      abortRef.current = true;
    };
  }, [seedHistoricalData, timeframe]);
}
