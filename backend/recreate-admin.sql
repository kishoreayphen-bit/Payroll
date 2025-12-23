-- Check and Fix Admin User

-- First, check if admin user exists
SELECT id, email, company_name, 
       CASE 
           WHEN password LIKE '$2a$%' THEN 'Valid BCrypt'
           ELSE 'Invalid Hash'
       END as password_status
FROM users 
WHERE email = 'admin@payrollpro.com';

-- If admin doesn't exist or has wrong password, delete and recreate
DELETE FROM users_roles WHERE user_id IN (SELECT id FROM users WHERE email = 'admin@payrollpro.com');
DELETE FROM users WHERE email = 'admin@payrollpro.com';

-- Create admin user with correct BCrypt hash
-- Password: Admin@123456
INSERT INTO users(email, password, phone_number, company_name, country, state, created_at)
VALUES (
    'admin@payrollpro.com',
    '$2a$10$eImiTXuWVxfM37uY4JANjOL8vVCgGz6aE.c1XZGpmN/sKBkcbt5Gy',
    '9999999999',
    'PayrollPro Admin',
    'India',
    'Karnataka',
    NOW()
);

-- Ensure ADMIN role exists
INSERT INTO roles(name, description)
VALUES ('ADMIN', 'System Administrator')
ON CONFLICT (name) DO NOTHING;

-- Assign ADMIN role to admin user
INSERT INTO users_roles(user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@payrollpro.com' AND r.name = 'ADMIN';

-- Verify the admin user
SELECT u.id, u.email, u.company_name, r.name as role
FROM users u
LEFT JOIN users_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'admin@payrollpro.com';
