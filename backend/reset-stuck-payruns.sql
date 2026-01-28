-- Reset stuck pay runs from CALCULATING to DRAFT status
-- Run this script to fix pay runs that got stuck during calculation

UPDATE pay_runs 
SET status = 'DRAFT' 
WHERE status = 'CALCULATING';

-- Verify the update
SELECT id, pay_run_number, status, pay_period_start, pay_period_end 
FROM pay_runs 
ORDER BY created_at DESC 
LIMIT 10;
