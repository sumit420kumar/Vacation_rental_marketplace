const mapElement = document.getElementById('listing-map');
const coordinates = JSON.parse(mapElement.dataset.coordinates || '[]');
const address = mapElement.dataset.address || '';
const title = mapElement.dataset.title || '';

var map = L.map('listing-map').setView([coordinates[1], coordinates[0]], 5);// starting position lati , lang
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// console.log(coordinates);

var marker = L.marker([coordinates[1], coordinates[0]]).addTo(map);
marker.bindPopup(`<h5>${address}</h5><br><b>Place</b>: ${title}`).openPopup();


var circle = L.circle([coordinates[1], coordinates[0]], {
    color: 'black',
    fillColor: '#82EEfd',
    fillOpacity: 0.4,
    radius: 100,
}).addTo(map);
