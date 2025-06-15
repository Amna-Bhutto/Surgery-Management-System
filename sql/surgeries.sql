-- Safe Database Migration for Surgery Packages Feature
-- This script safely updates the database without breaking foreign key constraints

-- Step 1: Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Step 2: Create surgery_packages table first (if it doesn't exist)
CREATE TABLE IF NOT EXISTS surgery_packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    duration_hours INT DEFAULT 1,
    complexity_level VARCHAR(50) DEFAULT 'Medium',
    equipment_required TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Check if surgery_package_id column exists in surgeries table
SELECT COUNT(*) AS column_exists FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hospital' 
AND TABLE_NAME = 'surgeries' 
AND COLUMN_NAME = 'surgery_package_id';

-- Step 4: Add new columns to surgeries table if they don't exist
-- Note: You may need to run these one by one if your MySQL version doesn't support IF NOT EXISTS for ALTER TABLE

-- Add surgery_package_id column
ALTER TABLE surgeries ADD COLUMN surgery_package_id INT DEFAULT NULL;

-- Add package_price column  
ALTER TABLE surgeries ADD COLUMN package_price DECIMAL(10,2) DEFAULT 0.00;

-- Add status column
ALTER TABLE surgeries ADD COLUMN status VARCHAR(50) DEFAULT 'Scheduled';

-- Step 5: Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Step 6: Add foreign key constraint safely
ALTER TABLE surgeries 
ADD CONSTRAINT fk_surgery_package 
FOREIGN KEY (surgery_package_id) REFERENCES surgery_packages(id) ON DELETE SET NULL;

-- Step 7: Insert surgery packages data
INSERT IGNORE INTO surgery_packages (name, description, category, price, duration_hours, complexity_level, equipment_required) VALUES
('Appendectomy', 'Surgical removal of the appendix - laparoscopic procedure', 'General Surgery', 150000.00, 2, 'Medium', 'Laparoscopy equipment, basic surgical instruments'),
('Gallbladder Surgery (Cholecystectomy)', 'Laparoscopic removal of gallbladder', 'General Surgery', 200000.00, 3, 'Medium', 'Laparoscopy equipment, specialized instruments'),
('Hernia Repair', 'Inguinal or umbilical hernia repair with mesh', 'General Surgery', 120000.00, 2, 'Low', 'Basic surgical instruments, mesh implant'),
('Cataract Surgery', 'Phacoemulsification with IOL implantation', 'Eye Surgery', 80000.00, 1, 'Low', 'Phaco machine, microscope, IOL'),
('Knee Replacement', 'Total knee joint replacement surgery', 'Orthopedic', 500000.00, 4, 'High', 'Orthopedic instruments, prosthetic knee joint'),
('Hip Replacement', 'Total hip joint replacement surgery', 'Orthopedic', 600000.00, 5, 'High', 'Orthopedic instruments, prosthetic hip joint'),
('Cardiac Bypass Surgery', 'Coronary artery bypass graft (CABG)', 'Cardiac Surgery', 1200000.00, 8, 'Very High', 'Heart-lung machine, cardiac instruments'),
('Thyroidectomy', 'Surgical removal of thyroid gland', 'ENT Surgery', 180000.00, 3, 'Medium', 'Specialized ENT instruments, nerve monitoring'),
('Tonsillectomy', 'Surgical removal of tonsils', 'ENT Surgery', 60000.00, 1, 'Low', 'Basic ENT instruments'),
('Cesarean Section (C-Section)', 'Surgical delivery of baby', 'Obstetrics', 100000.00, 2, 'Medium', 'Obstetric instruments, surgical sutures'),
('Hysterectomy', 'Surgical removal of uterus', 'Gynecology', 250000.00, 3, 'Medium', 'Gynecological instruments, laparoscopy equipment'),
('Brain Tumor Surgery', 'Craniotomy for tumor removal', 'Neurosurgery', 800000.00, 6, 'Very High', 'Neurosurgical instruments, microscope, neuro-monitoring'),
('Spinal Fusion', 'Lumbar or cervical spine fusion surgery', 'Neurosurgery', 450000.00, 4, 'High', 'Spinal instruments, bone graft, screws and rods'),
('Prostate Surgery (TURP)', 'Transurethral resection of prostate', 'Urology', 180000.00, 2, 'Medium', 'Urological instruments, resectoscope'),
('Kidney Stone Surgery', 'Percutaneous nephrolithotomy (PCNL)', 'Urology', 220000.00, 3, 'Medium', 'Urological instruments, nephroscope, lithotripsy equipment');

-- Step 8: Verify the migration
SELECT 'Migration completed successfully!' AS status;
SELECT COUNT(*) AS surgery_packages_count FROM surgery_packages;
SELECT 'surgery_package_id' AS new_column, 
       CASE WHEN COUNT(*) > 0 THEN 'EXISTS' ELSE 'MISSING' END AS status
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hospital' 
AND TABLE_NAME = 'surgeries' 
AND COLUMN_NAME = 'surgery_package_id'; 