import { useEffect, useCallback, useRef, useState } from 'react';

const RETRY_DELAYS = [2000, 5000, 10000];

async function fetchWithRetry(url, signal, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, signal ? { signal } : undefined);
      if (res.ok) return res;
      return null;
    } catch (err) {
      if (err.name === 'AbortError') return null;
      if (i < retries) await new Promise(r => setTimeout(r, RETRY_DELAYS[i] ?? 10000));
    }
  }
  return null;
}

/**
 * Fetch real historical OHLC candles from the backend.
 * @param {string}         symbolId
 * @param {string}         timeframe
 * @param {AbortSignal}    signal  - optional abort signal
 */
export async function fetchRealHistory(symbolId, timeframe = '1d', signal = null) {
  try {
    const res = await fetchWithRetry(`/api/history/${symbolId}?timeframe=${timeframe}`, signal);
    if (!res) return null;
    const candles = await res.json();
    if (!Array.isArray(candles) || candles.length === 0) return null;
    return candles.map(c => ({ ...c, time: new Date(c.time), value: c.close }));
  } catch {
    return null;
  }
}

/**
 * Fetch a single live quote (served from 60 s scheduler cache on backend).
 */
export async function fetchRealQuote(symbolId) {
  try {
    const res = await fetchWithRetry(`/api/quote/${symbolId}`, null);
    if (!res) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetch live prices for multiple symbols.
 * Returns { [symbolId]: { price, source } }
 */
export async function fetchLivePrices(symbolIds) {
  try {
    const res = await fetchWithRetry(`/api/quotes?symbols=${symbolIds.join(',')}`, null);
    if (!res) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export const SUPPORTED_TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M'];

/**
 * Hook — seeds market data with real historical OHLC candles from the backend.
 *
 * Features:
 * - Returns `isFetching` so the UI can show a loading overlay
 * - Uses AbortController to cancel in-flight requests on timeframe/symbol change
 * - Bootstraps `livePrices` from the last candle of each symbol's history
 * - 250 ms stagger between symbols to avoid bursting the backend
 *
 * @param {string[]} prioritySymbols   - Symbols to fetch first
 * @param {Function} setMarketData     - State setter from TradingContext
 * @param {boolean}  enabled           - Whether to run (default: true)
 * @param {string}   timeframe         - Backend timeframe ('1m' → '1M')
 * @param {Function} setLivePrices     - Optional: bootstrap live price store from last candle
 */
export function useRealMarketData(
  prioritySymbols,
  setMarketData,
  enabled = true,
  timeframe = '1d',
  setLivePrices = null,
) {
  const [isFetching, setIsFetching] = useState(false);
  const loadedRef  = useRef(new Set());
  const abortRef   = useRef(null);

  const seedHistoricalData = useCallback(async () => {
    if (!enabled) return;

    // Cancel any in-flight requests from the previous run
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsFetching(true);

    for (const symbolId of prioritySymbols) {
      if (controller.signal.aborted) break;

      const key = `${symbolId}:${timeframe}`;
      if (loadedRef.current.has(key)) continue; // already loaded for this TF

      const candles = await fetchRealHistory(symbolId, timeframe, controller.signal);
      if (controller.signal.aborted) break;

      if (candles && candles.length > 0) {
        setMarketData(prev => ({ ...prev, [symbolId]: candles }));
        loadedRef.current.add(key);

        // Bootstrap live price store from last candle
        if (setLivePrices) {
          const last  = candles[candles.length - 1];
          const prev2 = candles.length > 1 ? candles[candles.length - 2] : null;
          const pct   = prev2?.close ? ((last.close - prev2.close) / prev2.close) * 100 : 0;
          setLivePrices(p => ({
            ...p,
            [symbolId]: { price: last.close, percentChange: pct, ts: Date.now(), source: 'historical' },
          }));
        }
      }

      // Stagger requests — avoid bursting the backend
      if (!controller.signal.aborted) {
        await new Promise(r => setTimeout(r, 250));
      }
    }

    if (!controller.signal.aborted) setIsFetching(false);
  }, [prioritySymbols, setMarketData, enabled, timeframe, setLivePrices]);

  useEffect(() => {
    // Reset loaded tracking when timeframe changes
    loadedRef.current = new Set();
    abortRef.current?.abort();

    // Small delay on first load (let socket connect first), no delay on TF change
    const delay = timeframe === '1d' ? 3000 : 400;
    const timer = setTimeout(seedHistoricalData, delay);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [seedHistoricalData, timeframe]);

  return { isFetching };
}
