// Check if user already signed in this skip the login page and go straight to contacts
function checkAuthStatus()
{
    const xhr = new XMLHttpRequest();
    xhr.open( "GET", "../api/user/login.php", true );
    xhr.withCredentials = true;
 
    xhr.onreadystatechange = function()
    {
        if( this.readyState == 4 && this.status == 200 )
        {
            const jsonObject = JSON.parse( xhr.responseText );
 
            if( jsonObject.logged_in )
            {
                location.replace( "contacts.html" );
            }
        }
    };
 
    xhr.send();
}

// Live Clock in website
function updateClock() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric'
    });
}
updateClock();
setInterval(updateClock, 1000);

// Link with login.html and login.php. Runs when the user clicks Submit
function doLogin() {
    // Grab user input
    const username = document.getElementById('login_username').value.trim();
    const password = document.getElementById('login_password').value.trim();
    // graph UI element
    const message = document.getElementById('login_message');
    const button = document.getElementById('login_submit');
    
    // Clear any old error message
    message.textContent = '';

    // Validation if user not fill anything (empty box)
    if (!username || !password) {
        message.textContent = 'Please fill in all fields.';
        return;
    }

    // Disable button and show loading text while we wait for the server
    button.disabled = true;
    button.textContent = 'Signing in...';

    // Build the JSON payload to send
    const jsonPayload =
    {
        "login":    username,
        "password": password
    };

    // Send request to the PHP backend
    const xhr = new XMLHttpRequest();
    xhr.open( "POST", "api/login.php", true );
    xhr.setRequestHeader( "Content-type", "application/json; charset=UTF-8" );
 
    xhr.onreadystatechange = function()
    {
        if( this.readyState == 4 && this.status == 200 )
        {
            const jsonObject = JSON.parse( xhr.responseText );
 
            // PHP returns id > 0 on success, 0 on failure
            if( jsonObject.id > 0 )
            {
                // Save user info so other pages can use it
                localStorage.setItem( 'userId',   jsonObject.id );
                localStorage.setItem( 'username', username );
 
                // Go to the contacts page
                window.location.href = 'contacts.html';
            }
            else
            {
                // Show the error message from the server
                message.textContent = jsonObject.error || 'Invalid username or password.';
            }
        }
        else if( this.readyState == 4 )
        {
            // Server responded but with an error status
            message.textContent = 'Could not connect to the server. Try again.';
        }
 
        // Re-enable the button when done, success or fail
        button.disabled    = false;
        button.textContent = 'Submit';
    };
 
    xhr.send( JSON.stringify( jsonPayload ) );
}
// Theme toggle
document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("themeToggle");

    // Remember last theme on page load
    if (localStorage.getItem("theme") === "day") {
        document.body.classList.add("day-mode");
        if (toggle) {
            toggle.src = "images/logo_day.png"; // Load day variant if set
        } else {
            if (toggle) {
                toggle.src = "images/logo_night.png"; // Default fallback
            }
        }
    }

    // Click logo to switch themes and swap image sources
    if (toggle) {
        toggle.addEventListener("click", function () {
            document.body.classList.toggle("day-mode");
            const isDayMode = document.body.classList.contains("day-mode");
            
            // Save current choice to browser memory
            localStorage.setItem("theme", isDayMode ? "day" : "night");
            
            // Change the image instantly on the screen when clicked
            if (isDayMode) {
                toggle.src = "images/logo_day.png";
            } else {
                toggle.src = "images/logo_night.png";
            }
        });
    }
});