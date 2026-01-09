# Statutory Compliance Feature Guide

## Overview

The Statutory Compliance module provides comprehensive management of Indian statutory deductions including:
- **Provident Fund (PF/EPF)** - Employee & Employer contributions
- **ESI (Employee State Insurance)** - Health insurance scheme
- **Professional Tax (PT)** - State-wise tax slabs
- **TDS (Income Tax)** - Old & New tax regime calculations

---

## How to Access

Navigate to: **Settings → Statutory Compliance** or directly visit `/settings/statutory`

---

## Feature Tabs

### 1. Organization Settings Tab

This is the main configuration hub where you enable/disable statutory components for your organization.

**Toggle Controls:**
| Component | Description | Default |
|-----------|-------------|---------|
| Provident Fund (PF) | 12% Employee + 12% Employer | Enabled |
| ESI | 0.75% Employee + 3.25% Employer | Enabled |
| Professional Tax | State-wise PT slabs | Enabled |
| TDS (Income Tax) | Tax Deducted at Source | Enabled |

**TDS Deductor Details:**
- **TAN Number**: Your organization's Tax Deduction Account Number (e.g., ABCD12345E)
- **Deductor Name**: Legal name of your company
- **Deductor Category**: Company / Government / Individual / Firm

---

### 2. Provident Fund (PF/EPF) Tab

Configure PF contribution rates and establishment details.

#### Establishment Details
| Field | Description | Example |
|-------|-------------|---------|
| PF Establishment ID | EPFO registration number | TNCHE1234567000 |
| Establishment Name | Registered company name | ABC Tech Pvt Ltd |

#### Contribution Rates
| Component | Rate | Description |
|-----------|------|-------------|
| Employee Rate | 12% | Deducted from employee's basic salary |
| Employer Rate | 12% | Paid by employer (3.67% EPF + 8.33% EPS) |
| Admin Charges | 0.50% | Employer pays to EPFO |
| EDLI Rate | 0.50% | Employee Deposit Linked Insurance |

#### Wage Ceiling
- **Standard Ceiling**: ₹15,000
- PF is calculated on Basic Salary up to the ceiling
- Set to 0 for no ceiling (PF on full basic)

#### Key Notes:
- PF is mandatory for establishments with 20+ employees
- Employee can opt out if basic > ₹15,000 and joining after threshold
- Employer contribution split: 3.67% to EPF Account, 8.33% to EPS

---

### 3. ESI (Employee State Insurance) Tab

Configure ESI rates and wage ceiling.

#### ESI Applicability
ESI is applicable when employee's **gross monthly salary ≤ ₹21,000**

#### Contribution Rates
| Contributor | Rate | On Gross Salary |
|-------------|------|-----------------|
| Employee | 0.75% | Deducted from salary |
| Employer | 3.25% | Paid by employer |
| **Total** | **4.00%** | |

#### Configuration Fields
| Field | Description |
|-------|-------------|
| ESI Code | 17-digit ESI registration number |
| Employee Rate | Default 0.75% |
| Employer Rate | Default 3.25% |
| Wage Ceiling | ₹21,000 (employees above this are exempt) |

#### Key Notes:
- ESI provides medical, disability, maternity benefits
- Contribution periods: April-Sept, Oct-March
- Once enrolled, employee remains in ESI for full contribution period even if salary exceeds ceiling

---

### 4. Professional Tax (PT) Tab

View and configure state-wise Professional Tax slabs.

#### How to Use
1. Select your **Organization State** for default PT calculation
2. Use **View Slabs For** dropdown to see different state slabs

#### Pre-configured State Slabs

**Tamil Nadu:**
| Monthly Salary | PT Amount |
|----------------|-----------|
| Up to ₹3,500 | Nil |
| ₹3,501 - ₹5,000 | ₹22.50 |
| ₹5,001 - ₹10,000 | ₹52.50 |
| Above ₹10,000 | ₹208 |

**Karnataka:**
| Monthly Salary | PT Amount |
|----------------|-----------|
| Up to ₹15,000 | Nil |
| ₹15,001 - ₹25,000 | ₹150 |
| Above ₹25,000 | ₹200 |

**Maharashtra:**
| Monthly Salary | PT Amount |
|----------------|-----------|
| Up to ₹7,500 | Nil |
| ₹7,501 - ₹10,000 | ₹175 |
| Above ₹10,000 | ₹200 (₹300 in Feb) |

**Other States Supported:**
- Andhra Pradesh
- Telangana
- West Bengal
- Gujarat
- Kerala (No PT)

#### Initialize PT Slabs
If no slabs are loaded, click **"Initialize PT Slabs"** to load default slabs for all states.

---

### 5. TDS / Income Tax Tab

View tax regime information and employee tax declarations.

#### Tax Regimes Comparison

**Old Tax Regime:**
| Income Slab | Tax Rate |
|-------------|----------|
| Up to ₹2,50,000 | Nil |
| ₹2,50,001 - ₹5,00,000 | 5% |
| ₹5,00,001 - ₹10,00,000 | 20% |
| Above ₹10,00,000 | 30% |

**Benefits:** Standard Deduction ₹50,000 + Chapter VI-A deductions (80C, 80D, etc.)

**New Tax Regime (Default from FY 2023-24):**
| Income Slab | Tax Rate |
|-------------|----------|
| Up to ₹3,00,000 | Nil |
| ₹3,00,001 - ₹7,00,000 | 5% |
| ₹7,00,001 - ₹10,00,000 | 10% |
| ₹10,00,001 - ₹12,00,000 | 15% |
| ₹12,00,001 - ₹15,00,000 | 20% |
| Above ₹15,00,000 | 30% |

**Benefits:** Standard Deduction ₹75,000 (no other deductions)

#### Tax Declaration Status
| Status | Meaning |
|--------|---------|
| DRAFT | Employee is still filling the declaration |
| SUBMITTED | Employee has submitted for verification |
| VERIFIED | HR/Admin has verified the proofs |
| LOCKED | Declaration locked for the financial year |

#### Rebate Under Section 87A
- **Old Regime**: Full rebate if taxable income ≤ ₹5,00,000 (max ₹12,500)
- **New Regime**: Full rebate if taxable income ≤ ₹7,00,000 (max ₹25,000)

---

### 6. Employee Statutory Info Tab

Manage employee-level statutory details.

#### Fields Per Employee
| Field | Description |
|-------|-------------|
| UAN Number | 12-digit Universal Account Number for PF |
| PF Number | Member ID in PF (establishment-specific) |
| ESI Number | 17-digit ESI Insurance Number |
| Tax Regime | OLD or NEW |
| PF Applicable | Yes/No toggle |
| ESI Applicable | Yes/No (auto based on salary) |
| PT Applicable | Yes/No toggle |

#### Search & Filter
Use the search box to find employees by name or employee code.

---

## API Endpoints

### Statutory Settings
```
GET  /api/v1/statutory/settings          - Get org settings
POST /api/v1/statutory/settings          - Save org settings
```

### Employee Statutory Info
```
GET  /api/v1/statutory/employees         - List all employees
GET  /api/v1/statutory/employees/{id}    - Get employee info
POST /api/v1/statutory/employees/{id}    - Save employee info
```

### Professional Tax
```
GET  /api/v1/statutory/pt/slabs          - Get all PT slabs
GET  /api/v1/statutory/pt/slabs/{state}  - Get state PT slabs
GET  /api/v1/statutory/pt/states         - List available states
POST /api/v1/statutory/pt/initialize     - Initialize default slabs
```

### Tax Declarations
```
GET  /api/v1/statutory/tax-declarations                    - List all declarations
GET  /api/v1/statutory/tax-declarations/employee/{id}      - Get employee declaration
POST /api/v1/statutory/tax-declarations/employee/{id}      - Save declaration
POST /api/v1/statutory/tax-declarations/employee/{id}/submit - Submit for verification
```

### Tax Calculation
```
GET  /api/v1/statutory/tax-calculation/employee/{id}  - Calculate tax
GET  /api/v1/statutory/monthly-tds/employee/{id}      - Get monthly TDS
```

---

## Integration with Pay Run

When a pay run is calculated, the system automatically:

1. **PF Calculation**: 
   - Reads PF rates from statutory settings
   - Applies wage ceiling if configured
   - Calculates employee & employer contributions

2. **ESI Calculation**:
   - Checks if gross salary ≤ wage ceiling
   - Applies ESI rates if applicable

3. **PT Calculation**:
   - Identifies employee's state/work location
   - Looks up applicable PT slab
   - Deducts monthly PT amount

4. **TDS Calculation**:
   - Reads employee's tax regime preference
   - Applies tax declarations/investments
   - Calculates annual tax liability
   - Spreads across remaining months

---

## Best Practices

1. **Setup Order**:
   - First configure Organization Settings
   - Then set up PF/ESI establishment details
   - Initialize PT slabs
   - Finally update employee statutory info

2. **Employee Onboarding**:
   - Collect UAN (if existing) or generate new
   - Get ESI number or enroll if applicable
   - Confirm tax regime preference

3. **Monthly Compliance**:
   - Run pay run calculations
   - Generate PF ECR file (coming soon)
   - File ESI challan (coming soon)
   - Deposit TDS by 7th of following month

4. **Year-End Activities**:
   - Verify all tax declarations
   - Generate Form 16 (coming soon)
   - Reconcile PF/ESI contributions

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| PT not calculating | Check if PT is enabled and employee has work location set |
| ESI showing for high salary | ESI auto-disables above wage ceiling |
| PF amount seems high | Check if wage ceiling is set correctly |
| TDS not deducting | Ensure TDS is enabled and employee has tax declaration |

---

## Coming Soon

- ECR File Generation for PF
- ESI Challan Generation
- Form 16 Generation
- Form 12BB (Tax Declaration) PDF
- PT Return Filing
- TDS Return Filing (24Q)

---

*Last Updated: January 2026*
