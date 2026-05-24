-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    detail VARCHAR(1000),
    type VARCHAR(50) NOT NULL,
    user_role VARCHAR(50),
    user_id BIGINT,
    action_path VARCHAR(255),
    action_label VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_role ON notifications(user_role);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Insert some sample notifications for testing
INSERT INTO notifications (title, detail, type, user_role, action_path, action_label, is_read, created_at) VALUES
('Low Stock Alert: iPhone Screen', 'iPhone Screen is running low (Current: 3 units)', 'low-stock', 'inventory', '/inventory', 'View Inventory', false, NOW() - INTERVAL '2 hours'),
('Stock Out Alert: Samsung Battery', 'Samsung Battery is out of stock (Current: 0 units)', 'stockout', 'inventory', '/inventory', 'View Inventory', false, NOW() - INTERVAL '1 hour'),
('Item Restocked: Charging Cable', 'Charging Cable has been restocked (New stock: 50 units)', 'restocked', 'inventory', '/inventory', 'View Inventory', false, NOW() - INTERVAL '30 minutes'),
('Repair Completed: iPhone 12', 'Repair for John Doe''s iPhone 12 has been completed', 'repair-completed', 'sales', '/sales-repairs', 'View Repairs', false, NOW() - INTERVAL '15 minutes'),
('Low Stock Alert: Screen Protector', 'Screen Protector is running low (Current: 5 units)', 'low-stock', 'inventory', '/inventory', 'View Inventory', true, NOW() - INTERVAL '3 days');

COMMENT ON TABLE notifications IS 'Stores system notifications for different user roles';
COMMENT ON COLUMN notifications.type IS 'Notification type: stockout, low-stock, restocked, repair-completed, warranty-expiry';
COMMENT ON COLUMN notifications.user_role IS 'Target user role: admin, inventory, sales, technician';
COMMENT ON COLUMN notifications.user_id IS 'Specific user ID (null for role-based notifications)';
