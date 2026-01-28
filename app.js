// Initialize Map and Variables
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var marker = L.marker([0, 0]).addTo(map);

window.userLat = 0;
window.userLng = 0;

let isInAir = false;
let airTimeStart = 0;
let isAlertSent = false;

const IMPACT_THRESHOLD = 90; // High G-force spike on landing
const FREEFALL_THRESHOLD = 2.0; // Near zero-G (floating in air)

// 1. Get GPS Location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
        window.userLat = position.coords.latitude;
        window.userLng = position.coords.longitude;
        map.setView([window.userLat, window.userLng], 16);
        marker.setLatLng([window.userLat, window.userLng]);
    }, null, { enableHighAccuracy: true });
}

// 2. IN-AIR & IMPACT DETECTION
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', (event) => {
        let acc = event.accelerationIncludingGravity;
        if (!acc) return;

        let totalG = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);

        // STEP A: Detect Free-fall (Phone is in the air)
        if (totalG < FREEFALL_THRESHOLD) {
            isInAir = true;
            airTimeStart = Date.now();
            document.getElementById('status').innerText = "Status: Free-fall Detected...";
        }

        // STEP B: Detect the Landing Impact
        if (isInAir && totalG > IMPACT_THRESHOLD) {
            let timeInAir = Date.now() - airTimeStart;
            
            // If it was in the air for a short time and hit hard, it's a crash
            if (timeInAir > 100 && !isAlertSent) { 
                isAlertSent = true;
                sendEmergencyAlert();
                isInAir = false; 
            }
        }

        // Reset if it stays steady for too long without impact
        if (isInAir && (Date.now() - airTimeStart > 2000)) {
            isInAir = false;
        }
    });
}

// 3. SOS FUNCTION
function sendEmergencyAlert() {
    document.body.style.backgroundColor = "red";
    document.getElementById('status').innerText = "🚨 CRASH DETECTED: IMPACT AFTER FREE-FALL!";

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
        alert("Impact detected. Emergency services notified with GPS location!");
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
        alert("Motion Sensors Active");
    }
}
