// 1. Initialize Map
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var marker = L.marker([0, 0]).addTo(map);

window.userLat = 0;
window.userLng = 0;
let pressTimer;

// 2. Track GPS Location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
        window.userLat = position.coords.latitude;
        window.userLng = position.coords.longitude;
        map.setView([window.userLat, window.userLng], 16);
        marker.setLatLng([window.userLat, window.userLng]);
    }, null, { enableHighAccuracy: true });
}

// 3. SOFTWARE GESTURE: Long-Press Detection
// Triggers if the user holds their finger anywhere on the screen for 3 seconds
window.addEventListener('mousedown', startPress);
window.addEventListener('touchstart', startPress);
window.addEventListener('mouseup', cancelPress);
window.addEventListener('touchend', cancelPress);

function startPress() {
    document.getElementById('status').innerText = "Hold for 3 seconds to send SOS...";
    pressTimer = window.setTimeout(function() {
        sendEmergencyAlert();
    }, 3000); // 3000ms = 3 seconds
}

function cancelPress() {
    clearTimeout(pressTimer);
    if (document.getElementById('status').innerText.includes("Hold")) {
        document.getElementById('status').innerText = "Monitoring Active...";
    }
}

// 4. Send SOS Function
function sendEmergencyAlert() {
    document.body.style.backgroundColor = "#d32f2f";
    document.getElementById('status').innerText = "🚨 SOS SENT! POLICE & HOSPITAL NOTIFIED.";

    const name = document.getElementById('userName').value || "User";
    const phone = document.getElementById('userPhone').value || "No Phone";
    const mapsLink = `https://www.google.com/maps?q=${window.userLat},${window.userLng}`;

    // REPLACE WITH YOUR GOOGLE FORM DATA
    const formURL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";
    const formData = new FormData();
    formData.append("entry.2114161195", name);     
    formData.append("entry.223773848", phone);    
    formData.append("entry.6325147895", mapsLink); 

    fetch(formURL, { method: "POST", body: formData, mode: "no-cors" })
    .then(() => alert("Emergency alert shared with dispatch."));
}

