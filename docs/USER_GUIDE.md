# Payroll System - Complete User Guide

**Version:** 1.0  
**Last Updated:** January 2026

---

## Table of Contents

1. [System Overview](#system-overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Getting Started](#getting-started)
4. [Phase 1: Core Payroll Engine](#phase-1-core-payroll-engine)
   - [Organization Setup](#1-organization-setup)
   - [Employee Management](#2-employee-management)
   - [Salary Components](#3-salary-components)
   - [Pay Schedule Configuration](#4-pay-schedule-configuration)
   - [Pay Run Processing](#5-pay-run-processing)
   - [Payslip Generation](#6-payslip-generation)
5. [Phase 2: Statutory Compliance](#phase-2-statutory-compliance)
   - [Provident Fund (PF/EPF)](#1-provident-fund-pfepf)
   - [ESI Configuration](#2-esi-employee-state-insurance)
   - [Professional Tax](#3-professional-tax-pt)
   - [TDS (Income Tax)](#4-tds-income-tax)
6. [Phase 3: Employee Features](#phase-3-employee-features)
   - [Investment Declarations](#1-investment-declarations-form-12bb)
   - [Loans & Advances](#2-loans--advances)
   - [Reimbursements](#3-reimbursements)
7. [Attendance & Leave Management](#attendance--leave-management)
8. [Reports](#reports)
9. [Troubleshooting](#troubleshooting)

---

## System Overview

The Payroll System is a comprehensive solution for managing employee salaries, statutory compliance, and employee benefits. It supports:

- Multi-organization/tenant architecture
- Role-based access control
- Indian statutory compliance (PF, ESI, PT, TDS)
- Automated payroll calculations
- Employee self-service features

---

## User Roles & Permissions

### Role Hierarchy

| Role | Description | Access Level |
|------|-------------|--------------|
| **SUPER_ADMIN** | System administrator | Full system access |
| **ADMIN** | Organization administrator | Full organization access |
| **HR_MANAGER** | HR department head | Employee & payroll management |
| **PAYROLL_ADMIN** | Payroll specialist | Payroll processing |
| **MANAGER** | Department manager | Team approvals |
| **EMPLOYEE** | Regular employee | Self-service only |

### Feature Access Matrix

| Feature | Super Admin | Admin | HR Manager | Payroll Admin | Manager | Employee |
|---------|:-----------:|:-----:|:----------:|:-------------:|:-------:|:--------:|
| **Organization Setup** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Employee Management** | ✅ | ✅ | ✅ | 👁️ | 👁️ | ❌ |
| **Salary Components** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Pay Schedule** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Run Payroll** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Approve Payroll** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **View Payslips** | ✅ | ✅ | ✅ | ✅ | 👁️ | 👁️ |
| **Statutory Settings** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Investment Declarations** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Approve Investments** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Loan Requests** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Approve Loans** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Reimbursements** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Approve Reimbursements** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Attendance** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Leave Requests** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Approve Leaves** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Reports** | ✅ | ✅ | ✅ | ✅ | 👁️ | ❌ |

**Legend:** ✅ Full Access | 👁️ View Only | ❌ No Access

---

## Getting Started

### Step 1: Login to the System

1. Open your browser and navigate to the application URL
2. Enter your **Email** and **Password**
3. Click **Sign In**
4. If you have multiple organizations, select the organization from the dropdown

### Step 2: First-Time Setup Checklist

After logging in, the Dashboard displays a setup checklist:

| Step | Description | Required |
|------|-------------|----------|
| 1 | Add Organization Details | ✅ Yes |
| 2 | Configure Tax Details | ✅ Yes |
| 3 | Set Pay Schedule | ✅ Yes |
| 4 | Configure Statutory Components | ✅ Yes |
| 5 | Add Salary Components | ✅ Yes |
| 6 | Add Employees | ✅ Yes |
| 7 | Configure Prior Payroll | Optional |

---

## Phase 1: Core Payroll Engine

### 1. Organization Setup

**Who can access:** Super Admin, Admin

#### Step-by-Step Guide:

1. Navigate to **Settings** → **Organization Details**
2. Fill in the following information:

| Field | Description | Example |
|-------|-------------|---------|
| Company Name | Legal name of company | Acme Corp Pvt Ltd |
| Company Type | Business entity type | Private Limited |
| Industry | Business sector | Information Technology |
| Incorporation Date | Date of registration | 01/04/2020 |
| CIN | Corporate Identification Number | U72200TN2020PTC123456 |
| GSTIN | GST Registration Number | 33AABCU9603R1ZM |
| PAN | Company PAN | AABCU9603R |
| TAN | Tax Deduction Account Number | CHEN12345A |
| Registered Address | Official address | 123 Tech Park, Chennai |

3. Click **Save Changes**

#### Adding Bank Details:

1. Scroll to **Bank Details** section
2. Enter:
   - Bank Name
   - Branch Name
   - Account Number
   - IFSC Code
   - Account Type (Current/Savings)
3. Click **Save**

---

### 2. Employee Management

**Who can access:** Super Admin, Admin, HR Manager (full) | Payroll Admin, Manager (view only)

#### Adding a New Employee:

1. Navigate to **Employees** → **Add Employee**
2. Complete the following tabs:

**Tab 1: Personal Information**
| Field | Required | Description |
|-------|----------|-------------|
| First Name | ✅ | Employee's first name |
| Last Name | ✅ | Employee's last name |
| Email | ✅ | Official email address |
| Phone | ✅ | Contact number |
| Date of Birth | ✅ | DOB for age calculation |
| Gender | ✅ | Male/Female/Other |
| Blood Group | ❌ | Emergency information |
| Marital Status | ❌ | For tax calculations |

**Tab 2: Employment Details**
| Field | Required | Description |
|-------|----------|-------------|
| Employee ID | ✅ | Unique identifier (e.g., EMP001) |
| Department | ✅ | Work department |
| Designation | ✅ | Job title |
| Date of Joining | ✅ | Employment start date |
| Employment Type | ✅ | Full-time/Part-time/Contract |
| Reporting Manager | ❌ | Direct supervisor |
| Work Location | ❌ | Office location |

**Tab 3: Salary Information**
| Field | Required | Description |
|-------|----------|-------------|
| CTC (Annual) | ✅ | Cost to Company |
| Basic Salary | ✅ | Monthly basic (typically 40-50% of CTC) |
| HRA | ✅ | House Rent Allowance |
| Other Allowances | ❌ | Special/Conveyance allowances |

**Tab 4: Bank Details**
| Field | Required | Description |
|-------|----------|-------------|
| Bank Name | ✅ | Employee's bank |
| Account Number | ✅ | Salary credit account |
| IFSC Code | ✅ | Bank branch code |
| Account Type | ✅ | Savings/Current |

**Tab 5: Statutory Information**
| Field | Required | Description |
|-------|----------|-------------|
| PAN | ✅ | Permanent Account Number |
| Aadhar | ✅ | 12-digit Aadhar number |
| UAN | ❌ | Universal Account Number (PF) |
| ESI Number | ❌ | ESI registration (if applicable) |

3. Click **Save Employee**

#### Editing Employee Information:

1. Navigate to **Employees**
2. Click on the employee name
3. Click **Edit** on the relevant section
4. Make changes and click **Save**

#### Bulk Import Employees:

1. Navigate to **Employees** → **Import**
2. Download the CSV template
3. Fill employee data in the template
4. Upload the completed CSV
5. Review and confirm import

---

### 3. Salary Components

**Who can access:** Super Admin, Admin, HR Manager, Payroll Admin

#### Understanding Salary Components:

| Type | Description | Examples |
|------|-------------|----------|
| **Earnings** | Additions to salary | Basic, HRA, DA, Special Allowance |
| **Deductions** | Subtractions from salary | PF, ESI, PT, TDS, Loan EMI |
| **Reimbursements** | Expense claims | Travel, Medical, Food |

#### Creating a Salary Component:

1. Navigate to **Settings** → **Salary Components**
2. Click **Add Component**
3. Fill in the details:

| Field | Description |
|-------|-------------|
| Component Name | E.g., "House Rent Allowance" |
| Component Code | Short code, e.g., "HRA" |
| Type | Earning/Deduction/Reimbursement |
| Calculation Type | Fixed/Percentage/Formula |
| Value/Percentage | Amount or % of Basic |
| Is Taxable | Yes/No |
| Is Active | Enable/Disable component |

4. Click **Save**

#### Standard Indian Salary Structure:

```
Gross Salary Components (Monthly):
├── Basic Salary (40-50% of CTC/12)
├── House Rent Allowance (40-50% of Basic)
├── Dearness Allowance (if applicable)
├── Conveyance Allowance
├── Special Allowance (balancing figure)
├── Medical Allowance
└── Other Allowances

Deductions:
├── Provident Fund (12% of Basic)
├── ESI (0.75% if gross ≤ ₹21,000)
├── Professional Tax (state-wise)
├── TDS (based on tax slab)
└── Other Deductions (Loans, etc.)

Net Salary = Gross Salary - Total Deductions
```

#### Assigning Components to Employees:

1. Go to **Employees** → Select Employee
2. Navigate to **Salary** tab
3. Click **Edit Salary Structure**
4. Add/modify components
5. Click **Save**

---

### 4. Pay Schedule Configuration

**Who can access:** Super Admin, Admin, Payroll Admin

#### Setting Up Pay Schedule:

1. Navigate to **Settings** → **Pay Schedule**
2. Configure the following:

| Setting | Options | Description |
|---------|---------|-------------|
| Pay Frequency | Monthly/Weekly/Bi-weekly | How often employees are paid |
| Pay Day | 1-31 | Day of month for salary credit |
| Pay Period Start | 1-31 | First day of pay period |
| Pay Period End | 1-31 | Last day of pay period |
| Cut-off Date | 1-31 | Last date for attendance input |

3. Click **Save Settings**

#### Example Configuration:

**Monthly Payroll:**
- Pay Frequency: Monthly
- Pay Period: 1st to 31st of month
- Cut-off Date: 25th (for attendance/leaves)
- Pay Day: Last working day

---

### 5. Pay Run Processing

**Who can access:** Super Admin, Admin, Payroll Admin (process) | Admin only (approve)

#### Creating a Pay Run:

**Step 1: Initiate Pay Run**
1. Navigate to **Pay Runs**
2. Click **New Pay Run**
3. Select:
   - Pay Period (e.g., January 2026)
   - Pay Date (e.g., 31st January 2026)
4. Click **Create**

**Step 2: Review Employees**
1. System shows all active employees
2. Review employee list
3. Exclude employees if needed (on leave, resigned)
4. Click **Continue**

**Step 3: Calculate Payroll**
1. Click **Calculate Payroll**
2. System automatically calculates:
   - Gross earnings from salary components
   - Attendance-based deductions (LOP)
   - Statutory deductions (PF, ESI, PT, TDS)
   - Loan EMI deductions
   - Reimbursement additions
   - Net pay

**Step 4: Review Calculations**
1. Review the payroll summary:

| Column | Description |
|--------|-------------|
| Employee | Employee name |
| Gross Pay | Total earnings |
| PF | Provident Fund deduction |
| ESI | ESI deduction (if applicable) |
| PT | Professional Tax |
| TDS | Income Tax deduction |
| Other Deductions | Loans, advances |
| Net Pay | Take-home salary |

2. Click on any employee to view detailed breakdown
3. Make manual adjustments if needed

**Step 5: Submit for Approval**
1. Verify all calculations
2. Click **Submit for Approval**
3. Status changes to "Pending Approval"

**Step 6: Approve Pay Run (Admin only)**
1. Admin reviews the pay run
2. Click **Approve** or **Reject with Comments**
3. Approved pay runs move to "Ready for Payment"

**Step 7: Process Payment**
1. Click **Process Payment**
2. Generate bank transfer file (optional)
3. Mark as "Paid" after bank transfer

#### Pay Run Statuses:

| Status | Description |
|--------|-------------|
| Draft | Pay run created, not calculated |
| Calculated | Payroll calculated, pending review |
| Pending Approval | Submitted, awaiting approval |
| Approved | Ready for payment |
| Paid | Salaries disbursed |
| Cancelled | Pay run cancelled |

---

### 6. Payslip Generation

**Who can access:** All roles (own payslip) | Admin, HR, Payroll Admin (all payslips)

#### Generating Payslips:

1. Navigate to completed Pay Run
2. Click **Generate Payslips**
3. System creates PDF payslips for all employees

#### Viewing Payslip:

**For Admin/HR:**
1. Go to **Pay Runs** → Select completed pay run
2. Click on employee name
3. Click **View Payslip** or **Download PDF**

**For Employees:**
1. Go to **My Payslips** (from dashboard)
2. Select pay period
3. Click **View** or **Download**

#### Payslip Contents:

```
┌─────────────────────────────────────────────────────┐
│                    PAYSLIP                          │
│              Month: January 2026                    │
├─────────────────────────────────────────────────────┤
│ Employee: John Doe          │ Employee ID: EMP001   │
│ Department: Engineering     │ Designation: Developer│
│ PAN: ABCDE1234F            │ UAN: 100123456789     │
├─────────────────────────────────────────────────────┤
│ EARNINGS                    │ DEDUCTIONS            │
├─────────────────────────────┼───────────────────────┤
│ Basic Salary    ₹40,000     │ Provident Fund ₹4,800 │
│ HRA             ₹20,000     │ ESI            ₹0     │
│ Special Allow.  ₹15,000     │ Prof. Tax      ₹200   │
│ Conveyance      ₹5,000      │ TDS            ₹3,500 │
├─────────────────────────────┼───────────────────────┤
│ Gross Earnings  ₹80,000     │ Total Deduct.  ₹8,500 │
├─────────────────────────────────────────────────────┤
│            NET PAY: ₹71,500                         │
└─────────────────────────────────────────────────────┘
```

#### Email Distribution:

1. After generating payslips
2. Click **Send via Email**
3. Select:
   - All employees
   - Specific employees
4. Click **Send**
5. Employees receive payslip PDF attachment

---

## Phase 2: Statutory Compliance

### 1. Provident Fund (PF/EPF)

**Who can access:** Super Admin, Admin, HR Manager, Payroll Admin

#### Understanding PF:

| Component | Rate | Ceiling |
|-----------|------|---------|
| Employee Contribution | 12% of Basic | ₹15,000/month |
| Employer Contribution | 12% of Basic | ₹15,000/month |
| Admin Charges | 0.5% | On PF wages |
| EDLI | 0.5% | On PF wages |

**Note:** Contribution is calculated on Basic + DA, capped at ₹15,000

#### Configuring PF:

1. Navigate to **Settings** → **Statutory** → **Provident Fund**
2. Configure:

| Field | Description | Default |
|-------|-------------|---------|
| PF Establishment ID | EPFO registration number | - |
| PF Establishment Name | Registered name | - |
| Employee Contribution % | Employee's share | 12% |
| Employer Contribution % | Employer's share | 12% |
| Admin Charges % | Administrative fee | 0.5% |
| EDLI Rate % | Insurance contribution | 0.5% |
| Wage Ceiling | Maximum PF wage | ₹15,000 |
| Include Employer in CTC | Add employer share to CTC | Yes/No |

3. Click **Save**

#### Managing Employee UAN:

1. Go to **Employees** → Select Employee
2. Navigate to **Statutory** tab
3. Enter/Update **UAN (Universal Account Number)**
4. Click **Save**

#### Monthly PF Calculation:

**Example:**
```
Basic Salary: ₹40,000
PF Wage (capped): ₹15,000

Employee PF: ₹15,000 × 12% = ₹1,800
Employer PF: ₹15,000 × 12% = ₹1,800
Admin Charges: ₹15,000 × 0.5% = ₹75
EDLI: ₹15,000 × 0.5% = ₹75

Total Employer Cost: ₹1,800 + ₹75 + ₹75 = ₹1,950
```

---

### 2. ESI (Employee State Insurance)

**Who can access:** Super Admin, Admin, HR Manager, Payroll Admin

#### Understanding ESI:

| Component | Rate |
|-----------|------|
| Employee Contribution | 0.75% of Gross |
| Employer Contribution | 3.25% of Gross |
| **Wage Ceiling** | ₹21,000/month |

**Note:** ESI is applicable only if employee's gross salary ≤ ₹21,000/month

#### Configuring ESI:

1. Navigate to **Settings** → **Statutory** → **ESI**
2. Configure:

| Field | Description | Default |
|-------|-------------|---------|
| ESI Code | ESI registration number | - |
| Employee Contribution % | Employee's share | 0.75% |
| Employer Contribution % | Employer's share | 3.25% |
| Wage Ceiling | Maximum eligible salary | ₹21,000 |
| Is Active | Enable/Disable ESI | Yes |

3. Click **Save**

#### ESI Calculation Example:

```
Gross Salary: ₹18,000 (Eligible - below ₹21,000)

Employee ESI: ₹18,000 × 0.75% = ₹135
Employer ESI: ₹18,000 × 3.25% = ₹585

Total ESI: ₹720
```

---

### 3. Professional Tax (PT)

**Who can access:** Super Admin, Admin, HR Manager, Payroll Admin

#### Understanding PT:

Professional Tax is a state-level tax with different slabs for each state.

#### State-wise PT Slabs:

**Tamil Nadu:**
| Monthly Salary | PT Amount |
|----------------|-----------|
| Up to ₹21,000 | ₹0 |
| ₹21,001 - ₹30,000 | ₹100 |
| ₹30,001 - ₹45,000 | ₹235 |
| ₹45,001 - ₹60,000 | ₹510 |
| ₹60,001 - ₹75,000 | ₹760 |
| Above ₹75,000 | ₹1,095 |

**Karnataka:**
| Monthly Salary | PT Amount |
|----------------|-----------|
| Up to ₹15,000 | ₹0 |
| ₹15,001 - ₹25,000 | ₹200 |
| Above ₹25,000 | ₹200 |

**Maharashtra:**
| Monthly Salary | PT Amount |
|----------------|-----------|
| Up to ₹7,500 | ₹0 |
| ₹7,501 - ₹10,000 | ₹175 |
| Above ₹10,000 | ₹200/₹300* |

*₹300 in February (annual adjustment)

#### Configuring PT:

1. Navigate to **Settings** → **Statutory** → **Professional Tax**
2. Select **State**
3. View/Edit PT slabs
4. Click **Initialize Slabs** to load default state slabs
5. Customize if needed
6. Click **Save**

---

### 4. TDS (Income Tax)

**Who can access:** Super Admin, Admin, HR Manager, Payroll Admin

#### Tax Regimes:

**Old Tax Regime (with deductions):**
| Income Slab | Tax Rate |
|-------------|----------|
| Up to ₹2,50,000 | 0% |
| ₹2,50,001 - ₹5,00,000 | 5% |
| ₹5,00,001 - ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |

**New Tax Regime (lower rates, no deductions):**
| Income Slab | Tax Rate |
|-------------|----------|
| Up to ₹3,00,000 | 0% |
| ₹3,00,001 - ₹6,00,000 | 5% |
| ₹6,00,001 - ₹9,00,000 | 10% |
| ₹9,00,001 - ₹12,00,000 | 15% |
| ₹12,00,001 - ₹15,00,000 | 20% |
| Above ₹15,00,000 | 30% |

#### Configuring TDS:

1. Navigate to **Settings** → **Statutory** → **TDS**
2. Set default tax regime for organization
3. Configure:
   - Standard Deduction: ₹50,000
   - Surcharge rates
   - Cess: 4%

#### Employee Tax Declaration:

**For Employees:**
1. Navigate to **Benefits** → **Investment Declarations**
2. Select tax regime (Old/New)
3. Click **Create Declaration**
4. Fill in investments (see Phase 3)
5. Submit for approval

**For HR/Admin:**
1. Navigate to **Benefits** → **Investment Declarations**
2. Review submitted declarations
3. Approve or Reject with comments
4. Approved declarations affect TDS calculation

#### Monthly TDS Calculation:

```
Annual CTC: ₹12,00,000
Less: Exemptions (Old Regime):
  - Standard Deduction: ₹50,000
  - Section 80C: ₹1,50,000
  - Section 80D: ₹25,000
  - HRA Exemption: ₹1,20,000
  
Taxable Income: ₹8,55,000

Tax Calculation:
  - Up to ₹2,50,000: ₹0
  - ₹2,50,001 - ₹5,00,000: ₹12,500
  - ₹5,00,001 - ₹8,55,000: ₹71,000
  
Total Tax: ₹83,500
Add Cess (4%): ₹3,340

Annual TDS: ₹86,840
Monthly TDS: ₹7,237
```

---

## Phase 3: Employee Features

### 1. Investment Declarations (Form 12BB)

**Who can access:** All employees (own), Admin/HR/Payroll (all, approve)

#### Supported Deduction Sections:

**Section 80C (Max ₹1,50,000):**
| Investment | Description |
|------------|-------------|
| PPF | Public Provident Fund |
| ELSS | Equity Linked Savings Scheme |
| LIC | Life Insurance Premium |
| NSC | National Savings Certificate |
| Sukanya Samriddhi | Girl child scheme |
| Tuition Fees | Children's education (max 2) |
| Home Loan Principal | Principal repayment |
| 5-Year FD | Tax-saving fixed deposit |

**Section 80CCD (NPS):**
| Component | Limit |
|-----------|-------|
| Employee (80CCD 1) | Part of 80C limit |
| Employer (80CCD 2) | 10% of Basic |
| Additional (80CCD 1B) | ₹50,000 extra |

**Section 80D (Medical Insurance):**
| Category | Limit |
|----------|-------|
| Self & Family | ₹25,000 |
| Self & Family (Senior) | ₹50,000 |
| Parents | ₹25,000 |
| Parents (Senior) | ₹50,000 |
| Preventive Checkup | ₹5,000 |

**Other Sections:**
| Section | Purpose | Limit |
|---------|---------|-------|
| 80E | Education Loan Interest | No limit |
| 80G | Donations | 50-100% |
| 80EE | Home Loan Interest (first home) | ₹50,000 |
| 24 | Home Loan Interest | ₹2,00,000 |

#### Creating Investment Declaration:

**Step 1: Access Declaration**
1. Navigate to **Benefits** → **Investment Declarations**
2. Click **Create New Declaration**
3. Select Financial Year (e.g., 2025-26)

**Step 2: Enter Section 80C Investments**
1. Click **Section 80C** tab
2. Enter amounts for each investment:
   - PPF: ₹50,000
   - ELSS: ₹30,000
   - LIC Premium: ₹20,000
   - NSC: ₹10,000
   - Tuition Fees: ₹40,000
3. Total shows automatically (capped at ₹1,50,000)

**Step 3: Enter Section 80D**
1. Click **Section 80D** tab
2. Enter:
   - Self & Family Premium: ₹25,000
   - Parents Premium: ₹30,000
   - Preventive Checkup: ₹5,000

**Step 4: Enter HRA Details**
1. Click **HRA** tab
2. Enter:
   - Annual Rent Paid: ₹1,80,000
   - Landlord Name: (if rent > ₹1,00,000)
   - Landlord PAN: (if rent > ₹1,00,000)
   - Rental Address
   - Metro City: Yes/No

**Step 5: Enter Other Deductions**
1. Enter Section 80E (Education Loan Interest)
2. Enter Section 24 (Home Loan Interest)
3. Enter any other applicable deductions

**Step 6: Submit Declaration**
1. Review all entries
2. Click **Save as Draft** to save without submitting
3. Click **Submit for Approval** when ready
4. Status changes to "Submitted"

**Step 7: Approval (HR/Admin)**
1. Navigate to **Benefits** → **Investment Declarations**
2. Filter by status "Submitted"
3. Click on declaration to review
4. Click **Approve** or **Reject**
5. If rejecting, provide reason

#### Proof Submission:

1. During declaration or later
2. Upload supporting documents:
   - PPF passbook copy
   - Insurance premium receipts
   - Rent receipts
   - Landlord PAN copy (if applicable)
   - Loan statements
3. HR verifies proofs during approval

---

### 2. Loans & Advances

**Who can access:** All employees (request), Admin/HR/Manager (approve), Finance (disburse)

#### Loan Types:

| Type | Typical Tenure | Interest Rate |
|------|---------------|---------------|
| Salary Advance | 1-3 months | 0% |
| Personal Loan | 6-24 months | 8-12% |
| Emergency Loan | 3-12 months | 6-10% |
| Vehicle Loan | 12-60 months | 9-14% |
| Home Loan | 60-240 months | 8-10% |

#### Applying for a Loan:

**Step 1: Create Request**
1. Navigate to **Benefits** → **Employee Benefits** → **Loans & Advances**
2. Click **Apply for Loan**
3. Fill in:

| Field | Description |
|-------|-------------|
| Loan Type | Select type from dropdown |
| Principal Amount | Loan amount required |
| Tenure (Months) | Repayment period |
| Interest Rate | Annual interest rate |
| Purpose | Reason for loan |
| Supporting Documents | Upload if required |

4. Click **Submit**

**Step 2: EMI Calculation Preview**
System shows EMI calculation before submission:
```
Principal: ₹1,00,000
Tenure: 12 months
Interest: 10% p.a.

Monthly EMI: ₹8,792
Total Interest: ₹5,500
Total Repayment: ₹1,05,500
```

**Step 3: Approval Process**
1. Request submitted to Manager/HR
2. Manager reviews and approves
3. HR/Admin does final approval
4. Status: Pending → Approved

**Step 4: Disbursement**
1. Finance reviews approved loans
2. Initiates disbursement
3. Amount credited to employee account
4. Status: Approved → Disbursed → Active

**Step 5: EMI Deduction**
1. EMI automatically deducted from salary
2. Deduction starts from next pay cycle
3. Continues until loan closure
4. Employee can view:
   - EMIs paid
   - Pending EMIs
   - Outstanding balance

#### Loan Status Flow:

```
PENDING → APPROVED → DISBURSED → ACTIVE → CLOSED
            ↓
         REJECTED
```

#### Viewing Loan Details:

1. Navigate to **Benefits** → **Loans & Advances**
2. View all loans with status
3. Click on loan to see:
   - Loan summary
   - EMI schedule
   - Payment history
   - Outstanding balance

---

### 3. Reimbursements

**Who can access:** All employees (submit), Manager (approve), Finance (process)

#### Expense Categories:

| Category | Description | Typical Limit |
|----------|-------------|---------------|
| Travel | Business travel expenses | As per policy |
| Medical | Healthcare expenses | ₹15,000/year |
| Food | Business meals | ₹3,000/month |
| Communication | Phone/Internet | ₹1,500/month |
| Fuel | Vehicle fuel | ₹5,000/month |
| Relocation | Moving expenses | One-time |
| Training | Courses/Certifications | As approved |
| Other | Miscellaneous | As approved |

#### Submitting an Expense Claim:

**Step 1: Create Claim**
1. Navigate to **Benefits** → **Employee Benefits** → **Reimbursements**
2. Click **Submit New Claim**
3. Fill in:

| Field | Description |
|-------|-------------|
| Category | Select expense type |
| Expense Date | Date of expense |
| Amount | Total amount |
| Description | Brief description |
| Vendor/Merchant | Where purchased |
| Bill Number | Invoice/receipt number |

**Step 2: Upload Receipts**
1. Click **Upload Documents**
2. Attach:
   - Original bills/receipts
   - Invoices
   - Supporting documents
3. Multiple files supported

**Step 3: Submit**
1. Review claim details
2. Click **Submit**
3. Status: PENDING

#### Approval Workflow:

**Step 1: Manager Review**
1. Manager receives notification
2. Reviews claim and documents
3. Options:
   - **Approve** - Full amount approved
   - **Partially Approve** - Reduced amount
   - **Reject** - With reason

**Step 2: HR/Finance Review**
1. Reviews approved claims
2. Verifies against policy
3. Final approval

**Step 3: Payment**
1. Approved claims added to payroll
2. Amount included in next salary
3. Status: PAID

#### Claim Status Flow:

```
PENDING → APPROVED → PAID
   ↓         ↓
REJECTED  PARTIALLY_APPROVED → PAID
```

#### Viewing Claims:

1. Navigate to **Benefits** → **Reimbursements**
2. See all claims with filters:
   - Status (Pending/Approved/Rejected/Paid)
   - Date range
   - Category
3. Click claim for details

---

## Attendance & Leave Management

### Attendance

**Who can access:** All employees (own), HR/Admin (all)

#### Marking Attendance:

**Option 1: Check-in/Check-out**
1. Navigate to **Attendance**
2. Click **Check In** on arrival
3. Click **Check Out** on departure
4. System records time automatically

**Option 2: Manual Entry (HR)**
1. Navigate to **Attendance**
2. Select employee and date
3. Enter:
   - Status (Present/Absent/Half-day/Leave)
   - Check-in time
   - Check-out time
4. Click **Save**

#### Attendance Regularization:

1. If forgot to mark attendance
2. Navigate to **Attendance** → **Regularization**
3. Select date
4. Enter reason
5. Submit for approval
6. Manager approves regularization

### Leave Management

#### Leave Types:

| Leave Type | Days/Year | Carry Forward | Encashable |
|------------|-----------|---------------|------------|
| Casual Leave | 12 | No | No |
| Sick Leave | 12 | Yes (max 30) | No |
| Earned Leave | 15 | Yes (max 45) | Yes |
| Maternity Leave | 182 | No | No |
| Paternity Leave | 15 | No | No |
| Compensatory Off | As earned | No | No |

#### Applying for Leave:

1. Navigate to **Attendance** → **Leave Requests**
2. Click **Apply Leave**
3. Fill in:
   - Leave Type
   - Start Date
   - End Date
   - Half-day (if applicable)
   - Reason
4. Click **Submit**
5. Manager receives notification

#### Leave Approval (Manager):

1. Navigate to **Attendance** → **Leave Requests**
2. View pending requests
3. Click on request
4. **Approve** or **Reject** with comments

#### Leave Balance:

1. Navigate to **Attendance** → **Leave Balance**
2. View:
   - Opening balance
   - Accrued leaves
   - Used leaves
   - Available balance

---

## Reports

**Who can access:** Admin, HR Manager, Payroll Admin (all) | Manager (team)

### Available Reports:

| Report | Description | Access |
|--------|-------------|--------|
| Payroll Summary | Monthly payroll overview | Admin, HR, Payroll |
| Employee Salary Report | Individual salary details | Admin, HR, Payroll |
| PF Report | Provident Fund summary | Admin, HR, Payroll |
| ESI Report | ESI contribution details | Admin, HR, Payroll |
| PT Report | Professional Tax summary | Admin, HR, Payroll |
| TDS Report | Tax deduction details | Admin, HR, Payroll |
| Attendance Report | Employee attendance | Admin, HR, Manager |
| Leave Report | Leave utilization | Admin, HR, Manager |
| Loan Report | Active loans summary | Admin, HR, Finance |
| Reimbursement Report | Expense claims | Admin, HR, Finance |

### Generating Reports:

1. Navigate to **Reports**
2. Select report type
3. Set filters:
   - Date range
   - Department
   - Employee (optional)
4. Click **Generate**
5. View on screen or export:
   - PDF
   - Excel
   - CSV

---

## Troubleshooting

### Common Issues:

| Issue | Solution |
|-------|----------|
| Cannot login | Check email/password, reset if needed |
| Pay run calculation error | Verify employee salary components |
| PF not calculating | Check if Basic salary is configured |
| ESI not applicable | Verify gross salary is ≤ ₹21,000 |
| PT showing ₹0 | Check state configuration |
| TDS too high | Submit investment declarations |
| Payslip not generated | Complete pay run approval first |
| Loan EMI not deducted | Ensure loan is in "Active" status |

### Getting Help:

1. Check this user guide
2. Contact HR department
3. Raise support ticket
4. Email: support@payroll.com

---

## Appendix

### Keyboard Shortcuts:

| Shortcut | Action |
|----------|--------|
| Ctrl + S | Save |
| Ctrl + N | New entry |
| Esc | Close modal |
| Enter | Confirm |

### Glossary:

| Term | Definition |
|------|------------|
| CTC | Cost to Company - Total employer expense |
| Gross | Total earnings before deductions |
| Net | Take-home salary after deductions |
| UAN | Universal Account Number for PF |
| TDS | Tax Deducted at Source |
| EMI | Equated Monthly Installment |
| LOP | Loss of Pay |

---

**End of User Guide**

For updates and latest features, check the system release notes.
