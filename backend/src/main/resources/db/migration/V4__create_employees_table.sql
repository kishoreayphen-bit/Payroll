-- Create employees table with all fields from AddEmployee form
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    
    -- Basic Details
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    employee_id VARCHAR(50) NOT NULL,
    date_of_joining DATE NOT NULL,
    work_email VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    is_director BOOLEAN DEFAULT FALSE,
    gender VARCHAR(20),
    work_location VARCHAR(255),
    designation VARCHAR(100),
    department VARCHAR(100),
    enable_portal_access BOOLEAN DEFAULT FALSE,
    professional_tax BOOLEAN DEFAULT TRUE,
    
    -- Salary Details
    annual_ctc DECIMAL(15, 2),
    basic_percent_of_ctc DECIMAL(5, 2) DEFAULT 50.00,
    hra_percent_of_basic DECIMAL(5, 2) DEFAULT 50.00,
    conveyance_allowance_monthly DECIMAL(15, 2),
    basic_monthly DECIMAL(15, 2),
    hra_monthly DECIMAL(15, 2),
    fixed_allowance_monthly DECIMAL(15, 2),
    
    -- Personal Details
    date_of_birth DATE,
    age INTEGER,
    father_name VARCHAR(255),
    personal_email VARCHAR(255),
    differently_abled_type VARCHAR(50) DEFAULT 'none',
    
    -- Address
    address TEXT,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(10),
    
    -- Emergency Contact
    emergency_contact VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    
    -- Payment Information
    bank_name VARCHAR(255),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    payment_method VARCHAR(50) DEFAULT 'bank_transfer',
    pan_number VARCHAR(20),
    aadhar_number VARCHAR(20),
    
    -- Status and Metadata
    status VARCHAR(20) DEFAULT 'Active',
    organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_by_user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(employee_id, organization_id),
    UNIQUE(work_email, organization_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_employees_organization_id ON employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_work_email ON employees(work_email);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);

-- Add comments for documentation
COMMENT ON TABLE employees IS 'Stores employee information for payroll management';
COMMENT ON COLUMN employees.employee_id IS 'Unique employee identifier within organization';
COMMENT ON COLUMN employees.annual_ctc IS 'Annual Cost to Company in currency';
COMMENT ON COLUMN employees.payment_method IS 'Payment method: bank_transfer, direct_deposit, cheque, cash';
COMMENT ON COLUMN employees.status IS 'Employee status: Active, Inactive, Terminated';
