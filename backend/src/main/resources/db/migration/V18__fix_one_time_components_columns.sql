-- Add missing columns to pay_run_one_time_components to match entity mapping
DO $$
BEGIN
    -- created_by (nullable)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pay_run_one_time_components' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE pay_run_one_time_components ADD COLUMN created_by BIGINT;
    END IF;

    -- tenant_id (required by entity)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pay_run_one_time_components' AND column_name = 'tenant_id'
    ) THEN
        ALTER TABLE pay_run_one_time_components ADD COLUMN tenant_id BIGINT;
        -- If existing rows exist, set a safe default (e.g., 1) or leave NULL; here we leave NULL and app will fill on insert
    END IF;
END$$;
