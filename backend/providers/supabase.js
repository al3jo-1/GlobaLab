/**
 * Supabase backend provider
 * Uses PostgREST REST API directly (native fetch) for asset_cache writes —
 * avoids ws-transport issues with the Supabase JS client in Node 20.
 */

// Normalise: strip /rest/v1 suffix and trailing slash so we can append our own paths
const SUPABASE_URL = process.env.SUPABASE_URL
  ?.replace(/\/rest\/v1\/?$/, '')
  .replace(/\/$/, '');
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

function restHeaders() {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  };
}

export async function upsertAssetCache(symbol, price, changePercent = 0) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/asset_cache`, {
      method: 'POST',
      headers: { ...restHeaders(), 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({ symbol, price, change_percent: changePercent, updated_at: new Date().toISOString() }),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.warn(`[Supabase] upsert error for ${symbol}: ${txt.slice(0, 100)}`);
    }
  } catch (err) {
    console.warn(`[Supabase] upsert fetch error: ${err.message}`);
  }
}

export async function bulkUpsertAssetCache(priceMap) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || Object.keys(priceMap).length === 0) return;
  const rows = Object.entries(priceMap).map(([symbol, price]) => ({
    symbol,
    price,
    change_percent: 0,
    updated_at: new Date().toISOString(),
  }));
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/asset_cache`, {
      method: 'POST',
      headers: { ...restHeaders(), 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify(rows),
    });
    if (res.ok) {
      console.log(`[Supabase] Synced ${rows.length} prices to asset_cache`);
    } else {
      const txt = await res.text();
      console.warn(`[Supabase] bulk upsert error: ${res.status} ${txt.slice(0, 120)}`);
    }
  } catch (err) {
    console.warn(`[Supabase] bulk upsert fetch error: ${err.message}`);
  }
}

export async function isSupabaseReady() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/asset_cache?select=symbol&limit=1`, {
      headers: restHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Legacy: return a simple object for callers that expect getSupabaseAdmin()
export function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null;
  return {
    isReady: true,
    url: SUPABASE_URL,
  };
}
