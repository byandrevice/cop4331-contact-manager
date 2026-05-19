<?php
// ============================================================
// Example Database Config
// COP4331 Contact Manager
// ============================================================
//
// This file is an example/template only.
//
// IMPORTANT:
// - Do NOT put real passwords in this file.
// - Do NOT rename this file to config.php in GitHub.
// - The real config.php should exist only on the server.
// - config.php should be listed in .gitignore.
//
// The real server file will look similar to this, but with the actual
// MySQL username/password created for the project.

$db_host = "localhost";
$db_user = "YOUR_DATABASE_USER";
$db_pass = "YOUR_DATABASE_PASSWORD";
$db_name = "contact_manager";

// Create a MySQL connection.
// API endpoint files will include the real config.php to reuse this connection.
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Return JSON if the database connection fails.
// This keeps the API response format consistent for the frontend.
if ($conn->connect_error) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database connection failed."
    ]);

    exit();
}
?>
