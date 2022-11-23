var map;

async function fetchSightings() {
    var url = `http://localhost:3000/get-positions`;
    return fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            localStorage.setItem('sightings', JSON.stringify(data));
        });
}

async function saveOfflineSightings() {
    var offlineSightings = JSON.parse(localStorage.getItem('new-sightings') || '[]');
    return Promise.all(offlineSightings.map((sighting) => postZombieFormInDB(sighting, false))).then(() => {
        localStorage.removeItem('new-sightings');
    });
}

function drawSightingsOnMap(sightings) {
    if (!map) return;

    var colorTypeDict = {
        'zombie': 'red',
        'human': 'blue',
        'food': 'green'
    };

    sightings.forEach(function (sighting) {
        var markerColor = colorTypeDict[sighting.TYPE];
        var marker = L.circleMarker(
            [sighting.LAT, sighting.LON],
            {
                radius: 5,
                fillColor: markerColor,
                fillOpacity: 1,
                fill: true,
                stroke: false
            }
        ).addTo(map);
        marker.bindPopup(sighting.DESCRIPTION);
    });
}

async function getCurrentPosition() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function setFormLocation(lat, lon) {
    document.getElementById('lat').value = lat;
    document.getElementById('lon').value = lon;
}

window.addEventListener('DOMContentLoaded', async function () {
    // Get current position
    var currentCoords = [20.574854, -103.440244];
    try {        
        var position = await getCurrentPosition();
        var browserLat = position.coords.latitude;
        var browserLon = position.coords.longitude;
        currentCoords = [browserLat, browserLon];
        setFormLocation(browserLat, browserLon);
        console.log('Browser location: ', browserLat, browserLon);
    } catch (error) {
        console.log('Error getting current position', error);
    }

    map = L.map('map').setView(currentCoords, 10);

    L.tileLayer(`http://localhost:8080/tile/{z}/{x}/{y}.png`, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Get lat and lon from click on map
    map.on('click', function (e) {
        var mapLat = e.latlng.lat;
        var mapLon = e.latlng.lng;
        setFormLocation(mapLat, mapLon);
        console.log('Map clicked @: ', mapLat, mapLon);
    });

    // Add legend to map
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.style.backgroundColor = 'white';
        div.style.padding = '5px';
        div.style.border = '2px solid black';
        div.innerHTML += '<b>Legend</b><br>';
        div.innerHTML += '<span style="color: red;">Zombie </span> | ';
        div.innerHTML += '<span style="color: blue;">Shelter </span> | ';
        div.innerHTML += '<span style="color: green;">Food </span><br><br>';
        div.innerHTML += '<b>Click on map to store coordinates</b>';
        return div;
    };
    legend.addTo(map);

    try {
        await saveOfflineSightings();
        await fetchSightings();
    } catch (error) {
        console.log(error);
    } finally {
        var sightings = JSON.parse(localStorage.getItem('sightings') || '[]');
        drawSightingsOnMap(sightings);
    }

    /** Enable click with enter on tabbable elements */
    document.querySelectorAll('.menu-btn')
        .forEach(el => el.addEventListener('keyup', e => {
            if (e.key === 'Enter') {
                e.target.click();
            }
        }));
});