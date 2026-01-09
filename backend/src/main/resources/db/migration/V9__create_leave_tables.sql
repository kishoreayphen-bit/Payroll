-- Create leave_types table
CREATE TABLE leave_types (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    description TEXT,
    days_per_year INTEGER,
    is_paid BOOLEAN DEFAULT TRUE,
    is_carry_forward BOOLEAN DEFAULT FALSE,
    max_carry_forward_days INTEGER,
    is_encashable BOOLEAN DEFAULT FALSE,
    max_encashment_days INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_types_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    CONSTRAINT unique_leave_type_code UNIQUE (organization_id, code)
);

-- Create leave_requests table
CREATE TABLE leave_requests (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL,
    leave_type_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DOUBLE PRECISION,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    approved_by BIGINT,
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    is_half_day BOOLEAN DEFAULT FALSE,
    half_day_type VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_requests_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_requests_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_requests_leave_type FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE CASCADE
);

-- Create leave_balances table
CREATE TABLE leave_balances (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL,
    leave_type_id BIGINT NOT NULL,
    year INTEGER NOT NULL,
    opening_balance DOUBLE PRECISION DEFAULT 0,
    accrued DOUBLE PRECISION DEFAULT 0,
    used DOUBLE PRECISION DEFAULT 0,
    adjustment DOUBLE PRECISION DEFAULT 0,
    carry_forward DOUBLE PRECISION DEFAULT 0,
    encashed DOUBLE PRECISION DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_balances_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_balances_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_balances_leave_type FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE CASCADE,
    CONSTRAINT unique_leave_balance UNIQUE (employee_id, leave_type_id, year)
);

-- Create indexes
CREATE INDEX idx_leave_types_organization_id ON leave_types(organization_id);
CREATE INDEX idx_leave_types_code ON leave_types(code);
CREATE INDEX idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_organization_id ON leave_requests(organization_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);
CREATE INDEX idx_leave_balances_employee_id ON leave_balances(employee_id);
CREATE INDEX idx_leave_balances_organization_id ON leave_balances(organization_id);
CREATE INDEX idx_leave_balances_year ON leave_balances(year);
