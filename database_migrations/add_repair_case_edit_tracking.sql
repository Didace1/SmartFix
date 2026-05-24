-- Add edit tracking fields to repair_cases table
-- Allows admins to correct technician mistakes

ALTER TABLE repair_cases 
ADD COLUMN IF NOT EXISTS edited_by_admin_id BIGINT,
ADD COLUMN IF NOT EXISTS edit_reason TEXT,
ADD COLUMN IF NOT EXISTS edit_count INTEGER DEFAULT 0;

-- Add index for finding edited cases
CREATE INDEX IF NOT EXISTS idx_repair_cases_edited 
ON repair_cases(edited_by_admin_id) 
WHERE edited_by_admin_id IS NOT NULL;

-- Add index for finding frequently edited cases (quality issues)
CREATE INDEX IF NOT EXISTS idx_repair_cases_edit_count 
ON repair_cases(edit_count) 
WHERE edit_count > 0;

COMMENT ON COLUMN repair_cases.edited_by_admin_id IS 'Admin user ID who last edited this case';
COMMENT ON COLUMN repair_cases.edit_reason IS 'Reason for editing (e.g., "Corrected device type", "Fixed typo in solution")';
COMMENT ON COLUMN repair_cases.edit_count IS 'Number of times this case has been edited';
