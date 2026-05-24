-- Update all inventory items to have reorder point of 4
-- This sets the low stock threshold to 4 units

UPDATE inventory_items 
SET reorder_point = 4 
WHERE reorder_point IS NULL OR reorder_point != 4;

-- Show updated items
SELECT id, name, quantity, reorder_point, 
       CASE 
           WHEN quantity <= reorder_point THEN 'LOW STOCK'
           WHEN quantity = 0 THEN 'OUT OF STOCK'
           ELSE 'IN STOCK'
       END as stock_status
FROM inventory_items
ORDER BY quantity ASC;
