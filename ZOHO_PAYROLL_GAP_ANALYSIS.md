# ZOHO PAYROLL REQUIREMENTS - GAP ANALYSIS

**Document Version:** 1.0  
**Date:** January 2026  
**Purpose:** Compare Zoho Payroll requirements against current application implementation to identify gaps, missing features, and incomplete functionality for further development.

---

## 📊 EXECUTIVE SUMMARY

| Category | Total Features | Implemented | Partial | Not Implemented |
|----------|---------------|-------------|---------|-----------------|
| Organization Setup | 15 | 8 | 4 | 3 |
| Employee Management | 25 | 12 | 8 | 5 |
| Salary Components | 18 | 10 | 5 | 3 |
| Statutory Components | 12 | 6 | 4 | 2 |
| Pay Runs & Processing | 20 | 8 | 7 | 5 |
| Leave & Attendance | 22 | 10 | 7 | 5 |
| Approvals & Workflows | 15 | 5 | 5 | 5 |
| Tax & Forms | 18 | 4 | 6 | 8 |
| Reports | 20 | 6 | 8 | 6 |
| Employee Portal | 12 | 3 | 4 | 5 |
| Templates & Customization | 15 | 4 | 5 | 6 |
| **TOTAL** | **192** | **76 (40%)** | **63 (33%)** | **53 (27%)** |

---

## 🔴 CRITICAL GAPS (HIGH PRIORITY)

### 1. Prior Payroll Import
**Zoho Requirement:**
- Import prior payroll data when starting mid-financial year
- YTD calculations for accurate tax deductions
- Step-by-step wizard for employee info, pay info, and summary

**Current Status:** ❌ NOT IMPLEMENTED

**Action Required:**
- Create Prior Payroll module in Settings
- Build import wizard with CSV/XLS support
- Implement YTD value calculations
- Store prior payroll history

---

### 2. Investment Declaration & Proof of Investment (POI)
**Zoho Requirement:**
- Employees can submit IT declarations via portal
- Section 80C, 80D, HRA exemptions, etc.
- POI submission with document uploads
- Admin approval workflow for POI
- Automatic TDS adjustment based on declarations

**Current Status:** ⚠️ PARTIAL (Entity exists but workflow incomplete)
- `InvestmentDeclaration.java` entity exists
- `TaxDeclaration.java` entity exists
- Frontend form partially implemented

**Missing:**
- POI document upload functionality
- Multi-step approval workflow
- Auto TDS recalculation after POI approval
- Investment category configuration
- Declaration lock dates

---

### 3. Form 16 Generation & Distribution
**Zoho Requirement:**
- Upload Part A from TRACES
- Auto-generate Part B from payroll data
- Digital signature integration
- Publish to employee portal
- Email distribution

**Current Status:** ⚠️ PARTIAL
- `Form16Controller.java` exists
- Basic structure in place

**Missing:**
- TRACES Part A upload functionality
- Part B auto-generation with salary breakdown
- Digital signature tool/integration
- Batch processing for multiple employees
- Form 16 template customization

---

### 4. TDS Liabilities & Challans
**Zoho Requirement:**
- View TDS liabilities by employee
- Record challans with BSR code, date, amount
- Associate employees to challans
- Generate Form 24Q text file
- Track payment status

**Current Status:** ❌ NOT IMPLEMENTED

**Action Required:**
- Create TDS Liabilities module
- Implement Challan recording
- Build Form 24Q generation
- Employee-Challan association

---

### 5. Salary Revision with Arrears
**Zoho Requirement:**
- Revise salary with effective date
- Auto-calculate arrears if effective date is past
- Payout month selection
- Approval workflow for revisions
- Salary revision letters

**Current Status:** ⚠️ PARTIAL
- Basic salary editing exists
- No arrears calculation
- No approval workflow

**Missing:**
- Arrears calculation engine
- Revision approval workflow
- Salary revision letter templates
- Payout month management

---

## 🟡 WORKFLOW MISMATCHES

### 1. Pay Run Workflow
**Zoho Workflow:**
```
Create Draft → Add Inputs → Submit for Approval → Approve/Reject → 
Record Payment → Generate Bank Advice → Send Payslips
```

**Current Workflow:**
```
Create Pay Run → Process → Download Payslips
```

**Gaps:**
- ❌ Missing multi-level approval workflow
- ❌ No "Submit for Approval" step
- ❌ No bank advice generation
- ⚠️ Selective payment not implemented
- ❌ Missing journal entry posting to accounting

---

### 2. Employee Onboarding Workflow
**Zoho Workflow:**
```
Basic Details → Salary Details → Personal Info → Payment Info → 
Portal Access → Statutory Setup → Complete
```

**Current Workflow:**
```
Multi-step form exists but...
```

**Gaps:**
- ⚠️ Portal access toggle not fully functional
- ❌ No invite email to employee portal
- ❌ Missing profile completeness tracking on dashboard
- ⚠️ Statutory component assignment incomplete

---

### 3. Leave Request Workflow
**Zoho Workflow:**
```
Employee Applies → Manager/Reporting To Receives → 
Approve/Reject → Balance Updated → Payroll Integration
```

**Current Workflow:**
```
Leave application exists but approval chain incomplete
```

**Gaps:**
- ⚠️ Reporting manager assignment exists but approval flow weak
- ❌ No leave balance carry forward/encashment
- ❌ Missing leave calendar view
- ❌ No LOP auto-deduction in payroll

---

### 4. Reimbursement Claim Workflow
**Zoho Workflow:**
```
Employee Submits Claim → Upload Bills → Admin Reviews → 
Approve with Amount → Process in Next Payroll
```

**Current Status:** ⚠️ PARTIAL
- `Reimbursement.java` entity exists
- `ReimbursementController.java` exists

**Gaps:**
- ❌ No bill upload functionality
- ❌ Approval workflow not complete
- ❌ Not integrated with payroll processing

---

## 🟠 PARTIALLY IMPLEMENTED FEATURES

### 1. Salary Components
**Implemented:**
- ✅ Earnings (Basic, HRA, DA, Allowances)
- ✅ Deductions (post-tax)
- ✅ Component CRUD operations
- ✅ EPF/ESI consideration flags

**Missing:**
- ❌ Custom formula support (day/hour/unit based)
- ❌ Scheduled earnings (one-time payments)
- ❌ Variable pay components
- ❌ Correction components for adjustments
- ❌ Benefits (pre-tax deductions like NPS, VPF)
- ❌ FBP (Flexible Benefit Plan) components

---

### 2. Statutory Components
**Implemented:**
- ✅ EPF configuration
- ✅ ESI configuration
- ✅ Professional Tax slabs
- ✅ Employee statutory info storage

**Missing:**
- ❌ Labour Welfare Fund (LWF)
- ❌ Statutory Bonus configuration
- ❌ Gratuity calculation
- ❌ EPF/ESI override at employee level
- ❌ Employer contribution display in salary structure
- ❌ Admin charges configuration

---

### 3. Pay Schedule
**Implemented:**
- ✅ Work week configuration
- ✅ Pay frequency settings
- ✅ First pay period

**Missing:**
- ❌ Salary calculation method (actual days vs fixed days)
- ❌ Pay day configuration (last day, specific date)
- ❌ Pay period reminders

---

### 4. Leave Management
**Implemented:**
- ✅ Leave types (Casual, Sick, Earned)
- ✅ Leave balance tracking
- ✅ Leave request submission
- ✅ Basic approval

**Missing:**
- ❌ Leave type configuration (paid/unpaid, accrual rules)
- ❌ Pro-rata leave for new joiners
- ❌ Leave carry forward settings
- ❌ Leave encashment settings
- ❌ Negative leave balance handling
- ❌ Leave balance reset rules
- ❌ Criteria-based leave applicability

---

### 5. Attendance Management
**Implemented:**
- ✅ Basic attendance tracking
- ✅ Check-in/check-out
- ✅ Holiday management

**Missing:**
- ❌ Shift configuration
- ❌ Attendance regularization
- ❌ Working hours calculation methods
- ❌ Half-day/Full-day duration settings
- ❌ Attendance cycle configuration
- ❌ Payroll report generation day

---

## 🔵 NOT IMPLEMENTED FEATURES

### 1. Custom Approvals
**Zoho Features:**
- Simple approval (single approver)
- Multi-level approval (hierarchical)
- Custom approval (criteria-based)
- Auto-approve/reject rules

**Status:** ❌ NOT IMPLEMENTED

---

### 2. Departments & Designations
**Zoho Features:**
- Department creation with codes
- Designation management
- Import/export departments
- Department-wise reporting

**Status:** ⚠️ Basic department exists in employee but no dedicated module

**Missing:**
- Dedicated Departments page in Settings
- Designations management
- Import functionality
- Department codes

---

### 3. Users & Roles
**Zoho Features:**
- Invite users via email
- Role creation with granular permissions
- Module-level access control
- Mark user as inactive

**Status:** ⚠️ PARTIAL
- Basic auth exists
- Role concept exists

**Missing:**
- User invitation workflow
- Granular permission configuration
- Role CRUD UI
- Permission matrix for modules

---

### 4. Reporting Tags
**Zoho Features:**
- Create custom tags
- Associate tags with employees
- Filter reports by tags
- Import tags with employees

**Status:** ❌ NOT IMPLEMENTED

---

### 5. Custom Links & Buttons
**Zoho Features:**
- Add custom links to external resources
- Create custom buttons with Deluge scripts
- Placeholders for dynamic data

**Status:** ❌ NOT IMPLEMENTED

---

### 6. Salary Templates
**Zoho Features:**
- Create salary structure templates
- Quick assignment to employees
- Template-based onboarding

**Status:** ❌ NOT IMPLEMENTED
- No template management
- No template assignment during employee creation

---

### 7. Email Templates
**Zoho Features:**
- Customizable email templates
- User invite template
- Payslip notification template
- Employee invitation template
- Final settlement template
- Placeholders support

**Status:** ❌ NOT IMPLEMENTED

---

### 8. Payslip Templates
**Zoho Features:**
- Multiple template designs (Standard, Mini, Professional)
- Custom fields inclusion
- Logo placement
- YTD display option
- Final settlement template

**Status:** ⚠️ PARTIAL
- Basic payslip generation exists

**Missing:**
- Template designer
- Multiple template options
- Customization options
- Final settlement template

---

### 9. Letter Templates
**Zoho Features:**
- Salary certificate template
- Salary revision letter template
- Customizable headers/footers
- Digital signature placement

**Status:** ❌ NOT IMPLEMENTED

---

### 10. Web Tabs in Portal
**Zoho Features:**
- Embed external URLs in employee portal
- Company handbook links
- Learning platform access

**Status:** ❌ NOT IMPLEMENTED

---

### 11. Employee Exit & Rehire
**Zoho Features:**
- Exit process initiation
- Final settlement payroll
- Full & final calculation
- Notice pay handling
- Gratuity calculation
- Rehire with data retention

**Status:** ⚠️ PARTIAL
- Basic employee status change possible

**Missing:**
- Dedicated exit wizard
- Final settlement payroll
- F&F calculation engine
- Notice pay configuration
- Rehire functionality

---

### 12. Off-Cycle & One-Time Payouts
**Zoho Features:**
- One-time payout for bonuses
- Off-cycle payroll for special cases
- Resettlement payroll for terminated employees

**Status:** ❌ NOT IMPLEMENTED

---

### 13. Salary Withhold & Release
**Zoho Features:**
- Withhold salary during notice period
- Release withheld salary in future payroll
- Track withheld amounts

**Status:** ❌ NOT IMPLEMENTED

---

### 14. Vehicle Perquisite
**Zoho Features:**
- Company car perquisite calculation
- Engine capacity based rates
- Driver allowance handling

**Status:** ❌ NOT IMPLEMENTED

---

### 15. Custom Views for Employees
**Zoho Features:**
- Create custom filters
- Save views with criteria
- Share views with users/roles
- Column selection

**Status:** ⚠️ PARTIAL (UI exists but backend incomplete)

---

### 16. Bank Advice & Direct Deposit
**Zoho Features:**
- Generate bank advice file
- Direct deposit integration
- Multiple payment modes per employee
- Selective payment

**Status:** ⚠️ PARTIAL
- `BankFileController.java` exists

**Missing:**
- Bank-specific file formats
- Direct deposit integration
- Selective payment processing

---

### 17. Reports
**Zoho Requirement Reports:**
- Payroll Summary
- Salary Register
- Employee Pay Summary
- EPF Summary / ECR Report
- ESI Summary / ESIC Return
- PT Summary
- TDS Summary
- Reimbursement Summary
- Leave Encashment Summary
- LOP Summary
- Employee CTC Summary
- Form 24Q Reports
- Bank Transfer Report

**Status:** ⚠️ PARTIAL
- `ReportController.java` exists with basic reports

**Missing Reports:**
- ECR format export
- ESIC return format
- Detailed statutory reports
- YTD reports
- Comparative reports

---

## 📋 IMPLEMENTATION PRIORITY MATRIX

### Phase 1: Critical (Immediate)
| Feature | Effort | Impact | Priority |
|---------|--------|--------|----------|
| Prior Payroll Import | High | Critical | P1 |
| TDS Liabilities & Challans | High | Critical | P1 |
| Form 24Q Generation | High | Critical | P1 |
| Form 16 Complete Flow | High | Critical | P1 |
| Investment Declaration Complete | Medium | High | P1 |

### Phase 2: High Priority (Next Sprint)
| Feature | Effort | Impact | Priority |
|---------|--------|--------|----------|
| Salary Revision with Arrears | Medium | High | P2 |
| Multi-level Approval Workflow | High | High | P2 |
| Leave Type Configuration | Medium | High | P2 |
| Departments & Designations Module | Low | Medium | P2 |
| Email Templates | Medium | Medium | P2 |

### Phase 3: Medium Priority (Future Sprints)
| Feature | Effort | Impact | Priority |
|---------|--------|--------|----------|
| Salary Templates | Medium | Medium | P3 |
| Payslip Templates | Medium | Medium | P3 |
| Employee Exit & F&F | High | Medium | P3 |
| Off-Cycle Payroll | Medium | Medium | P3 |
| Custom Views (Backend) | Medium | Low | P3 |

### Phase 4: Low Priority (Enhancements)
| Feature | Effort | Impact | Priority |
|---------|--------|--------|----------|
| Reporting Tags | Low | Low | P4 |
| Custom Links/Buttons | Low | Low | P4 |
| Web Tabs in Portal | Low | Low | P4 |
| Vehicle Perquisite | Low | Low | P4 |
| Letter Templates | Medium | Low | P4 |

---

## 🛠️ TECHNICAL DEBT & IMPROVEMENTS

### Backend Improvements Needed
1. **Approval Engine** - Build generic approval workflow engine
2. **Calculation Engine** - Centralized salary/tax calculation service
3. **Template Engine** - For payslips, letters, emails
4. **File Generation** - For bank files, statutory files
5. **Audit Trail** - Complete activity logging
6. **Bulk Operations** - Import/export for all entities

### Frontend Improvements Needed
1. **Modal System** - Reusable modal components
2. **Form Wizards** - Multi-step form pattern
3. **Table/Grid** - Advanced filtering, sorting, export
4. **Document Viewer** - For uploaded documents
5. **Rich Text Editor** - For template editing
6. **PDF Generator** - Client-side PDF preview

### Database Changes Required
1. Add tables for:
   - `prior_payroll`
   - `tds_liabilities`
   - `challans`
   - `salary_templates`
   - `email_templates`
   - `payslip_templates`
   - `letter_templates`
   - `custom_views`
   - `reporting_tags`
   - `approval_workflows`
   - `approval_levels`
   - `approval_history`

---

## 📈 RECOMMENDED DEVELOPMENT ROADMAP

### Sprint N (Current): Foundation Fixes
- Fix employee listing issue
- Complete profile completeness feature
- Stabilize existing functionality

### Sprint N+1: Statutory Compliance
- Prior Payroll Import
- TDS Liabilities module
- Challan recording
- Form 24Q generation

### Sprint N+2: Tax & Forms
- Complete Investment Declaration flow
- POI approval workflow
- Form 16 complete implementation
- TDS calculation refinements

### Sprint N+3: Payroll Enhancements
- Multi-level approval workflow
- Salary revision with arrears
- Off-cycle payroll
- Salary templates

### Sprint N+4: Employee Management
- Departments & Designations
- Employee exit process
- Final settlement
- Rehire functionality

### Sprint N+5: Leave & Attendance
- Advanced leave configuration
- Attendance regularization
- Shift management
- Leave encashment

### Sprint N+6: Templates & Reports
- Email templates
- Payslip templates
- Letter templates
- Advanced reports

---

## 📝 NOTES

### API Endpoints to Add
```
POST   /api/v1/prior-payroll/import
GET    /api/v1/tds-liabilities
POST   /api/v1/challans
GET    /api/v1/form-24q/generate/{quarter}
POST   /api/v1/form-16/upload-part-a
GET    /api/v1/form-16/generate/{employeeId}
POST   /api/v1/salary-revisions
GET    /api/v1/salary-revisions/pending-approval
POST   /api/v1/approvals/{type}/{id}/approve
POST   /api/v1/approvals/{type}/{id}/reject
GET    /api/v1/departments
POST   /api/v1/departments
GET    /api/v1/designations
POST   /api/v1/designations
GET    /api/v1/salary-templates
POST   /api/v1/salary-templates
POST   /api/v1/employees/{id}/exit
POST   /api/v1/employees/{id}/rehire
GET    /api/v1/payroll/off-cycle
POST   /api/v1/payroll/off-cycle
```

### Configuration Tables Needed
- Approval workflow configuration
- Leave type policies
- Attendance policies
- Tax regime settings (Old vs New)
- Statutory contribution rates
- Email notification settings

---

## ✅ CONCLUSION

The current application has a solid foundation with approximately **40% of Zoho Payroll features implemented**. The critical gaps are in:

1. **Statutory Compliance** - Form 24Q, TDS Liabilities, Challans
2. **Tax Management** - Complete IT declaration, POI, Form 16
3. **Approval Workflows** - Multi-level approvals for pay runs, salary revisions
4. **Advanced Payroll** - Prior payroll, arrears, off-cycle payouts

Immediate focus should be on statutory compliance features as they are legally required for Indian payroll processing.

---

**Document Prepared By:** Development Team  
**Review Status:** Pending  
**Next Review Date:** [To be scheduled]
