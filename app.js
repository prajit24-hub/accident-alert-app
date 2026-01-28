var map = L.map('map').setView([0, 0], 13); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var marker = L.marker([0, 0]).addTo(map);

// 1. Get Location Automatically
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const coords = [lat, lng];
        
        map.setView(coords, 15);
        marker.setLatLng(coords);
        
        // Save to global variables to send later
        window.userLat = lat;
        window.userLng = lng;
    });
}

// 2. Send to Google Sheet (via Google Form)
function sendEmergencyAlert() {
    const name = "Hackathon User"; // Or get from a text input
    const phone = "9999999999";
    const locationUrl = `https://www.google.com/maps?q=${window.userLat},${window.userLng}`;

    // REPLACE THESE WITH YOUR FORM ACTION URL AND ENTRY IDs
    const formURL = "https://docs.google.com/forms/u/0/d/e/YOUR_FORM_ID/formResponse";
    
    const formData = new FormData();
    formData.append("entry.2114161195", name);   // Put your Name Entry ID here
    formData.append("entry.223773848", phone);  // Put your Phone Entry ID here
    formData.append("entry.6325147895", locationUrl); // Put your Location Entry ID here

    fetch(formURL, {
        method: "POST",
        body: formData,
        mode: "no-cors"
    }).then(() => {
        alert("🚨 ALERT SENT! Hospital and Police notified (Simulated).");
    }).catch(err => alert("Error sending alert. Check Internet."));
}
