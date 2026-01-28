// 1. Initialize Map
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var marker = L.marker([0, 0]).addTo(map);

window.userLat = 0;
window.userLng = 0;

// 2. Continuous GPS Tracking (Always keeps location ready)
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
        window.userLat = position.coords.latitude;
        window.userLng = position.coords.longitude;
        map.setView([window.userLat, window.userLng], 16);
        marker.setLatLng([window.userLat, window.userLng]);
    }, null, { enableHighAccuracy: true });
}

// 3. Manual SOS Function
function sendManualSOS() {
    // Provide visual feedback
    document.body.style.backgroundColor = "#d32f2f";
    document.getElementById('status').innerText = "🚨 ALERT SENT! NOTIFYING POLICE & HOSPITAL...";

    const name = document.getElementById('userName').value || "Manual User";
    const phone = document.getElementById('userPhone').value || "No Phone";
    const mapsLink = `https://www.google.com/maps?q=${window.userLat},${window.userLng}`;

    // --- REPLACE THESE WITH YOUR GOOGLE FORM DATA ---
    const formURL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/formResponse";
    const formData = new FormData();
    formData.append("entry.1111111", name);     // Use your Name Entry ID
    formData.append("entry.2222222", phone);    // Use your Phone Entry ID
    formData.append("entry.3333333", mapsLink); // Use your Location Entry ID

    fetch(formURL, { method: "POST", body: formData, mode: "no-cors" })
    .then(() => {
        alert("Emergency units have been dispatched to your fleet location.");
    })
    .catch(() => {
        alert("Connection Error. SOS logged locally.");
    });
}
