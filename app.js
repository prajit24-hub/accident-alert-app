document.addEventListener("DOMContentLoaded", function(){

    // ===== GOOGLE FORM SETTINGS =====
    const FORM_URL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";
    const ENTRY_LAT = "entry.2110052793";   // Latitude
    const ENTRY_LON = "entry.773656180";   // Longitude
    const ENTRY_TYPE = "entry.354081134";  // Trigger type

    // Initialize Leaflet map
    const map = L.map('map').setView([0,0], 2); // initial zoom out
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let marker = null;

    function sendSOS(triggerType){
        if(!navigator.geolocation){
            alert("Geolocation not supported!");
            return;
        }

        navigator.geolocation.getCurrentPosition(function(pos){
            let lat = pos.coords.latitude;
            let lon = pos.coords.longitude;

            // Update map
            if(marker){
                marker.setLatLng([lat, lon]);
            } else {
                marker = L.marker([lat, lon]).addTo(map);
            }
            map.setView([lat, lon], 16);

            // Send to Google Form
            const url = FORM_URL + 
                        `?${ENTRY_LAT}=${lat}&${ENTRY_LON}=${lon}&${ENTRY_TYPE}=${triggerType}`;
            fetch(url, {method: 'POST', mode:'no-cors'}) // sends silently
                .then(()=>alert("SOS Sent!\nLatitude: "+lat+"\nLongitude: "+lon))
                .catch(()=>alert("SOS failed!"));

        }, function(){
            alert("Location permission denied!");
        });
    }

    // Button click
    document.getElementById("sosBtn").addEventListener("click", function(){
        sendSOS("Button");
    });

    // Shake detection
    let lastX=0, lastY=0, lastZ=0, threshold=15;
    window.addEventListener("devicemotion", function(event){
        let acc = event.accelerationIncludingGravity;
        let delta = Math.abs(acc.x-lastX)+Math.abs(acc.y-lastY)+Math.abs(acc.z-lastZ);
        if(delta > threshold){
            sendSOS("Shake");
        }
        lastX=acc.x; lastY=acc.y; lastZ=acc.z;
    });

});
