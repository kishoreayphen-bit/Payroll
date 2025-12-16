# PAYROLL APPLICATION - ULTRA-DETAILED SWIMLANE WORKFLOW
## PART 2: COMPANY SETUP (40+ FIELDS ACROSS 7 SECTIONS)

---

## 🏢 PHASE 2: COMPANY CREATION & SETUP

### STEP 11: COMPANY SETUP PAGE LOADS

**💻 SYSTEM ACTIONS:**

**1. Page Request:**
- Browser executes redirect: `window.location.href = '/company-setup'`
- Browser sends GET request to `/company-setup`
- Request includes authentication token in header:
  - `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**2. Backend Authentication Check:**
- Backend receives request at: 11:30:02.600
- Backend extracts JWT token from Authorization header
- Backend validates token:
  - Verifies signature ✓
  - Checks expiration (not expired) ✓
  - Extracts user ID: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
- Authentication successful ✓

**3. Check Existing Company:**
- Backend queries database:
```sql
SELECT id, legal_name FROM companies 
WHERE user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
```
- Result: 0 rows (no company exists yet - first time setup)

**4. Load Company Setup Page:**
- Backend returns company-setup.html
- Page size: 85KB (HTML + inline CSS/JS)
- Page loads in 0.9 seconds
- URL: `https://yourpayroll.com/company-setup`

### 👤 USER SEES:

**Page Header:**
- **Progress Bar (Top of Page, Full Width):**
  - Text: "Step 2 of 3: Company Setup"
  - Blue filled portion: 66% (two-thirds filled)
  - Gray unfilled: 34%
  - Icons: ✓ Create Account (green checkmark) → ② Company Setup (blue, active) → ③ Verification (gray)

**Welcome Section:**
- **Large Heading (36px, Bold):** "Welcome, John! Let's set up your company"
- **Subheading (18px, Gray):** "This will take about 5-10 minutes. You can save your progress at any time."
- **Time Estimate Icon:** Clock icon showing "~8 minutes"

**Form Container (White Card, 800px Wide, Centered):**

**Tabbed Navigation (Top of Form):**
- 7 tabs displayed horizontally:
  - **Tab 1:** "① Basic Info" (Blue background - active)
  - **Tab 2:** "② Address" (Gray - inactive)
  - **Tab 3:** "③ Contact" (Gray - inactive)
  - **Tab 4:** "④ Banking" (Gray - inactive)
  - **Tab 5:** "⑤ Payroll" (Gray - inactive)
  - **Tab 6:** "⑥ Tax" (Gray - inactive)
  - **Tab 7:** "⑦ Additional" (Gray - inactive)

**Section 1: Basic Company Information (Currently Visible)**

---

### FIELD 1: COMPANY LEGAL NAME

**Display:**
- **Label (Bold, 14px):** "Company Legal Name *"
- **Help Icon:** (i) icon - when hovered shows tooltip: "Enter the official registered name of your company as it appears on tax documents"
- **Input Box:**
  - Width: 100% (full width of form)
  - Height: 45px
  - Border: 1px solid #CCCCCC
  - Border radius: 6px
  - Padding: 12px
  - Background: White
- **Placeholder (Gray, Italic):** "ABC Corporation Inc."
- **Left Icon (Inside Field):** Building/office icon (gray, 20x20px)
- **Character Counter (Bottom-Right of Field):** "0 / 200" (gray text, 12px)
- **Below Field:** Empty space for error messages

---

### FIELD 2: DOING BUSINESS AS (DBA)

**Display:**
- **Label:** "Doing Business As (DBA) *"
- **Help Text (Below Label, 12px, Gray):** "If your company operates under a different name, enter it here. Otherwise, enter the same as legal name."
- **Input Box:** Same styling as Field 1
- **Placeholder:** "ABC Company"
- **Quick Action Link (Below Field, Blue, Clickable):** "↻ Same as Legal Name"
- **Character Counter:** "0 / 200"

---

### FIELD 3: FEDERAL EMPLOYER IDENTIFICATION NUMBER (EIN)

**Display:**
- **Label:** "Federal Employer Identification Number (EIN) *"
- **Help Text:** "9-digit tax ID number assigned by the IRS (Format: XX-XXXXXXX)"
- **Input Box:**
  - Width: 48% (left side, shares row with Field 4)
  - Height: 45px
  - Same border/styling
- **Placeholder:** "12-3456789"
- **Format Hint (Below Field, 11px, Gray):** "Format: XX-XXXXXXX"
- **Left Icon:** ID card icon
- **Info Icon (Right Side):** Tooltip: "Find your EIN on IRS Letter 147C or previous tax returns"

---

### FIELD 4: STATE TAX ID NUMBER

**Display:**
- **Label:** "State Tax ID Number" (No asterisk - optional)
- **Help Text:** "Your state-assigned tax identification number (if applicable)"
- **Input Box:**
  - Width: 48% (right side, same row as Field 3)
  - Margin-left: 4% (gap between fields)
- **Placeholder:** "Varies by state"
- **Note (Below Field):** "Optional - Required in some states"

---

### FIELD 5: INDUSTRY

**Display:**
- **Label:** "Industry *"
- **Help Text:** "Select the industry that best describes your business"
- **Input Type:** Searchable dropdown
- **Input Box:**
  - Width: 100%
  - Height: 45px
  - Cursor: pointer (hand icon when hovering)
- **Placeholder:** "Select or search industry..."
- **Dropdown Icon (Right Side):** Down arrow (▼)
- **Left Icon:** Briefcase icon

**Dropdown Options (When Clicked):**
- **Search Box (Top of Dropdown):**
  - Placeholder: "Type to search..."
  - Auto-focuses when dropdown opens
- **Options List (Scrollable, Max Height 300px):**
  - Accounting & Finance
  - Agriculture & Farming
  - Automotive
  - Construction & Contractors
  - Education & Training
  - Healthcare & Medical
  - Hospitality & Food Service
  - Information Technology
  - Legal Services
  - Manufacturing
  - Non-Profit Organization
  - Real Estate
  - Retail & E-commerce
  - Transportation & Logistics
  - Other (specify)
- Each option has hover effect (light blue background)

---

### FIELD 6: LEGAL STRUCTURE

**Display:**
- **Label:** "Legal Structure *"
- **Help Text:** "Select your company's legal business structure"
- **Input Type:** Radio button cards (visual selection)
- **Layout:** 3 columns × 2 rows (6 cards total)

**Card 1 - Sole Proprietorship:**
- Width: 31% (3 cards per row with 3.5% gaps)
- Height: 100px
- Border: 1px solid #CCCCCC
- Border radius: 8px
- Padding: 15px
- Background: White
- **Icon (Top, Centered):** Single person icon (30x30px, gray)
- **Title (Below Icon, Centered, Bold):** "Sole Proprietorship"
- **Radio Button (Bottom-Left):** ○ (empty circle, 18px)
- **Hover Effect:** Border becomes blue, background becomes light blue (#F0F8FF)

**Card 2 - Partnership:**
- Same styling as Card 1
- **Icon:** Two people icon
- **Title:** "Partnership"
- **Subtitle (Small, Gray):** "General or Limited"

**Card 3 - LLC:**
- Same styling
- **Icon:** Shield icon
- **Title:** "Limited Liability Company (LLC)"

**Card 4 - C Corporation:**
- Same styling
- **Icon:** Building icon
- **Title:** "C Corporation"

**Card 5 - S Corporation:**
- Same styling
- **Icon:** Building with "S" icon
- **Title:** "S Corporation"

**Card 6 - Non-Profit:**
- Same styling
- **Icon:** Heart/charity icon
- **Title:** "Non-Profit Organization"

---

### FIELD 7: COMPANY SIZE

**Display:**
- **Label:** "Number of Employees *"
- **Help Text:** "How many employees will you be managing?"
- **Input Type:** Dropdown
- **Input Box:**
  - Width: 48% (left side)
  - Height: 45px
- **Placeholder:** "Select range..."
- **Dropdown Icon:** Down arrow

**Dropdown Options:**
- 1-10 employees
- 11-50 employees
- 51-100 employees
- 101-500 employees
- 501-1000 employees
- 1000+ employees

---

### FIELD 8: PAYROLL FREQUENCY

**Display:**
- **Label:** "Payroll Frequency *"
- **Help Text:** "How often do you pay your employees?"
- **Input Type:** Dropdown
- **Input Box:**
  - Width: 48% (right side, same row as Field 7)
  - Height: 45px
- **Placeholder:** "How often do you pay?"

**Dropdown Options:**
- Weekly (52 pay periods/year)
- Bi-Weekly (26 pay periods/year)
- Semi-Monthly (24 pay periods/year)
- Monthly (12 pay periods/year)

---

### FIELD 9: FISCAL YEAR START DATE

**Display:**
- **Label:** "Fiscal Year Start Date *"
- **Help Text:** "When does your company's fiscal year begin?"
- **Input Type:** Date picker
- **Input Box:**
  - Width: 48% (left side)
  - Height: 45px
- **Placeholder:** "MM/DD/YYYY"
- **Calendar Icon (Right Side of Field):** Clickable to open date picker
- **Default Suggestion (Gray Text Below):** "Most companies: 01/01/2024"

**Date Picker (When Calendar Icon Clicked):**
- Popup calendar widget (300px × 320px)
- Shows current month by default
- Navigation arrows: ← (previous month) | → (next month)
- Today's date highlighted in blue
- Dates are clickable
- Closes when date selected

---

### FIELD 10: FIRST PAYROLL DATE

**Display:**
- **Label:** "First Payroll Date *"
- **Help Text:** "When do you plan to run your first payroll?"
- **Input Type:** Date picker
- **Input Box:**
  - Width: 48% (right side)
  - Height: 45px
- **Placeholder:** "MM/DD/YYYY"
- **Calendar Icon:** Clickable
- **Validation Note (Below):** "Must be within next 90 days"

**Date Picker Restrictions:**
- Past dates: Grayed out (not clickable)
- Dates beyond 90 days: Grayed out
- Valid dates: Black text, clickable

---

**Bottom of Section 1:**

**Progress Indicator:**
- Text: "Section 1 of 7"
- Progress bar: 14% filled (1/7 complete)

**Navigation Buttons:**
- **Left Button:** "💾 Save Draft" (Gray background, dark gray text)
  - Saves current progress without validation
  - Shows toast message when clicked: "Draft saved"
- **Right Button:** "Next: Address →" (Blue background, white text)
  - Validates current section before proceeding
  - Disabled (gray) until all required fields filled

---

## STEP 12: USER FILLS BASIC COMPANY INFORMATION

### 👤 USER ACTIONS - FIELD 1 (COMPANY LEGAL NAME):

**1. Initial State:**
- User sees cursor automatically blinking in "Company Legal Name" field (auto-focused)
- Field border is blue (focused state)
- Character counter shows: "0 / 200"

**2. User Types Company Name:**
- User types: "T" → sees "T", counter: "1 / 200"
- User types: "e" → sees "Te", counter: "2 / 200"
- User types: "c" → sees "Tec", counter: "3 / 200"
- User types: "h" → sees "Tech", counter: "4 / 200"
- User types: " " → sees "Tech ", counter: "5 / 200"
- User types: "S" → sees "Tech S", counter: "6 / 200"
- User types: "o" → sees "Tech So", counter: "7 / 200"
- User types: "l" → sees "Tech Sol", counter: "8 / 200"
- User types: "u" → sees "Tech Solu", counter: "9 / 200"
- User types: "t" → sees "Tech Solut", counter: "10 / 200"
- User types: "i" → sees "Tech Soluti", counter: "11 / 200"
- User types: "o" → sees "Tech Solutio", counter: "12 / 200"
- User types: "n" → sees "Tech Solution", counter: "13 / 200"
- User types: "s" → sees "Tech Solutions", counter: "14 / 200"
- User types: " " → sees "Tech Solutions ", counter: "15 / 200"
- User types: "C" → sees "Tech Solutions C", counter: "16 / 200"
- User types: "o" → sees "Tech Solutions Co", counter: "17 / 200"
- User types: "r" → sees "Tech Solutions Cor", counter: "18 / 200"
- User types: "p" → sees "Tech Solutions Corp", counter: "19 / 200"
- User types: "o" → sees "Tech Solutions Corpo", counter: "20 / 200"
- User types: "r" → sees "Tech Solutions Corpor", counter: "21 / 200"
- User types: "a" → sees "Tech Solutions Corpora", counter: "22 / 200"
- User types: "t" → sees "Tech Solutions Corporat", counter: "23 / 200"
- User types: "i" → sees "Tech Solutions Corporati", counter: "24 / 200"
- User types: "o" → sees "Tech Solutions Corporatio", counter: "25 / 200"
- User types: "n" → sees "Tech Solutions Corporation", counter: "26 / 200"

**3. User Finishes:**
- User presses **Tab** key to move to next field

### 💻 SYSTEM ACTIONS:

**Real-Time (As User Types):**
- System captures each keystroke event
- System updates character counter after each character
- System stores value in memory

**On Blur (Tab Pressed):**

**Validation Step 1 - Not Empty:**
- Checks: Field contains text?
- Value: "Tech Solutions Corporation"
- Result: Not empty ✓ PASS

**Validation Step 2 - Minimum Length:**
- Checks: Length >= 2 characters?
- Current length: 26 characters
- Result: Yes ✓ PASS

**Validation Step 3 - Maximum Length:**
- Checks: Length <= 200 characters?
- Current length: 26 characters
- Result: Yes ✓ PASS

**Validation Step 4 - Valid Characters:**
- Allowed: Letters, numbers, spaces, &, -, ., ', Inc., LLC, Corp., Ltd.
- Checks each character:
  - All letters: ✓
  - Spaces: ✓
  - No invalid characters: ✓
- Result: All valid ✓ PASS

**Validation Step 5 - Uniqueness Check:**
- System shows mini loading spinner (0.2 seconds)
- Makes AJAX request:
  - POST `/api/companies/check-name`
  - Body: `{"name": "Tech Solutions Corporation"}`

### 🗄️ DATABASE ACTIONS:

**1. Backend Receives Request:**
- Timestamp: 11:30:03.100
- Extracts company name from request

**2. Database Query:**
```sql
SELECT id FROM companies 
WHERE legal_name = 'Tech Solutions Corporation'
LIMIT 1
```
- Query execution time: 10ms
- Result: 0 rows (name is available!)

**3. Backend Response:**
- Returns: `{"available": true, "message": "Company name is available"}`
- Response time: 11:30:03.120

### 💻 SYSTEM ACTIONS (AFTER RESPONSE):

**Success:**
- Response received at: 11:30:03.300 (200ms total)
- Name is available ✓
- System removes loading spinner
- System changes field border color: Gray → Green
- System displays green checkmark icon (✓) on right side of field
- System moves focus to Field 2 (DBA Name)

---

### 👤 USER ACTIONS - FIELD 2 (DBA NAME):

**1. User Sees Options:**
- Cursor now in DBA field
- User sees "↻ Same as Legal Name" link below field (blue, clickable)

**2. User Clicks Link:**
- User moves mouse to "Same as Legal Name" link
- Link text becomes darker blue (hover effect)
- User clicks link with left mouse button

### 💻 SYSTEM ACTIONS:

**1. Link Clicked:**
- JavaScript captures click event
- System reads value from Field 1: "Tech Solutions Corporation"
- System copies value to Field 2
- Field 2 now shows: "Tech Solutions Corporation"
- Character counter updates: "26 / 200"

**2. Auto-Validation:**
- System validates Field 2 automatically:
  - Not empty ✓
  - Valid length ✓
  - Valid characters ✓
- Green checkmark appears
- Border turns green
- Focus moves to Field 3 (EIN)

---

### 👤 USER ACTIONS - FIELD 3 (EIN):

**1. User Types EIN:**
- User types: "1" → sees "1"
- User types: "2" → sees "12"
- User types: "3" → sees "12-3" (system auto-adds hyphen)
- User types: "4" → sees "12-34"
- User types: "5" → sees "12-345"
- User types: "6" → sees "12-3456"
- User types: "7" → sees "12-34567"
- User types: "8" → sees "12-345678"
- User types: "9" → sees "12-3456789" (complete)

**2. User Finishes:**
- User presses **Tab** key

### 💻 SYSTEM ACTIONS:

**Auto-Formatting:**
- After 2 digits: Adds hyphen
- Format: XX-XXXXXXX
- Prevents typing more than 9 digits

**On Blur Validation:**

**Check 1 - Exactly 9 Digits:**
- Strips formatting: "123456789"
- Counts digits: 9
- Result: ✓ PASS

**Check 2 - Valid EIN Format:**
- Pattern: XX-XXXXXXX
- Result: ✓ PASS

**Check 3 - ABA Checksum Validation:**
- Uses IRS EIN validation algorithm
- Validates checksum
- Result: ✓ PASS (valid EIN format)

**Check 4 - Uniqueness:**
- Shows loading spinner
- AJAX request: POST `/api/companies/check-ein`
- Body: `{"ein": "123456789"}`

### 🗄️ DATABASE ACTIONS:

```sql
SELECT id FROM companies WHERE ein = '123456789'
```
- Result: 0 rows (EIN available)
- Returns: `{"available": true}`

### 💻 SYSTEM ACTIONS:

- EIN is valid and available ✓
- Green checkmark appears
- Border turns green
- Focus moves to Field 4 (State Tax ID)

---

### 👤 USER ACTIONS - FIELD 4 (STATE TAX ID - OPTIONAL):

**1. User Sees Field:**
- Label shows no asterisk (optional)
- Note below: "Optional - Required in some states"

**2. User Decision:**
- User decides to skip this field (doesn't have state tax ID yet)
- User presses **Tab** key

### 💻 SYSTEM ACTIONS:

- Field is optional, empty is acceptable
- No validation error
- No checkmark (optional field left empty)
- Focus moves to Field 5 (Industry)

---

### 👤 USER ACTIONS - FIELD 5 (INDUSTRY):

**1. User Clicks Dropdown:**
- User clicks on Industry field
- Dropdown menu opens (animated slide down, 0.2s)

**2. Dropdown Display:**
- Search box at top (auto-focused)
- Full list of 15 industries below
- Scrollable (max height 300px)

**3. User Searches:**
- User types in search box: "t"
- List filters in real-time
- Shows: "Information Technology"
- User types: "e"
- Shows: "Information Technology"
- User types: "c"
- Shows: "Information Technology"

**4. User Selects:**
- User clicks on "Information Technology"
- Dropdown closes (animated slide up)

### 💻 SYSTEM ACTIONS:

**Dropdown Opened:**
- System displays dropdown menu
- System focuses search box
- System shows all options

**Search Filtering:**
- After "t": Filters to show items containing "t"
  - Information Technology ✓
  - Construction & Contractors ✓
  - Hospitality & Food Service ✓
  - Transportation & Logistics ✓
  - Real Estate ✓
  - Retail & E-commerce ✓
- After "te": Further filters
  - Information Technology ✓
  - Real Estate ✓
- After "tec": Further filters
  - Information Technology ✓

**Selection:**
- System captures selection
- Dropdown closes
- Field displays: "Information Technology"
- Green checkmark appears
- Border turns green
- Validation: ✓ Required field filled

---

### 👤 USER ACTIONS - FIELD 6 (LEGAL STRUCTURE):

**1. User Sees Cards:**
- User scrolls down slightly
- User sees 6 radio button cards (3 per row)
- All cards have gray borders (unselected)

**2. User Reads Options:**
- User reads: Sole Proprietorship, Partnership, LLC, C Corp, S Corp, Non-Profit
- User decides: "We're an LLC"

**3. User Hovers Over LLC Card:**
- User moves mouse over "LLC" card (Card 3)
- Card border changes: Gray → Light Blue
- Card background: White → Very Light Blue (#F0F8FF)
- Cursor: Pointer (hand icon)

**4. User Clicks LLC Card:**
- User clicks anywhere on the card
- User hears small click sound

### 💻 SYSTEM ACTIONS:

**Hover Effect:**
- CSS transition (0.2s smooth)
- Border color: #CCCCCC → #0066CC
- Background: #FFFFFF → #F0F8FF

**Click Event:**
- System captures click on Card 3
- Radio button changes: ○ → ● (filled circle)
- Card border: Light Blue → Solid Blue (2px width)
- Card background: Light Blue (stays)
- **All other cards reset:**
  - Cards 1, 2, 4, 5, 6: Return to gray border, white background, empty radio ○
- Green checkmark appears next to "Legal Structure" label
- Validation: ✓ Required field filled
- System stores value: "LLC"

---

### 👤 USER ACTIONS - FIELD 7 (COMPANY SIZE):

**1. User Clicks Dropdown:**
- User clicks on "Number of Employees" field
- Dropdown opens

**2. User Sees Options:**
- 1-10 employees
- 11-50 employees
- 51-100 employees
- 101-500 employees
- 501-1000 employees
- 1000+ employees

**3. User Selects:**
- User clicks "11-50 employees"
- Dropdown closes

### 💻 SYSTEM ACTIONS:

- Dropdown opens (slide down animation)
- Each option has hover effect (light blue background)
- On selection:
  - Dropdown closes
  - Field displays: "11-50 employees"
  - Green checkmark appears
  - Border turns green

---

### 👤 USER ACTIONS - FIELD 8 (PAYROLL FREQUENCY):

**1. User Clicks Dropdown:**
- User clicks on "Payroll Frequency" field

**2. User Sees Options:**
- Weekly (52 pay periods/year)
- Bi-Weekly (26 pay periods/year)
- Semi-Monthly (24 pay periods/year)
- Monthly (12 pay periods/year)

**3. User Selects:**
- User clicks "Bi-Weekly (26 pay periods/year)"

### 💻 SYSTEM ACTIONS:

- On selection:
  - Dropdown closes
  - Field displays: "Bi-Weekly (26 pay periods/year)"
  - Green checkmark appears
  - Info message appears below field (blue background):
    - "ℹ️ Employees will be paid every 2 weeks (every other Friday)"
  - Border turns green

---

### 👤 USER ACTIONS - FIELD 9 (FISCAL YEAR START):

**1. User Clicks Field:**
- User clicks on "Fiscal Year Start Date" field
- Calendar popup appears

**2. Calendar Display:**
- Shows December 2024 (current month)
- Today (December 13) is highlighted in blue
- Navigation arrows at top: ← December 2024 →
- Days of week: Su Mo Tu We Th Fr Sa
- Calendar grid showing all dates

**3. User Navigates:**
- User clicks left arrow (←) to go to previous month
- Calendar changes to November 2024
- User clicks left arrow again
- Calendar changes to October 2024
- User continues clicking left arrow
- Calendar changes to September 2024
- ... continues ...
- Calendar shows January 2024

**4. User Selects Date:**
- User sees January 2024 calendar
- User clicks on "1" (January 1, 2024)
- Calendar closes (fade out animation, 0.2s)

### 💻 SYSTEM ACTIONS:

**Calendar Opens:**
- Popup appears below field (300px × 320px)
- Shows current month by default
- Today's date has blue background
- Month/year displayed at top
- Navigation arrows clickable

**Month Navigation:**
- Each arrow click:
  - Animates to previous/next month (slide animation)
  - Updates month/year display
  - Redraws calendar grid

**Date Selection:**
- System captures click on January 1, 2024
- Calendar closes
- Field populates: "01/01/2024"
- Validates: Valid date ✓
- Validates: Not more than 1 year in future ✓
- Green checkmark appears
- Border turns green

---

### 👤 USER ACTIONS - FIELD 10 (FIRST PAYROLL DATE):

**1. User Clicks Field:**
- User clicks on "First Payroll Date" field
- Calendar popup appears

**2. Calendar Display:**
- Shows December 2024
- **Past dates (1-13) are grayed out** (not clickable)
- **Future dates (14-31) are black** (clickable)
- **Dates beyond March 13, 2025 are grayed out** (more than 90 days)

**3. User Selects Date:**
- User clicks on "20" (December 20, 2024)
- Calendar closes

### 💻 SYSTEM ACTIONS:

**Calendar with Restrictions:**
- System calculates today: December 13, 2024
- System disables dates before today
- System calculates 90 days from today: March 13, 2025
- System disables dates after March 13, 2025
- Only dates between Dec 14 - Mar 13 are clickable

**Date Selection:**
- System captures: December 20, 2024
- Calendar closes
- Field displays: "12/20/2024"
- Validates: Not in past ✓ (7 days from today)
- Validates: Within 90 days ✓
- Green checkmark appears
- Info message below: "ℹ️ 7 days from today"
- Border turns green

---

## STEP 13: SECTION 1 COMPLETE - PROCEED TO SECTION 2

### 👤 USER ACTIONS:

**1. User Reviews Section 1:**
- User scrolls up and down to review all 10 fields
- All required fields show green checkmarks ✓
- User is satisfied with entries

**2. User Scrolls to Bottom:**
- User sees two buttons:
  - "💾 Save Draft" (gray, left)
  - "Next: Address →" (blue, right)
- "Next: Address →" button is enabled (blue, clickable)

**3. User Clicks Next Button:**
- User moves mouse to "Next: Address →" button
- Button darkens slightly (hover effect: #0066CC → #0052A3)
- User clicks button

### 💻 SYSTEM ACTIONS:

**1. Final Section Validation:**
- System validates all 10 fields one final time:
  - Company Legal Name: "Tech Solutions Corporation" ✓
  - DBA Name: "Tech Solutions Corporation" ✓
  - EIN: "12-3456789" ✓
  - State Tax ID: Empty (optional, OK) ✓
  - Industry: "Information Technology" ✓
  - Legal Structure: "LLC" ✓
  - Company Size: "11-50 employees" ✓
  - Payroll Frequency: "Bi-Weekly" ✓
  - Fiscal Year Start: "01/01/2024" ✓
  - First Payroll Date: "12/20/2024" ✓
- **ALL VALIDATIONS PASS!**

**2. Auto-Save Progress:**
- System shows small toast notification (top-right corner):
  - "💾 Saving progress..."
  - Background: Light blue
  - Duration: 2 seconds
- System makes AJAX request:
  - POST `/api/companies/draft`
  - Body: All Section 1 data in JSON format
  ```json
  {
    "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "section": 1,
    "data": {
      "legalName": "Tech Solutions Corporation",
      "dbaName": "Tech Solutions Corporation",
      "ein": "123456789",
      "stateTaxId": null,
      "industry": "Information Technology",
      "legalStructure": "LLC",
      "companySize": "11-50",
      "payrollFrequency": "bi-weekly",
      "fiscalYearStart": "2024-01-01",
      "firstPayrollDate": "2024-12-20"
    }
  }
  ```

### 🗄️ DATABASE ACTIONS:

**1. Backend Receives Draft Save:**
- Timestamp: 11:30:05.500

**2. Check for Existing Draft:**
```sql
SELECT id FROM company_drafts 
WHERE user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
```
- Result: 0 rows (no existing draft)

**3. Create Draft Record:**
```sql
INSERT INTO company_drafts (
  id,
  user_id,
  section_completed,
  draft_data,
  created_at,
  updated_at
) VALUES (
  'draft_xyz123',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  1,
  '{"legalName": "Tech Solutions Corporation", ...}',
  '2024-12-13 11:30:05',
  '2024-12-13 11:30:05'
)
```
- Query time: 15ms
- Draft saved successfully!

**4. Backend Response:**
- Returns: `{"success": true, "message": "Draft saved", "draftId": "draft_xyz123"}`

### 💻 SYSTEM ACTIONS (AFTER SAVE):

**1. Success Response:**
- Toast message updates: "💾 Saving progress..." → "✓ Progress saved"
- Toast background: Light blue → Light green
- Toast auto-dismisses after 2 seconds

**2. Switch to Section 2:**
- **Tab 1 (Basic Info):**
  - Background: Blue → Gray (inactive)
  - Shows green checkmark icon: "✓ Basic Info"
- **Tab 2 (Address):**
  - Background: Gray → Blue (active)
  - Text becomes bold
- **Content Area Transition:**
  - Current content (Section 1) slides left and fades out (0.3s animation)
  - New content (Section 2) slides in from right and fades in (0.3s animation)
- **URL Updates:** `#section-2` added to URL (for bookmarking)
- **Progress Bar Updates:** "Section 2 of 7" (28% complete)

---

## SECTION 2: COMPANY ADDRESS

### 👤 USER NOW SEES:

**Section Header:**
- **Title (24px, Bold):** "Company Address"
- **Subtitle (14px, Gray):** "Enter your company's primary business address"

---

### FIELD 11: COUNTRY

**Display:**
- **Label:** "Country *"
- **Help Text:** "Select the country where your company is located"
- **Input Type:** Searchable dropdown
- **Input Box:** Full width, 45px height
- **Default Value:** "United States" (pre-selected based on user registration)
- **Flag Icon (Left):** 🇺🇸 US flag
- **Dropdown Icon (Right):** Down arrow

---

### FIELD 12: STREET ADDRESS LINE 1

**Display:**
- **Label:** "Street Address *"
- **Help Text:** "Enter your company's street address"
- **Input Box:** Full width
- **Placeholder:** "123 Main Street"
- **Left Icon:** Location pin icon
- **Character Counter:** "0 / 200"

---

### FIELD 13: STREET ADDRESS LINE 2

**Display:**
- **Label:** "Address Line 2" (No asterisk - optional)
- **Help Text:** "Apartment, suite, unit, building, floor, etc."
- **Input Box:** Full width
- **Placeholder:** "Suite 100"
- **Character Counter:** "0 / 200"

---

### FIELD 14: CITY

**Display:**
- **Label:** "City *"
- **Input Box:**
  - Width: 38% (left side)
  - Height: 45px
- **Placeholder:** "New York"

---

### FIELD 15: STATE/PROVINCE

**Display:**
- **Label:** "State *"
- **Input Type:** Searchable dropdown
- **Input Box:**
  - Width: 28% (middle, same row as City)
  - Margin-left: 2%
- **Placeholder:** "Select state..."

**Dropdown Options (For US):**
- All 50 states + DC, alphabetically:
  - Alabama (AL)
  - Alaska (AK)
  - Arizona (AZ)
  - Arkansas (AR)
  - California (CA)
  - ... (all 50 states)
  - Wyoming (WY)
  - District of Columbia (DC)

---

### FIELD 16: ZIP/POSTAL CODE

**Display:**
- **Label:** "ZIP Code *"
- **Input Box:**
  - Width: 28% (right side, same row)
  - Margin-left: 2%
- **Placeholder:** "10001"
- **Format Hint:** "5 digits or 5+4 format"

---

**Bottom of Section 2:**

**Navigation Buttons:**
- "← Previous" (gray, left) - Returns to Section 1
- "💾 Save Draft" (gray, center-left)
- "Next: Contact →" (blue, right)

---

## STEP 14: USER FILLS ADDRESS INFORMATION

### 👤 USER ACTIONS - FIELD 11 (COUNTRY):

**1. User Sees Field:**
- "United States" is already selected (pre-filled)
- Green checkmark already showing
- User accepts default

**2. User Presses Tab:**
- Focus moves to Street Address field

### 💻 SYSTEM ACTIONS:

- Country pre-selected based on user's registration location
- Already validated ✓
- No action needed

---

### 👤 USER ACTIONS - FIELD 12 (STREET ADDRESS):

**1. User Types Address:**
- User types: "1234 Technology Drive"
- Character counter updates: "22 / 200"

**2. User Presses Tab:**

### 💻 SYSTEM ACTIONS:

**Validation:**
- Not empty ✓
- Min 5 characters ✓ (22 characters)
- Max 200 characters ✓
- Contains at least one number ✓ ("1234")
- Green checkmark appears
- Border turns green

---

### 👤 USER ACTIONS - FIELD 13 (ADDRESS LINE 2 - OPTIONAL):

**1. User Types:**
- User types: "Building A, Floor 3"
- Counter: "20 / 200"

**2. User Presses Tab:**

### 💻 SYSTEM ACTIONS:

- Optional field, but validates if filled
- Within 200 characters ✓
- Valid characters ✓
- Green checkmark appears (optional but valid)

---

### 👤 USER ACTIONS - FIELD 14 (CITY):

**1. User Types:**
- User types: "San Francisco"
- Counter: "13 / 100"

**2. User Presses Tab:**

### 💻 SYSTEM ACTIONS:

**Validation:**
- Not empty ✓
- Min 2 characters ✓
- Only letters, spaces, hyphens ✓
- Green checkmark appears

---

### 👤 USER ACTIONS - FIELD 15 (STATE):

**1. User Clicks Dropdown:**
- Dropdown opens showing all 50 states + DC
- Search box at top

**2. User Searches:**
- User types: "cal"
- List filters to show: "California (CA)"

**3. User Selects:**
- User clicks "California (CA)"
- Dropdown closes

### 💻 SYSTEM ACTIONS:

- On selection:
  - Field displays: "California (CA)"
  - Green checkmark appears
  - System notes: CA selected (special overtime rules apply)
  - Info message: "ℹ️ California has specific labor law requirements"

---

### 👤 USER ACTIONS - FIELD 16 (ZIP CODE):

**1. User Types:**
- User types: "94105"

**2. User Presses Tab:**

### 💻 SYSTEM ACTIONS:

**Validation:**
- 5 digits ✓
- Valid US ZIP format ✓
- Makes API call to validate ZIP code
- Confirms: 94105 is valid for San Francisco, CA ✓
- Green checkmark appears

---

**Section 2 Complete! User clicks "Next: Contact →"**

**System auto-saves Section 2, updates Tab 2 with checkmark, activates Tab 3**

---

## SECTION 3: CONTACT INFORMATION

**Fields:**
- Company Phone Number * → User fills: (415) 555-1234
- Fax Number (optional) → User skips
- Company Email * → User fills: payroll@techsolutions.com
- Company Website (optional) → User fills: https://www.techsolutions.com

**All fields validated, Section 3 complete!**

---

## SECTION 4: BANKING INFORMATION

**Security Notice Displayed:**
- Yellow banner: "🔒 Your banking information is encrypted and secure"

**Fields:**
- Bank Name * → User types "Chase", selects "Chase Bank" from autocomplete
- Account Type * → User selects "Checking Account"
- Routing Number * → User types "021000021", system validates, confirms "✓ Chase Bank, New York"
- Account Number * → User types "123456789012", system masks as "••••••••9012"
- Confirm Account Number * → User types "123456789012", system confirms "✓ Account numbers match"

**Section 4 complete!**

---

## SECTION 5: PAYROLL SETTINGS

**Fields:**
- Pay Period Start Day * → User selects "Monday"
- Payment Method * → User selects "Direct Deposit (ACH)"
- Overtime Calculation * → User selects "Both daily and weekly (California rule)"
- Time Tracking → User selects "Manual time entry"
- Workers' Comp Insurance * → User selects "Yes"
  - Provider: "State Compensation Insurance Fund"
  - Policy Number: "WC-2024-123456"
  - Expiration: "12/31/2025"

**Section 5 complete!**

---

## SECTION 6: TAX SETTINGS

**Fields:**
- Federal Tax Filing Status * → "Semi-weekly filer"
- SUI Rate * → "3.4%"
- SUI Account Number * → "1234567-8"
- Local Tax Jurisdictions * → "Yes"
  - User clicks "Add Jurisdiction" button
  - Modal opens with fields:
    - Jurisdiction Name: "San Francisco City"
    - Tax Type: "City"
    - Tax Rate: "1.5%"
  - User clicks "Add"
  - System adds to list: "San Francisco City - City Tax - 1.5%"

**Section 6 complete!**

---

## SECTION 7: ADDITIONAL SETTINGS

**Fields:**
- Company Logo (optional) → User drags "company-logo.png", system uploads, shows thumbnail
- Fiscal Year Already Started * → "No, this will be our first payroll"
- Multi-State Operations * → "No, all employees work in one state"
- PTO Policy * → "Accrual-based PTO"
- Employee Benefits (optional) → User selects: Health Insurance, Dental Insurance, 401(k)
- Notification Preferences * → User selects 4 options (3 pre-checked + Monthly compliance reports)

**All 7 sections complete! (40 fields filled)**

---

## STEP 15: FINAL REVIEW AND SUBMISSION

### 👤 USER ACTIONS:

**1. User Completes Section 7:**
- User scrolls to bottom
- User sees "Review & Submit" button (green, large)

**2. User Clicks Review Button:**
- User clicks "Review & Submit"

### 💻 SYSTEM ACTIONS:

**1. Button State:**
- Text changes: "Review & Submit" → "Validating..." with spinner

**2. Comprehensive Validation:**
- System validates ALL 40 fields across ALL 7 sections
- Validation takes 1.5 seconds
- **ALL VALIDATIONS PASS! ✓**

**3. Redirect to Review Page:**
- System redirects: `/company-setup/review`
- Review page loads

---

### REVIEW PAGE DISPLAYS:

**Header:**
- "Review Your Company Information"
- "Please review carefully before submitting"
- Progress: Step 2 of 3 (66%)

**7 Summary Cards:**

**Card 1: Basic Information**
- Shows all 10 fields from Section 1
- Two-column layout
- "Edit" button (top-right)

**Card 2: Address**
- Formatted address display
- "Edit" button

**Card 3: Contact**
- Phone, Email, Website
- "Edit" button

**Card 4: Banking** (Sensitive Data)
- Bank: Chase Bank
- Account Type: Checking
- Routing: 021000021
- Account: ••••••••9012 (masked)
- "Edit" button

**Card 5: Payroll Settings**
- All settings displayed
- "Edit" button

**Card 6: Tax Settings**
- All tax info
- "Edit" button

**Card 7: Additional Settings**
- Logo thumbnail
- All other settings
- "Edit" button

**Bottom:**

**Final Confirmation:**
- ☐ "I confirm that all information provided is accurate and complete *"

**Buttons:**
- "← Back to Edit" (gray, left)
- "Submit Company Setup" (green, large, right) - Disabled until checkbox checked

---

### 👤 USER ACTIONS:

**1. User Reviews:**
- User scrolls through all 7 cards (2 minutes)
- User verifies all information

**2. User Confirms:**
- User clicks confirmation checkbox
- Checkbox shows checkmark ✓
- "Submit Company Setup" button turns green (enabled)

**3. User Submits:**
- User clicks "Submit Company Setup"

### 💻 SYSTEM ACTIONS:

**1. Button State:**
- Disabled, text: "Submitting..." with spinner

**2. Full-Page Loading:**
- Overlay appears
- Messages rotate:
  - "Creating your company..."
  - "Setting up payroll system..."
  - "Configuring tax settings..."

**3. Send Request:**
- POST `/api/companies/create`
- Body: All 40 fields in JSON (~8KB)

### 🗄️ DATABASE ACTIONS:

**1. Transaction Begins:**
- Backend starts database transaction

**2. Generate Company ID:**
- UUID: "comp_9x8y7z6w5v4u3t2s1r"

**3. Create 7 Database Records:**
- companies table (main record)
- company_addresses table
- company_contacts table
- company_banking table (encrypted)
- company_payroll_settings table
- company_tax_settings table
- company_additional_settings table

**4. Upload Logo:**
- Uploads to cloud storage (S3/Azure)
- Stores URL in database

**5. Commit Transaction:**
- All records created successfully
- Total time: 2.3 seconds

**6. Return Success:**
- Company ID: "comp_9x8y7z6w5v4u3t2s1r"

### 💻 SYSTEM ACTIONS (SUCCESS):

**1. Remove Loading:**
- Overlay fades out

**2. Success Animation:**
- Large green checkmark (animated, grows)
- Confetti falls from top
- Message: "🎉 Company Setup Complete!"

**3. Wait and Redirect:**
- Wait 3 seconds
- Redirect: `/dashboard`

---

**END OF PART 2**

**Summary:**
- 40 fields filled across 7 sections
- All validations passed
- Company created in database
- User redirected to dashboard

**Next: Part 3 will cover Dashboard, Email Verification, Adding Employees, and Running First Payroll**
