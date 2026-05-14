/**
 * In-memory TTL cache with hit/miss metrics
 */

const cache = new Map();

const metrics = {
  hits: 0,
  misses: 0,
  sets: 0,
  evictions: 0,
};

export function setCache(key, value, ttlMs) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  metrics.sets++;
}

export function getCache(key) {
  const entry = cache.get(key);
  if (!entry) { metrics.misses++; return null; }
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    metrics.evictions++;
    metrics.misses++;
    return null;
  }
  metrics.hits++;
  return entry.value;
}

export function deleteCache(key) {
  cache.delete(key);
}

export function hasCache(key) {
  const entry = cache.get(key);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return false; }
  return true;
}

export function getCacheMetrics() {
  const total = metrics.hits + metrics.misses;
  return {
    ...metrics,
    size: cache.size,
    hitRate: total > 0 ? (metrics.hits / total * 100).toFixed(1) + '%' : '0%',
  };
}

/** Evict all expired entries (run periodically to free memory) */
export function clearExpired() {
  const now = Date.now();
  for (const [k, v] of cache.entries()) {
    if (now > v.expiresAt) { cache.delete(k); metrics.evictions++; }
  }
}

export const TTL = {
  LIVE_PRICE:   60 * 1000,          // 60 s  — matches scheduler interval
  BATCH_PRICE:  60 * 1000,          // 60 s
  QUOTE:        60 * 1000,          // 60 s
  HISTORICAL:   15 * 60 * 1000,     // 15 min — intraday
  HISTORICAL_D: 6 * 60 * 60 * 1000, // 6 h   — daily+
  SUPABASE:     5 * 60 * 1000,      // 5 min  — supabase cached historical
};
