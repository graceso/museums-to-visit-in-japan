// Initialise the map
const map = L.map('map').setView([36.2048, 138.2529], 5);

// Add dark-themed tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 24
}).addTo(map);

// Custom heart-shaped icon
const heartIcon = L.divIcon({
    html: `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ff4d4d">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                     2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
                     C13.09 3.81 14.76 3 16.5 3
                     19.58 3 22 5.42 22 8.5
                     c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Places data for museums
let places = [
    { name: "tokyo national museum", coords: [35.7188, 139.7765], link: "https://www.tnm.jp/?lang=en" },
    { name: "mori art museum", coords: [35.6605, 139.7293], link: "https://www.mori.art.museum/en/index.html" },
    { name: "kyoto national museum", coords: [34.9889, 135.773], link: "https://www.kyohaku.go.jp/eng/" },
    { name: "the national museum of art, osaka", coords: [34.6918, 135.4920], link: "https://www.nmao.go.jp/en/" },
    { name: "chichu art museum", coords: [34.4477, 133.9847], link: "https://benesse-artsite.jp/en/art/chichu.html", wantToGo: true },
    { name: "21st century museum of contemporary art", coords: [36.5613, 136.66], link: "https://www.kanazawa21.jp/en/" },
    { name: "hokkaido museum of modern art", coords: [43.0603, 141.3303], link: "https://artmuseum.pref.hokkaido.lg.jp/knb/english" },
    { name: "teamlab borderless: mori building digital art museum", coords: [35.6645, 139.7400], link: "https://www.teamlab.art/e/tokyo/" }
];

places.sort((a, b) => (b.wantToGo ? 1 : 0) - (a.wantToGo ? 1 : 0));

const markers = L.markerClusterGroup();
const markerMap = new Map();
const sidebar = document.getElementById('places-list');

places.forEach(place => {
    const badge = place.wantToGo ? '<span class="badge">❤️</span>' : '';
    const popupContent = `<b>${place.name}</b><br><a href="${place.link}" target="_blank">visit website</a>`;

    const marker = L.marker(place.coords, { icon: heartIcon }).bindPopup(popupContent);
    markers.addLayer(marker);
    markerMap.set(place.name.toLowerCase(), marker);

    const div = document.createElement('div');
    div.className = 'place';
    div.innerHTML = `
            <h2>${place.name} ${badge}</h2>
            <a href="${place.link}" target="_blank">visit website</a>
        `;
    div.addEventListener('click', () => {
        map.setView(place.coords, 8);
        marker.openPopup();
    });
    sidebar.appendChild(div);
});

map.addLayer(markers);

// Search functionality
const searchBox = document.getElementById('search-box');
searchBox.addEventListener('input', () => {
    const query = searchBox.value.toLowerCase();
    document.querySelectorAll('.place').forEach(item => {
        const name = item.querySelector('h2').textContent.toLowerCase();
        const match = name.includes(query);
        item.classList.toggle('hidden', !match);

        const marker = markerMap.get(name);
        if (marker) {
            if (match && query !== "") {
                marker.setIcon(L.icon({
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40]
                }));
            } else {
                marker.setIcon(customIcon);
            }
        }
    });

});

