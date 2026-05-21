<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include "config.example.php";

// READ JSON input
$inData = json_decode(file_get_contents("php://input"), true);

// Safety check
if (!isset($inData["login"]) || !isset($inData["password"])) {
    echo json_encode(["id" => 0, "error" => "Missing login or password"]);
    exit();
}

$login = $inData["login"];
$password = $inData["password"];

// Connect to DB
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["id" => 0, "error" => "Database connection failed"]);
    exit();
}

// Find user by login
$stmt = $conn->prepare("SELECT ID, Password FROM Users WHERE Login = ?");
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();

// If user exists
if ($row = $result->fetch_assoc()) {
    
    // Compare password
    if ($row["Password"] === $password) {
        echo json_encode(["id" => $row["ID"], "error" => ""]);
    } else {
        echo json_encode(["id" => 0, "error" => "Wrong password"]);
    }

} else {

    echo json_encode(["id" => 0, "error" => "User not found"]);
}

$stmt->close();
$conn->close();
?>

