<?php
// ============================================================
// Add Contact API Endpoint
// COP4331 Contact Manager
// ============================================================
//
// Final purpose:
// Receives contact details from the frontend as JSON.
// Inserts a new contact for the logged-in user.
//
// Expected JSON request later:
// {
//   "userId": 1,
//   "firstName": "John",
//   "lastName": "Doe",
//   "phone": "407-555-1234",
//   "email": "john@example.com"
// }

header("Content-Type: application/json");

echo json_encode([
    "success" => false,
    "message" => "addContact.php endpoint not implemented yet."
]);
?>
