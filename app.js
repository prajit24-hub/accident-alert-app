let map, marker;

function startTracking() {
  const status = document.getElementById("status");
  status.innerText = "Getting your location...";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        status.innerText = `Latitude: ${lat}\nLongitude: ${lng}`;

        // Initialize map
        if (!map) {
          map = L.map('map').setView([lat, lng], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(map);
        }

        // Add marker
        if (marker) {
          marker.setLatLng([lat, lng]);
        } else {
          marker = L.marker([lat, lng]).addTo(map);
        }

      },
      error => {
        status.innerText = "Location permission denied or error!";
      }
    );
  } else {
    status.innerText = "Geolocation not supported";
  }
}
