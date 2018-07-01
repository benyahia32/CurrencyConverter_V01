	const cacheName = 'cache-v1';

	const filesToCache = [
		'./index.html',
		'js/app.js',
		'js/idb.js',
		'js/jquery.min.js',
		'css/style.css',
		'node_modules/bootstrap/dist/css/bootstrap.min.css',
		'node_modules/bootstrap/dist/js/bootstrap.min.js',
		'https://www.w3schools.com/w3css/4/w3.css'
	];

	self.addEventListener('install', event => {
	  event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            console.info('Caching of files Initiation');
            return cache.addAll(filesToCache);
        })
      );
	});

	self.addEventListener('activate', event => {
	  event.waitUntil(
		  caches.keys()
			.then(keyList => Promise.all(keyList.map(thisCacheName => {
            if (thisCacheName !== cacheName){
                console.log("Service worker removing cached files from", thisCacheName);
                return caches.delete(thisCacheName);
            }
        })))
		);
	  return self.clients.claim();
	});


	self.addEventListener('fetch', event => {
	  event.respondWith(caches.match(event.request)
		.then(response => response || fetch(event.request)
      .then(response => caches.open(cacheName)
      .then(cache => {
        cache.put(event.request, response.clone());
        return response;
      })).catch(event => {
      console.log('Service Worker error caching and fetching');
    }))
	 );
	});
