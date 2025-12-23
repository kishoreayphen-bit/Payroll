-- Fix Admin User Password
-- This updates the admin user password to a valid BCrypt hash

-- Update admin user password
-- Password: Admin@123456
-- Valid BCrypt hash
UPDATE users 
SET password = '$2a$10$eImiTXuWVxfM37uY4JANjOL8vVCgGz6aE.c1XZGpmN/sKBkcbt5Gy'
WHERE email = 'admin@payrollpro.com';

-- Verify the update
SELECT id, email, company_name, 
       CASE 
           WHEN password LIKE '$2a$%' THEN 'Valid BCrypt Hash'
           ELSE 'Invalid Hash'
       END as password_status
FROM users 
WHERE email = 'admin@payrollpro.com';
