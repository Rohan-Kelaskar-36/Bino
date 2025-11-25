

const cacheStore = new Map();
const TTL = 10 * 60 * 1000; 

export const getCache = (key) => {
  const entry = cacheStore.get(key);

  if (!entry) return null;

  const isValid = Date.now() - entry.time < TTL;
  return isValid ? entry.data : null;
};

export const setCache = (key, data) => {
  cacheStore.set(key, { time: Date.now(), data });
};
