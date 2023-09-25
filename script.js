//Create Map
var map = L.map('map')

//Add OpenStreetMap tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// home marker
const homePin = L.icon({
    iconUrl: './assets/luffy-transparent.png',
    iconSize: [45, 45], // size of the icon
    iconAnchor: [19, 38], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -38] // point from which the popup should open relative to the iconAnchor
});

// Use Geolocation API to get the user's location
navigator.geolocation.getCurrentPosition(function (position) {
    // Set the map view to the user's location
    map.setView([position.coords.latitude, position.coords.longitude], 13)
    L.marker([position.coords.latitude, position.coords.longitude], { icon: homePin }).addTo(map).bindPopup('You are here').openPopup()
})


document.getElementById('searchButton').addEventListener('click', function () {
    const inputValue = document.getElementById('searchOptions').value

    // Clear previous markers
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
            //adding back the home marker after all markers are removed
            navigator.geolocation.getCurrentPosition(function (position) {
                L.marker([position.coords.latitude, position.coords.longitude], { icon: homePin }).addTo(map).bindPopup('You are here').openPopup()
            })
        }
    });

    async function placeSearch() {
        const { lat, lng } = map.getCenter();

        const searchParams = new URLSearchParams({
            query: `${inputValue}`,
            ll: `${lat},${lng}`,
            limit: 5,
            open_now: 'true',
            sort: 'DISTANCE'
        });
        const results = await fetch(
            `https://api.foursquare.com/v3/places/search?${searchParams}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: 'fsq3WavIXHIRfV7CF4x1q5S0fRfS0ydTld4UNavls+8M9sI=',
                }
            }
        );
        const data = await results.json();

        //forEach function to get the geocode data from json
        data.results.forEach(geoData => {
            const location = geoData.geocodes.main
            L.marker([location.latitude, location.longitude]).addTo(map).bindPopup(geoData.name);
        })
    }
    placeSearch()
})


