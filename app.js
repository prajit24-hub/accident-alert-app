function sendSOS() {
  document.getElementById("status").innerText = "Getting your location...";

  navigator.geolocation.getCurrentPosition(
    function(position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;

      // Only location message
      let message = "HELP! My live location: " + latitude + ", " + longitude;

      // Show message on page
      document.getElementById("status").innerText = "SOS Sent!\n" + message;

      // Update map
      showMap(latitude, longitude);

      // Optional: send to server or Google Sheet
      // sendToSheet(message);
    },
    function(error) {
      document.getElementById("status").innerText = "Error getting location: " + error.message;
    }
  );
}

function showMap(lat, lng) {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: lat, lng: lng },
    zoom: 15
  });
  new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
    title: "Your Location"
  });
}
