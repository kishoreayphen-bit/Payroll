# 🚀 Salary Components Implementation Plan

## 📊 Current State Analysis

### **What's Already Implemented:**

**Employee Entity (Employee.java)** has basic salary fields:
- ✅ `annualCtc` - Annual Cost to Company
- ✅ `basicPercentOfCtc` - Basic as % of CTC (default 50%)
- ✅ `hraPercentOfBasic` - HRA as % of Basic (default 50%)
- ✅ `conveyanceAllowanceMonthly` - Monthly conveyance
- ✅ `basicMonthly` - Calculated basic salary
- ✅ `hraMonthly` - Calculated HRA
- ✅ `fixedAllowanceMonthly` - Fixed allowance

**Current Limitations:**
- ❌ No separate Salary Component entity
- ❌ Hardcoded salary structure (only Basic, HRA, Conveyance, Fixed)
- ❌ No flexibility to add custom components
- ❌ No support for deductions (PF, ESI, PT, TDS)
- ❌ No formula engine for complex calculations
- ❌ No component templates/presets

---

## 🎯 What We Need to Build

### **New Entities Required:**

1. **SalaryComponent** - Master list of all components
2. **EmployeeSalaryComponent** - Components assigned to each employee
3. **ComponentFormula** - Formula definitions for calculations

---

## 📋 Implementation Roadmap

### **Phase 1: Backend Foundation (Days 1-3)**

#### **Day 1: Database Schema & Entities**

**1.1 Create SalaryComponent Entity**
```java
@Entity
@Table(name = "salary_components")
class SalaryComponent {
    - id: Long
    - name: String (e.g., "Basic Salary", "HRA", "PF")
    - code: String (e.g., "BASIC", "HRA", "PF")
    - type: Enum (EARNING, DEDUCTION)
    - calculationType: Enum (FIXED, PERCENTAGE, FORMULA)
    - baseComponent: SalaryComponent (for percentage calculations)
    - formula: String (for complex calculations)
    - isTaxable: Boolean
    - isStatutory: Boolean (PF, ESI, etc.)
    - isActive: Boolean
    - organization: Organization
    - createdAt, updatedAt
}
```

**1.2 Create EmployeeSalaryComponent Entity**
```java
@Entity
@Table(name = "employee_salary_components")
class EmployeeSalaryComponent {
    - id: Long
    - employee: Employee
    - component: SalaryComponent
    - value: BigDecimal (fixed amount or percentage)
    - calculatedAmount: BigDecimal (final calculated value)
    - effectiveFrom: LocalDate
    - effectiveTo: LocalDate
    - isActive: Boolean
    - createdAt, updatedAt
}
```

**1.3 Create Enums**
```java
enum ComponentType { EARNING, DEDUCTION }
enum CalculationType { FIXED, PERCENTAGE, FORMULA }
```

---

#### **Day 2: Repositories & Services**

**2.1 Repositories**
- `SalaryComponentRepository`
- `EmployeeSalaryComponentRepository`

**2.2 Services**
- `SalaryComponentService` - CRUD for components
- `EmployeeSalaryService` - Assign/manage employee components
- `SalaryCalculationService` - Calculate final salary

**2.3 DTOs**
- `SalaryComponentDTO`
- `EmployeeSalaryComponentDTO`
- `SalaryBreakdownDTO`

---

#### **Day 3: REST Controllers**

**3.1 SalaryComponentController**
```
GET    /api/v1/salary-components              - List all components
GET    /api/v1/salary-components/{id}         - Get component
POST   /api/v1/salary-components              - Create component
PUT    /api/v1/salary-components/{id}         - Update component
DELETE /api/v1/salary-components/{id}         - Delete component
GET    /api/v1/salary-components/earnings     - Get earnings only
GET    /api/v1/salary-components/deductions   - Get deductions only
```

**3.2 EmployeeSalaryController**
```
GET    /api/v1/employees/{id}/salary-components        - Get employee components
POST   /api/v1/employees/{id}/salary-components        - Assign component
PUT    /api/v1/employees/{id}/salary-components/{cid}  - Update assignment
DELETE /api/v1/employees/{id}/salary-components/{cid}  - Remove component
GET    /api/v1/employees/{id}/salary-breakdown         - Calculate salary
```

---

### **Phase 2: Frontend Implementation (Days 4-7)**

#### **Day 4: Salary Component Management Page**

**4.1 Component List Page** (`/salary-components`)
- Table showing all components
- Filter by type (Earnings/Deductions)
- Search by name
- Add/Edit/Delete actions

**4.2 Component Form Modal**
- Name, Code
- Type (Earning/Deduction)
- Calculation Type (Fixed/Percentage/Formula)
- Base Component (for percentage)
- Formula (for complex)
- Taxable, Statutory flags

---

#### **Day 5: Employee Salary Assignment**

**5.1 Employee Salary Tab** (in Employee Details)
- List of assigned components
- Add component button
- Edit/Remove component
- View salary breakdown

**5.2 Assign Component Modal**
- Select component from dropdown
- Enter value (amount or percentage)
- Set effective date

---

#### **Day 6: Salary Breakdown View**

**6.1 Salary Summary Card**
- Gross Salary
- Total Earnings
- Total Deductions
- Net Salary

**6.2 Component Breakdown Table**
- Component name
- Calculation type
- Value
- Calculated amount

---

#### **Day 7: Integration & Testing**

**7.1 Update AddEmployee Form**
- Integrate with new component system
- Backward compatibility with existing fields

**7.2 Update Employee Details**
- Show new salary breakdown
- Edit components inline

---

## 🗄️ Database Migration

### **Migration Script: V3__create_salary_components.sql**

```sql
-- Salary Components Master Table
CREATE TABLE salary_components (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organizations(id),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('EARNING', 'DEDUCTION')),
    calculation_type VARCHAR(20) NOT NULL CHECK (calculation_type IN ('FIXED', 'PERCENTAGE', 'FORMULA')),
    base_component_id BIGINT REFERENCES salary_components(id),
    formula TEXT,
    is_taxable BOOLEAN DEFAULT true,
    is_statutory BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(code, organization_id)
);

-- Employee Salary Components (Assignment)
CREATE TABLE employee_salary_components (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    component_id BIGINT NOT NULL REFERENCES salary_components(id),
    value DECIMAL(15,2) NOT NULL,
    calculated_amount DECIMAL(15,2),
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, component_id, effective_from)
);

-- Indexes
CREATE INDEX idx_salary_components_org ON salary_components(organization_id);
CREATE INDEX idx_salary_components_type ON salary_components(type);
CREATE INDEX idx_employee_salary_components_emp ON employee_salary_components(employee_id);
CREATE INDEX idx_employee_salary_components_comp ON employee_salary_components(component_id);
```

---

## 🔧 Default Components to Seed

### **Earnings:**
1. Basic Salary (PERCENTAGE of CTC, 50%)
2. House Rent Allowance (PERCENTAGE of Basic, 50%)
3. Dearness Allowance (PERCENTAGE of Basic, 0%)
4. Conveyance Allowance (FIXED, 1600)
5. Medical Allowance (FIXED, 1250)
6. Special Allowance (FIXED, 0)
7. Fixed Allowance (FIXED, 0)

### **Deductions:**
1. Provident Fund (PERCENTAGE of Basic, 12%)
2. Employee State Insurance (PERCENTAGE of Gross, 0.75%)
3. Professional Tax (FIXED, varies by state)
4. Tax Deducted at Source (FORMULA, based on income)
5. Loan Deduction (FIXED, 0)

---

## 🔄 Migration Strategy for Existing Employees

### **Data Migration Script:**

```sql
-- For each existing employee, create component assignments
-- based on their current salary fields

-- 1. Basic Salary
INSERT INTO employee_salary_components (employee_id, component_id, value, calculated_amount, effective_from)
SELECT 
    e.id,
    (SELECT id FROM salary_components WHERE code = 'BASIC' AND organization_id = e.organization_id),
    e.basic_percent_of_ctc,
    e.basic_monthly,
    e.date_of_joining
FROM employees e
WHERE e.basic_monthly IS NOT NULL;

-- 2. HRA
INSERT INTO employee_salary_components (employee_id, component_id, value, calculated_amount, effective_from)
SELECT 
    e.id,
    (SELECT id FROM salary_components WHERE code = 'HRA' AND organization_id = e.organization_id),
    e.hra_percent_of_basic,
    e.hra_monthly,
    e.date_of_joining
FROM employees e
WHERE e.hra_monthly IS NOT NULL;

-- 3. Conveyance
INSERT INTO employee_salary_components (employee_id, component_id, value, calculated_amount, effective_from)
SELECT 
    e.id,
    (SELECT id FROM salary_components WHERE code = 'CONVEYANCE' AND organization_id = e.organization_id),
    e.conveyance_allowance_monthly,
    e.conveyance_allowance_monthly,
    e.date_of_joining
FROM employees e
WHERE e.conveyance_allowance_monthly IS NOT NULL;

-- 4. Fixed Allowance
INSERT INTO employee_salary_components (employee_id, component_id, value, calculated_amount, effective_from)
SELECT 
    e.id,
    (SELECT id FROM salary_components WHERE code = 'FIXED_ALLOWANCE' AND organization_id = e.organization_id),
    e.fixed_allowance_monthly,
    e.fixed_allowance_monthly,
    e.date_of_joining
FROM employees e
WHERE e.fixed_allowance_monthly IS NOT NULL;
```

---

## 📊 API Response Examples

### **Get Employee Salary Breakdown:**

```json
{
  "employeeId": 123,
  "employeeName": "John Doe",
  "annualCtc": 600000,
  "monthlyCtc": 50000,
  "earnings": [
    {
      "componentId": 1,
      "componentName": "Basic Salary",
      "calculationType": "PERCENTAGE",
      "value": 50,
      "baseAmount": 50000,
      "calculatedAmount": 25000
    },
    {
      "componentId": 2,
      "componentName": "HRA",
      "calculationType": "PERCENTAGE",
      "value": 50,
      "baseAmount": 25000,
      "calculatedAmount": 12500
    }
  ],
  "deductions": [
    {
      "componentId": 8,
      "componentName": "Provident Fund",
      "calculationType": "PERCENTAGE",
      "value": 12,
      "baseAmount": 25000,
      "calculatedAmount": 3000
    }
  ],
  "grossSalary": 50000,
  "totalEarnings": 50000,
  "totalDeductions": 3000,
  "netSalary": 47000
}
```

---

## ✅ Implementation Checklist

### **Backend:**
- [ ] Create SalaryComponent entity
- [ ] Create EmployeeSalaryComponent entity
- [ ] Create ComponentType enum
- [ ] Create CalculationType enum
- [ ] Create database migration script
- [ ] Create SalaryComponentRepository
- [ ] Create EmployeeSalaryComponentRepository
- [ ] Create SalaryComponentService
- [ ] Create EmployeeSalaryService
- [ ] Create SalaryCalculationService
- [ ] Create DTOs (Request/Response)
- [ ] Create SalaryComponentController
- [ ] Create EmployeeSalaryController
- [ ] Seed default components
- [ ] Migrate existing employee data
- [ ] Write unit tests
- [ ] Write integration tests

### **Frontend:**
- [ ] Create Salary Components page
- [ ] Create Component List component
- [ ] Create Component Form modal
- [ ] Create Employee Salary tab
- [ ] Create Assign Component modal
- [ ] Create Salary Breakdown view
- [ ] Update AddEmployee form
- [ ] Update Employee Details page
- [ ] Add API service methods
- [ ] Add navigation menu item
- [ ] Test all CRUD operations
- [ ] Test salary calculations

---

## 🎯 Success Criteria

**Backend:**
✅ Can create/edit/delete salary components  
✅ Can assign components to employees  
✅ Can calculate salary based on components  
✅ Supports FIXED, PERCENTAGE, FORMULA types  
✅ Existing employees migrated successfully  

**Frontend:**
✅ Admin can manage salary components  
✅ Admin can assign components to employees  
✅ Salary breakdown displays correctly  
✅ AddEmployee form works with new system  
✅ Employee Details shows component breakdown  

---

## 📝 Next Steps

**Ready to start implementation!**

**Order of Implementation:**
1. Backend entities & database
2. Backend services & APIs
3. Data migration
4. Frontend components page
5. Frontend employee integration
6. Testing & refinement

**Estimated Timeline:** 7 days

---

**Shall I start with creating the backend entities?** 🚀
