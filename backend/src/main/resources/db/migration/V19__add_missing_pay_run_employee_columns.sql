-- Add missing columns to pay_run_employees table to match entity
ALTER TABLE pay_run_employees ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'UNPAID';
ALTER TABLE pay_run_employees ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP;
ALTER TABLE pay_run_employees ADD COLUMN IF NOT EXISTS is_withheld BOOLEAN DEFAULT FALSE;

-- is_skipped and skip_reason were added in V13 but let's ensure they exist
ALTER TABLE pay_run_employees ADD COLUMN IF NOT EXISTS is_skipped BOOLEAN DEFAULT FALSE;
ALTER TABLE pay_run_employees ADD COLUMN IF NOT EXISTS skip_reason TEXT;
