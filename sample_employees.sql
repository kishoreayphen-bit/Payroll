-- Sample Employee Data for PayRoll System
-- This script adds 5 sample employees to the database
-- Make sure to replace the organizationId and createdBy user_id with actual values from your database

-- Sample Employee 1: Sarah Johnson - Senior Developer
INSERT INTO employees (
    first_name, middle_name, last_name, employee_id, date_of_joining, 
    work_email, mobile_number, is_director, gender, work_location, 
    designation, department, enable_portal_access, professional_tax,
    annual_ctc, basic_percent_of_ctc, hra_percent_of_basic, 
    conveyance_allowance_monthly, basic_monthly, hra_monthly, fixed_allowance_monthly,
    date_of_birth, age, father_name, personal_email, differently_abled_type,
    address_line1, address_line2, city, state, pin_code,
    emergency_contact, emergency_contact_name,
    bank_name, account_number, ifsc_code, payment_method, pan_number, aadhar_number,
    status, organization_id, created_by, created_at, updated_at
) VALUES (
    'Sarah', 'Marie', 'Johnson', 'EMP001', '2023-01-15',
    'sarah.johnson@company.com', '9876543210', false, 'Female', 'Head Office',
    'Senior Developer', 'Engineering', true, true,
    1200000.00, 50, 50,
    1600.00, 50000.00, 25000.00, 23400.00,
    '1990-05-20', 33, 'Robert Johnson', 'sarah.personal@gmail.com', 'none',
    '123 Park Avenue', 'Apartment 4B', 'Mumbai', 'Maharashtra', '400001',
    '9876543211', 'Emily Johnson',
    'HDFC Bank', '12345678901234', 'HDFC0001234', 'bank_transfer', 'ABCDE1234F', '123456789012',
    'Active', 1, 1, NOW(), NOW()
);

-- Sample Employee 2: Rajesh Kumar - Product Manager
INSERT INTO employees (
    first_name, middle_name, last_name, employee_id, date_of_joining,
    work_email, mobile_number, is_director, gender, work_location,
    designation, department, enable_portal_access, professional_tax,
    annual_ctc, basic_percent_of_ctc, hra_percent_of_basic,
    conveyance_allowance_monthly, basic_monthly, hra_monthly, fixed_allowance_monthly,
    date_of_birth, age, father_name, personal_email, differently_abled_type,
    address_line1, address_line2, city, state, pin_code,
    emergency_contact, emergency_contact_name,
    bank_name, account_number, ifsc_code, payment_method, pan_number, aadhar_number,
    status, organization_id, created_by, created_at, updated_at
) VALUES (
    'Rajesh', 'Kumar', 'Sharma', 'EMP002', '2023-03-10',
    'rajesh.sharma@company.com', '9876543220', false, 'Male', 'Head Office',
    'Product Manager', 'Product', true, true,
    1500000.00, 50, 50,
    1600.00, 62500.00, 31250.00, 29650.00,
    '1988-08-15', 35, 'Vijay Sharma', 'rajesh.personal@gmail.com', 'none',
    '456 MG Road', 'Near City Mall', 'Bangalore', 'Karnataka', '560001',
    '9876543221', 'Priya Sharma',
    'ICICI Bank', '23456789012345', 'ICIC0002345', 'bank_transfer', 'BCDEF2345G', '234567890123',
    'Active', 1, 1, NOW(), NOW()
);

-- Sample Employee 3: Priya Patel - UI/UX Designer
INSERT INTO employees (
    first_name, middle_name, last_name, employee_id, date_of_joining,
    work_email, mobile_number, is_director, gender, work_location,
    designation, department, enable_portal_access, professional_tax,
    annual_ctc, basic_percent_of_ctc, hra_percent_of_basic,
    conveyance_allowance_monthly, basic_monthly, hra_monthly, fixed_allowance_monthly,
    date_of_birth, age, father_name, personal_email, differently_abled_type,
    address_line1, address_line2, city, state, pin_code,
    emergency_contact, emergency_contact_name,
    bank_name, account_number, ifsc_code, payment_method, pan_number, aadhar_number,
    status, organization_id, created_by, created_at, updated_at
) VALUES (
    'Priya', 'Anjali', 'Patel', 'EMP003', '2023-06-01',
    'priya.patel@company.com', '9876543230', false, 'Female', 'Remote',
    'UI/UX Designer', 'Design', true, true,
    900000.00, 50, 50,
    1600.00, 37500.00, 18750.00, 17650.00,
    '1992-11-25', 31, 'Ramesh Patel', 'priya.personal@gmail.com', 'none',
    '789 Lake View', 'Tower B, Floor 12', 'Pune', 'Maharashtra', '411001',
    '9876543231', 'Amit Patel',
    'State Bank Of India', '34567890123456', 'SBIN0003456', 'bank_transfer', 'CDEFG3456H', '345678901234',
    'Active', 1, 1, NOW(), NOW()
);

-- Sample Employee 4: Michael Chen - HR Manager
INSERT INTO employees (
    first_name, middle_name, last_name, employee_id, date_of_joining,
    work_email, mobile_number, is_director, gender, work_location,
    designation, department, enable_portal_access, professional_tax,
    annual_ctc, basic_percent_of_ctc, hra_percent_of_basic,
    conveyance_allowance_monthly, basic_monthly, hra_monthly, fixed_allowance_monthly,
    date_of_birth, age, father_name, personal_email, differently_abled_type,
    address_line1, address_line2, city, state, pin_code,
    emergency_contact, emergency_contact_name,
    bank_name, account_number, ifsc_code, payment_method, pan_number, aadhar_number,
    status, organization_id, created_by, created_at, updated_at
) VALUES (
    'Michael', 'James', 'Chen', 'EMP004', '2022-11-20',
    'michael.chen@company.com', '9876543240', false, 'Male', 'Head Office',
    'HR Manager', 'Human Resources', true, true,
    1100000.00, 50, 50,
    1600.00, 45833.33, 22916.67, 21149.99,
    '1987-03-10', 36, 'David Chen', 'michael.personal@gmail.com', 'none',
    '321 Business Park', 'Building C', 'Hyderabad', 'Telangana', '500001',
    '9876543241', 'Lisa Chen',
    'Axis Bank', '45678901234567', 'UTIB0004567', 'bank_transfer', 'DEFGH4567I', '456789012345',
    'Active', 1, 1, NOW(), NOW()
);

-- Sample Employee 5: Ananya Reddy - Marketing Manager
INSERT INTO employees (
    first_name, middle_name, last_name, employee_id, date_of_joining,
    work_email, mobile_number, is_director, gender, work_location,
    designation, department, enable_portal_access, professional_tax,
    annual_ctc, basic_percent_of_ctc, hra_percent_of_basic,
    conveyance_allowance_monthly, basic_monthly, hra_monthly, fixed_allowance_monthly,
    date_of_birth, age, father_name, personal_email, differently_abled_type,
    address_line1, address_line2, city, state, pin_code,
    emergency_contact, emergency_contact_name,
    bank_name, account_number, ifsc_code, payment_method, pan_number, aadhar_number,
    status, organization_id, created_by, created_at, updated_at
) VALUES (
    'Ananya', 'Lakshmi', 'Reddy', 'EMP005', '2023-09-05',
    'ananya.reddy@company.com', '9876543250', false, 'Female', 'Branch Office',
    'Marketing Manager', 'Marketing', true, true,
    1300000.00, 50, 50,
    1600.00, 54166.67, 27083.33, 26650.00,
    '1991-07-18', 32, 'Venkat Reddy', 'ananya.personal@gmail.com', 'none',
    '567 Tech Park', 'Phase 2, Block A', 'Chennai', 'Tamil Nadu', '600001',
    '9876543251', 'Karthik Reddy',
    'HDFC Bank', '56789012345678', 'HDFC0005678', 'bank_transfer', 'EFGHI5678J', '567890123456',
    'Active', 1, 1, NOW(), NOW()
);

-- Note: Before running this script:
-- 1. Replace organization_id value (currently 1) with your actual organization ID
-- 2. Replace created_by value (currently 1) with your actual user ID
-- 3. Ensure the employee_id values don't conflict with existing records
-- 4. Adjust work_email addresses to match your domain if needed
