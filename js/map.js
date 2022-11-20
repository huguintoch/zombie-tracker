function fetchSightings() {
    var url = `http://${location.hostname}:3000/get-positions`;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            localStorage.setItem('sightings', JSON.stringify(data));
        });
}

function drawSightingsOnMap(sightings) {
    sightings.forEach(function (sighting) {
        var marker = L.marker([sighting.latitude, sighting.longitude]).addTo(map);
        marker.bindPopup(sighting.description);
    });
}

window.addEventListener('DOMContentLoaded', function() {    
    L.tileLayer(`http://${location.hostname}:8080/tile/{z}/{x}/{y}.png`, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    fetchSightings();
    var sightings = JSON.parse(localStorage.getItem('sightings'));
    drawSightingsOnMap(sightings);
});