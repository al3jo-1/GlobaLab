/**
 * Global Market Price Scheduler
 * ─────────────────────────────
 * ONE batch fetch per 60 seconds for ALL priority symbols.
 * TwelveData free tier: 8 credits/min → we use exactly 1 batch call (7 symbols).
 * Yahoo Finance fills any gaps for free.
 *
 * Architecture:
 *   scheduler.tick() called every 60 s
 *   → 1 TwelveData batch (≤7 symbols)
 *   → Yahoo fallback for misses
 *   → update in-memory priceStore
 *   → persist to Supabase asset_cache + live_market_state
 *   → callback to broadcast via Socket.IO
 */

import { fetchBatchQuotes } from './providers/twelvedata.js';
import { fetchBatchCurrentPrices } from './providers/yahoo.js';
import { bulkUpsertAssetCache, bulkUpsertLiveMarketState, logApiUsage } from './providers/supabase.js';
import { getCacheMetrics, clearExpired } from './cache/inMemoryCache.js';

// ─── Priority symbols (TwelveData, ≤7 per batch call on free tier) ────────────
export const PRIORITY_SYMBOLS = ['BTCUSD', 'ETHUSD', 'AAPL', 'EURUSD', 'NVDA', 'SOLUSD', 'SPX'];

// ─── Shared price store (symbol → { price, previousPrice, percentChange, ts }) ─
const priceStore = new Map();

// ─── Metrics ─────────────────────────────────────────────────────────────────
const schedulerMetrics = {
  ticks:          0,
  apiCallsTD:     0,
  apiCallsYahoo:  0,
  failures:       0,
  lastTickAt:     null,
  symbolsActive:  0,
};

// ─── Broadcast callback (set by server.js) ────────────────────────────────────
let _broadcastCallback = null;
export function onPriceUpdate(cb) { _broadcastCallback = cb; }

// ─── Price store accessors ────────────────────────────────────────────────────
export function getPrice(symbolId) {
  return priceStore.get(symbolId) ?? null;
}

export function getAllPrices() {
  return Object.fromEntries(priceStore.entries());
}

export function setFallbackPrice(symbolId, price) {
  if (!priceStore.has(symbolId)) {
    priceStore.set(symbolId, { price, previousPrice: price, percentChange: 0, ts: Date.now() });
  }
}

export function getSchedulerMetrics() {
  return { ...schedulerMetrics, cacheMetrics: getCacheMetrics() };
}

// ─── Scheduler tick ───────────────────────────────────────────────────────────
export async function tick() {
  schedulerMetrics.ticks++;
  schedulerMetrics.lastTickAt = new Date().toISOString();

  // 1. Batch fetch from TwelveData (one call, ≤7 symbols)
  let realPrices = {};
  try {
    realPrices = await fetchBatchQuotes(PRIORITY_SYMBOLS);
    const fetched = Object.keys(realPrices).length;
    if (fetched > 0) {
      schedulerMetrics.apiCallsTD++;
      await logApiUsage('twelvedata', 'batch_price', 1);
    }
  } catch (err) {
    console.error('[Scheduler] TwelveData error:', err.message);
    schedulerMetrics.failures++;
  }

  // 2. Yahoo Finance fallback for any missed symbols
  const missing = PRIORITY_SYMBOLS.filter(s => !realPrices[s]);
  if (missing.length > 0) {
    try {
      const yahooPrices = await fetchBatchCurrentPrices(missing);
      Object.assign(realPrices, yahooPrices);
      if (Object.keys(yahooPrices).length > 0) {
        schedulerMetrics.apiCallsYahoo++;
        await logApiUsage('yahoo', 'batch_price', missing.length);
      }
      if (missing.length > 0) {
        console.log(`[Scheduler] Yahoo fallback for: ${missing.join(', ')}`);
      }
    } catch (err) {
      console.error('[Scheduler] Yahoo error:', err.message);
    }
  }

  if (Object.keys(realPrices).length === 0) {
    console.warn('[Scheduler] Tick produced no prices — using cached values');
    return;
  }

  // 3. Update price store
  for (const [symbolId, price] of Object.entries(realPrices)) {
    if (!price || price <= 0) continue;
    const prev = priceStore.get(symbolId);
    const prevPrice = prev?.price ?? price;
    const pctChange = prevPrice > 0 ? ((price - prevPrice) / prevPrice) * 100 : 0;
    priceStore.set(symbolId, {
      price,
      previousPrice: prevPrice,
      percentChange: parseFloat(pctChange.toFixed(4)),
      ts: Date.now(),
    });
  }

  schedulerMetrics.symbolsActive = priceStore.size;
  console.log(`[Scheduler] Tick #${schedulerMetrics.ticks} — updated ${Object.keys(realPrices).length} prices`);

  // 4. Persist to Supabase (non-blocking, fire-and-forget)
  bulkUpsertAssetCache(
    Object.fromEntries(Object.entries(realPrices).filter(([, p]) => p > 0))
  ).catch(() => {});

  bulkUpsertLiveMarketState(
    Object.fromEntries(Object.entries(realPrices).filter(([, p]) => p > 0))
  ).catch(() => {});

  // 5. Broadcast to all connected clients
  if (_broadcastCallback) {
    _broadcastCallback(Object.fromEntries(
      [...priceStore.entries()].map(([sym, d]) => [sym, d.price])
    ));
  }

  // 6. Evict expired cache entries (light housekeeping)
  clearExpired();
}

// ─── Start global scheduler ───────────────────────────────────────────────────
let _interval = null;

export function startScheduler() {
  if (_interval) return;
  console.log('[Scheduler] Started — global price refresh every 60 s');
  // First tick after 5 s (let server fully boot)
  setTimeout(tick, 5000);
  _interval = setInterval(tick, 60 * 1000);
}

export function stopScheduler() {
  if (_interval) { clearInterval(_interval); _interval = null; }
}
