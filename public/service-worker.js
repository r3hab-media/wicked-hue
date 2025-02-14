const CACHE_NAME = `wicked-hue-pwa-${new Date().toISOString().replace(/[-:.TZ]/g, "")}`; // Increment the version number when making updates
const urlsToCache = ["/", "/index.html", "/manifest.json", "/service-worker.js", "/icons/icon-192x192.png", "/icons/icon-512x512.png"];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(urlsToCache);
		})
	);
	self.skipWaiting(); // Forces the new service worker to take control immediately
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((name) => name !== CACHE_NAME) // Delete old caches
					.map((name) => caches.delete(name))
			);
		})
	);
	self.clients.claim(); // Forces pages to use the updated service worker immediately
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		fetch(event.request)
			.then((response) => {
				return caches.open(CACHE_NAME).then((cache) => {
					cache.put(event.request, response.clone()); // Store fresh response in cache
					return response;
				});
			})
			.catch(() => caches.match(event.request)) // Use cache as a fallback
	);
});
