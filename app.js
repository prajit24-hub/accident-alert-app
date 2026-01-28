function autoSendSOS() {

  if (!navigator.geolocation) {
    alert("GPS not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const time = new Date().toLocaleString();

    const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSd75j7BXWhMReBrYrzn88mhTtIYGukzjFO12d--HEIX-eXZgA/viewform?usp=publish-editor";

    const data = new FormData();
    data.append("entry.20476386660", "Test User");                 
    data.append("entry.1951263741", "friend@gmail.com");           
    data.append("entry.1106677624", "hospital@gmail.com");         
    data.append("entry.1111959112", "police@gmail.com");           
    data.append("entry.1743056932", lat);                          
    data.append("entry.941773419", lng);                           
    data.append("entry.354965029", time);                          

    fetch(formURL, {
      method: "POST",
      mode: "no-cors",
      body: data
    });

    document.getElementById("status").innerText =
      "🚨 SOS SENT AUTOMATICALLY\nLocation shared";

  }, () => {
    alert("Location permission denied");
  });
}
