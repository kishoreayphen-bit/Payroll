# Frontend Rebuild Instructions

## Critical: You MUST rebuild the frontend for changes to take effect!

### Step 1: Stop the Frontend Server
Press `Ctrl+C` in the terminal running the frontend

### Step 2: Clear Cache and Rebuild
```powershell
cd d:\PayRoll\frontend
npm run build
```

OR if running in development mode:
```powershell
cd d:\PayRoll\frontend
# Delete node_modules/.cache if it exists
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
# Restart dev server
npm start
```

### Step 3: Hard Refresh Browser
1. Open your browser
2. Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. This clears the browser cache and reloads

### Step 4: Verify Changes

#### Check 1: Calculate Button
1. Navigate to a DRAFT pay run
2. Open browser console (F12)
3. Look for log: `PayRun Status: DRAFT Is DRAFT? true`
4. **Calculate Pay Run** button should be visible (blue button)

#### Check 2: Pay Date
1. Create a new pay run
2. Check the pay date field
3. Should show **last day of the month** (e.g., 31st Jan, 28th Feb)
4. Check browser console for: `Pay Schedule not configured...` (if no schedule exists)

### Troubleshooting

**If Calculate button still not visible:**
1. Check browser console for the debug log
2. If status is not 'DRAFT', the button won't show
3. Verify the pay run status in the database

**If Pay Date still wrong:**
1. Check browser console for Pay Schedule API errors
2. Verify Pay Schedule exists in database:
   ```sql
   SELECT * FROM pay_schedules WHERE is_default = true;
   ```
3. If no Pay Schedule exists, create one or it will default to end of month

### Create Default Pay Schedule (If Needed)

If you want to configure a specific pay day:

```sql
INSERT INTO pay_schedules (
    organization_id, 
    schedule_name, 
    pay_frequency, 
    pay_day, 
    is_default, 
    is_active,
    created_at,
    updated_at
) VALUES (
    1,  -- Your organization ID
    'Monthly Payroll',
    'MONTHLY',
    31,  -- Last day of month (or 5, 10, 25, etc.)
    true,
    true,
    NOW(),
    NOW()
);
```

### Expected Console Logs

When everything works correctly, you should see:
```
PayRun Status: DRAFT Is DRAFT? true
Pay Schedule not configured or failed to fetch, using default (end of month): 404
```

OR if Pay Schedule exists:
```
PayRun Status: DRAFT Is DRAFT? true
(No Pay Schedule error - using configured schedule)
```
