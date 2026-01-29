// 1. Initialize Map
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var marker = L.marker([0, 0]).addTo(map);

window.userLat = 0;
window.userLng = 0;
let pressTimer;
let lastTap = 0;

// 2. Track GPS Location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
        window.userLat = position.coords.latitude;
        window.userLng = position.coords.longitude;
        map.setView([window.userLat, window.userLng], 16);
        marker.setLatLng([window.userLat, window.userLng]);
    }, null, { enableHighAccuracy: true });
}

// 3. SOFTWARE GESTURE: Double-Tap & Long-Press
window.addEventListener('touchstart', handleStart);
window.addEventListener('touchend', handleEnd);
window.addEventListener('mousedown', handleStart);
window.addEventListener('mouseup', handleEnd);

function handleStart(e) {
    // Check for Double-Tap
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // 300ms window
    if (now - lastTap < DOUBLE_TAP_DELAY) {
        sendEmergencyAlert("Double-Tap Detected");
        return;
    }
    lastTap = now;

    // Start Long-Press Timer
    document.getElementById('status').innerText = "Hold for 3s or Double-Tap to SOS";
    pressTimer = window.setTimeout(() => {
        sendEmergencyAlert("Long-Press Detected");
    }, 3000);
}

function handleEnd() {
    clearTimeout(pressTimer);
    if (!document.getElementById('status').innerText.includes("SENT")) {
        document.getElementById('status').innerText = "Monitoring Active...";
    }
}

// 4. Send SOS Function
function sendEmergencyAlert(triggerType) {
    document.body.style.backgroundColor = "#d32f2f";
    document.getElementById('status').innerText = `🚨 SOS SENT! (${triggerType})`;

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
    .then(() => alert(`Emergency alert sent via ${triggerType}`));
}
