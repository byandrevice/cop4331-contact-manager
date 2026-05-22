function doLogout(event) {
    if (event) event.preventDefault(); 
    // Clear global user variables
    userID = 0;
    firstName = "";
    lastName = "";
    username = "";
    password = "";
    
    saveCookie(); // Clear login cookies
    window.location.href = "login.html"; // Redirect to login.html
}