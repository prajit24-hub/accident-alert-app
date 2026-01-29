// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// Ask notification permission
if ('Notification' in window) {
  Notification.requestPermission();
}

// 🔴 GOOGLE FORM URL (replace FORM_ID)
const FORM_URL =
  "https://docs.google.com/forms/d/e/FORM_ID/formResponse";

// SOS FUNCTION
function sendSOS(triggerType) {

  document.getElementById("status").innerText =
    "📍 Fetching live location...";

  navigator.geolocation.getCurrentPosition(
    function (position) {

      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      // Fleet map using LAT / LON only
      let mapURL =
        "https://www.openstreetmap.org/export/embed.html?bbox=" +
        (lon-0.01) + "," + (lat-0.01) + "," +
        (lon+0.01) + "," + (lat+0.01) +
        "&layer=mapnik&marker=" + lat + "," + lon;

      document.getElementById("map").src = mapURL;

      document.getElementById("status").innerText =
        "🚨 SOS SENT\nLatitude: " + lat + "\nLongitude: " + lon;

      // Send data to police & hospital (Google Sheet)
      let data = new FormData();
      data.append("entry.1111111111", lat);
      data.append("entry.2222222222", lon);
      data.append("entry.3333333333", triggerType);

      fetch(FORM_URL, {
        method: "POST",
        mode: "no-cors",
        body: data
      });

      // Notification
      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification("🚨 Emergency Alert", {
            body: "Location shared with Police & Hospital"
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

/* 📳 SHAKE DETECTION */

let lastX = 0, lastY = 0, lastZ = 0;
let threshold = 15;

window.addEventListener("devicemotion", function (event) {

  let acc = event.accelerationIncludingGravity;
  let delta =
    Math.abs(acc.x - lastX) +
    Math.abs(acc.y - lastY) +
    Math.abs(acc.z - lastZ);

  if (delta > threshold) {
    sendSOS("Shake");
  }

  lastX = acc.x;
  lastY = acc.y;
  lastZ = acc.z;
});
