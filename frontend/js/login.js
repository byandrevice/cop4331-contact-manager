// Check if user already signed in
(async () => {
    const res = await fetch("../api/user/auth_status.php", { credentials: "include" });
    if ((await res.json()).logged_in) location.replace("contacts.html");
})();

// Live Clock in website
async function updateClock() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric'
    });
}
// Initialize clock and set interval
updateClock();
setInterval(updateClock, 1000);

async function doLogin() {
    const username = document.getElementById('login_username').value.trim();
    const password = document.getElementById('login_password').value.trim();
    const message  = document.getElementById('login_message');
    const button   = document.getElementById('login_submit');
    
    // Clear previous message
    message.textContent = '';

    // Validation if user not fill anything
    if (!username || !password) {
        message.textContent = 'Please fill in all fields.';
        return;
    }

    // Loading state
    button.disabled = true;
    button.textContent = 'Signing in...';

    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: username, password })
        });

        const data = await response.json();

        if (data.id > 0) {
            // Save user id so other pages can use it
            localStorage.setItem('userId', data.id);
            localStorage.setItem('username', username);

            // Redirect on success — change 'dashboard.html' to your target page
            window.location.href = 'dashboard.html';
        } else {
            message.textContent = data.error || 'Invalid username or password.';
        }

    } catch (err) {
        message.textContent = 'Could not connect to the server. Try again.';
        console.error(err);
    } finally {
        button.disabled = false;
        button.textContent = 'Submit';
    }
}