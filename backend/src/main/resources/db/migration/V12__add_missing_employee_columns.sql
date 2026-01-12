-- Add missing columns to employees table
ALTER TABLE employees ADD COLUMN IF NOT EXISTS uan VARCHAR(20);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS pf_number VARCHAR(30);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS esi_number VARCHAR(20);

-- Add comments for documentation
COMMENT ON COLUMN employees.uan IS 'Universal Account Number for PF';
COMMENT ON COLUMN employees.pf_number IS 'Provident Fund Number';
COMMENT ON COLUMN employees.esi_number IS 'Employee State Insurance Number';
