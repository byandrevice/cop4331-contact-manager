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
header("Access-Control-Allow-Origin: *");

include ("config.php");

// Get JSON input
$inData = json_decode(file_get_contents("php://input"), true);

$userId = $inData["userId"] ?? 0;
$firstName = $inData["firstName"] ?? "";
$lastName = $inData["lastName"] ?? "";
$phone = $inData["phone"] ?? "";
$email = $inData["email"] ?? "";

// Validate required fields
if (
    $userId == 0 ||
    $firstName == "" ||
    $lastName == "" ||
    $phone == "" ||
    $email == ""
) {
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

// Insert contact
$stmt = $conn->prepare(
    "INSERT INTO Contacts (UserID, FirstName, LastName, Phone, Email)
    VALUES (?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "issss",
    $userId,
    $firstName,
    $lastName,
    $phone,
    $email
);

if ($stmt->execute()) {
    echo json_encode([
        "id" => $stmt->insert_id,
        "error" => ""
    ]);
} else {
    echo json_encode([
        "id" => 0,
        "error" => "Insert failed"
    ]);
}

$stmt->close();
$conn->close();
?>
