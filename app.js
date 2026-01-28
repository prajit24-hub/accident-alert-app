let map;
let marker;
let accidentDetected = false;

function startTracking() {
  document.getElementById("status").innerText = "Monitoring started...";

  // Start GPS
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      updateMap(lat, lon);
    },
    function () {
      alert("Location permission denied");
    }
  );

  // Start accident detection (mobile)
  startAccidentDetection();
}

function updateMap(lat, lon) {
  document.getElementById("status").innerText =
    "Latitude: " + lat + " , Longitude: " + lon;

  if (!map) {
    map = L.map("map").setView([lat, lon], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map);

    marker = L.marker([lat, lon]).addTo(map);
  } else {
    marker.setLatLng([lat, lon]);
    map.setView([lat, lon]);
  }
}

function startAccidentDetection() {
  if (!window.DeviceMotionEvent) {
    console.log("Device motion not supported");
    return;
  }

  window.addEventListener("devicemotion", function (event) {
    if (accidentDetected) return;

    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    const totalAcc =
      Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);

    // Threshold (tune for demo)
    if (totalAcc > 30) {
      accidentDetected = true;
      onAccidentDetected();
    }
  });
}

function onAccidentDetected() {
  document.getElementById("status").innerText =
    "🚨 Accident detected! Sending alert...";

  alert("Accident detected!\nAlerting hospitals & police (simulation)");
}
