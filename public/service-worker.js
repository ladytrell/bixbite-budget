const FILES_TO_CACHE = [
  "./index.html",
  "./css/styles.css",
  "./js/index.js",
  "../routes/api.js",
  "../server.js",
  "../models/transaction.js",
  "./icons/icon-72x72.png",
  "./manifest.json"
];

const APP_PREFIX = 'BudgetTracker-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
          console.log('installing cache : ' + CACHE_NAME)
          return cache.addAll(FILES_TO_CACHE)
        })
    )  
});

// Clear old app cache and manage required cache content
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeeplist = keyList.filter(function (key) {
            return key.indexOf(APP_PREFIX);
            })
            cacheKeeplist.push(CACHE_NAME);

            return Promise.all(
                keyList.map(function(key, i) {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i]);
                    return caches.delete(keyList[i]);
                }
                })
            );
        })
    );
});

// Collect content from cache if there otherwise network request
self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
      caches.match(e.request).then(function (request) {
        if (request) { // if cache is available, respond with cache
          console.log('responding with cache : ' + e.request.url)
          return request
        } else {       // if there are no cache, try fetching request
          console.log('file is not cached, fetching : ' + e.request.url)
          return fetch(e.request)
        }
  
        // You can omit if/else for console.log & put one line below like this too.
        // return request || fetch(e.request)
      })
    )
}) 