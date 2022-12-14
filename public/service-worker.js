const APP_PREFIX = 'BudgetTracker-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
  "./index.html", 
  "./css/styles.css",
  "./icons/icon-72x72.png"
];

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { 
        console.log('responding with cache : ' + e.request.url)
        return request;
      } else { 
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request);
      }
    })
  )
}); 

// Installing cache resources listed in FILES_TO_CACHE
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Files pre-cached successfully : " + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE);
    })
  )
});

// Activate and delete old caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      })
      cacheKeeplist.push(CACHE_NAME);
      return Promise.all(keyList.map(function (key, i) {
        if (cacheKeeplist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] );
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});


