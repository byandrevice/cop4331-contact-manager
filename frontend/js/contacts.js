/* function doLogout(event) {
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

// Display the logged-in user's name
function displayUserInfo() {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const userSpan = document.getElementById('userName');
    if (userSpan && firstName && lastName) {
      userSpan.textContent = `${firstName} ${lastName}`;
    }
  }
  
  // Check authentication on page load
  document.addEventListener("DOMContentLoaded", () => {
    displayUserInfo();
    const userId = localStorage.getItem('userId');
    if (!userId || userId === "0") {
      window.location.href = "login.html";
    }
}); */ 

// Toggle between night mode and day mode when logo is clicked
document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            document.body.classList.toggle("day-mode");
        });
    }
});
