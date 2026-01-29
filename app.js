document.addEventListener("DOMContentLoaded", function(){

    // ====== GOOGLE FORM SETTINGS ======
    const FORM_URL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?usp=pp_url";
    const ENTRY_LAT = "entry.2110052793";      // Latitude question ID
    const ENTRY_LON = "entry.773656180";      // Longitude question ID
    const ENTRY_TYPE = "entry.354081134";     // Trigger type question ID

    // Function to send SOS
    function sendSOS(triggerType){
        if(!navigator.geolocation){
            alert("Geolocation not supported!");
            return;
        }

        navigator.geolocation.getCurrentPosition(function(position){
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            // Open Google Form with live location
            let formURL = FORM_URL +
                "&" + ENTRY_LAT + "=" + lat +
                "&" + ENTRY_LON + "=" + lon +
                "&" + ENTRY_TYPE + "=" + triggerType;

            window.open(formURL, "_blank"); // sends data to Sheet
            alert("SOS Sent!\nLatitude: "+lat+"\nLongitude: "+lon);

            // Show live map using OpenStreetMap
            document.getElementById("map").src =
                "https://www.openstreetmap.org/export/embed.html?bbox=" 
                + (lon-0.01) + "%2C" + (lat-0.01) + "%2C" + (lon+0.01) + "%2C" + (lat+0.01) 
                + "&layer=mapnik&marker=" + lat + "%2C" + lon;

        }, function(){
            alert("Location permission denied!");
        });
    }

    // SOS button click
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

