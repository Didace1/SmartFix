-- Check all categories in the database
SELECT * FROM categories ORDER BY id;

-- Check if there are any inventory items still referencing 'Accessories' category
SELECT * FROM inventory_items WHERE category = 'Accessories' OR category LIKE '%Accessories%';

-- Check if category ID 5 exists
SELECT * FROM categories WHERE id = 5;

-- Find categories by name (case insensitive)
SELECT * FROM categories WHERE LOWER(name) LIKE '%accessories%';