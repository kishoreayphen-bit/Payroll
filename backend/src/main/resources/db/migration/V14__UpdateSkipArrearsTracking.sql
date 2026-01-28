-- Update pay_run_employee_skips to track carried over amount and processing run
ALTER TABLE pay_run_employee_skips ADD COLUMN carried_over_amount DECIMAL(19, 2);
ALTER TABLE pay_run_employee_skips ADD COLUMN processed_in_pay_run_id BIGINT;

-- Add index for faster lookup of unpaid arrears
CREATE INDEX idx_skip_unpaid_arrears ON pay_run_employee_skips (employee_id, skip_type, processed_in_pay_run_id);
