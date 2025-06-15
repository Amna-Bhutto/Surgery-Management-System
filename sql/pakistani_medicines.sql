CREATE TABLE IF NOT EXISTS medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100),
    dosage VARCHAR(100),
    price DECIMAL(10,2),
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pakistani Pharmaceutical Industry Medicines
-- Popular medicines available in Pakistan with realistic PKR pricing

INSERT INTO medicines (name, description, category, dosage, price, stock_quantity) VALUES

-- 1. Panadol (GSK Pakistan)
('Panadol', 'Paracetamol for pain relief and fever reduction. Most trusted brand in Pakistan.', 'Analgesic', '500mg', 42.00, 200),

-- 2. Brufen (Abbott Pakistan)
('Brufen', 'Ibuprofen anti-inflammatory pain reliever. Popular for muscle pain and fever.', 'NSAID', '400mg', 70.00, 150),

-- 3. Arinac (Barrett Hodgson Pakistan)
('Arinac', 'Cold and flu relief tablets. Contains Paracetamol and Phenylephrine.', 'Cold & Flu', '500mg/10mg', 84.00, 120),

-- 4. Flagyl (Sanofi Pakistan)
('Flagyl', 'Metronidazole antibiotic for bacterial and parasitic infections.', 'Antibiotic', '400mg', 336.00, 80),

-- 5. Augmentin (GSK Pakistan)
('Augmentin', 'Amoxicillin with Clavulanic acid. Broad spectrum antibiotic.', 'Antibiotic', '625mg', 700.00, 60),

-- 6. Ponstan (Pfizer Pakistan)
('Ponstan', 'Mefenamic acid for pain relief, especially menstrual pain.', 'NSAID', '250mg', 224.00, 100),

-- 7. Disprol (Reckitt Benckiser Pakistan)
('Disprol', 'Paracetamol suspension and tablets for children and adults.', 'Analgesic', '120mg/5ml', 252.00, 180),

-- 8. Cipro (Bayer Pakistan)
('Cipro', 'Ciprofloxacin antibiotic for urinary tract and respiratory infections.', 'Antibiotic', '500mg', 504.00, 70),

-- 9. Risek (Getz Pharma Pakistan)
('Risek', 'Omeprazole for acid reflux and stomach ulcers. Popular Pakistani brand.', 'PPI', '20mg', 168.00, 140),

-- 10. Calpol (GSK Pakistan)
('Calpol', 'Paracetamol syrup specially formulated for children.', 'Pediatric Analgesic', '120mg/5ml', 308.00, 160),

-- 11. Lexotanil (Roche Pakistan)
('Lexotanil', 'Bromazepam for anxiety and tension relief.', 'Anxiolytic', '3mg', 112.00, 90),

-- 12. Stilnox (Sanofi Pakistan)
('Stilnox', 'Zolpidem for short-term treatment of insomnia.', 'Hypnotic', '10mg', 420.00, 50);
