# Zoho Payroll Workflow Comparison & Implementation Guide

## 1. Skip Employee from Payroll

### Zoho Workflow
1. Go to Pay Runs module and open the draft pay run
2. Click the More icon (⋯) next to employee's name
3. Select "Skip from this payroll"
4. Enter a reason in the popup and click Proceed
5. Employee excluded from payroll - no contributions calculated
6. Can re-add employee before finalizing pay run
7. **Important**: Skip only applies to current payroll, must repeat for future runs

### Our Application Workflow
1. Go to Pay Runs and open the pay run details
2. Click the More (⋮) button next to employee
3. Select "Skip from Payroll"
4. Enter reason in modal and confirm
5. Employee marked as skipped - excluded from calculations
6. Can use "Re-add to Payroll" to include again

### Comparison
| Feature | Zoho | Our App | Status |
|---------|------|---------|--------|
| Skip individual employee | ✅ | ✅ | Implemented |
| Reason for skipping | ✅ | ✅ | Implemented |
| Re-add to payroll | ✅ | ✅ | Implemented |
| Per-payroll skip (not permanent) | ✅ | ✅ | Implemented |
| Withhold salary option | ❌ | ✅ | Extra feature |

### Why Skip Payroll Exists
- **Seasonal workers**: Employees who don't work every pay period
- **Unpaid leave**: Extended leave without pay
- **New joiners**: Mid-month joiners processed separately
- **Corrections**: Fix issues before finalizing
- **Terminated employees**: Pending exit not yet processed

---

## 2. Prior Payroll / Record Old Pay Runs

### Zoho Workflow
1. Dashboard > Getting Started > Configure Prior Payroll
2. Enable Prior Payroll feature
3. Prerequisites:
   - Accept Terms of Service
   - Configure Pay Schedule
   - Set up Direct Deposit authorization
4. Provide organization details:
   - Number of employees
   - Previous payroll provider
   - Payroll history access method
5. Import historical payroll data
6. Data transfer pauses new payroll processing temporarily
7. After completion, continue with Zoho Payroll

### Our Application - NEEDS IMPLEMENTATION
Current behavior:
- If no previous payruns, uses current month dates
- Does not allow recording historical payruns
- No prior payroll import feature

### Required Implementation
1. **First Pay Run Setup Modal**:
   - Detect if organization has no completed payruns
   - Show date picker for pay period selection
   - Allow custom date range selection
   - Option to backdate pay runs

2. **Record Prior Payroll Feature**:
   - Add "Record Prior Payroll" option
   - Import historical payroll data (CSV/Excel)
   - Support for bulk historical entry
   - Mark as "Recorded" vs "Processed"

---

## 3. Pay Run Date Calculation

### Zoho Workflow
- Uses configured Pay Schedule (Settings > Pay Schedule)
- Considers:
  - Work week configuration
  - Monthly vs daily salary calculation method
  - Pay day of month
- Automatically calculates next period based on last completed run
- Shows clear indicator of next payroll period

### Our Application - NEEDS FIX
Current issues:
1. Next pay run date shows completed payrun's date (incorrect)
2. No date selection for first-time payroll
3. Doesn't clearly distinguish between new org vs existing

### Required Changes
1. **Date Indicator Fix**: Show period AFTER last completed run
2. **First Run Detection**: If no completed runs, show date picker
3. **Clear Period Display**: "Next Pay Period: [Start] to [End]"

---

## 4. Employee Exit Workflow

### Zoho Workflow

#### Step 1: Initiate Exit Process
1. Go to Employees > Select employee
2. Click More icon > "Initiate Exit Process"
3. Enter exit details:
   - Last Working Day (LWD)
   - Exit reason (Resignation, Termination, Death, Disability)
   - Notice period details
4. Click Proceed

#### Step 2: Final Settlement Payroll
1. Redirected to Final Settlement page
2. Enter:
   - Organization's Payable Days
   - Employee's Payable Days
   - LOP days (if any)
   - Additional Earnings (bonus, encashment)
   - Deductions (recovery, damages)
3. Notice Pay options:
   - Enable for notice period employees
   - Payable (org owes employee) or Receivable (employee owes org)
4. Add settlement notes
5. Click "Save and Continue"
6. Submit for approval (or Submit and Approve if authorized)

#### Step 3: Process Payment
1. Go to Pay Runs > View Details & Pay
2. Click "Record Payment"
3. Select payment date
4. Option: Send payslip notification to exited employee
5. Click Confirm

#### Bulk Exit Processing
**Method 1: Import Data**
1. Employees > More > Import Data
2. Choose "Employee Exit Details" as import type
3. Download sample CSV/XLS for format
4. Map fields correctly
5. Import and review bulk final settlement

**Method 2: Manual Bulk**
1. Initiate exit for each employee
2. Select "Pay as per pay schedule" option
3. All employees added to same final settlement payroll
4. Process as bulk final settlement

#### Filter Exited Employees
- Employees page > Filter dropdown > "Exited Employees"

### Our Application - Current Status
| Feature | Zoho | Our App | Status |
|---------|------|---------|--------|
| Initiate exit process | ✅ | ⚠️ | Partial (status change only) |
| Exit reason tracking | ✅ | ❌ | Not implemented |
| Final settlement payroll | ✅ | ❌ | Not implemented |
| Notice pay calculation | ✅ | ❌ | Not implemented |
| Leave encashment | ✅ | ❌ | Not implemented |
| Gratuity calculation | ✅ | ❌ | Not implemented |
| Bulk termination import | ✅ | ❌ | Not implemented |
| Filter exited employees | ✅ | ✅ | Implemented |

### Required Implementation for Full Exit Workflow

#### Phase 1: Basic Exit
1. Add "Initiate Exit" option (not just status change)
2. Collect exit reason and last working day
3. Calculate prorated salary for exit month

#### Phase 2: Final Settlement
1. Create Final Settlement Payroll type
2. Calculate:
   - Earned salary (prorated)
   - Leave encashment
   - Gratuity (if applicable)
   - Notice pay (shortfall/excess)
   - Deductions (recoveries)
3. Generate F&F statement

#### Phase 3: Advanced
1. Bulk exit import
2. Notice period tracking
3. Exit clearance workflow
4. Form 16 generation for exited employees

---

## 5. Implementation Priority

### High Priority (Immediate)
1. ✅ Skip employee from payroll - DONE
2. ⚠️ Fix pay run date indicator
3. ⚠️ Add first payrun date selection modal

### Medium Priority
1. Add prior payroll recording feature
2. Basic employee exit with final settlement
3. Leave encashment in final settlement

### Low Priority
1. Bulk exit import
2. Gratuity calculation
3. Notice pay automation
4. Exit clearance workflow

---

## 6. Database Changes Needed

### For Prior Payroll
```sql
ALTER TABLE pay_runs ADD COLUMN is_prior_payroll BOOLEAN DEFAULT FALSE;
ALTER TABLE pay_runs ADD COLUMN prior_payroll_source VARCHAR(100);
```

### For Employee Exit
```sql
CREATE TABLE employee_exits (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT REFERENCES employees(id),
    organization_id BIGINT REFERENCES organizations(id),
    exit_type VARCHAR(50), -- RESIGNATION, TERMINATION, DEATH, DISABILITY
    exit_reason TEXT,
    last_working_day DATE,
    notice_period_days INTEGER,
    notice_served_days INTEGER,
    is_notice_buy_out BOOLEAN,
    final_settlement_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE final_settlements (
    id BIGSERIAL PRIMARY KEY,
    employee_exit_id BIGINT REFERENCES employee_exits(id),
    earned_salary DECIMAL(15,2),
    leave_encashment DECIMAL(15,2),
    gratuity DECIMAL(15,2),
    notice_pay DECIMAL(15,2), -- positive if org pays, negative if recovery
    bonus DECIMAL(15,2),
    other_earnings DECIMAL(15,2),
    deductions DECIMAL(15,2),
    total_settlement DECIMAL(15,2),
    payment_status VARCHAR(50),
    payment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. API Endpoints Needed

### Prior Payroll
- `POST /api/v1/pay-runs/prior` - Record prior payroll
- `POST /api/v1/pay-runs/import-prior` - Import historical data
- `GET /api/v1/pay-runs/prior-status` - Check prior payroll setup status

### Employee Exit
- `POST /api/v1/employees/{id}/initiate-exit` - Start exit process
- `GET /api/v1/employees/{id}/exit-details` - Get exit info
- `POST /api/v1/employees/{id}/final-settlement` - Create F&F
- `PUT /api/v1/employees/{id}/final-settlement` - Update F&F
- `POST /api/v1/employees/{id}/final-settlement/process` - Process payment
- `POST /api/v1/employees/bulk-exit` - Bulk termination

---

*Document created: January 28, 2026*
*Based on Zoho Payroll documentation research*
