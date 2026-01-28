-- Drop the global unique constraint on pay_run_number
ALTER TABLE pay_runs DROP CONSTRAINT IF EXISTS pay_runs_pay_run_number_key;

-- Add a composite unique constraint on tenant_id and pay_run_number
-- This allows different tenants to have the same pay run numbering sequence
ALTER TABLE pay_runs ADD CONSTRAINT uk_pay_run_tenant_number UNIQUE (tenant_id, pay_run_number);
