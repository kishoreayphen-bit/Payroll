@echo off
echo Creating PayRoll Database...
echo.

REM Set PostgreSQL password
set PGPASSWORD=root

REM Create database
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE payroll;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Database 'payroll' created successfully!
    echo.
) else (
    echo.
    echo Note: Database might already exist or there was an error.
    echo.
)

REM Test connection to new database
echo Testing connection to payroll database...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d payroll -c "SELECT 'Database is ready!' as status;"

pause
