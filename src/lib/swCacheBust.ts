/**
 * Delete matching entries from the Service Worker's API response cache.
 * Call this after mutations so the admin sees their own updates immediately,
 * rather than the SW serving a stale cached response.
 *
 * Matches by URL substring, so partial paths like '/api/recipe/123' work
 * regardless of origin.
 */
export async function bustSwCache(...paths: string[]): Promise<void> {
  if (!('caches' in window)) return;
  try {
    const cache = await caches.open('api-responses');
    const keys = await cache.keys();
    await Promise.all(
      keys
        .filter(req => paths.some(path => req.url.includes(path)))
        .map(req => cache.delete(req))
    );
  } catch {
    // SW not available in this context — safe to ignore
  }
}
