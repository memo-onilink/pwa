const  CACHE_STATIC='cacheStatic_v1';
const  CACHE_DYNAMIC='cacheDinamico_v1';
const  CACHE_INMUTABLE='cacheInmutable_v1';

const APP_SHELL=[
    '/',
    '/index.html',
    '/css/style.css',
    '/img/avatars/hulk.jpg',
    '/img/avatars/ironman.jpg',
    '/img/avatars/spiderman.jpg',
    '/img/avatars/thor.jpg',
    '/img/avatars/wolverine.jpg',
    '/img/favicon.ico',
    '/js/app.js'
];

const APP_INMUTABLE=[
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    '/js/libs/jquery.js',
    '/css/animate.css',
];

self.addEventListener('install',e=>{
    let cacheStatic=caches.open(CACHE_STATIC)
    .then(cache=>{
        cache.addAll(APP_SHELL);
    });

    let cacheInmutable=caches.open(CACHE_INMUTABLE)
    .then(cache=>{
        cache.addAll(APP_INMUTABLE);
    });

    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));
});

self.addEventListener('activated',e=>{
    let promesaBorrar=caches.keys()
    .then(keys=>{
        keys.forEach(key=>{
            if(key!==CACHE_STATIC && key!==CACHE_DYNAMIC && key!=CACHE_INMUTABLE){
                return caches.delete(key);
            }
        })

    });
    e.waitUntil(promesaBorrar);
});


self.addEventListener('fetch',e=>{

    //respuesta=caches.match(e.request).then(respuestaCache=>respuestaCache);

   respuesta= caches.match(e.request)
    .then(respuestaCache=>{
        if(respuestaCache) return respuestaCache;

        console.log(e.request.url);

        return fetch(e.request)
            .then(respuestaFetch=>{
                if(respuestaFetch.ok){
                    return caches.open(CACHE_DYNAMIC)
                        .then(cache=>{
                            cache.put(e.request,respuestaFetch.clone());
                            return respuestaFetch.clone();
                        });
                    
                }else{
                    return respuestaFetch;
                }
            });

    });

    e.respondWith(respuesta);
});