-- Pay Schedules table for managing pay periods
CREATE TABLE pay_schedules (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    schedule_name VARCHAR(100) NOT NULL,
    pay_frequency VARCHAR(20) NOT NULL,
    pay_day INT,
    week_day VARCHAR(20),
    first_pay_day INT,
    second_pay_day INT,
    cut_off_days INT DEFAULT 5,
    processing_days INT DEFAULT 3,
    effective_from DATE,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_pay_schedule_org FOREIGN KEY (organization_id) REFERENCES organizations(id),
    CONSTRAINT uk_org_schedule_name UNIQUE (organization_id, schedule_name)
);

-- Create index for faster lookups
CREATE INDEX idx_pay_schedule_org ON pay_schedules(organization_id);
CREATE INDEX idx_pay_schedule_default ON pay_schedules(organization_id, is_default);
