-- Add barcode column to inventory_items table
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS barcode VARCHAR(255) UNIQUE;

-- Create index for faster barcode lookups
CREATE INDEX IF NOT EXISTS idx_inventory_items_barcode ON inventory_items(barcode);

-- Create barcode_transactions table for tracking barcode-based operations
CREATE TABLE IF NOT EXISTS barcode_transactions (
    id BIGSERIAL PRIMARY KEY,
    barcode VARCHAR(255) NOT NULL,
    inventory_item_id BIGINT,
    transaction_type VARCHAR(50) NOT NULL, -- 'SALE', 'STOCK_IN', 'STOCK_OUT', 'VERIFICATION'
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    user_id BIGINT,
    sale_id BIGINT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (sale_id) REFERENCES sales(id)
);

-- Create index for barcode transactions
CREATE INDEX IF NOT EXISTS idx_barcode_transactions_barcode ON barcode_transactions(barcode);
CREATE INDEX IF NOT EXISTS idx_barcode_transactions_type ON barcode_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_barcode_transactions_date ON barcode_transactions(created_at);

-- Update existing inventory items with generated barcodes (if they don't have one)
UPDATE inventory_items 
SET barcode = 'SF' || LPAD(id::text, 8, '0') 
WHERE barcode IS NULL OR barcode = '';