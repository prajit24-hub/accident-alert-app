// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// Request Notification Permission
if ('Notification' in window) {
  Notification.requestPermission();
}

// SOS FUNCTION
function sendSOS() {

  document.getElementById("status").innerText =
    "📍 Fetching live location...";

  navigator.geolocation.getCurrentPosition(
    function (position) {

      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      // PURE LATITUDE & LONGITUDE BASED FLEET MAP
      let fleetMapLink =
        "https://www.openstreetmap.org/#map=18/" +
        lat + "/" + lon;

      document.getElementById("status").innerText =
        "🚨 SOS SENT\n\nLatitude: " + lat +
        "\nLongitude: " + lon;

      // Open map
      window.open(fleetMapLink, "_blank");

      // Notification
      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(function (reg) {
          reg.showNotification("🚨 Emergency SOS Sent", {
            body: "Lat: " + lat + " , Lon: " + lon
          });
        });
      }
    },
    function () {
      document.getElementById("status").innerText =
        "❌ Location permission denied";
    }
  );
}

/* ---------------------
   SHAKE DETECTION
--------------------- */

let lastX = 0;
let lastY = 0;
let lastZ = 0;
let threshold = 15;

window.addEventListener("devicemotion", function (event) {

  let acc = event.accelerationIncludingGravity;

  let delta =
    Math.abs(acc.x - lastX) +
    Math.abs(acc.y - lastY) +
    Math.abs(acc.z - lastZ);

  if (delta > threshold) {
    sendSOS();
  }

  lastX = acc.x;
  lastY = acc.y;
  lastZ = acc.z;

});
