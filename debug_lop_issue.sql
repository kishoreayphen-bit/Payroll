-- Debug script to check LOP calculation issue
-- Run this in your PostgreSQL database

-- 1. Check attendance records for January and February
SELECT 
    a.id,
    a.employee_id,
    a.date,
    a.status,
    a.leave_type_id,
    lt.name as leave_type_name,
    lt.days_per_year as leave_limit,
    lt.is_paid
FROM attendance a
LEFT JOIN leave_types lt ON a.leave_type_id = lt.id
WHERE a.date >= '2026-01-01' AND a.date <= '2026-02-28'
  AND a.status = 'LEAVE'
ORDER BY a.employee_id, a.date;

-- 2. Count leaves by employee and type
SELECT 
    a.employee_id,
    a.leave_type_id,
    lt.name as leave_type_name,
    COUNT(*) as total_leaves,
    lt.days_per_year as annual_limit
FROM attendance a
LEFT JOIN leave_types lt ON a.leave_type_id = lt.id
WHERE a.date >= '2026-01-01' AND a.date <= '2026-02-28'
  AND a.status = 'LEAVE'
GROUP BY a.employee_id, a.leave_type_id, lt.name, lt.days_per_year
ORDER BY a.employee_id;

-- 3. Check if leave_type_id is NULL for any LEAVE records
SELECT 
    COUNT(*) as leaves_without_type
FROM attendance
WHERE status = 'LEAVE' 
  AND leave_type_id IS NULL
  AND date >= '2026-01-01' AND date <= '2026-02-28';

-- 4. Check leave types configuration
SELECT 
    id,
    name,
    code,
    days_per_year,
    is_paid,
    is_active
FROM leave_types
WHERE is_active = true
ORDER BY name;
