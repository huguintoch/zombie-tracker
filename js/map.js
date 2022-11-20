window.addEventListener('DOMContentLoaded', function() {
    var coords = [20.574854, -103.440244]
    var map = L.map('map').setView(coords, 2);
    
    L.tileLayer(`http://${location.hostname}:8080/{z}/{x}/{y}.png`, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker(coords).addTo(map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();
});