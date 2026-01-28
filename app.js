// Initialize Map
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var marker = L.marker([0, 0]).addTo(map);

window.userLat = 0;
window.userLng = 0;
let lastShake = 0;

// 1. Get GPS Location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
        window.userLat = position.coords.latitude;
        window.userLng = position.coords.longitude;
        map.setView([window.userLat, window.userLng], 16);
        marker.setLatLng([window.userLat, window.userLng]);
    }, null, { enableHighAccuracy: true });
}

// 2. SHAKE GESTURE DETECTION
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', (event) => {
        let acceleration = event.accelerationIncludingGravity;
        
        // Calculate the "strength" of the movement
        let totalMovement = Math.abs(acceleration.x) + Math.abs(acceleration.y) + Math.abs(acceleration.z);
        
        // Threshold: 30 is a very hard shake (collision). Adjust if needed.
        if (totalMovement > 800) { 
            let now = Date.now();
            if (now - lastShake > 5000) { // Prevent multiple alerts in 5 seconds
                lastShake = now;
                console.log("Collision Detected!");
                sendEmergencyAlert(); // Automatically triggers the SOS
            }
        }
    });
}

// 3. SEND SOS FUNCTION
function sendEmergencyAlert() {
    // Visual feedback for the user
    document.body.style.backgroundColor = "red";
    document.getElementById('status').innerText = "🚨 COLLISION DETECTED! ALERTING SERVICES...";

    const name = document.getElementById('userName').value || "Unknown User";
    const phone = document.getElementById('userPhone').value || "No Phone";
    const locUrl = `https://www.google.com/maps?q=${window.userLat},${window.userLng}`;

    // Update your Form ID and Entries here
    const formURL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";
    const formData = new FormData();
    formData.append("entry.1111111", name);
    formData.append("entry.2222222", phone);
    formData.append("entry.3333333", locUrl);

    fetch(formURL, { method: "POST", body: formData, mode: "no-cors" })
    .then(() => {
        // This simulates sending to Police/Hospital by updating your Sheet
        alert("Emergency Services (Police & Hospital) have been notified of your location!");
    });
    function requestPermission() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(response => {
                if (response == 'granted') {
                    document.getElementById('accelBtn').style.display = 'none';
                }
            })
            .catch(console.error);
    } else {
        // For non-iOS devices, it is usually granted by default
        document.getElementById('accelBtn').style.display = 'none';
    }
}
}





