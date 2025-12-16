# PAYROLL APPLICATION - DEVELOPMENT PAGE ORDER WORKFLOW (PART 2)
## Onboarding & Company Setup Pages

---

# PHASE 2: ONBOARDING & COMPANY SETUP PAGES (Pages 9-20)

---

## PAGE 9: ONBOARDING WELCOME PAGE (/onboarding/welcome)
**Development Priority:** HIGH  
**Development Order:** 9th  
**Estimated Time:** 2 days  
**Dependencies:** User authentication, onboarding flow state management

### **Page Purpose:**
Greet new users and guide them through the initial setup process.

### **Detailed Functionality to Implement:**

#### **Section 1: Welcome Message**
- **Heading:** "Welcome to [App Name], [User's First Name]!"
- **Subheading:** "Let's get your payroll set up in just a few minutes"
- **Welcome Animation:** Confetti or celebratory animation on load
- **Progress Indicator:** "Setup: Step 1 of 6"

#### **Section 2: Onboarding Checklist Preview**
- **Visual Checklist:**
  1. ✓ Create Account (completed)
  2. → Company Information (current step)
  3. ○ Business Details
  4. ○ Bank Information
  5. ○ Add Employees
  6. ○ Run First Payroll
- **Time Estimate:** "Estimated time: 10-15 minutes"

#### **Section 3: What You'll Need**
- **Preparation Checklist:**
  - Company legal name and address
  - Federal EIN (Employer Identification Number)
  - State tax IDs
  - Bank account for direct deposit
  - Employee information (names, SSNs, wages)
  - Pay schedule (weekly, bi-weekly, etc.)

#### **Section 4: Choose Setup Path**
- **Option 1: Guided Setup (Recommended)**
  - Label: "Step-by-step guided setup"
  - Description: "We'll walk you through each step"
  - Button: "Start Guided Setup"
- **Option 2: Quick Import**
  - Label: "Import from existing payroll provider"
  - Description: "Upload CSV or connect to previous system"
  - Supported: Gusto, ADP, QuickBooks, Paychex
  - Button: "Import Data"
- **Option 3: Demo Mode**
  - Label: "Explore with sample data"
  - Description: "Try the app with pre-filled demo data"
  - Button: "Start Demo"

#### **Section 5: Help & Support**
- **Need Help?** Link to live chat or support
- **Video Tutorial:** "Watch how to set up your account (3 min)"
- **Help Center:** Link to documentation

#### **Action Buttons:**
- **Primary:** "Get Started" → Next step
- **Secondary:** "I'll do this later" → Skip to dashboard with incomplete setup banner

---

## PAGE 10: COMPANY INFORMATION PAGE (/onboarding/company-info)
**Development Priority:** HIGH  
**Development Order:** 10th  
**Estimated Time:** 3-4 days  
**Dependencies:** Address validation API, EIN validation

### **Page Purpose:**
Collect basic company information required for payroll processing.

### **Detailed Functionality to Implement:**

#### **Progress Bar:**
- Show: Step 2 of 6
- Visual progress: 33% complete

#### **Section 1: Basic Company Information**

##### **Field 1: Legal Company Name**
- **Input Type:** Text
- **Label:** "Legal Company Name"
- **Placeholder:** "As registered with the IRS"
- **Validation:**
  - Required
  - Min 2, Max 100 characters
  - Check for duplicates (warning only)
- **Help Text:** "This must match your IRS registration exactly"
- **Icon:** Building icon

##### **Field 2: Doing Business As (DBA)**
- **Input Type:** Text
- **Label:** "DBA / Trade Name (Optional)"
- **Placeholder:** "If different from legal name"
- **Validation:** Optional, max 100 characters

##### **Field 3: Company Type**
- **Input Type:** Dropdown
- **Label:** "Business Entity Type"
- **Options:**
  - Sole Proprietorship
  - Partnership
  - LLC (Single Member)
  - LLC (Multi Member)
  - S Corporation
  - C Corporation
  - Non-Profit 501(c)(3)
  - Other
- **Required:** Yes
- **Help Text:** Affects tax reporting requirements

##### **Field 4: Industry**
- **Input Type:** Searchable dropdown
- **Label:** "Industry"
- **Options:** 100+ industries (NAICS codes)
  - Agriculture
  - Construction
  - Manufacturing
  - Retail
  - Healthcare
  - Technology
  - Professional Services
  - Food & Beverage
  - etc.
- **Required:** Yes
- **Help Text:** Used for workers' comp and reporting

##### **Field 5: Company Size**
- **Input Type:** Dropdown
- **Label:** "Number of Employees"
- **Options:**
  - 1-5
  - 6-10
  - 11-25
  - 26-50
  - 51-100
  - 101-250
  - 251-500
  - 500+
- **Required:** Yes

##### **Field 6: Fiscal Year Start**
- **Input Type:** Month dropdown
- **Label:** "Fiscal Year Starts"
- **Options:** January - December
- **Default:** January
- **Help Text:** Usually January 1st for most businesses

#### **Section 2: Contact Information**

##### **Field 7: Company Phone**
- **Input Type:** Tel
- **Label:** "Company Phone Number"
- **Placeholder:** "(555) 123-4567"
- **Auto-format:** (XXX) XXX-XXXX
- **Validation:**
  - Required
  - Valid US phone format
- **Help Text:** Main business line

##### **Field 8: Company Email**
- **Input Type:** Email
- **Label:** "Company Email Address"
- **Placeholder:** "contact@company.com"
- **Validation:**
  - Required
  - Valid email format
- **Help Text:** For business correspondence

##### **Field 9: Company Website (Optional)**
- **Input Type:** URL
- **Label:** "Company Website"
- **Placeholder:** "https://www.company.com"
- **Validation:**
  - Optional
  - Valid URL format if provided
- **Auto-prepend:** Add "https://" if missing

#### **Section 3: Business Address**

##### **Address Autocomplete:**
- **Integration:** Google Places API or similar
- **Functionality:** Start typing, show suggestions

##### **Field 10: Street Address**
- **Input Type:** Text
- **Label:** "Street Address"
- **Placeholder:** "123 Main Street"
- **Validation:** Required
- **Autocomplete:** Street address suggestions

##### **Field 11: Suite/Unit (Optional)**
- **Input Type:** Text
- **Label:** "Suite/Unit Number"
- **Placeholder:** "Suite 100"

##### **Field 12: City**
- **Input Type:** Text
- **Label:** "City"
- **Placeholder:** "New York"
- **Validation:** Required
- **Auto-fill:** From address autocomplete

##### **Field 13: State**
- **Input Type:** Dropdown
- **Label:** "State"
- **Options:** All 50 US states + DC
- **Validation:** Required
- **Auto-fill:** From address autocomplete

##### **Field 14: ZIP Code**
- **Input Type:** Text
- **Label:** "ZIP Code"
- **Placeholder:** "10001"
- **Validation:**
  - Required
  - 5 or 9 digits (XXXXX or XXXXX-XXXX)
  - Valid ZIP code check
- **Auto-format:** Add hyphen for ZIP+4
- **Auto-fill:** From address autocomplete

##### **Address Verification:**
- **On Blur:** Validate address with USPS API
- **Suggestion:** If address invalid, suggest corrections
- **Modal:** "We found a suggested address. Use this instead?"
  - Original address
  - Suggested address (with changes highlighted)
  - Options: "Use Suggested" or "Keep Original"

#### **Section 4: Mailing Address (If Different)**

##### **Checkbox: "Mailing address is different"**
- **Default:** Unchecked
- **If Checked:** Show duplicate address fields for mailing

#### **Action Buttons:**
- **Back Button:** "← Back" (return to welcome)
- **Save & Continue:** "Save & Continue →"
  - Validate all required fields
  - Call API: `POST /api/onboarding/company-info`
  - Save to database
  - Proceed to next step
- **Save Draft:** "Save for Later"
  - Save partial progress
  - Allow user to return later

### **Technical Implementation:**

#### **API Endpoints:**
- `POST /api/onboarding/company-info` - Save company details
- `GET /api/validation/address` - Validate address
- `GET /api/validation/ein` - Validate EIN (next page)

#### **Database Schema:**
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES users(id),
  legal_name VARCHAR(100) NOT NULL,
  dba_name VARCHAR(100),
  entity_type VARCHAR(50) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  company_size VARCHAR(20),
  fiscal_year_start INTEGER DEFAULT 1,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  street_address VARCHAR(255) NOT NULL,
  suite_unit VARCHAR(50),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  mailing_address_different BOOLEAN DEFAULT FALSE,
  mailing_street VARCHAR(255),
  mailing_suite VARCHAR(50),
  mailing_city VARCHAR(100),
  mailing_state VARCHAR(2),
  mailing_zip VARCHAR(10),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## PAGE 11: TAX INFORMATION PAGE (/onboarding/tax-info)
**Development Priority:** HIGH  
**Development Order:** 11th  
**Estimated Time:** 4-5 days  
**Dependencies:** IRS EIN validation, state tax ID validation

### **Page Purpose:**
Collect federal and state tax identification numbers for payroll tax filing.

### **Detailed Functionality to Implement:**

#### **Progress Bar:** Step 3 of 6 (50% complete)

#### **Section 1: Federal Tax Information**

##### **Field 1: Federal EIN (Employer Identification Number)**
- **Input Type:** Text (masked input)
- **Label:** "Federal EIN"
- **Placeholder:** "12-3456789"
- **Format:** XX-XXXXXXX
- **Auto-format:** Add hyphen after 2nd digit
- **Validation:**
  - Required (unless sole proprietor using SSN)
  - Must be 9 digits
  - Format: XX-XXXXXXX
  - Real-time format validation
  - IRS EIN format validation
- **EIN Verification:**
  - Check format matches IRS patterns
  - Validate against IRS database (if available)
  - Check if EIN already exists in system
- **Help Link:** "Don't have an EIN? Apply online (IRS)"
- **Error Messages:**
  - "Please enter your Federal EIN"
  - "Invalid EIN format. Use XX-XXXXXXX"
  - "This EIN is already registered. Contact support."

##### **Option: Use SSN for Sole Proprietors**
- **Checkbox:** "I'm a sole proprietor using my SSN"
- **If Checked:**
  - Show SSN input instead (XXX-XX-XXXX format)
  - Add security warning: "Your SSN will be encrypted"
  - Recommend getting EIN for privacy

##### **Field 2: Tax Filing Name**
- **Input Type:** Text
- **Label:** "Name for Tax Filings"
- **Auto-fill:** From company legal name
- **Validation:** Must match IRS records
- **Help Text:** "Must match your EIN registration exactly"

#### **Section 2: State Tax Information**

##### **Dynamic State Tax IDs:**
Based on company state, show required state tax IDs.

##### **Field 3: State Unemployment Insurance (SUI) Number**
- **Input Type:** Text
- **Label:** "[State] Unemployment Insurance Number"
- **Placeholder:** Format varies by state
- **Validation:**
  - Required
  - State-specific format validation
  - California: 7 digits (1234567-8)
  - New York: 7 digits
  - Texas: 8 digits
  - etc.
- **Help Link:** "How to get your SUI number"

##### **Field 4: State Income Tax Withholding ID**
- **Input Type:** Text
- **Label:** "[State] Withholding Tax ID"
- **Conditional:** Only for states with income tax
- **Validation:** State-specific format
- **Help Text:** "Used for state income tax withholding"

##### **Field 5: Additional State Tax IDs**
Depending on state, may include:
- State Disability Insurance (SDI) - California, New York, etc.
- Paid Family Leave - NY, NJ, CA, etc.
- Local tax IDs - Cities like NYC, Philadelphia
- Workers' Compensation ID

##### **Multi-State Operations:**
- **Question:** "Do you have employees in other states?"
- **If Yes:** Add button to add additional states
- **Functionality:**
  - Repeat state tax fields for each state
  - Track nexus states
  - Determine tax filing requirements per state

#### **Section 3: Tax Filing Schedule**

##### **Federal Tax Deposit Schedule:**
- **Auto-determined based on tax liability:**
  - Monthly depositor (most new businesses)
  - Semi-weekly depositor (larger payrolls)
- **Display:** "Based on your company size, you're likely a [monthly] depositor"
- **Help Text:** Explain IRS lookback period

##### **State Filing Frequency:**
- **Auto-determined by state:**
  - Quarterly (most states)
  - Monthly (high volume)
  - Annual (very small)
- **Display:** "[State] requires [quarterly] tax filing"

#### **Section 4: Tax Preferences**

##### **Field 6: 941/944 Filing (Federal Quarterly vs Annual)**
- **Input Type:** Radio buttons
- **Options:**
  - Form 941 - Quarterly (most businesses)
  - Form 944 - Annual (very small employers, <$1,000 annual tax)
- **Auto-recommend:** Based on estimated payroll
- **Help Text:** "Most businesses file quarterly (941)"

##### **Field 7: EFTPS Enrollment**
- **Question:** "Are you enrolled in EFTPS for federal tax payments?"
- **Input Type:** Radio buttons (Yes/No)
- **If Yes:** Option to link EFTPS account (optional)
- **If No:** Information about enrolling
- **Help Link:** "What is EFTPS?"

#### **Section 5: Tax Professional Information (Optional)**

##### **Checkbox: "I have a tax professional/accountant"**
- **If Checked:** Show fields:

##### **Field 8: Accountant Name**
- **Input Type:** Text
- **Label:** "Accountant/Tax Professional Name"

##### **Field 9: Accountant Email**
- **Input Type:** Email
- **Label:** "Accountant Email"
- **Functionality:** Send reports automatically

##### **Field 10: Accountant Phone**
- **Input Type:** Tel
- **Label:** "Accountant Phone"

##### **Field 11: Grant Access**
- **Checkbox:** "Allow accountant to access my account"
- **Functionality:**
  - Send invitation email to accountant
  - Grant read-only or full access
  - Accountant can view reports, run payroll

#### **Section 6: Document Upload**

##### **Upload Tax Documents (Optional but Recommended):**
- **File Upload Area:**
  - Drag & drop or click to upload
  - Accepted: PDF, JPG, PNG
  - Max size: 10MB per file
- **Documents:**
  - IRS CP-575 (EIN confirmation letter)
  - State tax ID registration documents
  - 941 determination letter
  - Any tax-related correspondence
- **Functionality:**
  - Store in secure document vault
  - OCR to extract data
  - Associate with company record

#### **Validation & Verification:**

##### **Real-time Validation:**
- Format validation as user types
- Check digit validation (where applicable)
- Cross-reference with known patterns

##### **Backend Verification:**
- IRS EIN verification (when API available)
- State tax ID format verification
- Duplicate EIN check across system
- Flag for manual review if suspicious

### **Action Buttons:**
- **Back:** Return to company info
- **Save & Continue:** Validate and proceed
- **Save Draft:** Save progress
- **Skip for Now:** Option to complete later (with warning)

### **Technical Implementation:**

#### **API Endpoints:**
- `POST /api/onboarding/tax-info` - Save tax information
- `GET /api/validation/ein/:ein` - Validate EIN
- `GET /api/validation/state-tax-id` - Validate state tax IDs
- `POST /api/documents/upload` - Upload tax documents

#### **Database Schema:**
```sql
ALTER TABLE companies ADD COLUMN federal_ein VARCHAR(12);
ALTER TABLE companies ADD COLUMN ein_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE companies ADD COLUMN tax_filing_name VARCHAR(100);
ALTER TABLE companies ADD COLUMN use_ssn_instead BOOLEAN DEFAULT FALSE;
ALTER TABLE companies ADD COLUMN federal_filing_schedule VARCHAR(20);
ALTER TABLE companies ADD COLUMN form_type VARCHAR(10);
ALTER TABLE companies ADD COLUMN eftps_enrolled BOOLEAN DEFAULT FALSE;

CREATE TABLE state_tax_ids (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  state VARCHAR(2) NOT NULL,
  sui_number VARCHAR(50),
  withholding_id VARCHAR(50),
  sdi_number VARCHAR(50),
  pfl_number VARCHAR(50),
  local_tax_id VARCHAR(50),
  workers_comp_id VARCHAR(50),
  filing_frequency VARCHAR(20),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE company_accountants (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  access_level VARCHAR(20) DEFAULT 'read-only',
  access_granted BOOLEAN DEFAULT FALSE,
  invited_at TIMESTAMP,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tax_documents (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  document_type VARCHAR(50),
  file_name VARCHAR(255),
  file_url VARCHAR(500),
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

---

## PAGE 12: PAYROLL SCHEDULE PAGE (/onboarding/payroll-schedule)
**Development Priority:** HIGH  
**Development Order:** 12th  
**Estimated Time:** 3 days  
**Dependencies:** Calendar calculations, holiday database

### **Page Purpose:**
Set up when and how often employees will be paid.

### **Detailed Functionality to Implement:**

#### **Progress Bar:** Step 4 of 6 (67% complete)

#### **Section 1: Pay Frequency Selection**

##### **Visual Pay Schedule Cards:**
Display as clickable cards with radio selection.

##### **Option 1: Weekly**
- **Icon:** Calendar with 7 days highlighted
- **Description:** "52 paychecks per year"
- **Common For:** Hourly employees, construction, retail
- **Example:** "Employees paid every Friday"

##### **Option 2: Bi-Weekly (Every 2 Weeks)**
- **Icon:** Calendar with 14 days
- **Description:** "26 paychecks per year"
- **Common For:** Most businesses (most popular)
- **Example:** "Employees paid every other Friday"
- **Note:** "2 months per year have 3 pay periods"

##### **Option 3: Semi-Monthly (Twice per Month)**
- **Icon:** Calendar with 1st and 15th highlighted
- **Description:** "24 paychecks per year"
- **Common For:** Salaried employees
- **Example:** "Paid on the 1st and 15th of each month"
- **Note:** "Easier for monthly budgeting"

##### **Option 4: Monthly**
- **Icon:** Calendar with single day
- **Description:** "12 paychecks per year"
- **Common For:** Executives, contractors (less common)
- **Example:** "Paid on the last day of each month"

##### **Selection:**
- **Required:** Must choose one
- **Highlight:** Selected card highlighted with border
- **Recommendation Badge:** "Most Popular" on Bi-Weekly

#### **Section 2: Pay Day Configuration**

##### **For Weekly/Bi-Weekly:**

###### **Field 1: Pay Day of Week**
- **Input Type:** Dropdown
- **Label:** "What day of the week will employees be paid?"
- **Options:**
  - Monday
  - Tuesday
  - Wednesday
  - Thursday
  - Friday (most common)
  - Saturday
  - Sunday
- **Default:** Friday
- **Help Text:** "Friday is most common for employee preference"

###### **Field 2: First Pay Date**
- **Input Type:** Date picker
- **Label:** "When is your first pay date?"
- **Constraint:** Must be in the future
- **Validation:**
  - Must match selected day of week
  - Cannot be a holiday
  - At least 5 days from today (processing time)
- **Calendar Display:** Show next 4 pay dates after selection
- **Example:** "Your first payroll will be on Friday, January 15, 2025"

##### **For Semi-Monthly:**

###### **Field 3: Pay Dates**
- **Input Type:** Two dropdowns
- **Label:** "Select your two pay dates each month"
- **Options:**
  - 1st and 15th (most common)
  - 5th and 20th
  - 10th and 25th
  - 15th and last day of month
  - Custom: Select any two dates (1-31)
- **Validation:**
  - Dates must be at least 10 days apart
  - If 31st selected, what happens in months with fewer days?
- **Adjustment Rule:**
  - If pay date falls on weekend, pay on: [Friday before / Monday after]
  - If pay date falls on holiday, pay on: [Day before / Day after]

##### **For Monthly:**

###### **Field 4: Monthly Pay Date**
- **Input Type:** Dropdown
- **Label:** "What date of the month?"
- **Options:**
  - 1st of month
  - 15th of month
  - Last day of month
  - Custom: Select date (1-31)
- **Validation:** Handle months with fewer days

#### **Section 3: Pay Period Configuration**

##### **Auto-calculated Pay Period:**
Based on pay frequency, calculate pay period.

##### **Example Display:**
- **Pay Frequency:** Bi-weekly
- **Pay Day:** Friday
- **Pay Period:** Monday - Sunday (2 weeks)
- **Pay Period Ends:** Sunday before pay day
- **Processing Time:** 2 days (Mon-Tue)

##### **Visual Timeline:**
```
Week 1: [Mon] [Tue] [Wed] [Thu] [Fri] [Sat] [Sun]
           ↑ Work Period Starts               ↑
Week 2: [Mon] [Tue] [Wed] [Thu] [Fri] [Sat] [Sun]
                                              ↑ Work Period Ends
Week 3: [Mon] [Tue] [Wed] [Thu] [Fri] [Sat] [Sun]
         ↑ Process ↑              ↑ PAY DAY
```

##### **Field 5: Pay Period Start Day**
- **Input Type:** Dropdown
- **Label:** "Pay period starts on"
- **Options:** Monday - Sunday
- **Default:** Monday (most common)
- **Help Text:** "Usually aligns with your work week"

#### **Section 4: Holiday Pay Schedule**

##### **Holiday Handling:**
- **Question:** "How do you handle pay days that fall on holidays?"
- **Input Type:** Radio buttons
- **Options:**
  - Pay on the business day before the holiday (most common)
  - Pay on the business day after the holiday
  - Pay exactly 2 business days before (if advance notice needed)

##### **Federal Holidays List:**
Display upcoming federal holidays that might affect payroll:
- New Year's Day
- Martin Luther King Jr. Day
- Presidents' Day
- Memorial Day
- Independence Day
- Labor Day
- Thanksgiving
- Christmas Day

##### **Add Custom Company Holidays:**
- **Button:** "Add Company Holiday"
- **Functionality:**
  - Date picker for holiday
  - Holiday name
  - Affects payroll: Yes/No
- **Examples:** Company anniversary, local holidays

#### **Section 5: Payroll Calendar Preview**

##### **Next 12 Months Payroll Calendar:**
- **Visual Calendar:**
  - Show all pay dates for next year
  - Highlight pay period end dates
  - Mark holidays
  - Show processing deadlines
- **List View:**
  - Table with columns:
    - Pay Period Start
    - Pay Period End
    - Processing Deadline
    - Pay Date
  - 26 rows for bi-weekly (first 12 months shown)

##### **Download Calendar:**
- **Button:** "Download Payroll Calendar"
- **Formats:**
  - PDF (printable)
  - CSV (import to spreadsheet)
  - iCal (import to calendar app)
  - Google Calendar sync

#### **Section 6: Advanced Settings**

##### **Off-Cycle Payroll:**
- **Toggle:** "Enable off-cycle payroll runs"
- **Description:** "Run payroll outside regular schedule (bonuses, terminations)"
- **Default:** Enabled

##### **Auto-run Payroll:**
- **Toggle:** "Automatically process payroll on schedule"
- **Description:** "Payroll runs automatically if no changes made by deadline"
- **Default:** Disabled (recommended to review manually)
- **Require:** Extra confirmation and setup

##### **Deadline Reminders:**
- **Checkboxes:** When to send reminders
  - 5 days before pay period end
  - 3 days before pay period end
  - 1 day before processing deadline
  - Morning of processing deadline
- **Notification Methods:**
  - Email
  - SMS
  - In-app notification

### **Action Buttons:**
- **Back:** Return to tax info
- **Save & Continue:** Save schedule, proceed to bank setup
- **Preview Calendar:** Modal showing full year calendar

### **Technical Implementation:**

#### **API Endpoints:**
- `POST /api/onboarding/payroll-schedule` - Save schedule
- `GET /api/payroll/calendar-preview` - Generate calendar
- `GET /api/payroll/next-pay-dates` - Calculate upcoming dates

#### **Database Schema:**
```sql
ALTER TABLE companies ADD COLUMN pay_frequency VARCHAR(20);
ALTER TABLE companies ADD COLUMN pay_day_of_week INTEGER;
ALTER TABLE companies ADD COLUMN pay_dates_semi_monthly VARCHAR(10);
ALTER TABLE companies ADD COLUMN pay_date_monthly INTEGER;
ALTER TABLE companies ADD COLUMN pay_period_start_day INTEGER;
ALTER TABLE companies ADD COLUMN first_pay_date DATE;
ALTER TABLE companies ADD COLUMN holiday_pay_rule VARCHAR(50);
ALTER TABLE companies ADD COLUMN auto_run_payroll BOOLEAN DEFAULT FALSE;

CREATE TABLE company_holidays (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  holiday_name VARCHAR(100),
  holiday_date DATE,
  affects_payroll BOOLEAN DEFAULT TRUE,
  recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payroll_calendar (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  pay_period_start DATE,
  pay_period_end DATE,
  processing_deadline TIMESTAMP,
  pay_date DATE,
  is_off_cycle BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Calendar Generation Logic:**
```javascript
function generatePayrollCalendar(
  frequency,
  startDate,
  payDayOfWeek,
  holidayRule
) {
  // Calculate all pay dates for next 12 months
  // Account for holidays
  // Calculate pay period ranges
  // Set processing deadlines
  // Return array of pay periods
}
```

---

## PAGE 13: BANK ACCOUNT PAGE (/onboarding/bank-account)
**Development Priority:** HIGH  
**Development Order:** 13th  
**Estimated Time:** 4-5 days  
**Dependencies:** Plaid integration, bank verification service, ACH setup

### **Page Purpose:**
Connect company bank account for payroll direct deposits and tax payments.

### **Detailed Functionality to Implement:**

#### **Progress Bar:** Step 5 of 6 (83% complete)

#### **Section 1: Bank Account Connection Method**

##### **Option 1: Instant Verification with Plaid (Recommended)**
- **Card Display:**
  - **Heading:** "Connect Instantly with Plaid"
  - **Description:** "Securely connect your bank in seconds"
  - **Benefits:**
    - No waiting for verification
    - Bank-level encryption
    - Automatic validation
  - **Supported Banks:** Show logos (Chase, Bank of America, Wells Fargo, etc.)
  - **Button:** "Connect Bank Account"
- **Click Functionality:**
  1. Open Plaid Link modal
  2. User selects their bank
  3. User logs in to bank (Plaid interface)
  4. User selects checking account
  5. Plaid returns account and routing numbers
  6. Save encrypted bank details
  7. Mark as verified instantly
  8. Show success message

##### **Option 2: Manual Entry**
- **Card Display:**
  - **Heading:** "Enter Bank Details Manually"
  - **Description:** "Verification takes 1-2 business days"
  - **Process:** Micro-deposits verification
  - **Button:** "Enter Manually"
- **Why Choose:** "My bank isn't supported by instant verification"

#### **Section 2: Manual Bank Account Entry**

##### **Field 1: Bank Name**
- **Input Type:** Text with autocomplete
- **Label:** "Bank Name"
- **Placeholder:** "Chase, Bank of America, etc."
- **Autocomplete:** Show top banks as suggestions
- **Validation:** Required if manual entry

##### **Field 2: Account Type**
- **Input Type:** Radio buttons
- **Label:** "Account Type"
- **Options:**
  - Checking (recommended for payroll)
  - Savings
- **Required:** Yes
- **Help Text:** "Checking accounts are recommended for frequent transactions"

##### **Field 3: Routing Number**
- **Input Type:** Text (numeric only)
- **Label:** "Routing Number"
- **Placeholder:** "123456789"
- **Format:** 9 digits
- **Validation:**
  - Required
  - Must be exactly 9 digits
  - ABA routing number checksum validation
  - Real-time bank lookup (show bank name when valid)
- **Help Text:** "9-digit number on bottom left of check"
- **Visual Aid:** Image showing where to find routing number on check
- **Error Messages:**
  - "Routing number must be 9 digits"
  - "Invalid routing number"
  - "Routing number not found"

##### **Field 4: Account Number**
- **Input Type:** Text (numeric only)
- **Label:** "Account Number"
- **Placeholder:** "1234567890"
- **Format:** 4-17 digits (varies by bank)
- **Validation:**
  - Required
  - Min 4, max 17 digits
  - No special characters
- **Help Text:** "Usually 8-12 digits, found on bottom of check"
- **Visual Aid:** Image showing account number location
- **Masking:** Show as •••••1234 after entry

##### **Field 5: Confirm Account Number**
- **Input Type:** Text (no paste allowed)
- **Label:** "Confirm Account Number"
- **Placeholder:** "Re-enter account number"
- **Validation:**
  - Required
  - Must match account number exactly
- **Error:** "Account numbers do not match"
- **Security:** Prevent copy/paste to ensure user types correctly

##### **Account Verification Preview:**
Display entered information (masked) for review:
- Bank Name: Chase Bank
- Account Type: Checking
- Routing Number: 021000021
- Account Number: ••••••1234

#### **Section 3: Micro-Deposit Verification Process**

##### **Verification Method:**
If manual entry chosen, explain micro-deposit process.

##### **Information Display:**
- **Step 1:** "We'll deposit two small amounts (< $1.00) into your account"
- **Step 2:** "Check your bank statement in 1-2 business days"
- **Step 3:** "Return here and enter the two amounts to verify"
- **Timeline:** "Verification typically complete in 1-2 business days"

##### **Important Notes:**
- Deposits will appear as "PAYROLL APP VERIFY" or similar
- Amounts will be withdrawn after verification
- You'll receive email when deposits are made
- Must verify within 7 days

#### **Section 4: Bank Account Security**

##### **Security Measures Display:**
- **Icon:** Lock/shield icon
- **Heading:** "Your Bank Information is Secure"
- **Security Features:**
  - 256-bit encryption
  - PCI-DSS compliant
  - Never stored in plain text
  - Encrypted at rest and in transit
  - Regular security audits
  - Read-only access (no withdrawals without authorization)

##### **Privacy Policy:**
- **Link:** "How we protect your financial information"
- **Modal or page:** Full privacy policy

#### **Section 5: Multiple Bank Accounts (Optional)**

##### **Primary Account:**
- Mark one account as primary for payroll
- Used for employee direct deposits
- Used for tax payments

##### **Add Additional Account:**
- **Button:** "+ Add Another Bank Account"
- **Use Cases:**
  - Backup account
  - Separate account for taxes
  - Different account for contractors
  - Multiple entities

##### **Account Management:**
- List all connected accounts
- Edit/remove accounts
- Set default account
- Nickname accounts ("Main Payroll", "Tax Account", etc.)

#### **Section 6: ACH Authorization**

##### **NACHA Authorization:**
Must obtain authorization for ACH debits/credits.

##### **Authorization Text:**
"I authorize [Payroll App] to electronically debit and credit the bank account indicated above for payroll processing, tax payments, and related fees. This authorization will remain in effect until I notify [Payroll App] in writing to cancel it."

##### **Required Fields:**
- **Checkbox:** "I authorize ACH transactions"
- **Electronic Signature:**
  - **Type:** Typed signature or drawn signature
  - **Field:** "Sign your full name"
  - **Date:** Auto-filled with current date
- **Validation:** Required to proceed

##### **Terms & Conditions:**
- **Checkbox:** "I agree to the ACH Terms and Conditions"
- **Link:** Open full terms in modal or new tab

#### **Section 7: Verification Status Page**

##### **If Using Plaid (Instant Verification):**
- **Status:** "✓ Bank Account Verified"
- **Message:** "Your bank account is connected and ready"
- **Account Display:**
  - Bank Name
  - Account Type
  - Last 4 digits of account
- **Action:** "Continue to Next Step"

##### **If Using Manual Entry (Pending Verification):**
- **Status:** "⏳ Verification Pending"
- **Message:** "We've sent two small deposits to your account"
- **Next Steps:**
  1. Check your bank statement in 1-2 days
  2. Return here to enter the amounts
  3. Your account will be verified
- **Notification:** "We'll email you when the deposits appear"
- **Action Options:**
  - "I'll verify later" → Continue with onboarding
  - "Enter verification amounts now" → If already received

##### **Verification Amount Entry (When Ready):**
- **Heading:** "Verify Your Bank Account"
- **Instructions:** "Enter the two amounts we deposited"
- **Field 1:** Amount 1 (e.g., $0.12)
- **Field 2:** Amount 2 (e.g., $0.34)
- **Format:** $0.XX
- **Validation:**
  - Must match deposited amounts exactly
  - 3 attempts allowed
  - If failed, must wait 24 hours or contact support
- **Submit Button:** "Verify Account"
- **Success:** Mark account as verified, allow payroll processing

### **Action Buttons:**
- **Back:** Return to payroll schedule
- **Save & Continue:** Save bank info, proceed (even if verification pending)
- **Skip for Now:** Option to add bank later (with limitations)

### **Technical Implementation:**

#### **API Endpoints:**
- `POST /api/plaid/create-link-token` - Initialize Plaid
- `POST /api/plaid/exchange-public-token` - Get account details
- `POST /api/onboarding/bank-account` - Save bank account
- `POST /api/bank/initiate-microdeposits` - Send verification deposits
- `POST /api/bank/verify-microdeposits` - Verify amounts
- `GET /api/bank/accounts` - List all bank accounts

#### **Database Schema:**
```sql
CREATE TABLE bank_accounts (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  account_nickname VARCHAR(100),
  bank_name VARCHAR(100),
  account_type VARCHAR(20),
  routing_number_encrypted TEXT,
  account_number_encrypted TEXT,
  account_last_four VARCHAR(4),
  verification_method VARCHAR(20),
  verification_status VARCHAR(20) DEFAULT 'pending',
  verified_at TIMESTAMP,
  is_primary BOOLEAN DEFAULT FALSE,
  plaid_access_token TEXT,
  plaid_account_id VARCHAR(255),
  microdeposit_amount_1 DECIMAL(5,2),
  microdeposit_amount_2 DECIMAL(5,2),
  microdeposit_sent_at TIMESTAMP,
  verification_attempts INTEGER DEFAULT 0,
  ach_authorized BOOLEAN DEFAULT FALSE,
  ach_signature TEXT,
  ach_signed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bank_accounts_company ON bank_accounts(company_id);
CREATE INDEX idx_bank_accounts_primary ON bank_accounts(company_id, is_primary);
```

#### **Encryption:**
- Use AES-256 encryption for routing and account numbers
- Store encryption keys in secure vault (AWS KMS, HashiCorp Vault)
- Never log or display full account numbers
- Audit all access to encrypted data

#### **Plaid Integration:**
```javascript
// Frontend: Initialize Plaid Link
const config = {
  token: linkToken,
  onSuccess: (publicToken, metadata) => {
    // Exchange public token for access token
    exchangePublicToken(publicToken);
  },
  onExit: (err, metadata) => {
    // Handle errors
  },
};
```

---

**END OF PART 2 - ONBOARDING & COMPANY SETUP PAGES**

**Continued in Part 3:** Employee Management Pages (Pages 14-25)
**Continued in Part 4:** Payroll Processing Pages (Pages 26-40)
**Continued in Part 5:** Tax & Compliance Pages (Pages 41-55)
**Continued in Part 6:** Advanced Features (Pages 56-70)
**Continued in Part 7:** Analytics & Reports (Pages 71-85)
