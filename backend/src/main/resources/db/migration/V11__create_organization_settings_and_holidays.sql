-- Organization Settings for leave/holiday configuration
CREATE TABLE organization_settings (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL UNIQUE,
    saturday_rule VARCHAR(50) DEFAULT 'ALL_SATURDAYS_OFF',
    sunday_off BOOLEAN DEFAULT TRUE,
    holiday_work_enabled BOOLEAN DEFAULT FALSE,
    holiday_compensation_type VARCHAR(50) DEFAULT 'EXTRA_PAY',
    holiday_pay_multiplier DECIMAL(3,2) DEFAULT 1.50,
    auto_mark_govt_holidays BOOLEAN DEFAULT TRUE,
    state_code VARCHAR(10) DEFAULT 'TN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Holidays table for government and company holidays
CREATE TABLE holidays (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    holiday_date DATE NOT NULL,
    holiday_type VARCHAR(50) DEFAULT 'NATIONAL',
    state_code VARCHAR(10),
    is_optional BOOLEAN DEFAULT FALSE,
    is_recurring BOOLEAN DEFAULT TRUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Index for faster lookups
CREATE INDEX idx_holidays_org_date ON holidays(organization_id, holiday_date);
CREATE INDEX idx_holidays_year ON holidays(EXTRACT(YEAR FROM holiday_date));

-- Holiday work tracking in attendance
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS is_holiday_work BOOLEAN DEFAULT FALSE;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS holiday_compensation_applied BOOLEAN DEFAULT FALSE;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS holiday_id BIGINT REFERENCES holidays(id);
