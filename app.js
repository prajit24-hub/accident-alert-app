var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var marker = L.marker([0, 0]).addTo(map);

window.userLat = 0;
window.userLng = 0;
let isAlertSent = false;

// 1. GPS Tracking
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
        window.userLat = position.coords.latitude;
        window.userLng = position.coords.longitude;
        map.setView([window.userLat, window.userLng], 16);
        marker.setLatLng([window.userLat, window.userLng]);
    }, null, { enableHighAccuracy: true });
}

// 2. SHAKE/IMPACT GESTURE DETECTION
window.addEventListener('devicemotion', (event) => {
    if (isAlertSent) return;
    let acc = event.accelerationIncludingGravity;
    if (!acc) return;

    // Detect high-G impact
    let totalG = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);

    if (totalG > 100) { 
        isAlertSent = true;
        sendEmergencyAlert();
    }
});

function sendEmergencyAlert() {
    document.body.style.backgroundColor = "red";
    document.getElementById('status').innerText = "🚨 ACCIDENT DETECTED! ALERTING SERVICES...";

    const name = document.getElementById('userName').value || "Unknown Driver";
    const phone = document.getElementById('userPhone').value || "No Phone";
    const mapsLink = `https://www.google.com/maps?q=${window.userLat},${window.userLng}`;

    // REPLACE WITH YOUR GOOGLE FORM DATA
    const formURL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";
    const formData = new FormData();
    formData.append("entry.1111111", name);     
    formData.append("entry.2222222", phone);    
    formData.append("entry.3333333", mapsLink); 

    fetch(formURL, { method: "POST", body: formData, mode: "no-cors" });
}

// 3. Sensor Permission Handler
function requestPermission() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(res => { if (res === 'granted') document.getElementById('accelBtn').style.display = 'none'; })
            .catch(console.error);
    } else {
        document.getElementById('accelBtn').style.display = 'none';
        alert("Sensors Active!");
    }
}
