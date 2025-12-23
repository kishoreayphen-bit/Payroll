@echo off
echo Fixing Admin User Password...
echo.

REM Set PostgreSQL password
set PGPASSWORD=root

REM Run the fix script
echo Running password fix...
psql -U postgres -d payroll -f fix-admin-password.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Admin password updated successfully!
    echo.
    echo You can now login with:
    echo Email: admin@payrollpro.com
    echo Password: Admin@123456
    echo.
) else (
    echo.
    echo ✗ Failed to update password
    echo.
)

pause
