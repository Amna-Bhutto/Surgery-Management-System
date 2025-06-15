-- Remove Status Fields Migration Script
-- This script will remove status and payment_status columns from all tables
-- Compatible with older MySQL versions

-- Step 1: Remove status column from patients table
ALTER TABLE patients DROP COLUMN status;

-- Step 2: Remove status column from surgeries table
ALTER TABLE surgeries DROP COLUMN status;

-- Step 3: Remove status column from lab_results table
ALTER TABLE lab_results DROP COLUMN status;

-- Step 4: Remove payment_status column from bills table
ALTER TABLE bills DROP COLUMN payment_status;

-- Verification message
SELECT 'Status columns have been removed successfully!' as message;

-- Optional: Check table structures to verify removal
-- DESCRIBE patients;
-- DESCRIBE surgeries;
-- DESCRIBE lab_results;
-- DESCRIBE bills;