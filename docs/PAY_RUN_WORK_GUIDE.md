# Pay Run Processing - Work Guide

This document provides a comprehensive guide on how to use the Pay Run Processing and Payslip Generation features in the Payroll application.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pay Run Processing](#pay-run-processing)
   - [Creating a Pay Run](#creating-a-pay-run)
   - [Calculating Payroll](#calculating-payroll)
   - [Approving a Pay Run](#approving-a-pay-run)
   - [Completing a Pay Run](#completing-a-pay-run)
3. [Payslip Generation](#payslip-generation)
   - [Generating Payslips](#generating-payslips)
   - [Downloading Payslips](#downloading-payslips)
4. [Email Distribution](#email-distribution)
5. [API Reference](#api-reference)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before using the Pay Run Processing features, ensure the following are set up:

### 1. Organization Setup
- **Organization registered** in the system with valid details
- **Organization ID** stored in localStorage as `selectedOrganizationId`

### 2. Employee Data
- At least one **Active employee** in the organization
- Employees must have the following salary details configured:
  - **Annual CTC** (Cost to Company)
  - **Basic Salary** (typically 40-50% of CTC)
  - **HRA** (House Rent Allowance)
  - **Conveyance Allowance**
  - **Fixed Allowance**
  
### 3. Statutory Configuration
Employees should have statutory settings configured:
- **PF Applicable** - Whether Provident Fund applies
- **ESI Applicable** - Whether ESI applies (for gross salary ≤ ₹21,000)
- **Professional Tax Applicable** - State-wise professional tax

### 4. Pay Schedule (Optional but Recommended)
- Configure pay schedule in **Settings → Pay Schedule**
- Set pay frequency (Monthly/Weekly/Bi-Weekly/Semi-Monthly)
- Define pay day and cutoff dates

### 5. Backend Services Running
- Spring Boot backend running on port 8080
- Database (PostgreSQL) with migrations applied
- Email service configured (for payslip distribution)

---

## Pay Run Processing

### Understanding Pay Run Status Flow

```
DRAFT → CALCULATING → PENDING_APPROVAL → APPROVED → COMPLETED
                                              ↓
                                         CANCELLED
```

| Status | Description |
|--------|-------------|
| **DRAFT** | Initial state, pay run created but not calculated |
| **CALCULATING** | Payroll calculation in progress |
| **PENDING_APPROVAL** | Calculation complete, awaiting approval |
| **APPROVED** | Approved by authorized user, ready for processing |
| **COMPLETED** | Pay run finalized, payslips can be generated |
| **CANCELLED** | Pay run cancelled (not processed) |

---

### Creating a Pay Run

#### From the UI:

1. Navigate to **Pay Runs** from the sidebar
2. Click **"Create Pay Run"** button (top right)
3. Fill in the form:
   - **Pay Period Start**: First day of the pay period (e.g., 01-Jan-2026)
   - **Pay Period End**: Last day of the pay period (e.g., 31-Jan-2026)
   - **Pay Date**: Date when salaries will be credited (e.g., 05-Feb-2026)
   - **Notes** (Optional): Any remarks for this pay run
4. Click **"Create Pay Run"**

#### What happens:
- A new pay run is created in **DRAFT** status
- A unique Pay Run Number is generated (e.g., `PR-2026-001`)
- All active employees are automatically included

#### API Endpoint:
```
POST /api/pay-runs
Headers:
  X-Tenant-ID: {organizationId}
  X-User-ID: {userId}
Body:
{
  "payPeriodStart": "2026-01-01",
  "payPeriodEnd": "2026-01-31",
  "payDate": "2026-02-05",
  "notes": "January 2026 Payroll"
}
```

---

### Calculating Payroll

#### From the UI:

1. In the Pay Runs table, find the pay run in **DRAFT** status
2. Click the **Calculator icon** (📊) or open details and click **"Calculate Payroll"**
3. Wait for calculation to complete

#### What happens during calculation:

1. **Fetch Active Employees**: All employees with status "Active" are included
2. **For each employee, calculate**:

   **Gross Salary Components:**
   - Basic Salary
   - HRA (House Rent Allowance)
   - Conveyance Allowance
   - Fixed Allowance
   - Other Earnings
   
   **Deductions:**
   - **Provident Fund (PF)**: 12% of Basic Salary (if applicable)
   - **ESI**: 0.75% of Gross (if gross ≤ ₹21,000 and applicable)
   - **Professional Tax**: Based on state slabs:
     - Gross > ₹15,000: ₹200/month
     - Gross > ₹10,000: ₹150/month
     - Otherwise: ₹0
   - **TDS**: As per employee's tax declaration
   - **LOP Deduction**: (Daily Salary × LOP Days)
   
   **Employer Contributions:**
   - **PF Employer**: 12% of Basic Salary
   - **ESI Employer**: 3.25% of Gross (if applicable)

3. **Net Salary** = Gross Salary - Total Deductions

#### Calculation Formula Example:

```
Employee: John Doe
Annual CTC: ₹6,00,000

Monthly Breakdown:
├── Basic Salary:        ₹25,000 (50% of monthly CTC)
├── HRA:                 ₹10,000 (40% of Basic)
├── Conveyance:          ₹1,600
├── Fixed Allowance:     ₹13,400
└── Gross Salary:        ₹50,000

Deductions:
├── PF (Employee):       ₹3,000 (12% of Basic)
├── ESI:                 ₹0 (not applicable, gross > ₹21,000)
├── Professional Tax:    ₹200
├── TDS:                 ₹0
└── Total Deductions:    ₹3,200

Net Salary: ₹50,000 - ₹3,200 = ₹46,800

Employer Contributions:
├── PF (Employer):       ₹3,000
└── ESI (Employer):      ₹0
```

#### API Endpoint:
```
POST /api/pay-runs/{payRunId}/calculate
Headers:
  X-Tenant-ID: {organizationId}
```

---

### Approving a Pay Run

#### From the UI:

1. Find the pay run in **PENDING_APPROVAL** status
2. Review the calculation details:
   - Click on the pay run number to open details
   - Verify employee breakdown, gross pay, deductions, and net pay
3. Click the **Check icon** (✓) or **"Approve"** button
4. Confirm the approval

#### What happens:
- Status changes to **APPROVED**
- Approval timestamp and approver ID are recorded
- Pay run is now ready for completion and payslip generation

#### API Endpoint:
```
POST /api/pay-runs/{payRunId}/approve
Headers:
  X-Tenant-ID: {organizationId}
  X-User-ID: {userId}
```

---

### Completing a Pay Run

#### From the UI:

1. Find the pay run in **APPROVED** status
2. Click the **CheckCircle icon** or **"Mark Complete"** button
3. Confirm completion

#### What happens:
- Status changes to **COMPLETED**
- Pay run is finalized and cannot be modified
- Payslips can now be generated

#### API Endpoint:
```
POST /api/pay-runs/{payRunId}/complete
Headers:
  X-Tenant-ID: {organizationId}
```

---

## Payslip Generation

### Generating Payslips

#### From the UI:

1. Find a pay run in **APPROVED** or **COMPLETED** status
2. Click the **FileText icon** (📄) or **"Generate Payslips"** button
3. Wait for generation to complete
4. Success message confirms payslips are generated

#### What happens:

1. For each employee in the pay run:
   - A `Payslip` record is created in the database
   - A unique Payslip Number is generated
   - A **PDF file** is generated and stored locally

2. **PDF Content includes**:
   - Company name and address (header)
   - Employee details (name, ID, designation, department, PAN)
   - Pay period and pay date
   - Earnings breakdown (Basic, HRA, Allowances)
   - Deductions breakdown (PF, ESI, PT, TDS)
   - Net pay (highlighted)
   - System-generated footer with timestamp

3. **PDF Storage**:
   - Default path: `./payslips/` directory
   - File naming: `payslip_{employeeId}_{YYYYMM}_{timestamp}.pdf`

#### API Endpoint:
```
POST /api/payslips/generate/{payRunId}
Headers:
  X-Tenant-ID: {organizationId}
```

---

### Downloading Payslips

#### For Employees (Self-Service):

```
GET /api/payslips/{payslipId}/download
Headers:
  X-Employee-ID: {employeeId}
```

#### For HR/Admin:

1. Navigate to employee payslips via employee details
2. Select the payslip period
3. Click download button

---

## Email Distribution

### Sending Payslip via Email

#### API Endpoint:
```
POST /api/payslips/{payslipId}/send-email
Headers:
  X-Tenant-ID: {organizationId}
```

#### What happens:

1. Fetches employee's email (personal or work email)
2. Composes email with:
   - Subject: `Payslip for {Month} {Year} - {Company Name}`
   - Body: Summary of gross, deductions, and net pay
   - Attachment: Payslip PDF
3. Sends email via configured SMTP server
4. Updates payslip record:
   - `emailSent = true`
   - `emailSentAt = current timestamp`
   - `status = SENT`

### Email Configuration (application.properties):

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## API Reference

### Pay Run Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pay-runs` | List all pay runs for organization |
| GET | `/api/pay-runs/{id}` | Get pay run by ID |
| GET | `/api/pay-runs/{id}/details` | Get pay run with employee breakdown |
| POST | `/api/pay-runs` | Create new pay run |
| POST | `/api/pay-runs/{id}/calculate` | Calculate payroll |
| POST | `/api/pay-runs/{id}/approve` | Approve pay run |
| POST | `/api/pay-runs/{id}/complete` | Mark pay run as complete |

### Payslip Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payslips/generate/{payRunId}` | Generate payslips for pay run |
| GET | `/api/payslips/employee/{employeeId}` | Get employee's payslips |
| GET | `/api/payslips/employee/{employeeId}/year/{year}` | Get payslips by year |
| GET | `/api/payslips/{id}/download` | Download payslip PDF |
| POST | `/api/payslips/{id}/send-email` | Send payslip via email |

### Required Headers

| Header | Description |
|--------|-------------|
| `X-Tenant-ID` | Organization/Tenant ID |
| `X-User-ID` | Current user ID (for approval tracking) |
| `X-Employee-ID` | Employee ID (for self-service endpoints) |
| `Authorization` | Bearer token for authentication |

---

## Troubleshooting

### Common Issues

#### 1. "No active employees found"
**Cause**: No employees with "Active" status in the organization
**Solution**: 
- Add employees via Employees → Add Employee
- Ensure employee status is set to "Active"

#### 2. "Pay run must be in DRAFT status to calculate"
**Cause**: Attempting to calculate a pay run that's already calculated
**Solution**: 
- For PENDING_APPROVAL status, use "Recalculate" if needed
- Create a new pay run if the current one is finalized

#### 3. "Failed to generate PDF"
**Cause**: PDF library issue or disk space
**Solution**:
- Check `./payslips/` directory exists and is writable
- Verify iText7 library is properly installed
- Check backend logs for detailed error

#### 4. "Email sending failed"
**Cause**: SMTP configuration issue
**Solution**:
- Verify email settings in `application.properties`
- Check if employee has a valid email address
- Ensure SMTP server allows sending

#### 5. Salary calculations seem incorrect
**Cause**: Missing or incorrect employee salary components
**Solution**:
- Verify employee's Annual CTC is set correctly
- Check Basic Salary, HRA, and allowances
- Confirm statutory settings (PF, ESI applicable flags)

---

## Best Practices

1. **Before Each Pay Run**:
   - Verify all employee data is up to date
   - Update attendance/leave records
   - Check for any new joiners or exits

2. **Review Before Approval**:
   - Cross-verify total amounts
   - Check individual employee calculations
   - Verify deduction amounts

3. **After Completion**:
   - Generate payslips promptly
   - Distribute payslips before pay date
   - Keep records for compliance

4. **Monthly Checklist**:
   - [ ] Employee data updated
   - [ ] Attendance recorded
   - [ ] LOP days marked
   - [ ] Pay run created
   - [ ] Calculations verified
   - [ ] Pay run approved
   - [ ] Payslips generated
   - [ ] Payslips distributed

---

## Database Schema

### pay_runs Table
```sql
- id: Primary key
- pay_run_number: Unique identifier (e.g., PR-2026-001)
- tenant_id: Organization ID
- pay_period_start: Start date of pay period
- pay_period_end: End date of pay period
- pay_date: Salary credit date
- status: DRAFT/CALCULATING/PENDING_APPROVAL/APPROVED/COMPLETED/CANCELLED
- total_gross_pay: Sum of all gross salaries
- total_deductions: Sum of all deductions
- total_net_pay: Sum of all net salaries
- employee_count: Number of employees included
```

### pay_run_employees Table
```sql
- id: Primary key
- pay_run_id: Foreign key to pay_runs
- employee_id: Foreign key to employees
- basic_salary, hra, conveyance_allowance, fixed_allowance
- gross_salary
- pf_employee, esi_employee, professional_tax, tds
- total_deductions
- net_salary
- payslip_generated: Boolean flag
```

### payslips Table
```sql
- id: Primary key
- payslip_number: Unique identifier
- pay_run_employee_id: Foreign key
- employee_id: Foreign key
- All salary components and deductions
- pdf_path: Path to generated PDF
- email_sent: Boolean flag
- status: GENERATED/SENT/VIEWED
```

---

## Support

For additional support or feature requests, please contact:
- **Technical Issues**: Check backend logs at `./logs/`
- **UI Issues**: Check browser console for errors
- **Data Issues**: Verify database records via admin tools

---

*Document Version: 1.0*
*Last Updated: January 2026*
