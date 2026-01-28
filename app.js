// Initialize Map
var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var marker = L.marker([0, 0]).addTo(map);

window.userLat = 0;
window.userLng = 0;

// Track Location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
        window.userLat = position.coords.latitude;
        window.userLng = position.coords.longitude;
        document.getElementById('status').innerText = "GPS Active: " + window.userLat.toFixed(4) + ", " + window.userLng.toFixed(4);
        
        let coords = [window.userLat, window.userLng];
        map.setView(coords, 16);
        marker.setLatLng(coords);
    }, error => {
        document.getElementById('status').innerText = "Error: Please allow location.";
    }, { enableHighAccuracy: true });
}

function sendEmergencyAlert() {
    const name = document.getElementById('userName').value || "Unknown User";
    const phone = document.getElementById('userPhone').value || "No Phone Provided";
    const locString = `https://www.google.com/maps?q=${window.userLat},${window.userLng}`;

    // PASTE YOUR DATA HERE:
    const formURL = "https://docs.google.com/forms/d/e/PASTE_YOUR_LONG_FORM_ID_HERE/formResponse";
    
    const formData = new FormData();
    formData.append("entry.NUMBER1", name);   // Name ID
    formData.append("entry.NUMBER2", phone);  // Phone ID
    formData.append("entry.NUMBER3", locString); // Location ID

    fetch(formURL, {
        method: "POST",
        body: formData,
        mode: "no-cors"
    }).then(() => {
        alert("🚨 SOS SENT! Details logged in Emergency Sheet.");
    }).catch(() => {
        alert("Network Error. Could not send alert.");
    });
}
