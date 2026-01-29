let map, marker;

// 🔹 CHANGE THIS
const formURL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";

function sendSOS() {

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      document.getElementById("status").innerText =
        "SOS SENT\nLat: " + lat + "\nLng: " + lng;

      // --- SEND TO GOOGLE SHEET ---
      const data = new FormData();
      data.append("entry.1111111111", lat);   // Latitude
      data.append("entry.2222222222", lng);   // Longitude
      data.append("entry.3333333333", "SOS"); // Status

      fetch(formURL, {
        method: "POST",
        body: data,
        mode: "no-cors"
      });

      // --- MAP ---
      if (!map) {
        map = L.map("map").setView([lat, lng], 16);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
        marker = L.marker([lat, lng]).addTo(map);
      } else {
        map.setView([lat, lng], 16);
        marker.setLatLng([lat, lng]);
      }
    },
    () => {
      alert("Location access required!");
    }
  );
}
