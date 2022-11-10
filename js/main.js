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

const AVAILABLE_TYPES = ['zombie', 'human', 'food'];

function onSumbit() {
  const type = document.querySelector('#type');
  const latitude = document.querySelector('#lat');
  const longitude = document.querySelector('#lon');
  const description = document.querySelector('#description');

  if (!isZombieFormValid(type, latitude, longitude, description)) {
    return;
  } 
  
  const dbForm = {
    TYPE: type.value,
    LAT: latitude.value,
    LON: longitude.value,
    DESCRIPTION: description.value
  }

  postZombieFormInDB(dbForm)
    .then(() => {
      const button = document.getElementById("active");
      button.checked = false;
    })
    .catch((error) => {
      console.log("[TODO] Handle error", error);
    })
  
  const button = document.getElementById("active");
  button.checked = false;
}

function isZombieFormValid(type, latitude, longitude, description) {
  let validForm = true;
  if (!AVAILABLE_TYPES.includes(type?.value)) {
    setInputInvalid(type);
    validForm = false;
  } else {
    setInputValid(type);
  }

  if (!isLatValid(latitude?.value)) {
    setInputInvalid(latitude);
    validForm = false;
  } else {
    setInputValid(latitude);
  }

  if (!isLonValid(longitude?.value)) {
    setInputInvalid(longitude);
    validForm = false;
  } else {
    setInputValid(longitude);
  }

  if (description?.value == null || description.value.length === 0) {
    setInputInvalid(description);
    validForm = false;
  } else {
    setInputValid(description);
  }
  return validForm;
}

function setInputInvalid(element) {
  element.style.border = '3px solid red';
}

function setInputValid(element) {
  element.style.border = '';
}


function isLatValid(latitude) {
  if (latitude == '') {
    return false;
  }
  const lat = Math.abs(latitude);
  return Number.isFinite(lat) && lat <= 90;
}

function isLonValid(longitude) {
  if (longitude == '') {
    return false;
  }
  const lon = Math.abs(longitude);
  return Number.isFinite(lon) && lon <= 180;
}

function postZombieFormInDB(form) {
  const http = context.services.get("myHttp");
  return http.post({
    url: "http://localhost:3000/create-position",
    body: { FORM: form },
    encodeBodyAsJSON: true
  });
}