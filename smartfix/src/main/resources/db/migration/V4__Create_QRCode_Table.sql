-- Create QR codes table
CREATE TABLE qr_codes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    qr_code_value VARCHAR(255) UNIQUE NOT NULL,
    inventory_item_id BIGINT NOT NULL,
    qr_image_path VARCHAR(500),
    qr_image_base64 TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    scan_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_scanned_at TIMESTAMP NULL,
    
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
    INDEX idx_qr_code_value (qr_code_value),
    INDEX idx_inventory_item_id (inventory_item_id),
    INDEX idx_is_active (is_active),
    INDEX idx_scan_count (scan_count DESC)
);

-- Add trigger to automatically generate QR codes for existing inventory items
-- This will be handled by the service layer instead