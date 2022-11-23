var map;

async function fetchSightings() {
    var url = `http://${location.hostname}:3000/get-positions`;
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

window.addEventListener('DOMContentLoaded', async function () {
    map = L.map('map').setView([20.574854, -103.440244], 10);

    L.tileLayer(`http://${location.hostname}:8080/tile/{z}/{x}/{y}.png`, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Get lat and lon from click on map
    map.on('click', function (e) {
        var lat = e.latlng.lat;
        var lon = e.latlng.lng;
        document.getElementById('lat').value = lat;
        document.getElementById('lon').value = lon;
        console.log(lat, lon);
    });

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