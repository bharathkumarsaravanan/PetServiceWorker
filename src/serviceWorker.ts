// Service Worker implementation
const CACHE_NAME = 'api-cache-v1';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

interface CachedResponse {
  timestamp: number;
  response: Response;
}

self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        const data = await cachedResponse.clone().json();
        const timestamp = data._timestamp;

        if (timestamp && Date.now() - timestamp < CACHE_DURATION) {
          return cachedResponse;
        }
      }

      try {
        const response = await fetch(event.request);
        if (!response.ok) throw new Error('Network response was not ok');

        const clonedResponse = response.clone();
        const responseData = await clonedResponse.json();
        
        // Add timestamp to response
        const timestampedResponse = new Response(JSON.stringify({
          ...responseData,
          _timestamp: Date.now()
        }), {
          headers: response.headers
        });

        await cache.put(event.request, timestampedResponse);
        return response;
      } catch (error) {
        return cachedResponse || new Response('Network error', { status: 503 });
      }
    })()
  );
});