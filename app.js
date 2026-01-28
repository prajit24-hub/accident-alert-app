function sendEmergencyAlert() {
    // 1. Your Google Form "Response" URL
    const formURL = "https://docs.google.com/forms/d/e/YOUR_ID_HERE/formResponse";

    const formData = new FormData();
    
    // 2. Put your actual IDs here
    formData.append("entry.2114161195", "Test Name"); 
    formData.append("entry.223773848", "999-000-0000");
    formData.append("entry.6325147895", "Location: " + window.userLat + "," + window.userLng);

    fetch(formURL, {
        method: "POST",
        body: formData,
        mode: "no-cors"
    }).then(() => {
        alert("Alert Sent to Google Sheets!");
    });
}
