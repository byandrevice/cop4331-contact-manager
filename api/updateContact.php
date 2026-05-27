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

// Tell browser/frontend that file returns JSON
header("Content-Type: application/json");

// Call API from browser
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Allow requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit();
}

include ("config.php");

// Get JSON input
$inData = json_decode(file_get_contents("php://input"), true);

$userId = $inData["userId"] ?? 0;
$contactId = $inData["contactId"] ?? 0;
$firstName = $inData["firstName"] ?? "";
$lastName = $inData["lastName"] ?? "";
$phone = $inData["phone"] ?? "";
$email = $inData["email"] ?? "";

// Validate required fields
if (
    $userId == 0 ||
    $contactId == 0 ||
    $firstName == "" ||
    $lastName == "" 
) {
    echo json_encode([
        "id" => 0,
        "message" => "Missing required fields"
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

// Update only the user's own contact
$stmt = $conn->prepare(
    "UPDATE Contacts
    SET FirstName=?, LastName=?, Phone=?, Email=?
    WHERE ID=? AND UserID=?"
);

$stmt->bind_param(
    "ssssii",
    $firstName,
    $lastName,
    $phone,
    $email,
    $contactId,
    $userId
);

$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode([
        "id" => 1,
        "error" => ""
    ]);
} else {
    echo json_encode([
        "id" => 0,
        "error" => "Contact not found or no changes made"
    ]);
}

$stmt->close();
$conn->close();
?>
