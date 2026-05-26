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
header("Access-Control-Allow-Origin: *");

include("config.php");

// Get JSON input
$inData = json_decode(file_get_contents("php://input"), true);

$firstName = $inData["firstName"] ?? "";
$lastName = $inData["lastName"] ?? "";
$login = $inData["login"] ?? "";
$password = $inData["password"] ?? "";

// Validate input
if ($firstName == "" || $lastName == "" || $login == "" || $password == "") {
    echo json_encode([
        "id" => 0,
        "error" => "Missing required fields"
    ]);
    exit();
}

if ($conn->connect_error) {
    echo json_encode([
        "id" => 0,
        "error" => "Database connection failed"
    ]);
    exit();
}

// Check if user already exists
$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        "id" => 0,
        "error" => "User already exists"
    ]);
    exit();
}

// Insert new user
$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);

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
