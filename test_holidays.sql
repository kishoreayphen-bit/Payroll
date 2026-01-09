-- Test if holidays table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('holidays', 'organization_settings');

-- If holidays table exists, check data
SELECT COUNT(*) as holiday_count FROM holidays;

-- Check flyway migration history
SELECT version, description, success 
FROM flyway_schema_history 
ORDER BY installed_rank DESC 
LIMIT 5;
