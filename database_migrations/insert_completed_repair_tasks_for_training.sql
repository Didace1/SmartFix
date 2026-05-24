-- =====================================================
-- INSERT 50 COMPLETED REPAIR TASKS FOR AI TRAINING
-- =====================================================
-- These are pre-completed repair tasks that will be used
-- to train the AI system. They appear as if they were:
-- 1. Created by Sales (with device info and symptoms)
-- 2. Assigned to technicians
-- 3. Completed by technicians (with diagnosis and result)
--
-- This data will automatically feed into the AI learning system
-- =====================================================

-- First, let's create some technician users if they don't exist
-- (You can skip this if you already have technicians in your system)

INSERT INTO users (full_name, email, password, role, specialization, approved, created_at)
SELECT 'John Smith', 'john.technician@smartfix.com', '$2a$10$dummyHashedPassword', 'TECHNICIAN', 'Hardware Specialist', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'john.technician@smartfix.com');

INSERT INTO users (full_name, email, password, role, specialization, approved, created_at)
SELECT 'Sarah Johnson', 'sarah.technician@smartfix.com', '$2a$10$dummyHashedPassword', 'TECHNICIAN', 'Software Specialist', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'sarah.technician@smartfix.com');

INSERT INTO users (full_name, email, password, role, specialization, approved, created_at)
SELECT 'Mike Davis', 'mike.technician@smartfix.com', '$2a$10$dummyHashedPassword', 'TECHNICIAN', 'General Repair', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'mike.technician@smartfix.com');

-- Get technician IDs (we'll rotate between them)
-- In the actual script, we'll use subqueries to get random technician IDs

-- =====================================================
-- INSERT 50 COMPLETED REPAIR TASKS
-- =====================================================
-- Sales side filled: device_type, device_brand, device_model, repair_note (symptoms)
-- Technician side filled: diagnosis (what they did) - stored in diagnosis table
-- Status: COMPLETED
-- =====================================================

-- Task 1: Samsung Galaxy A32 - Not charging
INSERT INTO repair_tasks (
    device_type, device_brand, device_model, repair_note, 
    status, technician_id, 
    created_at, assigned_at, started_at, completed_at
) VALUES (
    'Smartphone', 'Samsung', 'Galaxy A32', 'Not charging',
    'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0),
    NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'
);

-- Create diagnosis entry for Task 1
INSERT INTO diagnosis (
    repair_task_id, technician_id, diagnosis_text, result,
    created_at, technician_confirmed
) VALUES (
    (SELECT MAX(id) FROM repair_tasks),
    (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0),
    'Replaced charging port and cleaned corrosion near power IC',
    'SUCCESS',
    NOW() - INTERVAL '9 days',
    true
);

-- Task 2: Dell Latitude 5420 - No display
INSERT INTO repair_tasks (
    device_type, device_brand, device_model, repair_note,
    status, technician_id,
    created_at, assigned_at, started_at, completed_at
) VALUES (
    'Laptop', 'Dell', 'Latitude 5420', 'No display',
    'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1),
    NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days'
);

INSERT INTO diagnosis (repair_task_id, technician_id, diagnosis_text, result, created_at, technician_confirmed)
VALUES (
    (SELECT MAX(id) FROM repair_tasks),
    (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1),
    'Changed LCD screen and reseated RAM', 'SUCCESS', NOW() - INTERVAL '14 days', true
);

-- Task 3: LG 43LM6300 - No sound
INSERT INTO repair_tasks (device_type, device_brand, device_model, repair_note, status, technician_id, created_at, assigned_at, started_at, completed_at)
VALUES ('Television', 'LG', '43LM6300', 'No sound', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days');
INSERT INTO diagnosis (repair_task_id, technician_id, diagnosis_text, result, created_at, technician_confirmed)
VALUES ((SELECT MAX(id) FROM repair_tasks), (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), 'Replaced audio IC and updated firmware', 'SUCCESS', NOW() - INTERVAL '19 days', true);

-- Task 4: iPhone 11 - Battery draining fast
INSERT INTO repair_tasks (device_type, device_brand, device_model, repair_note, status, technician_id, created_at, assigned_at, started_at, completed_at)
VALUES ('Smartphone', 'Apple', 'iPhone 11', 'Battery draining fast', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', NOW() - INTERVAL '24 days');
INSERT INTO diagnosis (repair_task_id, technician_id, diagnosis_text, result, created_at, technician_confirmed)
VALUES ((SELECT MAX(id) FROM repair_tasks), (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), 'Replaced battery and optimized system settings', 'SUCCESS', NOW() - INTERVAL '24 days', true);

-- Task 5: HP EliteBook 840 G5 - Overheating
INSERT INTO repair_tasks (device_type, device_brand, device_model, repair_note, status, technician_id, created_at, assigned_at, started_at, completed_at)
VALUES ('Laptop', 'HP', 'EliteBook 840 G5', 'Overheating', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days');
INSERT INTO diagnosis (repair_task_id, technician_id, diagnosis_text, result, created_at, technician_confirmed)
VALUES ((SELECT MAX(id) FROM repair_tasks), (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), 'Cleaned fan and applied thermal paste', 'SUCCESS', NOW() - INTERVAL '29 days', true);

-- Continue with remaining 45 tasks...
-- (I'll create a condensed version for brevity)

-- Tasks 6-50 (condensed format)
INSERT INTO repair_tasks (device_type, device_brand, device_model, repair_note, status, technician_id, created_at, assigned_at, started_at, completed_at) VALUES
('Desktop Computer', 'Lenovo', 'ThinkCentre M720', 'Not powering on', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days', NOW() - INTERVAL '34 days'),
('Tablet', 'Samsung', 'Galaxy Tab S6', 'Touch not working', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days', NOW() - INTERVAL '39 days'),
('Printer', 'Epson', 'L3150', 'Paper jam error', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days', NOW() - INTERVAL '44 days'),
('Smartphone', 'Tecno', 'Camon 18', 'Boot loop', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days', NOW() - INTERVAL '49 days'),
('Laptop', 'Acer', 'Aspire 5', 'Keyboard not working', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days', NOW() - INTERVAL '54 days'),
('Television', 'Sony', 'Bravia X750H', 'Screen flickering', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days', NOW() - INTERVAL '59 days'),
('Smartphone', 'Xiaomi', 'Redmi Note 10', 'Speaker not working', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '65 days', NOW() - INTERVAL '65 days', NOW() - INTERVAL '65 days', NOW() - INTERVAL '64 days'),
('Desktop Computer', 'HP', 'ProDesk 600 G3', 'No network connection', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '70 days', NOW() - INTERVAL '70 days', NOW() - INTERVAL '70 days', NOW() - INTERVAL '69 days'),
('Laptop', 'Asus', 'VivoBook 15', 'Battery not charging', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '75 days', NOW() - INTERVAL '75 days', NOW() - INTERVAL '75 days', NOW() - INTERVAL '74 days'),
('Smartphone', 'Infinix', 'Hot 12', 'Camera blurry', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '80 days', NOW() - INTERVAL '80 days', NOW() - INTERVAL '80 days', NOW() - INTERVAL '79 days'),
('Television', 'Hisense', '50A6G', 'TV restarting itself', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '85 days', NOW() - INTERVAL '85 days', NOW() - INTERVAL '85 days', NOW() - INTERVAL '84 days'),
('Printer', 'Canon', 'PIXMA G3411', 'Not printing colors', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days', NOW() - INTERVAL '89 days'),
('Smartphone', 'Nokia', 'G20', 'SIM card not detected', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '95 days', NOW() - INTERVAL '95 days', NOW() - INTERVAL '95 days', NOW() - INTERVAL '94 days'),
('Laptop', 'Lenovo', 'IdeaPad 3', 'Slow performance', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '100 days', NOW() - INTERVAL '100 days', NOW() - INTERVAL '100 days', NOW() - INTERVAL '99 days'),
('Desktop Computer', 'Dell', 'OptiPlex 7080', 'Blue screen errors', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '105 days', NOW() - INTERVAL '105 days', NOW() - INTERVAL '105 days', NOW() - INTERVAL '104 days'),
('Smartphone', 'Huawei', 'P30 Lite', 'Fingerprint not working', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '110 days', NOW() - INTERVAL '110 days', NOW() - INTERVAL '110 days', NOW() - INTERVAL '109 days'),
('Tablet', 'Apple', 'iPad 8th Gen', 'Screen cracked', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '115 days', NOW() - INTERVAL '115 days', NOW() - INTERVAL '115 days', NOW() - INTERVAL '114 days'),
('Television', 'TCL', '55P615', 'No picture', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '120 days', NOW() - INTERVAL '120 days', NOW() - INTERVAL '120 days', NOW() - INTERVAL '119 days'),
('Laptop', 'MSI', 'GF63 Thin', 'Fan making noise', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '125 days', NOW() - INTERVAL '125 days', NOW() - INTERVAL '125 days', NOW() - INTERVAL '124 days'),
('Smartphone', 'Oppo', 'A54', 'WiFi not connecting', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '130 days', NOW() - INTERVAL '130 days', NOW() - INTERVAL '130 days', NOW() - INTERVAL '129 days'),
('Printer', 'Brother', 'HL-L2350DW', 'Printer offline', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '135 days', NOW() - INTERVAL '135 days', NOW() - INTERVAL '135 days', NOW() - INTERVAL '134 days'),
('Laptop', 'Dell', 'Inspiron 15 3501', 'USB ports not working', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '140 days', NOW() - INTERVAL '140 days', NOW() - INTERVAL '140 days', NOW() - INTERVAL '139 days'),
('Smartphone', 'Realme', 'C25Y', 'Stuck on logo', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '145 days', NOW() - INTERVAL '145 days', NOW() - INTERVAL '145 days', NOW() - INTERVAL '144 days'),
('Television', 'Samsung', 'UA50TU8000', 'HDMI not working', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '150 days', NOW() - INTERVAL '150 days', NOW() - INTERVAL '150 days', NOW() - INTERVAL '149 days'),
('Desktop Computer', 'Acer', 'Veriton X', 'Random shutdowns', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '155 days', NOW() - INTERVAL '155 days', NOW() - INTERVAL '155 days', NOW() - INTERVAL '154 days'),
('Smartphone', 'Vivo', 'Y20', 'Microphone not working', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '160 days', NOW() - INTERVAL '160 days', NOW() - INTERVAL '160 days', NOW() - INTERVAL '159 days'),
('Laptop', 'Apple', 'MacBook Pro 2019', 'Trackpad not responding', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '165 days', NOW() - INTERVAL '165 days', NOW() - INTERVAL '165 days', NOW() - INTERVAL '164 days'),
('Tablet', 'Lenovo', 'Tab M10', 'Not turning on', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '170 days', NOW() - INTERVAL '170 days', NOW() - INTERVAL '170 days', NOW() - INTERVAL '169 days'),
('Smartphone', 'Google', 'Pixel 5', 'Face unlock failing', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '175 days', NOW() - INTERVAL '175 days', NOW() - INTERVAL '175 days', NOW() - INTERVAL '174 days'),
('Television', 'LG', 'OLED55B9', 'Lines on screen', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '180 days', NOW() - INTERVAL '180 days', NOW() - INTERVAL '180 days', NOW() - INTERVAL '179 days'),
('Laptop', 'HP', 'Pavilion 15', 'Hinges broken', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '185 days', NOW() - INTERVAL '185 days', NOW() - INTERVAL '185 days', NOW() - INTERVAL '184 days'),
('Desktop Computer', 'Custom Build', 'Ryzen 5 PC', 'No boot display', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '190 days', NOW() - INTERVAL '190 days', NOW() - INTERVAL '190 days', NOW() - INTERVAL '189 days'),
('Smartphone', 'Samsung', 'Galaxy S20 FE', 'Fast charging not working', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '195 days', NOW() - INTERVAL '195 days', NOW() - INTERVAL '195 days', NOW() - INTERVAL '194 days'),
('Printer', 'HP', 'LaserJet Pro M404', 'Toner leaking', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '200 days', NOW() - INTERVAL '200 days', NOW() - INTERVAL '200 days', NOW() - INTERVAL '199 days'),
('Laptop', 'Toshiba', 'Satellite C55', 'No audio', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '205 days', NOW() - INTERVAL '205 days', NOW() - INTERVAL '205 days', NOW() - INTERVAL '204 days'),
('Smartphone', 'Itel', 'A56', 'Power button stuck', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '210 days', NOW() - INTERVAL '210 days', NOW() - INTERVAL '210 days', NOW() - INTERVAL '209 days'),
('Television', 'Panasonic', 'TH-43FS500', 'Remote not responding', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '215 days', NOW() - INTERVAL '215 days', NOW() - INTERVAL '215 days', NOW() - INTERVAL '214 days'),
('Laptop', 'Asus', 'ROG Strix G15', 'GPU overheating', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '220 days', NOW() - INTERVAL '220 days', NOW() - INTERVAL '220 days', NOW() - INTERVAL '219 days'),
('Smartphone', 'Motorola', 'Moto G Power', 'Charging slowly', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '225 days', NOW() - INTERVAL '225 days', NOW() - INTERVAL '225 days', NOW() - INTERVAL '224 days'),
('Tablet', 'Amazon', 'Fire HD 10', 'Apps crashing', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '230 days', NOW() - INTERVAL '230 days', NOW() - INTERVAL '230 days', NOW() - INTERVAL '229 days'),
('Desktop Computer', 'Lenovo', 'ThinkStation P330', 'Hard drive failure', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '235 days', NOW() - INTERVAL '235 days', NOW() - INTERVAL '235 days', NOW() - INTERVAL '234 days'),
('Smartphone', 'OnePlus', 'Nord N10', 'Bluetooth not working', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '240 days', NOW() - INTERVAL '240 days', NOW() - INTERVAL '240 days', NOW() - INTERVAL '239 days'),
('Laptop', 'Samsung', 'Notebook 9', 'Webcam not detected', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 2), NOW() - INTERVAL '245 days', NOW() - INTERVAL '245 days', NOW() - INTERVAL '245 days', NOW() - INTERVAL '244 days'),
('Television', 'Sharp', 'Aquos LC-50', 'TV not powering on', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 0), NOW() - INTERVAL '250 days', NOW() - INTERVAL '250 days', NOW() - INTERVAL '250 days', NOW() - INTERVAL '249 days'),
('Smartphone', 'Sony', 'Xperia 10 II', 'Screen unresponsive', 'COMPLETED', (SELECT id FROM users WHERE role = 'TECHNICIAN' LIMIT 1 OFFSET 1), NOW() - INTERVAL '255 days', NOW() - INTERVAL '255 days', NOW() - INTERVAL '255 days', NOW() - INTERVAL '254 days');

-- Now insert corresponding diagnosis entries for tasks 6-50
INSERT INTO diagnosis (repair_task_id, technician_id, diagnosis_text, result, created_at, technician_confirmed)
SELECT 
    rt.id,
    rt.technician_id,
    CASE rt.device_model
        WHEN 'ThinkCentre M720' THEN 'Replaced power supply unit'
        WHEN 'Galaxy Tab S6' THEN 'Replaced touchscreen digitizer'
        WHEN 'L3150' THEN 'Cleaned rollers and removed damaged paper sensor'
        WHEN 'Camon 18' THEN 'Flashed firmware and replaced faulty battery'
        WHEN 'Aspire 5' THEN 'Replaced keyboard ribbon cable'
        WHEN 'Bravia X750H' THEN 'Replaced T-Con board'
        WHEN 'Redmi Note 10' THEN 'Replaced loudspeaker module'
        WHEN 'ProDesk 600 G3' THEN 'Replaced LAN card'
        WHEN 'VivoBook 15' THEN 'Replaced charging IC'
        WHEN 'Hot 12' THEN 'Replaced rear camera module'
        WHEN '50A6G' THEN 'Updated firmware and replaced power board capacitors'
        WHEN 'PIXMA G3411' THEN 'Cleaned printhead and refilled ink system'
        WHEN 'G20' THEN 'Replaced SIM reader socket'
        WHEN 'IdeaPad 3' THEN 'Installed SSD and upgraded RAM'
        WHEN 'OptiPlex 7080' THEN 'Replaced faulty RAM module'
        WHEN 'P30 Lite' THEN 'Replaced fingerprint sensor flex cable'
        WHEN 'iPad 8th Gen' THEN 'Replaced display assembly'
        WHEN '55P615' THEN 'Replaced LED backlight strips'
        WHEN 'GF63 Thin' THEN 'Replaced cooling fan'
        WHEN 'A54' THEN 'Replaced WiFi IC'
        WHEN 'HL-L2350DW' THEN 'Reset network settings and updated drivers'
        WHEN 'Inspiron 15 3501' THEN 'Replaced USB daughter board'
        WHEN 'C25Y' THEN 'Reinstalled operating system'
        WHEN 'UA50TU8000' THEN 'Replaced HDMI controller IC'
        WHEN 'Veriton X' THEN 'Replaced overheating processor fan'
        WHEN 'Y20' THEN 'Replaced charging flex with microphone'
        WHEN 'MacBook Pro 2019' THEN 'Reconnected trackpad flex cable'
        WHEN 'Tab M10' THEN 'Replaced battery connector'
        WHEN 'Pixel 5' THEN 'Replaced front camera sensor'
        WHEN 'OLED55B9' THEN 'Replaced display panel cable'
        WHEN 'Pavilion 15' THEN 'Replaced left and right hinges'
        WHEN 'Ryzen 5 PC' THEN 'Reseated graphics card and cleared CMOS'
        WHEN 'Galaxy S20 FE' THEN 'Replaced charging sub-board'
        WHEN 'LaserJet Pro M404' THEN 'Replaced toner cartridge and cleaned drum unit'
        WHEN 'Satellite C55' THEN 'Installed audio drivers and replaced speakers'
        WHEN 'A56' THEN 'Replaced power flex cable'
        WHEN 'TH-43FS500' THEN 'Replaced IR sensor board'
        WHEN 'ROG Strix G15' THEN 'Cleaned cooling system and changed thermal paste'
        WHEN 'Moto G Power' THEN 'Cleaned charging port and replaced cable connector'
        WHEN 'Fire HD 10' THEN 'Reset software and updated firmware'
        WHEN 'ThinkStation P330' THEN 'Replaced HDD with SSD and reinstalled Windows'
        WHEN 'Nord N10' THEN 'Replaced wireless connectivity module'
        WHEN 'Notebook 9' THEN 'Reconnected webcam cable'
        WHEN 'Aquos LC-50' THEN 'Replaced main power board'
        WHEN 'Xperia 10 II' THEN 'Replaced display touch assembly'
        ELSE 'Repaired successfully'
    END,
    CASE rt.device_model
        WHEN 'OLED55B9' THEN 'PARTIAL'
        ELSE 'SUCCESS'
    END,
    rt.completed_at,
    true
FROM repair_tasks rt
WHERE rt.id > 5  -- Skip the first 5 we already inserted
AND rt.status = 'COMPLETED'
AND NOT EXISTS (SELECT 1 FROM diagnosis d WHERE d.repair_task_id = rt.id);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- SELECT COUNT(*) as total_completed_tasks FROM repair_tasks WHERE status = 'COMPLETED';
-- SELECT COUNT(*) as total_diagnoses FROM diagnosis;
-- SELECT device_type, COUNT(*) as count FROM repair_tasks WHERE status = 'COMPLETED' GROUP BY device_type;
-- SELECT result, COUNT(*) as count FROM diagnosis GROUP BY result;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
-- If you see this, 50 completed repair tasks have been inserted!
-- These will automatically be used by the AI for training.
-- Technicians can see these in their completed tasks history.
-- The AI will learn from these cases to provide better recommendations.
