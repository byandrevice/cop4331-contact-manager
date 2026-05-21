<?php
// ============================================================
// Update Contact API Endpoint
// COP4331 Contact Manager
// ============================================================
//
// Final purpose:
// Receives edited contact data from the frontend as JSON.
// Updates an existing contact that belongs to the logged-in user.
//
// Expected JSON request later:
// {
//   "userId": 1,
//   "contactId": 3,
//   "firstName": "John",
//   "lastName": "Doe",
//   "phone": "407-555-9999",
//   "email": "john.updated@example.com"
// }

header("Content-Type: application/json");

echo json_encode([
    "success" => false,
    "message" => "updateContact.php endpoint not implemented yet."
]);
?>

