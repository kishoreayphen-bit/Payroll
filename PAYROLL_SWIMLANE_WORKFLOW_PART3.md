# PAYROLL APPLICATION - ULTRA-DETAILED SWIMLANE WORKFLOW
## PART 3: DASHBOARD & EMPLOYEE MANAGEMENT

---

## 📊 PHASE 3: DASHBOARD, EMAIL VERIFICATION & ADDING FIRST EMPLOYEE

### STEP 16: DASHBOARD LOADS (FIRST TIME)

**💻 SYSTEM:** Redirects from company setup success → `/dashboard`
- Loads user data: John Smith, email NOT verified yet
- Loads company: Tech Solutions Corporation
- Employee count: 0
- Onboarding progress: 40% (2 of 5 steps complete)

**👤 USER SEES:**
- Welcome banner: "Welcome to PayRoll Pro, John!"
- **Onboarding Checklist Card:**
  - ✅ Create account (Green, completed)
  - ✅ Set up company (Green, completed)
  - ⚠️ Verify email (Yellow, pending) - "Resend Email" button
  - ⬜ Add first employee (Gray, not started) - "Add Employee" button
  - ⬜ Run first payroll (Gray, disabled) - Needs employee first
- Dashboard stats: 0 employees, Next payroll: Dec 20 (7 days)

---

### STEP 17: EMAIL VERIFICATION

**👤 USER:** Opens email client → Finds "Welcome to PayRoll Pro" email → Clicks "Verify Email Address" button

**💻 SYSTEM:** Opens browser → URL with token → Validates token in database → Updates user.email_verified = TRUE → Deletes token

**👤 USER SEES:** Success page with large green checkmark ✓ "Email Verified Successfully!" → Clicks "Continue to Dashboard"

**💻 SYSTEM:** Redirects to dashboard → Reloads with updated status

**👤 USER SEES UPDATED DASHBOARD:**
- Checklist Item 3 now: ✅ Verify email (Green, completed)
- Progress: 60% (3 of 5 steps complete)
- Success toast: "✓ Email verified successfully!"

---

### STEP 18: ADD FIRST EMPLOYEE - FORM LOADS

**👤 USER:** Clicks "Add Employee" button in checklist

**💻 SYSTEM:** Redirects to `/employees/add` → Loads employee form with 7 sections

**👤 USER SEES EMPLOYEE FORM:**

**Page Title:** "Add New Employee"
**Progress Tabs:** ① Personal Info (active) | ② Contact | ③ Employment | ④ Compensation | ⑤ Tax | ⑥ Direct Deposit | ⑦ Benefits

---

## SECTION 1: PERSONAL INFORMATION (10 FIELDS)

**FIELD 1 - First Name * :** Text, 48% width, "John", Required 2-50 chars
**FIELD 2 - Middle Name:** Text, 48% width, Optional
**FIELD 3 - Last Name * :** Text, 48% width, "Doe", Required 2-50 chars
**FIELD 4 - Preferred Name:** Text, 48% width, Optional
**FIELD 5 - Date of Birth * :** Date picker, must be 16+, "MM/DD/YYYY"
**FIELD 6 - SSN * :** Masked input, "XXX-XX-XXXX", shows as •••-••-1234
**FIELD 7 - Gender:** Dropdown (Male/Female/Non-binary/Prefer not to say), Optional
**FIELD 8 - Marital Status:** Dropdown (Single/Married/Divorced/Widowed), Optional

**👤 USER FILLS:**
- First Name: "Sarah"
- Last Name: "Johnson"
- DOB: Clicks calendar → Selects "03/15/1990" (34 years old)
- SSN: Types "123456789" → Auto-formats to "123-45-6789" → Displays as "•••-••-6789"
- Gender: Selects "Female"
- Marital Status: Selects "Single"

**💻 SYSTEM:** Validates each field on blur → All valid ✓ → Green checkmarks appear

**👤 USER:** Clicks "Next: Contact Info →"

**💻 SYSTEM:** Validates section → Auto-saves draft → Switches to Section 2

---

## SECTION 2: CONTACT INFORMATION (11 FIELDS)

**FIELD 9 - Personal Email * :** "employee@email.com", Must be unique
**FIELD 10 - Personal Phone * :** Auto-formats "(555) 123-4567"
**FIELD 11 - Alternate Phone:** Optional
**FIELD 12 - Street Address * :** "123 Main Street"
**FIELD 13 - Address Line 2:** "Apt 4B", Optional
**FIELD 14 - City * :** "San Francisco"
**FIELD 15 - State * :** Dropdown, all 50 states
**FIELD 16 - ZIP Code * :** "94105", 5 or 9 digits
**FIELD 17 - Emergency Contact Name * :** "Jane Johnson"
**FIELD 18 - Emergency Contact Phone * :** "(555) 111-2222"
**FIELD 19 - Emergency Contact Relationship * :** Dropdown (Spouse/Parent/Sibling/Child/Friend/Other)

**👤 USER FILLS:**
- Email: "sarah.johnson@email.com"
- Phone: Types "4155551234" → Auto-formats to "(415) 555-1234"
- Address: "456 Market Street"
- City: "San Francisco"
- State: Selects "California"
- ZIP: "94102"
- Emergency Contact: "Jane Johnson" (Mother), "(415) 555-9999"

**💻 SYSTEM:** Validates all fields → Email uniqueness check via AJAX → All valid ✓

**👤 USER:** Clicks "Next: Employment →"

---

## SECTION 3: EMPLOYMENT DETAILS (9 FIELDS)

**FIELD 20 - Employee ID * :** Auto-generated "EMP-001", can edit, must be unique
**FIELD 21 - Job Title * :** "Software Engineer"
**FIELD 22 - Department * :** Dropdown (Engineering/Sales/Marketing/HR/Finance/Operations/Support) + "Add New"
**FIELD 23 - Employment Type * :** Radio cards (Full-Time/Part-Time/Contractor)
**FIELD 24 - Employment Status * :** Radio (Active/Inactive), Default: Active
**FIELD 25 - Hire Date * :** Date picker, cannot be >1 year in future
**FIELD 26 - Work Location * :** Dropdown from company locations
**FIELD 27 - Manager/Supervisor:** Searchable dropdown (currently empty), Optional
**FIELD 28 - Employment Classification * :** Radio cards (Exempt/Non-exempt)

**👤 USER FILLS:**
- Employee ID: Accepts default "EMP-001"
- Job Title: "Senior Software Engineer"
- Department: Selects "Engineering"
- Employment Type: Clicks "Full-Time" card
- Status: Accepts default "Active"
- Hire Date: Clicks calendar → Selects "12/16/2024" (3 days from now)
- Work Location: Selects "San Francisco Office"
- Classification: Clicks "Exempt" card (salaried, no overtime)

**💻 SYSTEM:** Validates all → Hire date is valid (within 1 year) ✓ → All fields valid ✓

**👤 USER:** Clicks "Next: Compensation →"

---

## SECTION 4: COMPENSATION (6 FIELDS)

**FIELD 29 - Pay Type * :** Radio cards (Salary/Hourly)
**FIELD 30 - Pay Rate * :** Number input, $ symbol, format depends on pay type
**FIELD 31 - Pay Frequency * :** Dropdown, inherits company default (Bi-Weekly), can override
**FIELD 32 - Currency:** Dropdown, default USD
**FIELD 33 - Effective Date * :** Date picker, when compensation starts
**FIELD 34 - Pay Schedule:** Dropdown (Standard/Custom), shows pay dates

**👤 USER FILLS:**
- Pay Type: Clicks "Salary" card
- Pay Rate: Types "120000" → System formats as "$120,000.00 per year"
- Pay Frequency: Accepts default "Bi-Weekly (26 pay periods/year)"
- Currency: Accepts default "USD"
- Effective Date: Selects "12/16/2024" (same as hire date)
- System calculates: "$4,615.38 per pay period (bi-weekly)"

**💻 SYSTEM:** 
- Validates pay rate: Must be > $0 ✓
- Calculates per-period amount: $120,000 ÷ 26 = $4,615.38
- Shows info message: "ℹ️ Gross pay per paycheck: $4,615.38"

**👤 USER:** Clicks "Next: Tax Info →"

---

## SECTION 5: TAX INFORMATION (8 FIELDS)

**FIELD 35 - Federal Filing Status * :** Dropdown (Single/Married Filing Jointly/Married Filing Separately/Head of Household)
**FIELD 36 - Federal Allowances:** Number input, 0-99
**FIELD 37 - Additional Federal Withholding:** Dollar amount, optional
**FIELD 38 - State Filing Status * :** Dropdown (varies by state)
**FIELD 39 - State Allowances:** Number input
**FIELD 40 - Additional State Withholding:** Dollar amount, optional
**FIELD 41 - Local Tax Elections:** Multi-select if applicable
**FIELD 42 - Tax Exemptions:** Checkboxes (if any apply)

**👤 USER FILLS:**
- Federal Filing Status: Selects "Single"
- Federal Allowances: Enters "1"
- Additional Federal: Leaves blank (optional)
- State Filing Status: Selects "Single" (California)
- State Allowances: Enters "1"
- Additional State: Leaves blank
- Local Tax: System shows "San Francisco City Tax (1.5%)" - auto-selected based on work location
- Tax Exemptions: None checked

**💻 SYSTEM:** 
- Validates all required fields ✓
- Calculates estimated withholding:
  - Federal: ~$1,850/month
  - State (CA): ~$650/month
  - Local (SF): ~$150/month
- Shows info: "ℹ️ Estimated total tax withholding: $2,650/month"

**👤 USER:** Clicks "Next: Direct Deposit →"

---

## SECTION 6: DIRECT DEPOSIT (5 FIELDS)

**Security Banner:** "🔒 Bank information is encrypted and secure"

**FIELD 43 - Bank Name * :** Text with autocomplete
**FIELD 44 - Routing Number * :** 9 digits, validates with ABA checksum
**FIELD 45 - Account Number * :** 4-17 digits, masked display
**FIELD 46 - Account Type * :** Radio (Checking/Savings)
**FIELD 47 - Allocation * :** Radio (100% to this account / Split between accounts)

**👤 USER FILLS:**
- Bank Name: Types "Wells" → Autocomplete suggests "Wells Fargo" → Selects
- Routing Number: Types "121000248" → System validates → Shows "✓ Wells Fargo Bank"
- Account Number: Types "9876543210" → System masks as "••••••3210"
- Confirm Account: Types "9876543210" → System validates match ✓
- Account Type: Clicks "Checking"
- Allocation: Accepts default "100% to this account"

**💻 SYSTEM:**
- Validates routing number via ABA algorithm ✓
- Looks up bank name from routing number ✓
- Confirms account numbers match ✓
- Encrypts account number before saving

**👤 USER:** Clicks "Next: Benefits →"

---

## SECTION 7: BENEFITS & DEDUCTIONS (OPTIONAL)

**FIELD 48 - Health Insurance:** Checkbox + Plan selection dropdown
**FIELD 49 - Dental Insurance:** Checkbox + Plan selection
**FIELD 50 - Vision Insurance:** Checkbox + Plan selection
**FIELD 51 - 401(k) Contribution:** Checkbox + Percentage input (0-100%)
**FIELD 52 - HSA/FSA:** Checkbox + Amount per pay period
**FIELD 53 - Other Deductions:** Add custom deductions button

**👤 USER FILLS:**
- Health Insurance: Checks box → Selects "PPO Plan - $200/month employee contribution"
- Dental: Checks box → Selects "Standard Plan - $25/month"
- Vision: Skips (unchecked)
- 401(k): Checks box → Enters "5%" → System shows: "Employer match: 3% (up to 5%)"
- HSA: Skips
- Other: Skips

**💻 SYSTEM:**
- Calculates total deductions per paycheck:
  - Health: $200/month ÷ 2 = $100 per paycheck
  - Dental: $25/month ÷ 2 = $12.50 per paycheck
  - 401(k): 5% of $4,615.38 = $230.77 per paycheck
  - Total deductions: $343.27 per paycheck

**👤 USER:** Scrolls to bottom → Sees "Review & Submit" button → Clicks

---

### STEP 19: EMPLOYEE REVIEW & SUBMISSION

**💻 SYSTEM:** 
- Validates ALL 53 fields across all 7 sections
- Validation takes 1.2 seconds
- **ALL VALIDATIONS PASS ✓**
- Redirects to `/employees/review`

**👤 USER SEES REVIEW PAGE:**

**7 Summary Cards:**

**Card 1 - Personal Information:**
- Name: Sarah Johnson
- DOB: 03/15/1990 (34 years old)
- SSN: •••-••-6789
- Gender: Female
- Marital Status: Single
- "Edit" button

**Card 2 - Contact Information:**
- Email: sarah.johnson@email.com
- Phone: (415) 555-1234
- Address: 456 Market Street, San Francisco, CA 94102
- Emergency: Jane Johnson (Mother) - (415) 555-9999
- "Edit" button

**Card 3 - Employment Details:**
- ID: EMP-001
- Title: Senior Software Engineer
- Department: Engineering
- Type: Full-Time, Exempt
- Hire Date: 12/16/2024
- Location: San Francisco Office
- "Edit" button

**Card 4 - Compensation:**
- Pay Type: Salary
- Annual Salary: $120,000.00
- Pay Frequency: Bi-Weekly
- Gross per Paycheck: $4,615.38
- Effective Date: 12/16/2024
- "Edit" button

**Card 5 - Tax Information:**
- Federal: Single, 1 allowance
- State (CA): Single, 1 allowance
- Local: San Francisco City Tax (1.5%)
- Est. Tax Withholding: $2,650/month
- "Edit" button

**Card 6 - Direct Deposit:**
- Bank: Wells Fargo Bank
- Routing: 121000248
- Account: ••••••3210 (Checking)
- Allocation: 100%
- "Edit" button

**Card 7 - Benefits:**
- Health Insurance: PPO Plan ($100/paycheck)
- Dental Insurance: Standard Plan ($12.50/paycheck)
- 401(k): 5% contribution ($230.77/paycheck)
- Total Deductions: $343.27/paycheck
- "Edit" button

**Bottom Summary Box:**
- **Gross Pay per Paycheck:** $4,615.38
- **Total Deductions:** $343.27
- **Estimated Taxes:** $1,325.00 (per paycheck)
- **Estimated Net Pay:** $2,947.11

**Confirmation Checkbox:**
- ☐ "I confirm all employee information is accurate *"

**Buttons:**
- "← Back to Edit" (gray)
- "Add Employee" (green, large) - Disabled until checkbox checked

**👤 USER:**
- Reviews all 7 cards (takes 1 minute)
- Verifies information is correct
- Clicks confirmation checkbox ✓
- "Add Employee" button turns green (enabled)
- Clicks "Add Employee" button

**💻 SYSTEM:**
- Button disabled, text: "Adding Employee..." with spinner
- Full-page loading overlay: "Creating employee record..."
- Makes POST request to `/api/employees/create`
- Request body: All 53 fields in JSON (~6KB)

**🗄️ DATABASE:**
- Starts transaction
- Generates employee ID: "emp_abc123xyz"
- Creates employee record in `employees` table
- Creates employee_personal_info record
- Creates employee_contact_info record
- Creates employee_employment record
- Creates employee_compensation record
- Creates employee_tax_info record (encrypted SSN)
- Creates employee_banking record (encrypted account number)
- Creates employee_benefits records (3 records for health, dental, 401k)
- Commits transaction
- Total time: 1.8 seconds
- Returns success with employee ID

**💻 SYSTEM:**
- Receives success response
- Removes loading overlay
- Shows success animation: Large green checkmark + confetti
- Message: "🎉 Employee Added Successfully!"
- Waits 2 seconds
- Redirects to `/employees` (employee list page)

**👤 USER SEES EMPLOYEE LIST PAGE:**
- Page title: "Employees"
- Employee count badge: "1 Employee"
- Table with 1 row:
  - Photo: Default avatar with "SJ" initials
  - Name: Sarah Johnson
  - ID: EMP-001
  - Title: Senior Software Engineer
  - Department: Engineering
  - Status: Active (green badge)
  - Hire Date: 12/16/2024
  - Actions: View | Edit | Delete icons
- Success toast: "✓ Sarah Johnson added successfully!"

**👤 USER:** Clicks "← Back to Dashboard" link

---

### STEP 20: DASHBOARD UPDATED AFTER ADDING EMPLOYEE

**💻 SYSTEM:** Loads dashboard with updated data

**👤 USER SEES UPDATED DASHBOARD:**

**Onboarding Checklist - Item 4 Updated:**
- ✅ Add your first employee (Green, completed)
- Status: "Completed on Dec 13, 2024 at 11:35 AM"
- "Add Employee" button removed

**Progress Bar:**
- 80% complete (4 of 5 steps)
- Only 1 step remaining!

**Dashboard Stats Updated:**
- **Employee Count:** "1" (changed from 0)
- **Next Payroll:** "Dec 20, 2024" (7 days)
- **Pending Tasks:** "1" (Run first payroll)

**Item 5 Now Enabled:**
- ⬜ Run your first payroll (Gray, but button is now BLUE and clickable!)
- "Run Payroll" button (blue, enabled)
- No longer shows "disabled" state

**Recent Activity Card:**
- Shows activity now:
  - "Sarah Johnson added" - 2 minutes ago
  - "Company setup completed" - 35 minutes ago
  - "Account created" - 40 minutes ago

---

**END OF PART 3**

**Summary:**
- User verified email (Item 3 complete)
- User added first employee Sarah Johnson (Item 4 complete)
- 53 employee fields filled across 7 sections
- Employee record created in database
- Dashboard progress: 80% (4 of 5 steps)
- Ready for final step: Run first payroll

**Next: Part 4 will cover Running First Payroll and Completion**
