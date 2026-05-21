<?php
// ============================================================
// Search Contacts API Endpoint
// COP4331 Contact Manager
// ============================================================
//
// Final purpose:
// Searches contacts for a specific logged-in user.
// This must be a real search API, not cached client-side contacts.
//
// Requirement reminder:
// The project requires effective search with partial match.
// Search should work at least on first and last names.
//
// Expected JSON request later:
// {
//   "userId": 1,
//   "search": "jo"
// }

header("Content-Type: application/json");

echo json_encode([
    "success" => false,
    "message" => "searchContacts.php endpoint not implemented yet.",
    "results" => []
]);
?>

