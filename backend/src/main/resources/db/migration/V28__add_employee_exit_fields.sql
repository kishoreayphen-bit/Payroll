-- Add employee exit related fields
ALTER TABLE employees
    ADD COLUMN IF NOT EXISTS exit_date DATE,
    ADD COLUMN IF NOT EXISTS last_working_day DATE,
    ADD COLUMN IF NOT EXISTS exit_reason VARCHAR(100),
    ADD COLUMN IF NOT EXISTS exit_notes TEXT,
    ADD COLUMN IF NOT EXISTS exit_initiated_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS exit_initiated_by BIGINT,
    ADD COLUMN IF NOT EXISTS notice_period_days INTEGER DEFAULT 30,
    ADD COLUMN IF NOT EXISTS is_notice_period_served BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS rehire_eligible BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS exit_interview_done BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS final_settlement_status VARCHAR(50) DEFAULT 'PENDING';

-- Create employee_final_settlement table for tracking F&F
CREATE TABLE IF NOT EXISTS employee_final_settlements (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id),
    organization_id BIGINT NOT NULL REFERENCES organizations(id),
    
    -- Settlement dates
    settlement_date DATE,
    last_working_day DATE NOT NULL,
    
    -- Salary components
    pending_salary DECIMAL(15, 2) DEFAULT 0,
    prorated_salary DECIMAL(15, 2) DEFAULT 0,
    worked_days INTEGER DEFAULT 0,
    total_days_in_month INTEGER DEFAULT 0,
    
    -- Leave encashment
    leave_balance_days DECIMAL(5, 2) DEFAULT 0,
    leave_encashment_amount DECIMAL(15, 2) DEFAULT 0,
    
    -- Gratuity (if eligible - 5+ years)
    is_gratuity_eligible BOOLEAN DEFAULT FALSE,
    years_of_service DECIMAL(5, 2) DEFAULT 0,
    gratuity_amount DECIMAL(15, 2) DEFAULT 0,
    
    -- Notice period
    notice_period_days INTEGER DEFAULT 0,
    notice_period_served_days INTEGER DEFAULT 0,
    notice_pay_recovery DECIMAL(15, 2) DEFAULT 0,
    notice_pay_payable DECIMAL(15, 2) DEFAULT 0,
    
    -- Bonus and other components
    bonus_payable DECIMAL(15, 2) DEFAULT 0,
    other_earnings DECIMAL(15, 2) DEFAULT 0,
    
    -- Deductions
    pending_loans DECIMAL(15, 2) DEFAULT 0,
    other_deductions DECIMAL(15, 2) DEFAULT 0,
    tds_on_settlement DECIMAL(15, 2) DEFAULT 0,
    
    -- Totals
    total_earnings DECIMAL(15, 2) DEFAULT 0,
    total_deductions DECIMAL(15, 2) DEFAULT 0,
    net_settlement_amount DECIMAL(15, 2) DEFAULT 0,
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'DRAFT',
    approved_by BIGINT,
    approved_at TIMESTAMP,
    paid_at TIMESTAMP,
    payment_reference VARCHAR(100),
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_final_settlements_employee ON employee_final_settlements(employee_id);
CREATE INDEX IF NOT EXISTS idx_final_settlements_org ON employee_final_settlements(organization_id);
CREATE INDEX IF NOT EXISTS idx_final_settlements_status ON employee_final_settlements(status);
