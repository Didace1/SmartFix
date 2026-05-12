-- ========================================
-- DATABASE CLEANUP SCRIPT
-- Remove all barcode-related columns and constraints
-- ========================================

-- Connect to your database first:
-- psql -U postgres -d smartfix_db

-- 1. Drop barcode table if it exists
DROP TABLE IF EXISTS barcodes CASCADE;

-- 2. Remove barcode column from inventory_items if it exists
ALTER TABLE inventory_items DROP COLUMN IF EXISTS barcode CASCADE;

-- 3. Remove any barcode-related constraints
DO $$ 
BEGIN
    -- Drop unique constraint on barcode if exists
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'uk_barcode' 
        OR conname LIKE '%barcode%'
    ) THEN
        ALTER TABLE inventory_items DROP CONSTRAINT IF EXISTS uk_barcode;
    END IF;
END $$;

-- 4. Verify cleanup
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'inventory_items'
ORDER BY ordinal_position;

-- 5. List all tables (should NOT include 'barcodes')
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ========================================
-- DONE! Your database is now clean
-- ========================================
