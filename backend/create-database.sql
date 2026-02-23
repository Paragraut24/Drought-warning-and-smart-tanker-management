-- Water Governance Platform Database Setup
-- Run this file in MySQL to create the database

-- Create database
CREATE DATABASE IF NOT EXISTS water_governance;

-- Use the database
USE water_governance;

-- Show success message
SELECT 'Database created successfully!' AS Status;

-- Optional: Create dedicated user (recommended)
-- Uncomment the lines below to create a dedicated user

-- CREATE USER IF NOT EXISTS 'wateradmin'@'localhost' IDENTIFIED BY 'water123';
-- GRANT ALL PRIVILEGES ON water_governance.* TO 'wateradmin'@'localhost';
-- FLUSH PRIVILEGES;
-- SELECT 'User created successfully!' AS Status;

-- Show all databases to verify
SHOW DATABASES;
