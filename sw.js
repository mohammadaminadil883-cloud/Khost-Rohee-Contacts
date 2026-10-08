var C="school-v1";
var SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
var LIB="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js";
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(C).then(function(c){
    return Promise.all([c.addAll(SHELL),c.add(new Request(LIB,{mode:"no-cors"}))]);
  }).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
  var r=e.request,u=new URL(r.url);
  if(r.method!=="GET")return;
  if(u.hostname.indexOf("supabase.co")>-1)return;
  var ok=u.origin===location.origin||u.hostname==="cdn.jsdelivr.net";
  if(!ok)return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(hit){
    var net=fetch(r).then(function(res){
      if(res&&(res.ok||res.type==="opaque")){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}
      return res;
    }).catch(function(){return hit||(r.mode==="navigate"?caches.match("index.html"):undefined)});
    return hit||net;
  }));
});
