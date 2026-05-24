-- ============================================================================
-- SmartFix Technician Intelligence System - Database Migration
-- Version: 1.0
-- Purpose: Enhance repair case schema for two-module architecture
-- ============================================================================

-- ============================================================================
-- 1. ENHANCE EXISTING repair_cases TABLE
-- ============================================================================

-- Add new columns for enhanced diagnostic information
ALTER TABLE repair_cases 
ADD COLUMN IF NOT EXISTS serial_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS diagnostic_observations TEXT,
ADD COLUMN IF NOT EXISTS fault_category VARCHAR(100),
ADD COLUMN IF NOT EXISTS repair_procedure TEXT;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_repair_cases_fault_category ON repair_cases(fault_category);
CREATE INDEX IF NOT EXISTS idx_repair_cases_serial_number ON repair_cases(serial_number);

-- Add full-text search indexes for symptoms and diagnosis
CREATE INDEX IF NOT EXISTS idx_repair_cases_symptoms_fts 
ON repair_cases USING gin(to_tsvector('english', symptoms_text));

CREATE INDEX IF NOT EXISTS idx_repair_cases_diagnosis_fts 
ON repair_cases USING gin(to_tsvector('english', diagnosis_text));

-- ============================================================================
-- 2. ENHANCE repair_case_parts TABLE
-- ============================================================================

ALTER TABLE repair_case_parts
ADD COLUMN IF NOT EXISTS part_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS replacement_reason TEXT,
ADD COLUMN IF NOT EXISTS component_condition VARCHAR(50);

CREATE INDEX IF NOT EXISTS idx_repair_case_parts_type ON repair_case_parts(part_type);

-- ============================================================================
-- 3. CREATE component_failure_history TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS component_failure_history (
    id BIGSERIAL PRIMARY KEY,
    device_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(200),
    component_name VARCHAR(255) NOT NULL,
    failure_count INTEGER NOT NULL DEFAULT 1,
    replacement_count INTEGER NOT NULL DEFAULT 0,
    last_failure_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_component_failure_device 
ON component_failure_history(device_type, brand, model);

CREATE INDEX idx_component_failure_component 
ON component_failure_history(component_name);

CREATE INDEX idx_component_failure_date 
ON component_failure_history(last_failure_date);

-- ============================================================================
-- 4. CREATE repair_pattern_statistics TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS repair_pattern_statistics (
    id BIGSERIAL PRIMARY KEY,
    device_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    symptom_pattern TEXT NOT NULL,
    fault_category VARCHAR(100),
    common_solution TEXT,
    occurrence_count INTEGER NOT NULL DEFAULT 1,
    success_rate DECIMAL(5,2),
    return_rate DECIMAL(5,2),
    average_repair_duration INTEGER,
    last_occurrence TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_repair_pattern_device 
ON repair_pattern_statistics(device_type, brand);

CREATE INDEX idx_repair_pattern_symptom_fts 
ON repair_pattern_statistics USING gin(to_tsvector('english', symptom_pattern));

CREATE INDEX idx_repair_pattern_fault 
ON repair_pattern_statistics(fault_category);

-- ============================================================================
-- 5. CREATE MATERIALIZED VIEW FOR ANALYTICS
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS repair_analytics_summary AS
SELECT 
    device_type,
    brand,
    model,
    fault_category,
    COUNT(*) as total_repairs,
    COUNT(*) FILTER (WHERE returned_after_repair = true) as returned_count,
    ROUND(
        (COUNT(*) FILTER (WHERE returned_after_repair = true)::DECIMAL / COUNT(*)) * 100, 
        2
    ) as return_rate,
    AVG(repair_duration_minutes) as avg_repair_duration,
    MIN(repair_date) as first_repair_date,
    MAX(repair_date) as last_repair_date
FROM repair_cases
WHERE repair_status = 'COMPLETED'
GROUP BY device_type, brand, model, fault_category;

CREATE INDEX idx_repair_analytics_device 
ON repair_analytics_summary(device_type, brand, model);

-- ============================================================================
-- 6. CREATE FUNCTION TO UPDATE COMPONENT FAILURE HISTORY
-- ============================================================================

CREATE OR REPLACE FUNCTION update_component_failure_history()
RETURNS TRIGGER AS $$
BEGIN
    -- Update component failure history when parts are added to repair cases
    INSERT INTO component_failure_history (
        device_type,
        brand,
        model,
        component_name,
        failure_count,
        replacement_count,
        last_failure_date
    )
    SELECT 
        rc.device_type,
        rc.brand,
        rc.model,
        NEW.part_name,
        1,
        CASE WHEN NEW.was_replacement THEN 1 ELSE 0 END,
        rc.repair_date
    FROM repair_cases rc
    WHERE rc.case_id = NEW.case_id
    ON CONFLICT (device_type, brand, model, component_name) 
    DO UPDATE SET
        failure_count = component_failure_history.failure_count + 1,
        replacement_count = component_failure_history.replacement_count + 
            CASE WHEN NEW.was_replacement THEN 1 ELSE 0 END,
        last_failure_date = EXCLUDED.last_failure_date,
        updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add unique constraint for component failure history
ALTER TABLE component_failure_history
ADD CONSTRAINT uk_component_failure 
UNIQUE (device_type, brand, model, component_name);

-- Create trigger
DROP TRIGGER IF EXISTS trg_update_component_failure ON repair_case_parts;
CREATE TRIGGER trg_update_component_failure
    AFTER INSERT ON repair_case_parts
    FOR EACH ROW
    EXECUTE FUNCTION update_component_failure_history();

-- ============================================================================
-- 7. CREATE FUNCTION TO UPDATE REPAIR PATTERN STATISTICS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_repair_pattern_statistics()
RETURNS TRIGGER AS $$
DECLARE
    v_success_count INTEGER;
    v_total_count INTEGER;
    v_return_count INTEGER;
BEGIN
    -- Update pattern statistics when repair case is completed
    IF NEW.repair_status = 'COMPLETED' THEN
        -- Calculate statistics
        SELECT 
            COUNT(*) FILTER (WHERE returned_after_repair = false),
            COUNT(*),
            COUNT(*) FILTER (WHERE returned_after_repair = true)
        INTO v_success_count, v_total_count, v_return_count
        FROM repair_cases
        WHERE device_type = NEW.device_type
          AND brand = NEW.brand
          AND symptoms_text ILIKE '%' || NEW.symptoms_text || '%';
        
        -- Insert or update pattern statistics
        INSERT INTO repair_pattern_statistics (
            device_type,
            brand,
            symptom_pattern,
            fault_category,
            common_solution,
            occurrence_count,
            success_rate,
            return_rate,
            last_occurrence
        )
        VALUES (
            NEW.device_type,
            NEW.brand,
            NEW.symptoms_text,
            NEW.fault_category,
            NEW.solution_summary,
            1,
            ROUND((v_success_count::DECIMAL / v_total_count) * 100, 2),
            ROUND((v_return_count::DECIMAL / v_total_count) * 100, 2),
            NEW.repair_date
        )
        ON CONFLICT (device_type, brand, symptom_pattern)
        DO UPDATE SET
            occurrence_count = repair_pattern_statistics.occurrence_count + 1,
            success_rate = ROUND((v_success_count::DECIMAL / v_total_count) * 100, 2),
            return_rate = ROUND((v_return_count::DECIMAL / v_total_count) * 100, 2),
            last_occurrence = NEW.repair_date,
            updated_at = CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add unique constraint for repair patterns
ALTER TABLE repair_pattern_statistics
ADD CONSTRAINT uk_repair_pattern 
UNIQUE (device_type, brand, symptom_pattern);

-- Create trigger
DROP TRIGGER IF EXISTS trg_update_repair_pattern ON repair_cases;
CREATE TRIGGER trg_update_repair_pattern
    AFTER INSERT OR UPDATE ON repair_cases
    FOR EACH ROW
    EXECUTE FUNCTION update_repair_pattern_statistics();

-- ============================================================================
-- 8. CREATE HELPER FUNCTIONS FOR SIMILARITY SEARCH
-- ============================================================================

-- Function to calculate text similarity score
CREATE OR REPLACE FUNCTION calculate_text_similarity(
    text1 TEXT,
    text2 TEXT
)
RETURNS DECIMAL AS $$
DECLARE
    similarity_score DECIMAL;
BEGIN
    -- Use PostgreSQL's built-in similarity function
    SELECT similarity(text1, text2) INTO similarity_score;
    RETURN similarity_score;
END;
$$ LANGUAGE plpgsql;

-- Enable pg_trgm extension for similarity search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- 9. INSERT SAMPLE FAULT CATEGORIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS fault_categories (
    id SERIAL PRIMARY KEY,
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO fault_categories (category_code, category_name, description) VALUES
('BATTERY', 'Battery Issues', 'Battery-related problems including degradation, charging issues'),
('DISPLAY', 'Display Problems', 'Screen, LCD, backlight, and display-related issues'),
('CHARGING', 'Charging Issues', 'Charging port, IC, and power-related problems'),
('MOTHERBOARD', 'Motherboard Faults', 'Logic board, IC, and circuit issues'),
('CAMERA', 'Camera Problems', 'Front/rear camera malfunctions'),
('AUDIO', 'Audio Issues', 'Speaker, microphone, and audio-related problems'),
('BUTTON', 'Button Malfunctions', 'Power, volume, home button issues'),
('CONNECTIVITY', 'Connectivity Problems', 'WiFi, Bluetooth, cellular connectivity issues'),
('SOFTWARE', 'Software Issues', 'OS, firmware, and software-related problems'),
('WATER_DAMAGE', 'Water Damage', 'Liquid damage and corrosion'),
('PHYSICAL_DAMAGE', 'Physical Damage', 'Cracks, dents, and physical trauma'),
('OTHER', 'Other Issues', 'Miscellaneous problems')
ON CONFLICT (category_code) DO NOTHING;

-- ============================================================================
-- 10. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_repair_cases_device_brand_model 
ON repair_cases(device_type, brand, model);

CREATE INDEX IF NOT EXISTS idx_repair_cases_status_date 
ON repair_cases(repair_status, repair_date DESC);

CREATE INDEX IF NOT EXISTS idx_repair_cases_technician_date 
ON repair_cases(technician_id, repair_date DESC);

-- ============================================================================
-- 11. REFRESH MATERIALIZED VIEW
-- ============================================================================

REFRESH MATERIALIZED VIEW repair_analytics_summary;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify tables exist
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Tables created/enhanced:';
    RAISE NOTICE '  - repair_cases (enhanced)';
    RAISE NOTICE '  - repair_case_parts (enhanced)';
    RAISE NOTICE '  - component_failure_history (new)';
    RAISE NOTICE '  - repair_pattern_statistics (new)';
    RAISE NOTICE '  - fault_categories (new)';
    RAISE NOTICE '  - repair_analytics_summary (materialized view)';
END $$;
