<?php
// ============================================================
// Register API Endpoint
// COP4331 Contact Manager
// ============================================================
//
// Final purpose:
// Receives new user information from the frontend as JSON.
// Adds a new user to the Users table.
// Returns success/failure.
//
// Expected JSON request later:
// {
//   "firstName": "Test",
//   "lastName": "User",
//   "login": "testuser",
//   "password": "password123"
// }

header("Content-Type: application/json");

echo json_encode([
    "success" => false,
    "message" => "register.php endpoint not implemented yet."
]);
?>

