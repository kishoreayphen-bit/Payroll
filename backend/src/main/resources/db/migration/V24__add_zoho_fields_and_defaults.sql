-- Add Zoho-specific fields to salary_components
ALTER TABLE salary_components
ADD COLUMN IF NOT EXISTS name_in_payslip VARCHAR(100),
ADD COLUMN IF NOT EXISTS is_include_in_ctc BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_pro_rata_applicable BOOLEAN DEFAULT true;

-- Update defaults
UPDATE salary_components SET name_in_payslip = name WHERE name_in_payslip IS NULL;

-- 1. Update existing BONUS to be variable (so it shows in dropdown)
UPDATE salary_components 
SET is_variable = true, is_recurring = false 
WHERE code = 'BONUS';

-- 2. Insert Commission (Variable) for all organizations
INSERT INTO salary_components (
    organization_id, name, name_in_payslip, code, type, calculation_type, 
    is_taxable, is_statutory, is_recurring, is_variable, is_pf_applicable, 
    is_include_in_ctc, is_pro_rata_applicable, display_order, description
)
SELECT 
    id, 'Commission', 'Commission', 'COMMISSION', 'EARNING', 'FIXED', 
    true, false, false, true, false, 
    false, false, 9, 'Sales commission or incentive'
FROM organizations
WHERE NOT EXISTS (
    SELECT 1 FROM salary_components sc 
    WHERE sc.organization_id = organizations.id AND sc.code = 'COMMISSION'
);

-- 3. Insert Leave Encashment (Variable)
INSERT INTO salary_components (
    organization_id, name, name_in_payslip, code, type, calculation_type, 
    is_taxable, is_statutory, is_recurring, is_variable, is_pf_applicable, 
    is_include_in_ctc, is_pro_rata_applicable, display_order, description
)
SELECT 
    id, 'Leave Encashment', 'Leave Encashment', 'LEAVE_ENCASHMENT', 'EARNING', 'FIXED', 
    true, false, false, true, false, 
    false, false, 10, 'Encashment of unused leave days'
FROM organizations
WHERE NOT EXISTS (
    SELECT 1 FROM salary_components sc 
    WHERE sc.organization_id = organizations.id AND sc.code = 'LEAVE_ENCASHMENT'
);

-- Comments
COMMENT ON COLUMN salary_components.name_in_payslip IS 'Name displayed on the employee payslip';
COMMENT ON COLUMN salary_components.is_include_in_ctc IS 'Whether this component is part of the Cost to Company (CTC)';
COMMENT ON COLUMN salary_components.is_pro_rata_applicable IS 'Whether this component is calculated based on attendance (pro-rata)';
