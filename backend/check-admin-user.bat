@echo off
echo Checking Admin User in Database...
echo.

REM Set PostgreSQL password
set PGPASSWORD=root

REM Check if admin user exists
echo Checking if admin user exists...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d payroll -c "SELECT id, email, company_name FROM users WHERE email = 'admin@payrollpro.com';"

echo.
echo Checking admin user roles...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d payroll -c "SELECT u.email, r.name as role FROM users u JOIN users_roles ur ON u.id = ur.user_id JOIN roles r ON ur.role_id = r.id WHERE u.email = 'admin@payrollpro.com';"

echo.
echo Checking all roles in system...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d payroll -c "SELECT * FROM roles;"

pause
