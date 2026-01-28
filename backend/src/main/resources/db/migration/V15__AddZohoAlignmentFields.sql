-- Add Zoho Alignment Fields to pay_runs
ALTER TABLE pay_runs ADD COLUMN pay_run_type VARCHAR(50) DEFAULT 'REGULAR' NOT NULL;
ALTER TABLE pay_runs ADD COLUMN payment_status VARCHAR(50) DEFAULT 'UNPAID';
ALTER TABLE pay_runs ADD COLUMN payment_date DATE;

-- Add Zoho Alignment Fields to pay_run_employees
ALTER TABLE pay_run_employees ADD COLUMN payment_status VARCHAR(50) DEFAULT 'UNPAID';
ALTER TABLE pay_run_employees ADD COLUMN payment_date TIMESTAMP;
ALTER TABLE pay_run_employees ADD COLUMN is_withheld BOOLEAN DEFAULT FALSE;
