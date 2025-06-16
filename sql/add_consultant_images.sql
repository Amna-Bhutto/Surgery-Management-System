-- Add Consultant Images Migration Script
-- This script will add image_url column to consultants table

-- Add image_url column to consultants table with default value
ALTER TABLE consultants ADD COLUMN image_url VARCHAR(500) DEFAULT 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg' AFTER available_days;

-- Insert some sample consultant data with images (using placeholder image URLs)
-- You can replace these URLs with actual consultant photos later

-- Pakistani Medical Consultants with Images
-- Popular medical specialties and consultant names in Pakistan

INSERT INTO consultants (name, arriving_time, leaving_time, available_days, image_url) VALUES

-- 1. Dr. Ahmed Hassan (Cardiologist)
('Dr. Ahmed Hassan', '09:00:00', '17:00:00', '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),

-- 2. Dr. Fatima Khan (Gynecologist)
('Dr. Fatima Khan', '10:00:00', '16:00:00', '["Monday", "Wednesday", "Friday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),

-- 3. Dr. Muhammad Ali (Orthopedic Surgeon)
('Dr. Muhammad Ali', '08:00:00', '14:00:00', '["Tuesday", "Thursday", "Saturday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),

-- 4. Dr. Ayesha Malik (Pediatrician)
('Dr. Ayesha Malik', '11:00:00', '19:00:00', '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),

-- 5. Dr. Imran Sheikh (Neurologist)
('Dr. Imran Sheikh', '14:00:00', '20:00:00', '["Monday", "Wednesday", "Friday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),

-- 6. Dr. Sadia Rehman (Dermatologist)
('Dr. Sadia Rehman', '09:30:00', '15:30:00', '["Tuesday", "Thursday", "Saturday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),

-- 7. Dr. Tariq Mahmood (General Surgeon)
('Dr. Tariq Mahmood', '07:00:00', '15:00:00', '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),

-- 8. Dr. Nadia Iqbal (ENT Specialist)
('Dr. Nadia Iqbal', '10:30:00', '16:30:00', '["Monday", "Wednesday", "Friday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),

-- 9. Dr. Waseem Ahmad (Urologist)
('Dr. Waseem Ahmad', '08:30:00', '14:30:00', '["Tuesday", "Thursday", "Saturday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'),

-- 10. Dr. Rubina Ashraf (Psychiatrist)
('Dr. Rubina Ashraf', '12:00:00', '18:00:00', '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]', 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg')

ON DUPLICATE KEY UPDATE 
    arriving_time = VALUES(arriving_time),
    leaving_time = VALUES(leaving_time),
    available_days = VALUES(available_days),
    image_url = VALUES(image_url);

SELECT 'Consultant images column added and sample data inserted successfully!' as message; 