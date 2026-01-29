// Initialize Map
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var marker = L.marker([0, 0]).addTo(map);

window.userLat = 0;
window.userLng = 0;

// 1. Live GPS Tracking
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
        window.userLat = position.coords.latitude;
        window.userLng = position.coords.longitude;
        map.setView([window.userLat, window.userLng], 16);
        marker.setLatLng([window.userLat, window.userLng]);
    }, null, { enableHighAccuracy: true });
}

// 2. Software Shake Logic (No Hardware Sensors)
let moveCount = 0;
let lastX = 0;
let isAlertSent = false;
const shakeZone = document.getElementById('shake-zone');
const fill = document.getElementById('progress-fill');

// Detect rapid swiping/friction across the zone
shakeZone.addEventListener('mousemove', detectSoftwareShake);
shakeZone.addEventListener('touchmove', (e) => detectSoftwareShake(e.touches[0]));

function detectSoftwareShake(e) {
    if (isAlertSent) return;

    let currentX = e.clientX || e.pageX;
    let travel = Math.abs(currentX - lastX);

    // If movement is fast enough, increment the count
    if (travel > 40) { 
        moveCount++;
        lastX = currentX;
        
        // Visual feedback bar
        fill.style.width = (moveCount * 5) + "%";

        // Trigger SOS after 20 rapid movements
        if (moveCount >= 20) {
            isAlertSent = true;
            sendEmergencyAlert();
        }
    }

    // Reset if movement stops for 1 second
    clearTimeout(window.shakeReset);
    window.shakeReset = setTimeout(() => {
        if (!isAlertSent) {
            moveCount = 0;
            fill.style.width = "0%";
        }
    }, 1000);
}

// 3. Send SOS Function
function sendEmergencyAlert() {
    document.body.style.backgroundColor = "#d32f2f";
    document.getElementById('status').innerText = "🚨 ACCIDENT DETECTED! ALERTING SERVICES...";

    const name = document.getElementById('userName').value || "Unknown User";
    const phone = document.getElementById('userPhone').value || "No Phone";
    const mapsLink = `https://www.google.com/maps?q=${window.userLat},${window.userLng}`;

    // REPLACE WITH YOUR GOOGLE FORM LINK AND ENTRY IDs
    const formURL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";
    const formData = new FormData();
    formData.append("entry.1111111", name);     
    formData.append("entry.2222222", phone);    
    formData.append("entry.3333333", mapsLink); 

    fetch(formURL, { method: "POST", body: formData, mode: "no-cors" })
    .then(() => {
        alert("SOS SUCCESS: Police and Hospital notified with your Live Location.");
    });
}
