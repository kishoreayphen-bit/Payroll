# EPIC 04: PAYROLL CONFIGURATION

**Module:** Payroll Configuration  
**Priority:** HIGH  
**Sprint:** Sprint 3-5  
**Estimated Effort:** 45 Story Points  

---

## Epic Overview

Configure all aspects of payroll processing including salary components, salary grades, salary structure templates, and allowances to support flexible payroll calculations.

**Business Value:**
- Flexible salary structure configuration
- Component-based salary calculations
- Grade-based salary management
- Automated salary revisions
- Standardized salary templates

**Acceptance Criteria:**
- Salary components can be created and configured
- Salary grades define pay bands
- Salary structure templates can be created and assigned
- Salary revisions track increment history
- Allowances can be configured and managed

---

## User Stories

### Story 4.1: Salary Component Configuration

**As a** HR Manager  
**I want to** configure salary components  
**So that** payroll calculations include all earnings and deductions

**Priority:** HIGH  
**Story Points:** 8  
**Sprint:** Sprint 3  

#### Acceptance Criteria
- [ ] Create/edit/delete salary components
- [ ] Component types: Earning and Deduction
- [ ] Calculation methods: Fixed Amount or Percentage
- [ ] Statutory components marked separately (PF, ESI, TDS)
- [ ] Component ordering for payslip display
- [ ] Components can be active/inactive

#### UI Form Fields

**Salary Component Form:**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Component Code | Text | Yes | Uppercase, unique, max 20 | "BASIC" |
| Component Name | Text | Yes | Min 3, Max 100 | "Basic Salary" |
| Component Type | Dropdown | Yes | Earning, Deduction | Select type |
| Calculation Method | Dropdown | Yes | Fixed Amount, Percentage of CTC, Percentage of Basic, Percentage of Gross | Select method |
| Default Value/Percentage | Number | No | 0-100 for %, positive for amount | "40" |
| Is Statutory | Checkbox | No | Boolean | Unchecked |
| Statutory Type | Dropdown | Conditional | PF, ESI, TDS, PT, LWF, None | Select if statutory |
| Is Taxable | Checkbox | Yes | Boolean | Checked |
| Is Part of Gross | Checkbox | Yes | Boolean | Checked |
| Is Part of CTC | Checkbox | Yes | Boolean | Checked |
| Display Order | Number | Yes | 1-100 | "1" |
| Appears on Payslip | Checkbox | Yes | Boolean | Checked |
| Description | Textarea | No | Max 500 | Component description |
| Status | Toggle | Yes | Active/Inactive | Active |

**Common Salary Components:**

**Earnings:**
1. Basic Salary (40% of CTC)
2. House Rent Allowance (HRA) (50% of Basic)
3. Dearness Allowance (DA)
4. Conveyance Allowance
5. Medical Allowance
6. Special Allowance
7. Performance Bonus
8. Overtime Pay

**Deductions:**
1. Provident Fund (PF) - 12% of Basic (Statutory)
2. Employee State Insurance (ESI) - 0.75% of Gross (Statutory)
3. Professional Tax (PT) - Statutory
4. Tax Deducted at Source (TDS) - Statutory
5. Loan Deduction
6. Advance Deduction
7. Loss of Pay (LOP)

**Database Schema:**
```sql
CREATE TABLE salary_components (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    organization_id BIGINT NOT NULL REFERENCES organizations(id),
    
    component_code VARCHAR(20) NOT NULL,
    component_name VARCHAR(100) NOT NULL,
    component_type VARCHAR(20) NOT NULL,
    calculation_method VARCHAR(50) NOT NULL,
    default_value DECIMAL(10,2),
    default_percentage DECIMAL(5,2),
    
    is_statutory BOOLEAN DEFAULT FALSE,
    statutory_type VARCHAR(20),
    is_taxable BOOLEAN DEFAULT TRUE,
    is_part_of_gross BOOLEAN DEFAULT TRUE,
    is_part_of_ctc BOOLEAN DEFAULT TRUE,
    
    display_order INTEGER DEFAULT 1,
    appears_on_payslip BOOLEAN DEFAULT TRUE,
    description TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT unique_component_code_per_org UNIQUE(organization_id, component_code),
    CONSTRAINT check_component_type CHECK (component_type IN ('EARNING', 'DEDUCTION')),
    CONSTRAINT check_calculation_method CHECK (calculation_method IN (
        'FIXED_AMOUNT', 'PERCENTAGE_OF_CTC', 'PERCENTAGE_OF_BASIC', 
        'PERCENTAGE_OF_GROSS', 'PERCENTAGE_OF_NET'
    ))
);

CREATE INDEX idx_salary_components_org ON salary_components(organization_id);
CREATE INDEX idx_salary_components_type ON salary_components(component_type);
CREATE INDEX idx_salary_components_status ON salary_components(status);
```

**API Endpoints:**
```
POST   /api/v1/salary/components          # Create component
GET    /api/v1/salary/components          # List all components
GET    /api/v1/salary/components/{id}     # Get component details
PUT    /api/v1/salary/components/{id}     # Update component
DELETE /api/v1/salary/components/{id}     # Delete component
```

---

### Story 4.2: Salary Grades Configuration

**As a** HR Manager  
**I want to** define salary grades and bands  
**So that** employees are assigned appropriate salary ranges

**Priority:** HIGH  
**Story Points:** 5  
**Sprint:** Sprint 3  

#### Acceptance Criteria
- [ ] Create salary grades (Grade 1, Grade 2, etc.)
- [ ] Define min-max salary range per grade
- [ ] Set annual increment percentage
- [ ] Grade progression rules
- [ ] Map grades to job levels

#### UI Form Fields

**Salary Grade Form:**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Grade Code | Text | Yes | Unique, max 10 | "G1" |
| Grade Name | Text | Yes | Min 2, Max 50 | "Grade 1" |
| Grade Level | Number | Yes | 1-20, unique | "1" |
| Minimum Salary | Number | Yes | Positive, < max salary | "30000" |
| Maximum Salary | Number | Yes | > min salary | "50000" |
| Currency | Dropdown | Yes | USD, INR, etc. | "USD" |
| Annual Increment (%) | Number | No | 0-100 | "10" |
| Description | Textarea | No | Max 500 | Grade description |
| Status | Toggle | Yes | Active/Inactive | Active |

**Salary Grade Examples:**

| Grade | Level | Min Salary | Max Salary | Roles |
|-------|-------|------------|------------|-------|
| G1 | 1 | $30,000 | $50,000 | Junior roles |
| G2 | 2 | $48,000 | $75,000 | Mid-level roles |
| G3 | 3 | $70,000 | $110,000 | Senior roles |
| G4 | 4 | $100,000 | $150,000 | Lead roles |
| G5 | 5 | $140,000 | $200,000 | Manager roles |

**Database Schema:**
```sql
CREATE TABLE salary_grades (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    organization_id BIGINT NOT NULL REFERENCES organizations(id),
    
    grade_code VARCHAR(10) NOT NULL,
    grade_name VARCHAR(50) NOT NULL,
    grade_level INTEGER NOT NULL,
    
    minimum_salary DECIMAL(15,2) NOT NULL,
    maximum_salary DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    annual_increment_percentage DECIMAL(5,2),
    description TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT unique_grade_code_per_org UNIQUE(organization_id, grade_code),
    CONSTRAINT unique_grade_level_per_org UNIQUE(organization_id, grade_level),
    CONSTRAINT check_salary_range CHECK (maximum_salary > minimum_salary)
);

CREATE INDEX idx_salary_grades_org ON salary_grades(organization_id);
CREATE INDEX idx_salary_grades_level ON salary_grades(grade_level);
```

---

### Story 4.3: Salary Structure Templates

**As a** HR Manager  
**I want to** create salary structure templates  
**So that** consistent salary breakdowns can be applied to employees

**Priority:** HIGH  
**Story Points:** 13  
**Sprint:** Sprint 4  

#### Acceptance Criteria
- [ ] Create salary structure templates
- [ ] Add components with percentages/amounts
- [ ] Preview CTC calculation
- [ ] Clone existing templates
- [ ] Assign templates to grades
- [ ] Template versioning

#### UI Form Fields

**Salary Structure Template Form:**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Template Name | Text | Yes | Min 3, Max 100 | "Standard Template - Grade 1" |
| Template Code | Text | Yes | Uppercase, unique, max 20 | "STD_G1" |
| Salary Grade | Dropdown | No | Select grade | Select grade |
| Effective From | Date | Yes | Valid date | "MM/DD/YYYY" |
| Effective To | Date | No | After effective from | "MM/DD/YYYY" |
| Is Default | Checkbox | No | Boolean | Unchecked |
| Description | Textarea | No | Max 500 | Template description |

**Component Breakup Table:**

| Component | Type | Calc Method | Value/% | Amount (for ₹50,000 CTC) |
|-----------|------|-------------|---------|--------------------------|
| Basic Salary | Earning | % of CTC | 40% | ₹20,000 |
| HRA | Earning | % of Basic | 50% | ₹10,000 |
| Conveyance | Earning | Fixed | - | ₹1,600 |
| Medical | Earning | Fixed | - | ₹1,250 |
| Special Allowance | Earning | Balancing | - | ₹14,750 |
| **Gross Salary** | | | | **₹47,600** |
| PF (Employee) | Deduction | % of Basic | 12% | ₹2,400 |
| ESI | Deduction | % of Gross | 0.75% | ₹357 |
| Professional Tax | Deduction | Fixed | - | ₹200 |
| **Total Deductions** | | | | **₹2,957** |
| **Net Salary** | | | | **₹44,643** |

**Database Schema:**
```sql
CREATE TABLE salary_structure_templates (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    organization_id BIGINT NOT NULL REFERENCES organizations(id),
    
    template_name VARCHAR(100) NOT NULL,
    template_code VARCHAR(20) NOT NULL,
    salary_grade_id BIGINT REFERENCES salary_grades(id),
    
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_default BOOLEAN DEFAULT FALSE,
    description TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    
    version INTEGER DEFAULT 1,
    parent_template_id BIGINT REFERENCES salary_structure_templates(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT unique_template_code_per_org UNIQUE(organization_id, template_code)
);

CREATE TABLE salary_structure_components (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL REFERENCES salary_structure_templates(id),
    component_id BIGINT NOT NULL REFERENCES salary_components(id),
    
    calculation_method VARCHAR(50) NOT NULL,
    fixed_amount DECIMAL(15,2),
    percentage DECIMAL(5,2),
    is_variable BOOLEAN DEFAULT FALSE,
    
    display_order INTEGER DEFAULT 1,
    
    CONSTRAINT unique_template_component UNIQUE(template_id, component_id)
);

CREATE INDEX idx_structure_templates_org ON salary_structure_templates(organization_id);
CREATE INDEX idx_structure_templates_grade ON salary_structure_templates(salary_grade_id);
CREATE INDEX idx_structure_components_template ON salary_structure_components(template_id);
```

**CTC Calculator Component (React):**
```tsx
interface CTCCalculatorProps {
  templateId: number;
  annualCTC: number;
}

const CTCCalculator: React.FC<CTCCalculatorProps> = ({ templateId, annualCTC }) => {
  const monthlyCTC = annualCTC / 12;
  const [breakdown, setBreakdown] = useState<SalaryBreakdown[]>([]);
  
  // Calculate component-wise breakdown
  const calculateBreakdown = () => {
    // Fetch template components
    // Calculate each component based on method
    // Return breakdown
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>CTC Breakdown Preview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Annual CTC: {formatCurrency(annualCTC)} | 
          Monthly: {formatCurrency(monthlyCTC)}
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Monthly Amount</TableHead>
              <TableHead className="text-right">Annual Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breakdown.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.componentName}</TableCell>
                <TableCell>
                  <Badge variant={item.type === 'EARNING' ? 'success' : 'destructive'}>
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.monthlyAmount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.annualAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
```

---

### Story 4.4: Assign Salary to Employees

**As a** HR Manager  
**I want to** assign salary structure to employees  
**So that** payroll can be processed

**Priority:** HIGH  
**Story Points:** 8  
**Sprint:** Sprint 4  

#### Acceptance Criteria
- [ ] Select employee and assign CTC
- [ ] Choose salary structure template
- [ ] Customize component values if needed
- [ ] Set effective date
- [ ] Preview salary breakdown
- [ ] Save as draft option

#### UI Form Fields

**Salary Assignment Form:**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Employee | Searchable Dropdown | Yes | Select employee | Search employee |
| Salary Grade | Dropdown | No | Auto-filled from employee | Select grade |
| Structure Template | Dropdown | Yes | Select template | Select template |
| Annual CTC | Number | Yes | Positive, within grade range | "600000" |
| Effective From | Date | Yes | Cannot be past | "MM/DD/YYYY" |
| Payment Frequency | Dropdown | Yes | Monthly, Semi-monthly | "Monthly" |
| Bank Account | Dropdown | Yes | Employee's bank accounts | Select account |
| Comments | Textarea | No | Max 500 | Additional notes |

**Component Customization:**
- Allow editing individual component amounts
- Recalculate totals automatically
- Show warnings if outside template defaults

**Database Schema:**
```sql
CREATE TABLE employee_salaries (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    employee_id BIGINT NOT NULL REFERENCES employees(id),
    
    salary_grade_id BIGINT REFERENCES salary_grades(id),
    template_id BIGINT REFERENCES salary_structure_templates(id),
    
    annual_ctc DECIMAL(15,2) NOT NULL,
    monthly_ctc DECIMAL(15,2) NOT NULL,
    gross_salary DECIMAL(15,2) NOT NULL,
    net_salary DECIMAL(15,2) NOT NULL,
    
    effective_from DATE NOT NULL,
    effective_to DATE,
    payment_frequency VARCHAR(20) DEFAULT 'MONTHLY',
    bank_account_id BIGINT REFERENCES employee_bank_accounts(id),
    
    is_active BOOLEAN DEFAULT TRUE,
    comments TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

CREATE TABLE employee_salary_components (
    id BIGSERIAL PRIMARY KEY,
    employee_salary_id BIGINT NOT NULL REFERENCES employee_salaries(id),
    component_id BIGINT NOT NULL REFERENCES salary_components(id),
    
    monthly_amount DECIMAL(15,2) NOT NULL,
    annual_amount DECIMAL(15,2) NOT NULL,
    calculation_method VARCHAR(50),
    
    is_custom BOOLEAN DEFAULT FALSE,
    
    CONSTRAINT unique_employee_salary_component UNIQUE(employee_salary_id, component_id)
);

CREATE INDEX idx_employee_salaries_employee ON employee_salaries(employee_id);
CREATE INDEX idx_employee_salaries_active ON employee_salaries(is_active);
CREATE INDEX idx_employee_salary_components_salary ON employee_salary_components(employee_salary_id);
```

---

### Story 4.5: Salary Revisions & Increments

**As a** HR Manager  
**I want to** manage salary revisions  
**So that** increments and promotions are tracked

**Priority:** MEDIUM  
**Story Points:** 8  
**Sprint:** Sprint 5  

#### Acceptance Criteria
- [ ] Create salary revision request
- [ ] Revision types: Increment, Promotion, Adjustment
- [ ] Calculate percentage increase
- [ ] Multi-level approval workflow
- [ ] Revision history tracking
- [ ] Bulk revisions support

#### UI Form Fields

**Salary Revision Form:**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Employee | Searchable Dropdown | Yes | Select employee | Search employee |
| Revision Type | Dropdown | Yes | Annual Increment, Promotion, Adjustment, Market Correction | Select type |
| Current CTC | Number | No | Auto-filled, readonly | "600000" (readonly) |
| Revised CTC | Number | Yes | Must be > current CTC | "660000" |
| Increment Amount | Number | No | Auto-calculated | "60000" (readonly) |
| Increment (%) | Number | No | Auto-calculated | "10%" (readonly) |
| New Grade | Dropdown | Conditional | Required if promotion | Select grade |
| New Designation | Text | Conditional | Required if promotion | "Senior Engineer" |
| Effective Date | Date | Yes | Future date preferred | "MM/DD/YYYY" |
| Reason | Textarea | Yes | Min 10, Max 1000 | Reason for revision |
| Attach Document | File Upload | No | PDF, Max 5MB | Upload document |

**Approval Workflow:**
1. HR Manager initiates
2. Reporting Manager approves
3. Department Head approves
4. Finance Manager approves
5. Management approves (for amounts > threshold)

**Database Schema:**
```sql
CREATE TABLE salary_revisions (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    employee_id BIGINT NOT NULL REFERENCES employees(id),
    
    revision_type VARCHAR(30) NOT NULL,
    current_salary_id BIGINT REFERENCES employee_salaries(id),
    
    current_ctc DECIMAL(15,2) NOT NULL,
    revised_ctc DECIMAL(15,2) NOT NULL,
    increment_amount DECIMAL(15,2) NOT NULL,
    increment_percentage DECIMAL(5,2) NOT NULL,
    
    new_grade_id BIGINT REFERENCES salary_grades(id),
    new_designation VARCHAR(100),
    effective_date DATE NOT NULL,
    
    reason TEXT NOT NULL,
    document_url VARCHAR(500),
    
    status VARCHAR(20) DEFAULT 'PENDING',
    approval_level INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT check_revision_type CHECK (revision_type IN (
        'ANNUAL_INCREMENT', 'PROMOTION', 'ADJUSTMENT', 'MARKET_CORRECTION'
    )),
    CONSTRAINT check_revision_status CHECK (status IN (
        'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'
    ))
);

CREATE TABLE salary_revision_approvals (
    id BIGSERIAL PRIMARY KEY,
    revision_id BIGINT NOT NULL REFERENCES salary_revisions(id),
    approver_id BIGINT NOT NULL REFERENCES users(id),
    approval_level INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    comments TEXT,
    approved_at TIMESTAMP,
    
    CONSTRAINT check_approval_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

CREATE INDEX idx_salary_revisions_employee ON salary_revisions(employee_id);
CREATE INDEX idx_salary_revisions_status ON salary_revisions(status);
CREATE INDEX idx_revision_approvals_revision ON salary_revision_approvals(revision_id);
```

---

### Story 4.6: Allowances Management

**As a** HR Manager  
**I want to** configure special allowances  
**So that** additional benefits can be provided to employees

**Priority:** MEDIUM  
**Story Points:** 5  
**Sprint:** Sprint 5  

#### Acceptance Criteria
- [ ] Create allowance types
- [ ] Set eligibility criteria
- [ ] One-time or recurring allowances
- [ ] Taxable/non-taxable flag
- [ ] Assign to specific employees

#### Allowance Types:
- Travel Allowance
- Mobile Allowance
- Internet Allowance
- Meal Allowance
- Education Allowance
- Uniform Allowance
- Project Allowance

**Database Schema:**
```sql
CREATE TABLE allowances (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    organization_id BIGINT NOT NULL REFERENCES organizations(id),
    
    allowance_name VARCHAR(100) NOT NULL,
    allowance_code VARCHAR(20) NOT NULL,
    allowance_type VARCHAR(30) NOT NULL,
    
    default_amount DECIMAL(15,2),
    frequency VARCHAR(20) DEFAULT 'MONTHLY',
    is_taxable BOOLEAN DEFAULT TRUE,
    
    eligibility_criteria TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT unique_allowance_code_per_org UNIQUE(organization_id, allowance_code)
);

CREATE TABLE employee_allowances (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id),
    allowance_id BIGINT NOT NULL REFERENCES allowances(id),
    
    amount DECIMAL(15,2) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Testing Requirements

### Unit Tests
- Salary component calculations
- CTC breakdown logic
- Increment percentage calculation
- Grade range validation

### Integration Tests
- Template creation and assignment
- Salary revision workflow
- Allowance assignment

---

**Epic Status:** Ready for Development  
**Last Updated:** December 2024
