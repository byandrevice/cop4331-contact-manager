-- ============================================================
-- Seed Data
-- COP4331 Contact Manager
-- ============================================================

-- This file adds temporary test data to the database.
-- It is used so the API and frontend can test with real-looking data.
-- This is NOT final production data.

USE contact_manager;

-- Test user
-- NOTE: This password will be in plain text for early testing

Insert INTO Users (FirstName, LastName, Login, Password)
Values ('Test', 'User', 'testuser', 'password123');

-- Temporary test contacts connected to test user
-- UserID = 1 belongs to Test User.
-- UserID = 2 belongs to Demo User.
-- Helps us verify contacts are user-specific/not shared

INSERT INTO Contacts (UserID, FirstName, LastName, Phone, Email)
Values
(1, 'John', 'Doe', '407-555-1234', 'john@example.com'),
(1, 'Jane', 'Smith', '407-555-5678', 'jane@example.com'),
(2, 'Alex', 'Rivera', '321-555-1111', 'alex@example.com'),
(2, 'Mia', 'Chen', '321-555-2222', 'mia@example.com');
