let map;
let marker;

// Initialize map immediately
window.onload = function () {
    map = L.map('map').setView([20, 78], 5); // India view

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
};

// MAIN SOS FUNCTION
function sendSOS(triggerType) {

    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (pos) {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            // Show marker on map
            if (marker) {
                marker.setLatLng([lat, lon]);
            } else {
                marker = L.marker([lat, lon]).addTo(map);
            }

            map.setView([lat, lon], 16);

            // SEND TO GOOGLE FORM (POLICE + HOSPITAL DASHBOARD)
            const FORM_URL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";

            fetch(
                FORM_URL +
                "?entry.111111=" + lat +
                "&entry.222222=" + lon +
                "&entry.333333=" + triggerType,
                { method: "POST", mode: "no-cors" }
            );

            alert(
                "🚨 SOS SENT\n\n" +
                "Latitude: " + lat + "\n" +
                "Longitude: " + lon + "\n\n" +
                "Location shared with Police & Hospital"
            );
        },
        function () {
            alert("Location permission denied");
        }
    );
}

// SHAKE DETECTION
let lastX = 0, lastY = 0, lastZ = 0;
const threshold = 15;

window.addEventListener("devicemotion", function (event) {
    const acc = event.accelerationIncludingGravity;
    const delta =
        Math.abs(acc.x - lastX) +
        Math.abs(acc.y - lastY) +
        Math.abs(acc.z - lastZ);

    if (delta > threshold) {
        sendSOS("Shake");
    }

    lastX = acc.x;
    lastY = acc.y;
    lastZ = acc.z;
});
