// Initialize Map and Variables
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var marker = L.marker([0, 0]).addTo(map);

window.userLat = 0;
window.userLng = 0;

let shakeStartTime = null; 
let isAlertSent = false;
const REQUIRED_SHAKE_DURATION = 3000; // 3 seconds in milliseconds
const SHAKE_THRESHOLD = 50; // Intensity of the shake

// 1. Get GPS Location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
        window.userLat = position.coords.latitude;
        window.userLng = position.coords.longitude;
        map.setView([window.userLat, window.userLng], 16);
        marker.setLatLng([window.userLat, window.userLng]);
    }, null, { enableHighAccuracy: true });
}

// 2. CONTINUOUS SHAKE DETECTION
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', (event) => {
        let acc = event.accelerationIncludingGravity;
        let totalMovement = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);

        if (totalMovement > SHAKE_THRESHOLD) {
            // Shaking is happening
            if (!shakeStartTime) {
                shakeStartTime = Date.now(); // Start the timer
            } else {
                let duration = Date.now() - shakeStartTime;
                
                // Update UI to show progress
                if (!isAlertSent) {
                    document.getElementById('status').innerText = `Shaking detected: ${(duration/1000).toFixed(1)}s`;
                }

                if (duration >= REQUIRED_SHAKE_DURATION && !isAlertSent) {
                    isAlertSent = true; 
                    sendEmergencyAlert();
                }
            }
        } else {
            // Shaking stopped - Reset timer
            if (!isAlertSent) {
                shakeStartTime = null;
                document.getElementById('status').innerText = "System Monitoring...";
            }
        }
    });
}

// 3. SOS FUNCTION
function sendEmergencyAlert() {
    document.body.style.backgroundColor = "red";
    document.getElementById('status').innerText = "🚨 EMERGENCY: CONTINUOUS IMPACT DETECTED!";

    const name = document.getElementById('userName').value || "Unknown User";
    const phone = document.getElementById('userPhone').value || "No Phone";
    const locUrl = `https://www.google.com/maps?q=${window.userLat},${window.userLng}`;

    const formURL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";
    const formData = new FormData();
    formData.append("entry.NUMBER1", name);
    formData.append("entry.NUMBER2", phone);
    formData.append("entry.NUMBER3", locUrl);

    fetch(formURL, { method: "POST", body: formData, mode: "no-cors" })
    .then(() => {
        alert("Continuous impact detected. Emergency services notified!");
    });
}

// 4. PERMISSION FUNCTION
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
        document.getElementById('accelBtn').style.display = 'none';
        alert("Sensors active!");
    }
}
