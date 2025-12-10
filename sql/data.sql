-- Seed data for Surgery Management System
-- This file consolidates all inserts from previous migration/data files.
-- It is safe to re-run: uses INSERT IGNORE or ON DUPLICATE KEY UPDATE where appropriate.

-- -------------------------------------------------------------------
-- Surgery Packages
-- -------------------------------------------------------------------
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

-- -------------------------------------------------------------------
-- Consultants (sample data with images)
-- -------------------------------------------------------------------
INSERT INTO consultants (name, arriving_time, leaving_time, available_days, image_url) VALUES
('Dr. Ahmed Hassan', '09:00:00', '17:00:00', '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),
('Dr. Fatima Khan', '10:00:00', '16:00:00', '["Monday", "Wednesday", "Friday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),
('Dr. Muhammad Ali', '08:00:00', '14:00:00', '["Tuesday", "Thursday", "Saturday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),
('Dr. Ayesha Malik', '11:00:00', '19:00:00', '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),
('Dr. Imran Sheikh', '14:00:00', '20:00:00', '["Monday", "Wednesday", "Friday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),
('Dr. Sadia Rehman', '09:30:00', '15:30:00', '["Tuesday", "Thursday", "Saturday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),
('Dr. Tariq Mahmood', '07:00:00', '15:00:00', '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),
('Dr. Nadia Iqbal', '10:30:00', '16:30:00', '["Monday", "Wednesday", "Friday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),
('Dr. Waseem Ahmad', '08:30:00', '14:30:00', '["Tuesday", "Thursday", "Saturday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),
('Dr. Rubina Ashraf', '12:00:00', '18:00:00', '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg')
ON DUPLICATE KEY UPDATE 
	arriving_time = VALUES(arriving_time),
	leaving_time = VALUES(leaving_time),
	available_days = VALUES(available_days),
	image_url = VALUES(image_url);

-- -------------------------------------------------------------------
-- Lab sample/result types
-- -------------------------------------------------------------------
INSERT IGNORE INTO lab_sample_types (name, description, collection_method, processing_time_hours, special_requirements) VALUES
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

INSERT IGNORE INTO lab_result_types (name, description, normal_range, units, category, interpretation_guide) VALUES
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

-- -------------------------------------------------------------------
-- Medicines (with images)
-- -------------------------------------------------------------------
INSERT INTO medicines (name, description, category, dosage, price, stock_quantity, image_url) VALUES
('Panadol', 'Paracetamol for pain relief and fever reduction. Most trusted brand in Pakistan.', 'Analgesic', '500mg', 42.00, 200, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),
('Brufen', 'Ibuprofen anti-inflammatory pain reliever. Popular for muscle pain and fever.', 'NSAID', '400mg', 70.00, 150, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),
('Arinac', 'Cold and flu relief tablets. Contains Paracetamol and Phenylephrine.', 'Cold & Flu', '500mg/10mg', 84.00, 120, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),
('Flagyl', 'Metronidazole antibiotic for bacterial and parasitic infections.', 'Antibiotic', '400mg', 336.00, 80, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),
('Augmentin', 'Amoxicillin with Clavulanic acid. Broad spectrum antibiotic.', 'Antibiotic', '625mg', 700.00, 60, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),
('Ponstan', 'Mefenamic acid for pain relief, especially menstrual pain.', 'NSAID', '250mg', 224.00, 100, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),
('Disprol', 'Paracetamol suspension and tablets for children and adults.', 'Analgesic', '120mg/5ml', 252.00, 180, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),
('Cipro', 'Ciprofloxacin antibiotic for urinary tract and respiratory infections.', 'Antibiotic', '500mg', 504.00, 70, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),
('Risek', 'Omeprazole for acid reflux and stomach ulcers. Popular Pakistani brand.', 'PPI', '20mg', 168.00, 140, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),
('Calpol', 'Paracetamol syrup specially formulated for children.', 'Pediatric Analgesic', '120mg/5ml', 308.00, 160, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),
('Lexotanil', 'Bromazepam for anxiety and tension relief.', 'Anxiolytic', '3mg', 112.00, 90, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),
('Stilnox', 'Zolpidem for short-term treatment of insomnia.', 'Hypnotic', '10mg', 420.00, 50, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg')
ON DUPLICATE KEY UPDATE 
	description = VALUES(description),
	category = VALUES(category),
	dosage = VALUES(dosage),
	price = VALUES(price),
	stock_quantity = VALUES(stock_quantity),
	image_url = VALUES(image_url);


