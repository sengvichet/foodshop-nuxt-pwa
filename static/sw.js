importScripts('/_nuxt/workbox.4c4f5ca6.js')



workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/50c8e0972ccaa086d3b8.js",
    "revision": "280af8e386619f7df3fef26803ae5df2"
  },
  {
    "url": "/_nuxt/51b51d7939d0288f816f.js",
    "revision": "1f7bf0fa54d703dface47d8bdd0b43d3"
  },
  {
    "url": "/_nuxt/5c9704742bc71a767622.js",
    "revision": "40363f79fa80112585a04e6dc063b9f0"
  },
  {
    "url": "/_nuxt/60d8893f154414f7bcac.js",
    "revision": "61766b5e37c6388cf393c6854183337f"
  },
  {
    "url": "/_nuxt/7bf2a701123f3cd44166.js",
    "revision": "420b67b5fe08ff5216248df7f0adb2d5"
  },
  {
    "url": "/_nuxt/96299c78e69baa239383.js",
    "revision": "c9d97d2bdd4f72e2ef88f05b04dd21b3"
  },
  {
    "url": "/_nuxt/afeb71ba7870cf2a6882.js",
    "revision": "d586331ec58a895122e14df1767c9f52"
  },
  {
    "url": "/_nuxt/b58bacb5cc961da7ca78.js",
    "revision": "910203f04a2996a6726af43ad6580014"
  },
  {
    "url": "/_nuxt/d73134016d5dd8a97279.js",
    "revision": "75c81a6d4193a35399b55ca21f351f24"
  },
  {
    "url": "/_nuxt/e17c33966a3544f5eb78.js",
    "revision": "2f7045d9a5db1801b9c6262b83c9ce21"
  },
  {
    "url": "/_nuxt/e5ee8fb82c1ff4884426.js",
    "revision": "efba1273b27e5b3f3a8d13a5b324cebd"
  },
  {
    "url": "/_nuxt/f1009433ea818b7212dc.js",
    "revision": "a231366dc2e9993a9ced32690ec01189"
  },
  {
    "url": "/_nuxt/img/221862f.png",
    "revision": "221862f87a3c96058f446a084813464f"
  },
  {
    "url": "/_nuxt/img/26b64c0.svg",
    "revision": "26b64c0f1da7a725e571b7cde2d61da7"
  },
  {
    "url": "/_nuxt/img/2a6b364.svg",
    "revision": "2a6b3640a1dfa0117200ff7d2680db9f"
  },
  {
    "url": "/_nuxt/img/4f9506b.png",
    "revision": "4f9506bd45cb6e5faaab3f25fc607125"
  },
  {
    "url": "/_nuxt/img/6a82203.svg",
    "revision": "6a822032c25e2539020cd276b857ca8a"
  },
  {
    "url": "/_nuxt/img/8a2aabf.svg",
    "revision": "8a2aabf0e8f857590a5dc0c2afc3ebec"
  },
  {
    "url": "/_nuxt/img/8a82c65.svg",
    "revision": "8a82c65b52d580225f9bf1e9372c9a37"
  },
  {
    "url": "/_nuxt/img/c5722ee.svg",
    "revision": "c5722ee4b501a2ddb6e26c694c7fda42"
  },
  {
    "url": "/_nuxt/img/d4449df.svg",
    "revision": "d4449df5be97a3d7bcc6bb1a5664e0f2"
  },
  {
    "url": "/_nuxt/img/d84cf0a.svg",
    "revision": "d84cf0ae64c21b2a6252b378c7e6ac92"
  },
  {
    "url": "/_nuxt/img/e537557.svg",
    "revision": "e537557a2ed38800a90d1a0735a56303"
  }
], {
  "cacheId": "metamat-iot",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.precaching.precacheAndRoute(['/index.html'])

workbox.precaching.precacheAndRoute(['/404.html'])
workbox.routing.registerRoute(
    /.*\.(mp4|webm)/,
    workbox.strategies.cacheFirst({
      plugins: [
        new workbox.rangeRequests.Plugin(),
      ],
    }),
    'GET'
  );
workbox.clientsClaim()
workbox.skipWaiting()


workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('https://api.kompis.app/.*'), workbox.strategies.staleWhileRevalidate({"cacheName":"data_kompips","cacheExpiration":{"maxEntries":200,"maxAgeSeconds":259200},"cacheableResponse":{"statuses":[0,200]}}), 'GET')

workbox.routing.registerRoute(new RegExp('https://devapi.kompis.app/.*'), workbox.strategies.staleWhileRevalidate({"cacheName":"data_dev_kompis","cacheExpiration":{"maxEntries":200,"maxAgeSeconds":259200},"cacheableResponse":{"statuses":[0,200]}}), 'GET')

workbox.routing.registerRoute(new RegExp('https://cdn.kompis.app/public/.*'), workbox.strategies.staleWhileRevalidate({"cacheName":"data_kompis_app","cacheExpiration":{"maxEntries":200,"maxAgeSeconds":259200},"cacheableResponse":{"statuses":[0,200]}}), 'GET')



// offlinePage support
const strategy = workbox.strategies.networkOnly()
workbox.routing.registerRoute(new RegExp('/.*'), ({event}) => {
  return strategy.handle({event})
    .catch(() => caches.match('/404.html'))
})


