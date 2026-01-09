# Phase 2 & Phase 3 Features Guide

## Overview

This document covers all features implemented in Phase 2 (Statutory Compliance) and Phase 3 (Employee Features) of the Payroll System.

---

## Phase 2: Statutory Compliance

### 1. Provident Fund (PF/EPF)

**Configuration:**
- Employee contribution: 12% of Basic
- Employer contribution: 12% of Basic
- Wage ceiling: ₹15,000/month

**Features:**
- PF establishment ID and name configuration
- Admin charges rate (0.5%)
- EDLI rate (0.5%)
- Option to include employer contribution in CTC

**API Endpoints:**
```
GET  /api/v1/statutory/settings
POST /api/v1/statutory/settings
```

### 2. ESI (Employee State Insurance)

**Configuration:**
- Employee contribution: 0.75%
- Employer contribution: 3.25%
- Wage ceiling: ₹21,000/month

**Features:**
- Automatic ESI calculation for eligible employees
- ESI code management
- Monthly ESI deduction in payroll

### 3. Professional Tax (PT)

**State-wise Slabs:**
- Tamil Nadu, Karnataka, Maharashtra, etc.
- Automatic slab initialization
- Monthly PT calculation based on gross salary

**API Endpoints:**
```
GET  /api/v1/statutory/pt/slabs
GET  /api/v1/statutory/pt/states
POST /api/v1/statutory/pt/initialize
GET  /api/v1/statutory/pt/calculate
```

### 4. TDS (Income Tax)

**Tax Regime Support:**
- Old Regime (with deductions)
- New Regime (lower rates, no deductions)

**Features:**
- Tax declaration management
- Monthly TDS calculation
- Standard deduction (₹50,000)
- HRA exemption calculation

**API Endpoints:**
```
GET  /api/v1/statutory/tax-declarations
POST /api/v1/statutory/tax-declarations
GET  /api/v1/statutory/calculate-tax/{employeeId}
```

---

## Phase 3: Employee Features

### 1. Investment Declarations (Form 12BB)

**Supported Sections:**

| Section | Description | Max Limit |
|---------|-------------|-----------|
| 80C | PPF, ELSS, LIC, NSC, FD, Tuition | ₹1,50,000 |
| 80CCD | NPS Contributions | ₹50,000 (1B) |
| 80D | Medical Insurance | ₹75,000 |
| 80E | Education Loan Interest | No Limit |
| 80G | Donations | 50-100% |
| 24 | Home Loan Interest | ₹2,00,000 |

**HRA Exemption:**
- Landlord name and PAN (mandatory if rent > ₹1,00,000/year)
- Metro/Non-metro city selection
- Automatic exemption calculation

**Workflow:**
1. Employee creates declaration (DRAFT)
2. Employee submits declaration (SUBMITTED)
3. HR/Admin approves/rejects (APPROVED/REJECTED)
4. Approved declarations used in TDS calculation

**API Endpoints:**
```
GET    /api/v1/investments
GET    /api/v1/investments/employee/{employeeId}
GET    /api/v1/investments/year/{year}
POST   /api/v1/investments
POST   /api/v1/investments/{id}/submit
POST   /api/v1/investments/{id}/approve
POST   /api/v1/investments/{id}/reject
```

### 2. Loans & Advances

**Loan Types:**
- Salary Advance
- Personal Loan
- Emergency Loan
- Vehicle Loan
- Home Loan

**Features:**
- EMI calculation (simple/compound interest)
- Automatic salary deduction
- Loan disbursement tracking
- Outstanding balance management

**Workflow:**
1. Employee applies for loan (PENDING)
2. Manager/HR approves (APPROVED)
3. Finance disburses (DISBURSED)
4. Monthly EMI deduction (ACTIVE)
5. Loan closure (CLOSED)

**EMI Formula:**
```
EMI = P × r × (1+r)^n / ((1+r)^n - 1)
Where:
  P = Principal Amount
  r = Monthly Interest Rate
  n = Number of Months
```

**API Endpoints:**
```
GET    /api/v1/loans
GET    /api/v1/loans/employee/{employeeId}
GET    /api/v1/loans/pending
GET    /api/v1/loans/active
POST   /api/v1/loans
POST   /api/v1/loans/{id}/approve
POST   /api/v1/loans/{id}/reject
POST   /api/v1/loans/{id}/disburse
POST   /api/v1/loans/{id}/emi-payment
GET    /api/v1/loans/employee/{employeeId}/monthly-emi
```

### 3. Reimbursements

**Expense Categories:**
- Travel
- Medical
- Food
- Communication
- Fuel
- Relocation
- Training
- Other

**Features:**
- Expense claim submission
- Bill/receipt attachment support
- Partial approval support
- Integration with payroll for payout

**Workflow:**
1. Employee submits claim (PENDING)
2. Manager reviews and approves (APPROVED/PARTIALLY_APPROVED)
3. Claim included in next payroll (PAID)

**API Endpoints:**
```
GET    /api/v1/reimbursements
GET    /api/v1/reimbursements/employee/{employeeId}
GET    /api/v1/reimbursements/pending
GET    /api/v1/reimbursements/approved-unpaid
POST   /api/v1/reimbursements
POST   /api/v1/reimbursements/{id}/approve
POST   /api/v1/reimbursements/{id}/reject
POST   /api/v1/reimbursements/mark-paid
```

---

## Frontend Navigation

| Feature | URL | Sidebar Location |
|---------|-----|------------------|
| Statutory Compliance | `/settings/statutory` | Management > Statutory |
| Employee Benefits | `/benefits` | Benefits > Employee Benefits |
| Settings | `/settings` | Management > Settings |

---

## Database Entities

### Phase 2 Entities:
- `statutory_settings` - Organization statutory configuration
- `employee_statutory_info` - Employee PF/ESI details
- `professional_tax_slabs` - State-wise PT slabs
- `tax_declarations` - Employee tax declarations

### Phase 3 Entities:
- `investment_declarations` - Form 12BB data
- `loans` - Loan applications and tracking
- `reimbursements` - Expense claims

---

## Integration with Payroll

During pay run calculation, the system automatically:

1. **Deducts PF** - 12% of Basic (employee share)
2. **Deducts ESI** - 0.75% if gross ≤ ₹21,000
3. **Deducts PT** - Based on state and gross salary
4. **Deducts TDS** - Based on tax regime and declarations
5. **Deducts Loan EMI** - Active loans with salary deduction enabled
6. **Adds Reimbursements** - Approved unpaid claims

---

## Best Practices

### For HR/Admin:
1. Configure statutory settings before running payroll
2. Review and approve investment declarations before tax calculation
3. Process loan applications promptly
4. Approve reimbursements before payroll cutoff

### For Employees:
1. Submit investment declarations at start of financial year
2. Update declarations when investments change
3. Keep receipts/proofs for all claimed investments
4. Submit reimbursement claims promptly with proper documentation

---

## Compliance Calendar

| Task | Frequency | Due Date |
|------|-----------|----------|
| PF Payment | Monthly | 15th of next month |
| ESI Payment | Monthly | 15th of next month |
| PT Payment | Monthly | As per state rules |
| TDS Payment | Monthly | 7th of next month |
| Form 16 | Annual | 15th June |
| PF Annual Return | Annual | 25th April |

---

## Support

For any issues or questions, contact the system administrator.
