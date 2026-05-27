<?php
// Searches contacts for a specific logged-in user.
// According to assignment ust be a real search API, not cached client-side contacts.
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

// Include database connection
include "config.php";

// Read JSON
$inData = json_decode(file_get_contents("php://input"), true);

// Check that JSON was read correctly
if ($inData === null) {
    echo json_encode([
        "results" => [],
        "error" => "Invalid JSON input."
    ]);
    exit();
}

// Receive userId and search text from the frontend JSON.
$userId = $inData["userId"] ?? 0;
$search = $inData["search"] ?? "";

// Make sure the frontend sent a valid userId.
if ($userId == 0) {
    echo json_encode([
        "results" => [],
        "error" => "Missing or invalid userId."
    ]);
    exit();
}

// Ex: "jo" becomes "%jo%", which can match "John".
$searchPattern = "%" . $search . "%";


// Checks FirstName and LastName for partial matches.
$stmt = $conn->prepare(
    "SELECT ID, FirstName, LastName, Phone, Email, DateCreated
     FROM Contacts
     WHERE UserID = ?
     AND (FirstName LIKE ? OR LastName LIKE ?)
     ORDER BY LastName, FirstName"
);

// If SQL statement cant be prepared, return a JSON error.
if (!$stmt) {
    echo json_encode([
        "results" => [],
        "error" => "Failed to prepare search query."
    ]);
    exit();
}

// Bind values into the prepared statement.
// i = integer userId
// s = string search pattern for FirstName
// s = string search pattern for LastName
$stmt->bind_param("iss", $userId, $searchPattern, $searchPattern);

// Run the query and get the result set.
$stmt->execute();
$result = $stmt->get_result();

// Store each matching contact in this array.
$contacts = [];

// Convert each database row into a JSON-friendly contact object.
while ($row = $result->fetch_assoc()) {
    $contacts[] = [
        "id" => $row["ID"],
        "firstName" => $row["FirstName"],
        "lastName" => $row["LastName"],
        "phone" => $row["Phone"],
        "email" => $row["Email"],
        "dateCreated" => $row["DateCreated"]
    ];
}

// Close database resources.
$stmt->close();
$conn->close();

// Return the matching contacts to the frontend as JSON.
echo json_encode([
    "success" => true,
    "results" => $contacts,
    "error" => ""
]);
?>



