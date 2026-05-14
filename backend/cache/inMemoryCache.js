
const cache = new Map();

export function setCache(key, value, ttlMs) {
  const expiresAt = Date.now() + ttlMs;
  cache.set(key, { value, expiresAt });
}

export function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

export function deleteCache(key) {
  cache.delete(key);
}

export function hasCache(key) {
  const entry = cache.get(key);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return false;
  }
  return true;
}

export const TTL = {
  LIVE_PRICE: 10 * 1000,
  BATCH_PRICE: 60 * 1000,
  HISTORICAL: 60 * 60 * 1000,
  QUOTE: 30 * 1000,
};
