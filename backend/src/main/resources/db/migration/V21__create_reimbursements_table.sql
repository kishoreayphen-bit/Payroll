CREATE TABLE reimbursements (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    organization_id BIGINT NOT NULL,
    claim_number VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    expense_date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    approved_amount DECIMAL(15, 2),
    description TEXT,
    bill_number VARCHAR(255),
    vendor_name VARCHAR(255),
    attachment_path VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING',
    submitted_at TIMESTAMP,
    approved_by BIGINT,
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    paid_in_payroll_id BIGINT,
    paid_at TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reimbursement_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_reimbursement_organization FOREIGN KEY (organization_id) REFERENCES organizations(id),
    CONSTRAINT fk_reimbursement_payroll FOREIGN KEY (paid_in_payroll_id) REFERENCES pay_runs(id)
);

CREATE INDEX idx_reimbursement_employee ON reimbursements(employee_id);
CREATE INDEX idx_reimbursement_organization ON reimbursements(organization_id);
CREATE INDEX idx_reimbursement_payroll ON reimbursements(paid_in_payroll_id);
