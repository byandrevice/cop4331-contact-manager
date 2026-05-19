// ============================================================
// Shared API Helper
// COP4331 Contact Manager
// ============================================================
//
// This file centralizes frontend-to-backend communication.
//
// The frontend must communicate with the server through API endpoints
// using JSON. Page-specific JS files can call sendRequest() instead of
// rewriting fetch() each time.
//
// IMPORTANT:
// Replace the IP address with the final domain before presentation.
// Example later:
// const API_BASE_URL = "http://yourdomain.xyz/api";

const API_BASE_URL = "lampcm.me";

// Sends a POST request to a PHP API endpoint.
// endpoint example: "login.php"
// data example: { login: "testuser", password: "password123" }
async function sendRequest(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);

    return {
      success: false,
      message: "Could not connect to the server."
    };
  }
}
