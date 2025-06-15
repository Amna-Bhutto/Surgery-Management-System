-- Lab Enhancement Migration Script
-- This script will create the new lab tables and migrate existing data

-- Step 1: Create new tables for lab sample types and result types
CREATE TABLE IF NOT EXISTS lab_sample_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    collection_method VARCHAR(100),
    processing_time_hours INT DEFAULT 24,
    special_requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lab_result_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    normal_range VARCHAR(100),
    units VARCHAR(50),
    category VARCHAR(100),
    interpretation_guide TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Insert sample data for lab sample types
INSERT INTO lab_sample_types (name, description, collection_method, processing_time_hours, special_requirements) VALUES
('Blood', 'Whole blood sample for various tests', 'Venipuncture', 2, 'Fasting may be required for some tests'),
('Urine', 'Urine sample for analysis', 'Midstream collection', 1, 'Clean catch technique preferred'),
('Tissue Biopsy', 'Tissue sample for histopathological examination', 'Surgical biopsy', 48, 'Immediate fixation in formalin required'),
('Swab Culture', 'Bacterial culture from wound or throat', 'Sterile swab', 24, 'Sterile collection technique essential'),
('Sputum', 'Respiratory secretions for analysis', 'Expectoration', 4, 'Early morning sample preferred'),
('Cerebrospinal Fluid', 'CSF for neurological analysis', 'Lumbar puncture', 6, 'Immediate processing required'),
('Stool', 'Fecal sample for parasites and bacteria', 'Container collection', 12, 'Fresh sample within 2 hours'),
('Pleural Fluid', 'Fluid from pleural cavity', 'Thoracentesis', 8, 'Sterile collection required'),
('Synovial Fluid', 'Joint fluid for analysis', 'Arthrocentesis', 4, 'Sterile technique mandatory'),
('Bone Marrow', 'Bone marrow aspirate for hematological analysis', 'Bone marrow biopsy', 24, 'Immediate smear preparation');

-- Step 3: Insert sample data for lab result types
INSERT INTO lab_result_types (name, description, normal_range, units, category, interpretation_guide) VALUES
('Hemoglobin', 'Oxygen-carrying protein in red blood cells', '12-16 g/dL (Women), 14-18 g/dL (Men)', 'g/dL', 'Hematology', 'Low: Anemia, High: Polycythemia'),
('White Blood Cell Count', 'Total count of white blood cells', '4,000-11,000', 'cells/μL', 'Hematology', 'Low: Immunosuppression, High: Infection/Leukemia'),
('Platelet Count', 'Number of platelets for blood clotting', '150,000-450,000', 'cells/μL', 'Hematology', 'Low: Bleeding risk, High: Thrombosis risk'),
('Blood Glucose', 'Blood sugar level', '70-100 mg/dL (Fasting)', 'mg/dL', 'Biochemistry', 'High: Diabetes, Low: Hypoglycemia'),
('Creatinine', 'Kidney function marker', '0.6-1.2 mg/dL', 'mg/dL', 'Biochemistry', 'High: Kidney dysfunction'),
('ALT (SGPT)', 'Liver enzyme for liver function', '7-56 U/L', 'U/L', 'Biochemistry', 'High: Liver damage or disease'),
('Total Cholesterol', 'Overall cholesterol level', '<200 mg/dL', 'mg/dL', 'Lipid Profile', 'High: Cardiovascular risk'),
('Bacteria Culture', 'Presence of pathogenic bacteria', 'No growth', 'CFU/mL', 'Microbiology', 'Growth: Infection present'),
('Malignant Cells', 'Presence of cancer cells', 'Negative', 'Present/Absent', 'Histopathology', 'Positive: Malignancy detected'),
('Protein', 'Protein content in urine', '<150 mg/24hr', 'mg/24hr', 'Urinalysis', 'High: Kidney disease'),
('Red Blood Cells', 'RBC count in urine', '0-2 /hpf', '/hpf', 'Urinalysis', 'High: Hematuria, possible UTI or stones'),
('Inflammatory Cells', 'Presence of inflammatory cells', 'Minimal', 'Grade 0-4', 'Histopathology', 'High grade: Active inflammation'),
('Parasites', 'Presence of parasitic organisms', 'Not detected', 'Present/Absent', 'Parasitology', 'Detected: Parasitic infection'),
('Acid Fast Bacilli', 'TB bacteria detection', 'Negative', 'Present/Absent', 'Microbiology', 'Positive: TB infection'),
('Leukocytes', 'White blood cells in fluid', '<500', 'cells/μL', 'Fluid Analysis', 'High: Infection or inflammation');

-- Step 4: Backup existing lab_results data (if any)
CREATE TABLE IF NOT EXISTS lab_results_backup AS 
SELECT * FROM lab_results WHERE 1=0;

INSERT INTO lab_results_backup SELECT * FROM lab_results;

-- Step 5: Drop existing lab_results table and recreate with new structure
DROP TABLE IF EXISTS lab_results;

CREATE TABLE lab_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    surgery_id INT NOT NULL,
    sample_type_id INT NOT NULL,
    result_type_id INT NOT NULL,
    result_value TEXT NOT NULL,
    test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    technician_notes TEXT,
    FOREIGN KEY (surgery_id) REFERENCES surgeries(id) ON DELETE CASCADE,
    FOREIGN KEY (sample_type_id) REFERENCES lab_sample_types(id) ON DELETE CASCADE,
    FOREIGN KEY (result_type_id) REFERENCES lab_result_types(id) ON DELETE CASCADE
);

-- Step 6: Migrate old data (if backup table has data)
-- This will map old sample_name and result to appropriate IDs
-- You may need to adjust this based on your actual data

-- Example migration (uncomment and adjust as needed):
-- INSERT INTO lab_results (surgery_id, sample_type_id, result_type_id, result_value, test_date, technician_notes)
-- SELECT 
--     surgery_id,
--     (SELECT id FROM lab_sample_types WHERE name = 'Blood' LIMIT 1) as sample_type_id,
--     (SELECT id FROM lab_result_types WHERE name = 'Hemoglobin' LIMIT 1) as result_type_id,
--     result as result_value,
--     NOW() as test_date,
--     CONCAT('Migrated from old system. Original sample: ', sample_name) as technician_notes
-- FROM lab_results_backup;

-- Step 7: Add some sample lab results for demonstration
-- These are example results - uncomment if you want sample data
-- INSERT INTO lab_results (surgery_id, sample_type_id, result_type_id, result_value, technician_notes) VALUES
-- (1, 1, 1, '14.5', 'Normal hemoglobin levels'),
-- (1, 1, 2, '7500', 'WBC count within normal range'),
-- (2, 2, 10, '80', 'Protein levels slightly elevated'),
-- (3, 3, 9, 'Negative', 'No malignant cells detected');

-- Migration complete message
SELECT 'Lab enhancement migration completed successfully!' as message; 