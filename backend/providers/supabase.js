import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabaseAdmin = null;

export function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return null;
  }
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
      realtime: { transport: ws },
    });
  }
  return supabaseAdmin;
}

export async function upsertAssetCache(symbol, price, changePercent = 0) {
  try {
    const db = getSupabaseAdmin();
    if (!db) return;
    await db.from('asset_cache').upsert({
      symbol,
      price,
      change_percent: changePercent,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'symbol' });
  } catch (err) {
    // Non-critical — silently fail if table doesn't exist yet
  }
}

export async function bulkUpsertAssetCache(priceMap) {
  try {
    const db = getSupabaseAdmin();
    if (!db || Object.keys(priceMap).length === 0) return;
    const rows = Object.entries(priceMap).map(([symbol, price]) => ({
      symbol,
      price,
      change_percent: 0,
      updated_at: new Date().toISOString(),
    }));
    await db.from('asset_cache').upsert(rows, { onConflict: 'symbol' });
    console.log(`[Supabase] Synced ${rows.length} prices to asset_cache`);
  } catch (err) {
    console.warn(`[Supabase] asset_cache upsert skipped: ${err.message?.slice(0, 80)}`);
  }
}
