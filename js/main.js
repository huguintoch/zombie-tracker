/* Log page load time */
console.time('Page load time'); // Start timer
window.addEventListener('load', function() {
  console.timeEnd('Page load time'); // End timer
}); 

/* Register service worker */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/js/sw.js')
  .then(function(registration) {
    console.log('Service worker registered');
  })
  .catch(function(err) {
    console.log('Service worker registration failed: ', err);
  });
}