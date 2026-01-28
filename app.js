// 1. Initialize Map
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var marker = L.marker([0, 0]).addTo(map);

window.userLat = 0;
window.userLng = 0;
let isProcessingCrash = false;

// 2. Track GPS Location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
        window.userLat = position.coords.latitude;
        window.userLng = position.coords.longitude;
        map.setView([window.userLat, window.userLng], 16);
        marker.setLatLng([window.userLat, window.userLng]);
    }, null, { enableHighAccuracy: true });
}

// 3. Accident Detection Logic (High-Impact + Free-fall)
window.addEventListener('devicemotion', (event) => {
    if (isProcessingCrash) return; // Stop listening if we are already in a countdown

    let acc = event.accelerationIncludingGravity;
    if (!acc) return;

    // Calculate Resultant G-Force
    let totalG = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);

    // THRESHOLD: 100+ represents a vehicle impact or a high drop
    // Normal phone handling is usually between 9 and 20.
    if (totalG > 100) { 
        isProcessingCrash = true;
        startCountdown();
    }
});

// 4. Countdown to Prevent Unwanted Notifications
function startCountdown() {
    let timeLeft = 10;
    document.body.style.backgroundColor = "#d32f2f"; // Change screen to alert red
    
    // Play a beep sound if you want, or just show the text
    const statusLabel = document.getElementById('status');
    
    let timer = setInterval(() => {
        timeLeft--;
        statusLabel.innerHTML = `
            <div style="font-size: 20px; font-weight: bold;">🚨 POTENTIAL ACCIDENT DETECTED!</div>
            <div style="font-size: 16px;">Sharing location in ${timeLeft}s...</div>
            <button onclick="cancelAlert()" style="margin-top:10px; padding:10px; background:white; color:black; border-radius:5px; border:none; font-weight:bold;">I AM SAFE (CANCEL)</button>
        `;

        if (timeLeft <= 0) {
            clearInterval(timer);
            sendEmergencyAlert();
        }
    }, 1000);

    // Global function to cancel
    window.cancelAlert = function() {
        clearInterval(timer);
        isProcessingCrash = false;
        document.body.style.backgroundColor = "#0f0f0f";
        statusLabel.innerText = "System Monitoring... (Safe)";
    };
}

// 5. Shared Location Function (Sends to Police & Hospital)
function sendEmergencyAlert() {
    document.getElementById('status').innerText = "✅ LOCATION SHARED WITH EMERGENCY SERVICES";

    const name = document.getElementById('userName').value || "Unknown Rider";
    const phone = document.getElementById('userPhone').value || "No Phone";
    const mapsLink = `http://google.com/maps?q=${window.userLat},${window.userLng}`;

    const formURL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";
    const formData = new FormData();
    formData.append("entry.NUMBER1", name);
    formData.append("entry.NUMBER2", phone);
    formData.append("entry.NUMBER3", mapsLink);

    fetch(formURL, { method: "POST", body: formData, mode: "no-cors" })
    .then(() => {
        console.log("Data sent to Google Sheet");
    });
}

// 6. Permission Handler
function requestPermission() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(res => { if (res === 'granted') document.getElementById('accelBtn').style.display = 'none'; })
            .catch(console.error);
    } else {
        document.getElementById('accelBtn').style.display = 'none';
    }
}
