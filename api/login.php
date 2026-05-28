<?php
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

include "config.php";

// READ JSON input
$inData = json_decode(file_get_contents("php://input"), true);

// Safety check
if (!isset($inData["login"]) || !isset($inData["password"])) {
    echo json_encode([
        "id" => 0,
        "firstName" => "",
        "lastName" => "",
        "error" => "Missing login or password"
    ]);
    exit();
}

$login = $inData["login"];
$password = $inData["password"];

if ($conn->connect_error) {
    echo json_encode([
        "id" => 0,
        "firstName" => "",
        "lastName" => "",
        "error" => "Database connection failed"
    ]);
    exit();
}

// Find user by login
$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Password FROM Users WHERE Login = ?");
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();

// If user exists
if ($row = $result->fetch_assoc()) {
    
    // Compare password
    if ($row["Password"] === $password) {
        echo json_encode([
            "id" => $row["ID"],
            "firstName" => $row["FirstName"],
            "lastName" => $row["LastName"],
            "error" => ""
        ]);
    } else {
        echo json_encode([
            "id" => 0,
            "firstName" => "",
            "lastName" => "",
            "error" => "Wrong password"
        ]);
    }

} else {

    echo json_encode([
        "id" => 0,
        "firstName" => "",
        "lastName" => "",
        "error" => "User not found"
    ]);
}

$stmt->close();
$conn->close();
?>