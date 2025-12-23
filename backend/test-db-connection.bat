@echo off
echo Testing PostgreSQL Connection...
echo.

REM Set PostgreSQL password
set PGPASSWORD=root

REM Test connection
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d payroll -c "SELECT version();"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Database connection successful!
    echo.
) else (
    echo.
    echo ✗ Database connection failed!
    echo.
    echo Please check:
    echo 1. PostgreSQL is running
    echo 2. Database 'payroll' exists
    echo 3. Username is 'postgres'
    echo 4. Password is 'root'
    echo.
)

pause
