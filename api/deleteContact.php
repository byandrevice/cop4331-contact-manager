<?php
// ============================================================
// Delete Contact API Endpoint
// COP4331 Contact Manager
// ============================================================
//
// Final purpose:
// Deletes a contact that belongs to the logged-in user.
//
// Frontend reminder:
// The only alert/dialog the app should need is delete confirmation.
//
// Expected JSON request later:
// {
//   "userId": 1,
//   "contactId": 3
// }

header("Content-Type: application/json");

echo json_encode([
    "success" => false,
    "message" => "deleteContact.php endpoint not implemented yet."
]);
?>
