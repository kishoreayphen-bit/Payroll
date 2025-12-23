@echo off
echo Recreating Admin User...
echo.

REM Set PostgreSQL password
set PGPASSWORD=root

REM Run the SQL script
echo Running SQL script...
psql -U postgres -d payroll -f recreate-admin.sql

echo.
echo Admin user recreated!
echo.
echo Login credentials:
echo Email: admin@payrollpro.com
echo Password: Admin@123456
echo.

pause
