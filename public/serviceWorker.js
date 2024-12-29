// Cache configuration
const CACHE_NAME = 'api-cache-v1';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Helper functions
const isValidCache = (timestamp) => {
  return timestamp && (Date.now() - timestamp < CACHE_DURATION);
};

const createTimestampedResponse = async (response) => {
  const clonedResponse = response.clone();
  const responseData = await clonedResponse.json();
  
  return new Response(JSON.stringify({
    ...responseData,
    _timestamp: Date.now()
  }), {
    headers: {
      'Content-Type': 'application/json',
      'x-from-cache': 'false'
    }
  });
};

const createCachedResponse = (data) => {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'x-from-cache': 'true'
    }
  });
};

// Main fetch handler
self.addEventListener('fetch', (event) => {
  // Only handle GET requests to JSONPlaceholder API
  if (event.request.method !== 'GET' || 
      !event.request.url.includes('jsonplaceholder.typicode.com')) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);

        // Check for valid cached response
        if (cachedResponse) {
          const data = await cachedResponse.clone().json();
          
          if (isValidCache(data._timestamp)) {
            return createCachedResponse(data);
          }
        }

        // Fetch fresh data
        const response = await fetch(event.request);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Cache the fresh response
        const timestampedResponse = await createTimestampedResponse(response);
        await cache.put(event.request, timestampedResponse);

        return response;
      } catch (error) {
        console.error('Service Worker Error:', error);
        
        // Return cached data if available, even if expired
        if (cachedResponse) {
          return createCachedResponse(await cachedResponse.json());
        }

        // If no cache available, return error response
        return new Response(JSON.stringify({
          error: 'Network error occurred',
          message: error.message
        }), {
          status: 503,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    })()
  );
});