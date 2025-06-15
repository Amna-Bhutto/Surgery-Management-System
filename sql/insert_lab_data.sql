-- Insert Lab Sample Types
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

-- Insert Lab Result Types
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