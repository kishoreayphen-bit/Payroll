-- Pay Runs table
CREATE TABLE pay_runs (
    id BIGSERIAL PRIMARY KEY,
    pay_run_number VARCHAR(50) UNIQUE,
    tenant_id BIGINT NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    pay_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    total_gross_pay DECIMAL(15,2) DEFAULT 0,
    total_deductions DECIMAL(15,2) DEFAULT 0,
    total_net_pay DECIMAL(15,2) DEFAULT 0,
    total_employer_contributions DECIMAL(15,2) DEFAULT 0,
    employee_count INT DEFAULT 0,
    notes TEXT,
    processed_by BIGINT,
    processed_at TIMESTAMP,
    approved_by BIGINT,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pay_runs_tenant ON pay_runs(tenant_id);
CREATE INDEX idx_pay_runs_status ON pay_runs(status);
CREATE INDEX idx_pay_runs_period ON pay_runs(pay_period_start, pay_period_end);

-- Pay Run Employees table
CREATE TABLE pay_run_employees (
    id BIGSERIAL PRIMARY KEY,
    pay_run_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    basic_salary DECIMAL(15,2) DEFAULT 0,
    hra DECIMAL(15,2) DEFAULT 0,
    conveyance_allowance DECIMAL(15,2) DEFAULT 0,
    fixed_allowance DECIMAL(15,2) DEFAULT 0,
    other_earnings DECIMAL(15,2) DEFAULT 0,
    gross_salary DECIMAL(15,2) DEFAULT 0,
    working_days INT DEFAULT 0,
    days_worked INT DEFAULT 0,
    leave_days INT DEFAULT 0,
    lop_days INT DEFAULT 0,
    lop_deduction DECIMAL(15,2) DEFAULT 0,
    pf_employee DECIMAL(15,2) DEFAULT 0,
    esi_employee DECIMAL(15,2) DEFAULT 0,
    professional_tax DECIMAL(15,2) DEFAULT 0,
    tds DECIMAL(15,2) DEFAULT 0,
    other_deductions DECIMAL(15,2) DEFAULT 0,
    total_deductions DECIMAL(15,2) DEFAULT 0,
    pf_employer DECIMAL(15,2) DEFAULT 0,
    esi_employer DECIMAL(15,2) DEFAULT 0,
    total_employer_contribution DECIMAL(15,2) DEFAULT 0,
    net_salary DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING',
    payslip_generated BOOLEAN DEFAULT FALSE,
    payslip_sent BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pay_run_id) REFERENCES pay_runs(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT uk_pay_run_employee UNIQUE (pay_run_id, employee_id)
);

CREATE INDEX idx_pre_pay_run ON pay_run_employees(pay_run_id);
CREATE INDEX idx_pre_employee ON pay_run_employees(employee_id);

-- Payslips table
CREATE TABLE payslips (
    id BIGSERIAL PRIMARY KEY,
    payslip_number VARCHAR(50) UNIQUE,
    pay_run_employee_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    pay_date DATE,
    basic_salary DECIMAL(15,2),
    hra DECIMAL(15,2),
    conveyance_allowance DECIMAL(15,2),
    fixed_allowance DECIMAL(15,2),
    other_earnings DECIMAL(15,2),
    gross_salary DECIMAL(15,2),
    pf_employee DECIMAL(15,2),
    esi_employee DECIMAL(15,2),
    professional_tax DECIMAL(15,2),
    tds DECIMAL(15,2),
    lop_deduction DECIMAL(15,2),
    other_deductions DECIMAL(15,2),
    total_deductions DECIMAL(15,2),
    net_salary DECIMAL(15,2),
    working_days INT,
    days_worked INT,
    lop_days INT,
    pdf_path VARCHAR(500),
    pdf_generated_at TIMESTAMP,
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'GENERATED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pay_run_employee_id) REFERENCES pay_run_employees(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE INDEX idx_payslips_tenant ON payslips(tenant_id);
CREATE INDEX idx_payslips_employee ON payslips(employee_id);
CREATE INDEX idx_payslips_period ON payslips(pay_period_start, pay_period_end);
