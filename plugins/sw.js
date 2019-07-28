import Vue from 'vue'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const worker of registrations) {
      console.log('Service worker:', worker)
    }
  });
}

  window.addEventListener("load", () => {
    if(navigator.onLine) {
      console.log('online');
      console.log('install');
      caches.open('pre_cache_data').then(function(cache) {
        return cache.addAll([
          '/',
          '/shop/',
          '/contact/',
          '/forget-password/',
          '/login/',
          '/menu/',
          '/temporary-login',
          '/videos/',
          '/employees/',
          '/orders-history/'
        ])
      })
    } else {
      console.log('offline');
      Vue.$notify('Network connection errors', 'error');
    }
    function handleNetworkChange(event) {
      if (navigator.onLine) {
          console.log('online');
          window.location.reload();
      } else {
          console.log('offline');
          Vue.$notify('Network connection errors', 'error');
      }
    }
    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);
  });


  // Cache reload when status changes from offline to online.
  // let refreshing;
  // navigator.serviceWorker.addEventListener("controllerchange", e => {
  //   console.log("controllerchange event", e);
  //   if (refreshing) return;
  //   window.location.reload();
  //   refreshing = true;
  // });

  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
  });

  if (window.navigator.standalone === true) {
    console.log('display-mode is standalone');
  }

