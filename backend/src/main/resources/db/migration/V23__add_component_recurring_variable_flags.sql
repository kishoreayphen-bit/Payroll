-- Add recurring and variable flags to salary_components
-- This enables distinction between fixed salary structure components and variable/one-time components

ALTER TABLE salary_components
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_variable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_pf_applicable BOOLEAN DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN salary_components.is_recurring IS 'Whether this is a recurring component (part of monthly salary structure)';
COMMENT ON COLUMN salary_components.is_variable IS 'Whether this is a variable/one-time component (can be added ad-hoc in pay run)';
COMMENT ON COLUMN salary_components.is_pf_applicable IS 'Whether this component is applicable for PF calculation';

-- Add index for efficient filtering of variable components
CREATE INDEX IF NOT EXISTS idx_salary_components_variable ON salary_components(is_variable, is_active, type);

-- Update existing components based on their characteristics
-- Statutory components (PF, ESI, PT, TDS) are recurring by default, not variable
UPDATE salary_components 
SET is_recurring = true, 
    is_variable = false,
    is_pf_applicable = false
WHERE is_statutory = true;

-- Basic/HRA/Allowances are typically recurring (part of CTC), not variable for ad-hoc additions
UPDATE salary_components 
SET is_recurring = true, 
    is_variable = false
WHERE is_statutory = false 
  AND type = 'EARNING'
  AND code IN ('BASIC', 'HRA', 'CONVEYANCE', 'FIXED_ALLOW');

-- Set PF applicable flag for basic salary (commonly used for PF calculation base)
UPDATE salary_components 
SET is_pf_applicable = true
WHERE code = 'BASIC';
