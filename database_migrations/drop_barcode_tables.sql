-- Drop barcode-related tables
-- Run this script to remove barcode functionality from the database

-- Drop barcode_transactions table first (if it has foreign key to barcodes)
DROP TABLE IF EXISTS barcode_transactions CASCADE;

-- Drop barcodes table
DROP TABLE IF EXISTS barcodes CASCADE;

-- Confirmation message
SELECT 'Barcode tables dropped successfully' AS status;
