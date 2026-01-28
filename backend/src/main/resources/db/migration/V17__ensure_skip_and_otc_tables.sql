-- Ensure pay_run_employee_skips table exists
CREATE TABLE IF NOT EXISTS pay_run_employee_skips (
    id BIGSERIAL PRIMARY KEY,
    pay_run_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    skip_type VARCHAR(50) NOT NULL, -- SKIP, PAY_AS_ARREARS
    reason TEXT,
    skipped_by BIGINT,
    skipped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    carried_over_amount DECIMAL(19, 2),
    processed_in_pay_run_id BIGINT
);

-- Add FKs if not present (PostgreSQL will ignore duplicates if named constraints exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_skip_pay_run'
    ) THEN
        ALTER TABLE pay_run_employee_skips 
        ADD CONSTRAINT fk_skip_pay_run FOREIGN KEY (pay_run_id) REFERENCES pay_runs(id);
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_skip_employee'
    ) THEN
        ALTER TABLE pay_run_employee_skips 
        ADD CONSTRAINT fk_skip_employee FOREIGN KEY (employee_id) REFERENCES employees(id);
    END IF;
END$$;

-- Index for unpaid arrears lookups
CREATE INDEX IF NOT EXISTS idx_skip_unpaid_arrears 
    ON pay_run_employee_skips (employee_id, skip_type, processed_in_pay_run_id);

-- Ensure pay_run_one_time_components table exists
CREATE TABLE IF NOT EXISTS pay_run_one_time_components (
    id BIGSERIAL PRIMARY KEY,
    pay_run_employee_id BIGINT NOT NULL,
    component_type VARCHAR(20) NOT NULL, -- EARNING, DEDUCTION
    component_name VARCHAR(100) NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    is_taxable BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FK for one-time components
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_otc_pay_run_employee'
    ) THEN
        ALTER TABLE pay_run_one_time_components 
        ADD CONSTRAINT fk_otc_pay_run_employee 
        FOREIGN KEY (pay_run_employee_id) REFERENCES pay_run_employees(id) ON DELETE CASCADE;
    END IF;
END$$;
