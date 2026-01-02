-- Seed Default Salary Components
-- This script will be run after V3 migration to populate default components
-- Note: This should be run for each organization

-- Function to insert default components for an organization
-- Usage: SELECT insert_default_salary_components(organization_id);

CREATE OR REPLACE FUNCTION insert_default_salary_components(org_id BIGINT)
RETURNS void AS $$
DECLARE
    basic_id BIGINT;
BEGIN
    -- EARNINGS
    
    -- 1. Basic Salary (50% of CTC)
    INSERT INTO salary_components (organization_id, name, code, type, calculation_type, is_taxable, is_statutory, display_order, description)
    VALUES (org_id, 'Basic Salary', 'BASIC', 'EARNING', 'PERCENTAGE', true, false, 1, 'Basic salary component, typically 50% of CTC')
    RETURNING id INTO basic_id;
    
    -- 2. House Rent Allowance (50% of Basic)
    INSERT INTO salary_components (organization_id, name, code, type, calculation_type, base_component_id, is_taxable, is_statutory, display_order, description)
    VALUES (org_id, 'House Rent Allowance', 'HRA', 'EARNING', 'PERCENTAGE', basic_id, true, false, 2, 'Housing allowance, typically 50% of basic salary');
    
    -- 3. Dearness Allowance (% of Basic)
    INSERT INTO salary_components (organization_id, name, code, type, calculation_type, base_component_id, is_taxable, is_statutory, display_order, description)
    VALUES (org_id, 'Dearness Allowance', 'DA', 'EARNING', 'PERCENTAGE', basic_id, true, false, 3, 'Cost of living adjustment allowance');
    
    -- 4. Conveyance Allowance (Fixed)
    INSERT INTO salary_components (organization_id, name, code, type, calculation_type, is_taxable, is_statutory, display_order, description)
    VALUES (org_id, 'Conveyance Allowance', 'CONVEYANCE', 'EARNING', 'FIXED', false, false, 4, 'Transport/travel allowance (tax-exempt up to ₹1,600/month)');
    
    -- 5. Medical Allowance (Fixed)
    INSERT INTO salary_components (organization_id, name, code, type, calculation_type, is_taxable, is_statutory, display_order, description)
    VALUES (org_id, 'Medical Allowance', 'MEDICAL', 'EARNING', 'FIXED', false, false, 5, 'Medical reimbursement allowance (tax-exempt up to ₹1,250/month)');
    
    -- 6. Special Allowance (Fixed)
    INSERT INTO salary_components (organization_id, name, code, type, calculation_type, is_taxable, is_statutory, display_order, description)
    VALUES (org_id, 'Special Allowance', 'SPECIAL', 'EARNING', 'FIXED', true, false, 6, 'Special allowance for specific roles or responsibilities');
    
    -- 7. Fixed Allowance (Fixed)
    INSERT INTO salary_components (organization_id, name, code, type, calculation_type, is_taxable, is_statutory, display_order, description)
    VALUES (org_id, 'Fixed Allowance', 'FIXED_ALLOWANCE', 'EARNING', 'FIXED', true, false, 7, 'Miscellaneous fixed allowance');
    
    -- 8. Performance Bonus (Fixed)
    INSERT INTO salary_components (organization_id, name, code, type, calculation_type, is_taxable, is_statutory, display_order, description)
    VALUES (org_id, 'Performance Bonus', 'BONUS', 'EARNING', 'FIXED', true, false, 8, 'Performance-based bonus');
    
    -- DEDUCTIONS
    
    -- 9. Provident Fund - Employee (12% of Basic)
    INSERT INTO salary_components (organization_id, name, code, type, calculation_type, base_component_id, is_taxable, is_statutory, display_order, description)
    VALUES (org_id, 'Provident Fund (Employee)', 'PF_EMPLOYEE', 'DEDUCTION', 'PERCENTAGE', basic_id, false, true, 1, 'Employee contribution to PF (12% of basic, max ₹1,800)');
    
    -- 10. Employee State Insurance (0.75% of Gross)
    INSERT INTO salary_components (organization_id, name, code, type, calculation_type, is_taxable, is_statutory, display_order, description)
    VALUES (org_id, 'Employee State Insurance', 'ESI', 'DEDUCTION', 'PERCENTAGE', NULL, false, true, 2, 'ESI contribution (0.75% of gross, applicable if gross < ₹21,000)');
    
    -- 11. Professional Tax (State-specific)
    INSERT INTO salary_components (organization_id, name, code, type, calculation_type, is_taxable, is_statutory, display_order, description)
    VALUES (org_id, 'Professional Tax', 'PT', 'DEDUCTION', 'FIXED', false, true, 3, 'State-specific professional tax (varies by state)');
    
    -- 12. Tax Deducted at Source
    INSERT INTO salary_components (organization_id, name, code, type, calculation_type, is_taxable, is_statutory, display_order, description)
    VALUES (org_id, 'Tax Deducted at Source', 'TDS', 'DEDUCTION', 'FORMULA', false, true, 4, 'Income tax deducted at source based on tax slab');
    
    -- 13. Loan Deduction
    INSERT INTO salary_components (organization_id, name, code, type, calculation_type, is_taxable, is_statutory, display_order, description)
    VALUES (org_id, 'Loan Deduction', 'LOAN', 'DEDUCTION', 'FIXED', false, false, 5, 'Loan repayment deduction');
    
    -- 14. Other Deductions
    INSERT INTO salary_components (organization_id, name, code, type, calculation_type, is_taxable, is_statutory, display_order, description)
    VALUES (org_id, 'Other Deductions', 'OTHER_DEDUCTION', 'DEDUCTION', 'FIXED', false, false, 6, 'Miscellaneous deductions');

    RAISE NOTICE 'Default salary components created for organization %', org_id;
END;
$$ LANGUAGE plpgsql;

-- Example usage (commented out - run manually for each organization):
-- SELECT insert_default_salary_components(1);  -- Replace 1 with actual organization ID
