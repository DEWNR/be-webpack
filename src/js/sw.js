workbox.precaching.precacheAndRoute(self.__precacheManifest);

//add in src/src-sw.js
workbox.routing.registerRoute(
    /\.localhost/,
    new workbox.strategies.NetworkFirst({
        cacheName: "currencies",
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 10 * 60 // 10 minutes
            })
        ]
    })
);


// offline google analytics
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.googleAnalytics.initialize();

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());