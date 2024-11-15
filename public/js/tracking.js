// Tracking functionality
const tracking = {
    map: null,
    busMarker: null,
    route: [
        [51.505, -0.09],
        [51.51, -0.1],
        [51.515, -0.09],
        [51.52, -0.1]
    ],
    currentRouteIndex: 0,

    initMap(containerId) {
        this.map = L.map(containerId).setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.busMarker = L.marker([51.505, -0.09]).addTo(this.map);
        this.startTracking();
    },

    startTracking() {
        setInterval(() => {
            this.updateBusLocation();
        }, 3000);
    },

    updateBusLocation() {
        this.currentRouteIndex = (this.currentRouteIndex + 1) % this.route.length;
        const newPosition = this.route[this.currentRouteIndex];
        this.busMarker.setLatLng(newPosition);
    }
};