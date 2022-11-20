function fetchSightings() {
    var url = `http://${location.hostname}:3000/get-positions`;
    return fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            localStorage.setItem('sightings', JSON.stringify(data));
        });
}

function drawSightingsOnMap(sightings, map) {
    var colorTypeDict = {
        'zombie': 'red',
        'human': 'blue',
        'food': 'green'
    };

    sightings.forEach(function (sighting) {
        var markerColor = colorTypeDict[sighting.TYPE];
        var marker = L.circleMarker([sighting.LAT, sighting.LON], {radius: 10, fillColor: markerColor, fill: true, stroke: false}).addTo(map);
        marker.bindPopup(sighting.DESCRIPTION);
    });
}

window.addEventListener('DOMContentLoaded', async function() {
    var map = L.map('map').setView([20.574854, -103.440244], 10); 
       
    L.tileLayer(`http://${location.hostname}:8080/tile/{z}/{x}/{y}.png`, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    fetchSightings().then(function () {
        var sightings = JSON.parse(localStorage.getItem('sightings'));
        drawSightingsOnMap(sightings, map);
    });
});