-- Safe Remove Status Fields Migration Script
-- This script will safely remove status columns only if they exist

-- Step 1: Check and remove status column from patients table
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'patients' 
     AND column_name = 'status' 
     AND table_schema = DATABASE()) > 0,
    'ALTER TABLE patients DROP COLUMN status',
    'SELECT "patients.status column does not exist" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 2: Check and remove status column from surgeries table
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'surgeries' 
     AND column_name = 'status' 
     AND table_schema = DATABASE()) > 0,
    'ALTER TABLE surgeries DROP COLUMN status',
    'SELECT "surgeries.status column does not exist" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 3: Check and remove status column from lab_results table
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'lab_results' 
     AND column_name = 'status' 
     AND table_schema = DATABASE()) > 0,
    'ALTER TABLE lab_results DROP COLUMN status',
    'SELECT "lab_results.status column does not exist" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 4: Check and remove payment_status column from bills table
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name = 'bills' 
     AND column_name = 'payment_status' 
     AND table_schema = DATABASE()) > 0,
    'ALTER TABLE bills DROP COLUMN payment_status',
    'SELECT "bills.payment_status column does not exist" as message'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Final verification message
SELECT 'Status migration completed!' as result; 