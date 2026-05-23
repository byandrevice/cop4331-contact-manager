-- ============================================================
-- Seed Data
-- COP4331 Contact Manager
-- ============================================================

USE contact_manager;

-- Test user
-- NOTE: This password will be in plain text for early testing, update to match format later

INSERT INTO Users (FirstName, LastName, Login, Password)
VALUES ('Test', 'User', 'testuser', 'password123');

INSERT INTO Users (FirstName, LastName, Login, Password)
VALUES ('Demo', 'User', 'demouser', 'password123');

-- Temporary test contacts connected to test user
-- UserID = 1 belongs to Test User.
-- UserID = 2 belongs to Demo User.
-- Helps us verify contacts are user-specific/not shared

INSERT INTO Contacts (UserID, FirstName, LastName, Phone, Email)
VALUES
(1, 'John', 'Doe', '407-555-1234', 'john@example.com'),
(1, 'Jane', 'Smith', '407-555-5678', 'jane@example.com'),
(2, 'Alex', 'Rivera', '321-555-1111', 'alex@example.com'),
(2, 'Mia', 'Chen', '321-555-2222', 'mia@example.com');

-- To test in MySQL, run this after loading seed.sql:

-- SELECT * FROM Users;
-- SELECT * FROM Contacts;
-- SELECT * FROM Contacts WHERE UserID = 1;
-- SELECT * FROM Contacts WHERE UserID = 2;
--
-- Partial-match search test:
-- SELECT * FROM Contacts
-- WHERE UserID = 1
-- AND (FirstName LIKE '%jo%' OR LastName LIKE '%jo%');
