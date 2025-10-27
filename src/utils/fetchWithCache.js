const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchWithCache(key, url) {
  const cached = localStorage.getItem(key);
  if (cached) {
    const parsed = JSON.parse(cached);
    const age = Date.now() - parsed.timestamp;
    if (age < CACHE_DURATION && parsed.data?.results?.length) {
      console.log(`🟢 Using cached data for: ${key}`);
      return parsed.data;
    }
  }

  console.log(`🔵 Fetching new data for: ${key}`);
  const res = await fetch(url);
  const data = await res.json();

  // store in cache
  localStorage.setItem(
    key,
    JSON.stringify({ timestamp: Date.now(), data })
  );
  return data;
}
