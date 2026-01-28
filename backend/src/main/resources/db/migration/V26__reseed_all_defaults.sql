-- Re-seed defaults for organizations that might have been missed
-- This is identical logic to previous migrations but ensures newer organizations get them too

-- 1. Standards (Basic, HRA, etc.) - We rely on V5 function if available, or insert manually if needed
-- But V5 function was not automatically called. Let's insert core components if missing.

-- Basic Salary
INSERT INTO salary_components (
    organization_id, name, name_in_payslip, code, type, calculation_type, 
    is_taxable, is_statutory, is_recurring, is_variable, is_pf_applicable, 
    is_include_in_ctc, is_pro_rata_applicable, display_order, description
)
SELECT 
    id, 'Basic Salary', 'Basic Salary', 'BASIC', 'EARNING', 'PERCENTAGE', 
    true, false, true, false, true, 
    true, true, 1, 'Basic salary component, typically 50% of CTC'
FROM organizations
WHERE NOT EXISTS (
    SELECT 1 FROM salary_components sc 
    WHERE sc.organization_id = organizations.id AND sc.code = 'BASIC'
);

-- HRA
INSERT INTO salary_components (
    organization_id, name, name_in_payslip, code, type, calculation_type, 
    is_taxable, is_statutory, is_recurring, is_variable, is_pf_applicable, 
    is_include_in_ctc, is_pro_rata_applicable, display_order, description
)
SELECT 
    id, 'House Rent Allowance', 'House Rent Allowance', 'HRA', 'EARNING', 'PERCENTAGE', 
    true, false, true, false, true, 
    true, true, 2, 'Housing allowance, typically 50% of basic salary'
FROM organizations
WHERE NOT EXISTS (
    SELECT 1 FROM salary_components sc 
    WHERE sc.organization_id = organizations.id AND sc.code = 'HRA'
);

-- 2. Variable Earnings (Commission, Bonus, Leave Encashment)
-- Commission
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

-- Bonus
INSERT INTO salary_components (
    organization_id, name, name_in_payslip, code, type, calculation_type, 
    is_taxable, is_statutory, is_recurring, is_variable, is_pf_applicable, 
    is_include_in_ctc, is_pro_rata_applicable, display_order, description
)
SELECT 
    id, 'Performance Bonus', 'Performance Bonus', 'BONUS', 'EARNING', 'FIXED', 
    true, false, false, true, false, 
    false, false, 6, 'Performance-based bonus'
FROM organizations
WHERE NOT EXISTS (
    SELECT 1 FROM salary_components sc 
    WHERE sc.organization_id = organizations.id AND sc.code = 'BONUS'
);

-- Leave Encashment
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

-- 3. Variable Deductions (Salary Advance, Damage Recovery)
-- Salary Advance
INSERT INTO salary_components (
    organization_id, name, name_in_payslip, code, type, calculation_type, 
    is_taxable, is_statutory, is_recurring, is_variable, is_pf_applicable, 
    is_include_in_ctc, is_pro_rata_applicable, display_order, description
)
SELECT 
    id, 'Salary Advance', 'Salary Advance', 'SALARY_ADVANCE', 'DEDUCTION', 'FIXED', 
    false, false, false, true, false, 
    false, false, 11, 'Recovery of salary advance'
FROM organizations
WHERE NOT EXISTS (
    SELECT 1 FROM salary_components sc 
    WHERE sc.organization_id = organizations.id AND sc.code = 'SALARY_ADVANCE'
);

-- Damage Recovery
INSERT INTO salary_components (
    organization_id, name, name_in_payslip, code, type, calculation_type, 
    is_taxable, is_statutory, is_recurring, is_variable, is_pf_applicable, 
    is_include_in_ctc, is_pro_rata_applicable, display_order, description
)
SELECT 
    id, 'Damage Recovery', 'Damage Recovery', 'DAMAGE_RECOVERY', 'DEDUCTION', 'FIXED', 
    false, false, false, true, false, 
    false, false, 12, 'Recovery for damages or fines'
FROM organizations
WHERE NOT EXISTS (
    SELECT 1 FROM salary_components sc 
    WHERE sc.organization_id = organizations.id AND sc.code = 'DAMAGE_RECOVERY'
);
