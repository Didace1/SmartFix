-- Create barcodes table
CREATE TABLE IF NOT EXISTS barcodes (
    id BIGSERIAL PRIMARY KEY,
    barcode_value VARCHAR(50) UNIQUE NOT NULL,
    inventory_item_id BIGINT NOT NULL,
    barcode_type VARCHAR(20) DEFAULT 'CODE128',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_scanned_at TIMESTAMP,
    scan_count INTEGER DEFAULT 0
);

-- Add foreign key constraint
ALTER TABLE barcodes 
ADD CONSTRAINT fk_barcode_inventory_item 
FOREIGN KEY (inventory_item_id) 
REFERENCES inventory_items(id) 
ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_barcodes_barcode_value ON barcodes(barcode_value);
CREATE INDEX IF NOT EXISTS idx_barcodes_inventory_item_id ON barcodes(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_barcodes_is_active ON barcodes(is_active);
CREATE INDEX IF NOT EXISTS idx_barcodes_scan_count ON barcodes(scan_count DESC);