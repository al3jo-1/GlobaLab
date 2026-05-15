/**
 * Supabase backend provider
 * Uses PostgREST REST API directly (native fetch) — no Supabase JS client needed.
 * Handles: asset_cache, live_market_state, historical_cache, api_usage_logs.
 *
 * IMPORTANT: SUPABASE_URL may include /rest/v1/ suffix — always normalize.
 */

// Normalize URL: strip /rest/v1/ suffix and trailing slash
const SUPABASE_URL = process.env.SUPABASE_URL
  ?.replace(/\/rest\/v1\/?$/, '')
  .replace(/\/$/, '');

const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

function enabled() {
  return !!(SUPABASE_URL && SUPABASE_SERVICE_KEY);
}

function headers(extra = {}) {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    ...extra,
  };
}

/**
 * POST/upsert to a PostgREST table.
 * @param {string} table        - Table name
 * @param {*}      body         - Row or array of rows
 * @param {string} prefer       - Prefer header value
 * @param {string} onConflict   - Comma-separated conflict columns for upsert
 *                                (required when unique constraint is not the PK)
 */
async function pgPost(table, body, prefer = 'resolution=merge-duplicates', onConflict = '') {
  if (!enabled()) return false;
  try {
    const url = onConflict
      ? `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`
      : `${SUPABASE_URL}/rest/v1/${table}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: headers({ 'Prefer': prefer }),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.warn(`[Supabase] POST ${table} error ${res.status}: ${txt.slice(0, 120)}`);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[Supabase] POST ${table} fetch error: ${err.message}`);
    return false;
  }
}

async function pgGet(table, query = '') {
  if (!enabled()) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query ? '?' + query : ''}`, {
      headers: headers({ 'Prefer': 'return=representation' }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ─── asset_cache ──────────────────────────────────────────────────────────────

export async function upsertAssetCache(symbol, price, changePercent = 0) {
  return pgPost('asset_cache', {
    symbol, price, change_percent: changePercent, updated_at: new Date().toISOString(),
  });
}

export async function bulkUpsertAssetCache(priceMap) {
  if (!enabled() || Object.keys(priceMap).length === 0) return;
  const rows = Object.entries(priceMap).map(([symbol, price]) => ({
    symbol, price, change_percent: 0, updated_at: new Date().toISOString(),
  }));
  const ok = await pgPost('asset_cache', rows);
  if (ok) console.log(`[Supabase] Synced ${rows.length} prices to asset_cache`);
}

// ─── live_market_state ────────────────────────────────────────────────────────

export async function upsertLiveMarketState(symbol, data) {
  return pgPost('live_market_state', {
    symbol,
    last_price:      data.price,
    previous_close:  data.previousClose ?? data.price,
    percent_change:  data.percentChange ?? 0,
    volume:          data.volume ?? 0,
    updated_at:      new Date().toISOString(),
  });
}

export async function bulkUpsertLiveMarketState(priceMap) {
  if (!enabled() || Object.keys(priceMap).length === 0) return;
  const rows = Object.entries(priceMap).map(([symbol, price]) => ({
    symbol,
    last_price:     price,
    previous_close: price,
    percent_change: 0,
    volume:         0,
    updated_at:     new Date().toISOString(),
  }));
  await pgPost('live_market_state', rows);
}

// ─── historical_cache ─────────────────────────────────────────────────────────

export async function getCachedHistorical(symbol, timeframe) {
  const rows = await pgGet('historical_cache',
    `select=candles_json,updated_at&symbol=eq.${symbol}&timeframe=eq.${timeframe}&limit=1`);
  if (!rows || rows.length === 0) return null;
  const row = rows[0];
  // TTL: intraday (1m/5m/15m) → 15 min; others → 6h
  const isIntraday = ['1m','5m','15m'].includes(timeframe);
  const ttlMs = isIntraday ? 15 * 60 * 1000 : 6 * 60 * 60 * 1000;
  const age = Date.now() - new Date(row.updated_at).getTime();
  if (age > ttlMs) return null;
  try { return JSON.parse(row.candles_json); } catch { return null; }
}

export async function setCachedHistorical(symbol, timeframe, candles) {
  return pgPost(
    'historical_cache',
    { symbol, timeframe, candles_json: JSON.stringify(candles), updated_at: new Date().toISOString() },
    'resolution=merge-duplicates',
    'symbol,timeframe'
  );
}

// ─── api_usage_logs ───────────────────────────────────────────────────────────

export async function logApiUsage(provider, endpoint, requestCount = 1) {
  return pgPost('api_usage_logs', {
    provider,
    endpoint,
    request_count: requestCount,
    created_at:    new Date().toISOString(),
  }, 'return=minimal');
}

// ─── health check ─────────────────────────────────────────────────────────────

export function getSupabaseAdmin() {
  return enabled() ? { isReady: true, url: SUPABASE_URL } : null;
}

export async function isSupabaseReady() {
  if (!enabled()) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/asset_cache?select=symbol&limit=1`, {
      headers: headers(),
    });
    return res.ok;
  } catch {
    return false;
  }
}
