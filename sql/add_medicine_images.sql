-- Add Medicine Images Migration Script
-- This script will add image_url column to medicines table

-- Add image_url column to medicines table with default value
ALTER TABLE medicines ADD COLUMN image_url VARCHAR(500) DEFAULT 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg' AFTER stock_quantity;

-- Insert some sample medicine data with images (using placeholder image URLs)
-- You can replace these URLs with actual medicine images later

-- Pakistani Pharmaceutical Industry Medicines with Images
-- Popular medicines available in Pakistan with realistic PKR pricing

INSERT INTO medicines (name, description, category, dosage, price, stock_quantity, image_url) VALUES

-- 1. Panadol (GSK Pakistan)
('Panadol', 'Paracetamol for pain relief and fever reduction. Most trusted brand in Pakistan.', 'Analgesic', '500mg', 42.00, 200, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),

-- 2. Brufen (Abbott Pakistan)
('Brufen', 'Ibuprofen anti-inflammatory pain reliever. Popular for muscle pain and fever.', 'NSAID', '400mg', 70.00, 150, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),

-- 3. Arinac (Barrett Hodgson Pakistan)
('Arinac', 'Cold and flu relief tablets. Contains Paracetamol and Phenylephrine.', 'Cold & Flu', '500mg/10mg', 84.00, 120, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),

-- 4. Flagyl (Sanofi Pakistan)
('Flagyl', 'Metronidazole antibiotic for bacterial and parasitic infections.', 'Antibiotic', '400mg', 336.00, 80, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),

-- 5. Augmentin (GSK Pakistan)
('Augmentin', 'Amoxicillin with Clavulanic acid. Broad spectrum antibiotic.', 'Antibiotic', '625mg', 700.00, 60, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),

-- 6. Ponstan (Pfizer Pakistan)
('Ponstan', 'Mefenamic acid for pain relief, especially menstrual pain.', 'NSAID', '250mg', 224.00, 100, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),

-- 7. Disprol (Reckitt Benckiser Pakistan)
('Disprol', 'Paracetamol suspension and tablets for children and adults.', 'Analgesic', '120mg/5ml', 252.00, 180, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),

-- 8. Cipro (Bayer Pakistan)
('Cipro', 'Ciprofloxacin antibiotic for urinary tract and respiratory infections.', 'Antibiotic', '500mg', 504.00, 70, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),

-- 9. Risek (Getz Pharma Pakistan)
('Risek', 'Omeprazole for acid reflux and stomach ulcers. Popular Pakistani brand.', 'PPI', '20mg', 168.00, 140, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),

-- 10. Calpol (GSK Pakistan)
('Calpol', 'Paracetamol syrup specially formulated for children.', 'Pediatric Analgesic', '120mg/5ml', 308.00, 160, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),

-- 11. Lexotanil (Roche Pakistan)
('Lexotanil', 'Bromazepam for anxiety and tension relief.', 'Anxiolytic', '3mg', 112.00, 90, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg'),

-- 12. Stilnox (Sanofi Pakistan)
('Stilnox', 'Zolpidem for short-term treatment of insomnia.', 'Hypnotic', '10mg', 420.00, 50, 'https://www.shutterstock.com/shutterstock/photos/1682021551/display_1500/stock-vector-medicine-icon-trendy-and-modern-placeholder-symbol-for-logo-web-app-ui-1682021551.jpg')
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    category = VALUES(category),
    dosage = VALUES(dosage),
    price = VALUES(price),
    stock_quantity = VALUES(stock_quantity),
    image_url = VALUES(image_url);

SELECT 'Medicine images column added and sample data inserted successfully!' as message; 