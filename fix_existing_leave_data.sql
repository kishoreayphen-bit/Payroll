-- Fix existing attendance records that have status='LEAVE' but no leave_type_id
-- This script will update those records to use the Sick Leave type

-- First, get the Sick Leave type ID
-- Replace 'X' with the actual ID from your leave_types table
-- Run this query first to find the ID:
-- SELECT id, name FROM leave_types WHERE name LIKE '%Sick%' OR code LIKE '%SICK%';

-- Example: If Sick Leave ID is 1, update all LEAVE records without leave_type_id
-- UPDATE attendance 
-- SET leave_type_id = 1
-- WHERE status = 'LEAVE' 
--   AND leave_type_id IS NULL
--   AND date >= '2026-01-01' 
--   AND date <= '2026-02-28';

-- To be safe, first check which records will be updated:
SELECT 
    id,
    employee_id,
    date,
    status,
    leave_type_id
FROM attendance
WHERE status = 'LEAVE' 
  AND leave_type_id IS NULL
  AND date >= '2026-01-01' 
  AND date <= '2026-02-28'
ORDER BY employee_id, date;

-- After verifying, uncomment and run the UPDATE statement above
-- with the correct leave_type_id
