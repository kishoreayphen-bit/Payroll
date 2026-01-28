-- Seed default variable deductions
-- 1. Insert Salary Advance (Variable Deduction)
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

-- 2. Insert Damage Recovery (Variable Deduction)
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
