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
header("Access-Control-Allow-Origin: *");

include ("config.php");

// Get JSON input
$inData = json_decode(file_get_contents("php://input"), true);

$userId = $inData["userId"] ?? 0;
$contactId = $inData["contactId"] ?? 0;

// Validate
if ($userId == 0 || $contactId == 0) {
    echo json_encode([
        "id" => 0,
        "error" => "Missing required fields"
    ]);
    exit();
}

// Checking for Database connection
if ($conn->connect_error) {
    echo json_encode([
        "id" => 0,
        "error" => "Database connection failed"
    ]);
    exit();
}

// Delete query
$stmt = $conn->prepare(
    "DELETE FROM Contacts WHERE ID=? AND UserID=?"
);

$stmt->bind_param("ii", $contactId, $userId);

$stmt->execute();

// Check if anything was deleted
if ($stmt->affected_rows > 0) {
    echo json_encode([
        "id" => 1,
        "error" => ""
    ]);
} else {
    echo json_encode([
        "id" => 0,
        "error" => "Contact not found"
    ]);
}

$stmt->close();
$conn->close();
?>
