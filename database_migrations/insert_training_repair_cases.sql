-- =====================================================
-- INSERT TRAINING DATA FOR AI REPAIR ASSISTANT
-- =====================================================
-- This script inserts 50 real repair cases into the repair_cases table
-- These cases will be used by the AI to learn and provide recommendations
-- 
-- Sales side provides: Device Type, Brand, Model, Customer Issue (symptoms)
-- Technician side provides: Repair Sentence (diagnosis), Result (outcome)
-- =====================================================

-- Insert 50 training repair cases
INSERT INTO repair_cases (device_type, device_brand, device_model, symptoms, diagnosis, outcome, parts_used, repair_duration_minutes, difficulty_level, created_at) VALUES

-- Case 1
('Smartphone', 'Samsung', 'Galaxy A32', 'Not charging', 'Replaced charging port and cleaned corrosion near power IC', 'SUCCESS', 'Charging port, Cleaning solution', 45, 'MEDIUM', NOW()),

-- Case 2
('Laptop', 'Dell', 'Latitude 5420', 'No display', 'Changed LCD screen and reseated RAM', 'SUCCESS', 'LCD screen', 60, 'MEDIUM', NOW()),

-- Case 3
('Television', 'LG', '43LM6300', 'No sound', 'Replaced audio IC and updated firmware', 'SUCCESS', 'Audio IC', 90, 'HARD', NOW()),

-- Case 4
('Smartphone', 'Apple', 'iPhone 11', 'Battery draining fast', 'Replaced battery and optimized system settings', 'SUCCESS', 'Battery', 30, 'EASY', NOW()),

-- Case 5
('Laptop', 'HP', 'EliteBook 840 G5', 'Overheating', 'Cleaned fan and applied thermal paste', 'SUCCESS', 'Thermal paste', 40, 'EASY', NOW()),

-- Case 6
('Desktop Computer', 'Lenovo', 'ThinkCentre M720', 'Not powering on', 'Replaced power supply unit', 'SUCCESS', 'Power supply unit', 50, 'MEDIUM', NOW()),

-- Case 7
('Tablet', 'Samsung', 'Galaxy Tab S6', 'Touch not working', 'Replaced touchscreen digitizer', 'SUCCESS', 'Touchscreen digitizer', 70, 'HARD', NOW()),

-- Case 8
('Printer', 'Epson', 'L3150', 'Paper jam error', 'Cleaned rollers and removed damaged paper sensor', 'SUCCESS', 'Paper sensor', 35, 'EASY', NOW()),

-- Case 9
('Smartphone', 'Tecno', 'Camon 18', 'Boot loop', 'Flashed firmware and replaced faulty battery', 'SUCCESS', 'Battery, Firmware', 55, 'MEDIUM', NOW()),

-- Case 10
('Laptop', 'Acer', 'Aspire 5', 'Keyboard not working', 'Replaced keyboard ribbon cable', 'SUCCESS', 'Keyboard ribbon cable', 25, 'EASY', NOW()),

-- Case 11
('Television', 'Sony', 'Bravia X750H', 'Screen flickering', 'Replaced T-Con board', 'SUCCESS', 'T-Con board', 80, 'HARD', NOW()),

-- Case 12
('Smartphone', 'Xiaomi', 'Redmi Note 10', 'Speaker not working', 'Replaced loudspeaker module', 'SUCCESS', 'Loudspeaker module', 30, 'EASY', NOW()),

-- Case 13
('Desktop Computer', 'HP', 'ProDesk 600 G3', 'No network connection', 'Replaced LAN card', 'SUCCESS', 'LAN card', 20, 'EASY', NOW()),

-- Case 14
('Laptop', 'Asus', 'VivoBook 15', 'Battery not charging', 'Replaced charging IC', 'SUCCESS', 'Charging IC', 65, 'HARD', NOW()),

-- Case 15
('Smartphone', 'Infinix', 'Hot 12', 'Camera blurry', 'Replaced rear camera module', 'SUCCESS', 'Rear camera module', 35, 'MEDIUM', NOW()),

-- Case 16
('Television', 'Hisense', '50A6G', 'TV restarting itself', 'Updated firmware and replaced power board capacitors', 'SUCCESS', 'Capacitors, Firmware', 95, 'HARD', NOW()),

-- Case 17
('Printer', 'Canon', 'PIXMA G3411', 'Not printing colors', 'Cleaned printhead and refilled ink system', 'SUCCESS', 'Ink', 40, 'EASY', NOW()),

-- Case 18
('Smartphone', 'Nokia', 'G20', 'SIM card not detected', 'Replaced SIM reader socket', 'SUCCESS', 'SIM reader socket', 45, 'MEDIUM', NOW()),

-- Case 19
('Laptop', 'Lenovo', 'IdeaPad 3', 'Slow performance', 'Installed SSD and upgraded RAM', 'SUCCESS', 'SSD, RAM', 50, 'MEDIUM', NOW()),

-- Case 20
('Desktop Computer', 'Dell', 'OptiPlex 7080', 'Blue screen errors', 'Replaced faulty RAM module', 'SUCCESS', 'RAM module', 15, 'EASY', NOW()),

-- Case 21
('Smartphone', 'Huawei', 'P30 Lite', 'Fingerprint not working', 'Replaced fingerprint sensor flex cable', 'SUCCESS', 'Fingerprint sensor flex', 40, 'MEDIUM', NOW()),

-- Case 22
('Tablet', 'Apple', 'iPad 8th Gen', 'Screen cracked', 'Replaced display assembly', 'SUCCESS', 'Display assembly', 75, 'HARD', NOW()),

-- Case 23
('Television', 'TCL', '55P615', 'No picture', 'Replaced LED backlight strips', 'SUCCESS', 'LED backlight strips', 100, 'HARD', NOW()),

-- Case 24
('Laptop', 'MSI', 'GF63 Thin', 'Fan making noise', 'Replaced cooling fan', 'SUCCESS', 'Cooling fan', 35, 'EASY', NOW()),

-- Case 25
('Smartphone', 'Oppo', 'A54', 'WiFi not connecting', 'Replaced WiFi IC', 'SUCCESS', 'WiFi IC', 60, 'HARD', NOW()),

-- Case 26
('Printer', 'Brother', 'HL-L2350DW', 'Printer offline', 'Reset network settings and updated drivers', 'SUCCESS', 'None', 20, 'EASY', NOW()),

-- Case 27
('Laptop', 'Dell', 'Inspiron 15 3501', 'USB ports not working', 'Replaced USB daughter board', 'SUCCESS', 'USB daughter board', 45, 'MEDIUM', NOW()),

-- Case 28
('Smartphone', 'Realme', 'C25Y', 'Stuck on logo', 'Reinstalled operating system', 'SUCCESS', 'None', 40, 'MEDIUM', NOW()),

-- Case 29
('Television', 'Samsung', 'UA50TU8000', 'HDMI not working', 'Replaced HDMI controller IC', 'SUCCESS', 'HDMI controller IC', 85, 'HARD', NOW()),

-- Case 30
('Desktop Computer', 'Acer', 'Veriton X', 'Random shutdowns', 'Replaced overheating processor fan', 'SUCCESS', 'Processor fan', 30, 'EASY', NOW()),

-- Case 31
('Smartphone', 'Vivo', 'Y20', 'Microphone not working', 'Replaced charging flex with microphone', 'SUCCESS', 'Charging flex', 35, 'MEDIUM', NOW()),

-- Case 32
('Laptop', 'Apple', 'MacBook Pro 2019', 'Trackpad not responding', 'Reconnected trackpad flex cable', 'SUCCESS', 'None', 25, 'EASY', NOW()),

-- Case 33
('Tablet', 'Lenovo', 'Tab M10', 'Not turning on', 'Replaced battery connector', 'SUCCESS', 'Battery connector', 40, 'MEDIUM', NOW()),

-- Case 34
('Smartphone', 'Google', 'Pixel 5', 'Face unlock failing', 'Replaced front camera sensor', 'SUCCESS', 'Front camera sensor', 45, 'MEDIUM', NOW()),

-- Case 35
('Television', 'LG', 'OLED55B9', 'Lines on screen', 'Replaced display panel cable', 'PARTIAL', 'Display panel cable', 90, 'HARD', NOW()),

-- Case 36
('Laptop', 'HP', 'Pavilion 15', 'Hinges broken', 'Replaced left and right hinges', 'SUCCESS', 'Hinges', 55, 'MEDIUM', NOW()),

-- Case 37
('Desktop Computer', 'Custom Build', 'Ryzen 5 PC', 'No boot display', 'Reseated graphics card and cleared CMOS', 'SUCCESS', 'None', 20, 'EASY', NOW()),

-- Case 38
('Smartphone', 'Samsung', 'Galaxy S20 FE', 'Fast charging not working', 'Replaced charging sub-board', 'SUCCESS', 'Charging sub-board', 50, 'MEDIUM', NOW()),

-- Case 39
('Printer', 'HP', 'LaserJet Pro M404', 'Toner leaking', 'Replaced toner cartridge and cleaned drum unit', 'SUCCESS', 'Toner cartridge', 30, 'EASY', NOW()),

-- Case 40
('Laptop', 'Toshiba', 'Satellite C55', 'No audio', 'Installed audio drivers and replaced speakers', 'SUCCESS', 'Speakers', 35, 'EASY', NOW()),

-- Case 41
('Smartphone', 'Itel', 'A56', 'Power button stuck', 'Replaced power flex cable', 'SUCCESS', 'Power flex cable', 30, 'EASY', NOW()),

-- Case 42
('Television', 'Panasonic', 'TH-43FS500', 'Remote not responding', 'Replaced IR sensor board', 'SUCCESS', 'IR sensor board', 40, 'MEDIUM', NOW()),

-- Case 43
('Laptop', 'Asus', 'ROG Strix G15', 'GPU overheating', 'Cleaned cooling system and changed thermal paste', 'SUCCESS', 'Thermal paste', 50, 'MEDIUM', NOW()),

-- Case 44
('Smartphone', 'Motorola', 'Moto G Power', 'Charging slowly', 'Cleaned charging port and replaced cable connector', 'SUCCESS', 'Cable connector', 25, 'EASY', NOW()),

-- Case 45
('Tablet', 'Amazon', 'Fire HD 10', 'Apps crashing', 'Reset software and updated firmware', 'SUCCESS', 'None', 30, 'EASY', NOW()),

-- Case 46
('Desktop Computer', 'Lenovo', 'ThinkStation P330', 'Hard drive failure', 'Replaced HDD with SSD and reinstalled Windows', 'SUCCESS', 'SSD', 70, 'MEDIUM', NOW()),

-- Case 47
('Smartphone', 'OnePlus', 'Nord N10', 'Bluetooth not working', 'Replaced wireless connectivity module', 'SUCCESS', 'Wireless module', 55, 'HARD', NOW()),

-- Case 48
('Laptop', 'Samsung', 'Notebook 9', 'Webcam not detected', 'Reconnected webcam cable', 'SUCCESS', 'None', 20, 'EASY', NOW()),

-- Case 49
('Television', 'Sharp', 'Aquos LC-50', 'TV not powering on', 'Replaced main power board', 'SUCCESS', 'Main power board', 85, 'HARD', NOW()),

-- Case 50
('Smartphone', 'Sony', 'Xperia 10 II', 'Screen unresponsive', 'Replaced display touch assembly', 'SUCCESS', 'Display touch assembly', 65, 'HARD', NOW());

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to verify the data was inserted correctly
-- SELECT COUNT(*) as total_cases FROM repair_cases;
-- SELECT device_type, COUNT(*) as count FROM repair_cases GROUP BY device_type;
-- SELECT outcome, COUNT(*) as count FROM repair_cases GROUP BY outcome;
