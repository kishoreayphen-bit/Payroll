# 🗄️ Employee Database Schema Documentation

## 📋 Overview

Complete database schema for the Employee module, designed to match all fields in the AddEmployee form. This schema supports comprehensive employee management with salary details, personal information, payment details, and more.

---

## 🏗️ Database Schema

### **Table: `employees`**

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    
    -- Basic Details (Step 1)
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    employee_id VARCHAR(50) NOT NULL,
    date_of_joining DATE NOT NULL,
    work_email VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    is_director BOOLEAN DEFAULT FALSE,
    gender VARCHAR(20),
    work_location VARCHAR(255),
    designation VARCHAR(100),
    department VARCHAR(100),
    enable_portal_access BOOLEAN DEFAULT FALSE,
    professional_tax BOOLEAN DEFAULT TRUE,
    
    -- Salary Details (Step 2)
    annual_ctc DECIMAL(15, 2),
    basic_percent_of_ctc DECIMAL(5, 2) DEFAULT 50.00,
    hra_percent_of_basic DECIMAL(5, 2) DEFAULT 50.00,
    conveyance_allowance_monthly DECIMAL(15, 2),
    basic_monthly DECIMAL(15, 2),
    hra_monthly DECIMAL(15, 2),
    fixed_allowance_monthly DECIMAL(15, 2),
    
    -- Personal Details (Step 3)
    date_of_birth DATE,
    age INTEGER,
    father_name VARCHAR(255),
    personal_email VARCHAR(255),
    differently_abled_type VARCHAR(50) DEFAULT 'none',
    address TEXT,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(10),
    emergency_contact VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    
    -- Payment Information (Step 4)
    bank_name VARCHAR(255),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    payment_method VARCHAR(50) DEFAULT 'bank_transfer',
    pan_number VARCHAR(20),
    aadhar_number VARCHAR(20),
    
    -- Metadata
    status VARCHAR(20) DEFAULT 'Active',
    organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_by_user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(employee_id, organization_id),
    UNIQUE(work_email, organization_id)
);
```

---

## 📊 Field Mapping

### **Basic Details (14 fields)**

| Frontend Field | Database Column | Type | Required | Default |
|----------------|-----------------|------|----------|---------|
| firstName | first_name | VARCHAR(100) | ✅ Yes | - |
| middleName | middle_name | VARCHAR(100) | ❌ No | - |
| lastName | last_name | VARCHAR(100) | ❌ No | - |
| employeeId | employee_id | VARCHAR(50) | ✅ Yes | - |
| dateOfJoining | date_of_joining | DATE | ✅ Yes | - |
| workEmail | work_email | VARCHAR(255) | ✅ Yes | - |
| mobileNumber | mobile_number | VARCHAR(20) | ✅ Yes | - |
| isDirector | is_director | BOOLEAN | ❌ No | false |
| gender | gender | VARCHAR(20) | ❌ No | - |
| workLocation | work_location | VARCHAR(255) | ❌ No | - |
| designation | designation | VARCHAR(100) | ❌ No | - |
| department | department | VARCHAR(100) | ❌ No | - |
| enablePortalAccess | enable_portal_access | BOOLEAN | ❌ No | false |
| professionalTax | professional_tax | BOOLEAN | ❌ No | true |

---

### **Salary Details (7 fields)**

| Frontend Field | Database Column | Type | Required | Default |
|----------------|-----------------|------|----------|---------|
| annualCtc | annual_ctc | DECIMAL(15,2) | ❌ No | - |
| basicPercentOfCtc | basic_percent_of_ctc | DECIMAL(5,2) | ❌ No | 50.00 |
| hraPercentOfBasic | hra_percent_of_basic | DECIMAL(5,2) | ❌ No | 50.00 |
| conveyanceAllowanceMonthly | conveyance_allowance_monthly | DECIMAL(15,2) | ❌ No | - |
| basicMonthly | basic_monthly | DECIMAL(15,2) | ❌ No | - |
| hraMonthly | hra_monthly | DECIMAL(15,2) | ❌ No | - |
| fixedAllowanceMonthly | fixed_allowance_monthly | DECIMAL(15,2) | ❌ No | - |

---

### **Personal Details (13 fields)**

| Frontend Field | Database Column | Type | Required | Default |
|----------------|-----------------|------|----------|---------|
| dateOfBirth | date_of_birth | DATE | ❌ No | - |
| age | age | INTEGER | ❌ No | - |
| fatherName | father_name | VARCHAR(255) | ❌ No | - |
| personalEmail | personal_email | VARCHAR(255) | ❌ No | - |
| differentlyAbledType | differently_abled_type | VARCHAR(50) | ❌ No | 'none' |
| address | address | TEXT | ❌ No | - |
| addressLine1 | address_line1 | VARCHAR(255) | ❌ No | - |
| addressLine2 | address_line2 | VARCHAR(255) | ❌ No | - |
| city | city | VARCHAR(100) | ❌ No | - |
| state | state | VARCHAR(100) | ❌ No | - |
| pinCode | pin_code | VARCHAR(10) | ❌ No | - |
| emergencyContact | emergency_contact | VARCHAR(20) | ❌ No | - |
| emergencyContactName | emergency_contact_name | VARCHAR(255) | ❌ No | - |

---

### **Payment Information (6 fields)**

| Frontend Field | Database Column | Type | Required | Default |
|----------------|-----------------|------|----------|---------|
| bankName | bank_name | VARCHAR(255) | ❌ No | - |
| accountNumber | account_number | VARCHAR(50) | ❌ No | - |
| ifscCode | ifsc_code | VARCHAR(20) | ❌ No | - |
| paymentMethod | payment_method | VARCHAR(50) | ❌ No | 'bank_transfer' |
| panNumber | pan_number | VARCHAR(20) | ❌ No | - |
| aadharNumber | aadhar_number | VARCHAR(20) | ❌ No | - |

---

## 🔑 Indexes

```sql
CREATE INDEX idx_employees_organization_id ON employees(organization_id);
CREATE INDEX idx_employees_employee_id ON employees(employee_id);
CREATE INDEX idx_employees_work_email ON employees(work_email);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_department ON employees(department);
```

**Purpose:**
- ✅ Faster queries by organization
- ✅ Quick employee ID lookups
- ✅ Email search optimization
- ✅ Status filtering
- ✅ Department-based queries

---

## 🔗 Relationships

### **Foreign Keys:**

1. **organization_id** → `organizations(id)`
   - Each employee belongs to one organization
   - CASCADE delete (employee deleted when org deleted)

2. **created_by_user_id** → `users(id)`
   - Tracks who created the employee record
   - Maintains audit trail

---

## 🛡️ Constraints

### **Unique Constraints:**

```sql
UNIQUE(employee_id, organization_id)
UNIQUE(work_email, organization_id)
```

**Ensures:**
- ✅ Employee ID is unique within organization
- ✅ Work email is unique within organization
- ✅ Same employee ID can exist in different organizations

---

## 📁 Files Created

### **1. Database Migration**
```
d:\PayRoll\backend\src\main\resources\db\migration\V4__create_employees_table.sql
```
- Flyway migration script
- Creates employees table
- Adds indexes and constraints
- Includes documentation comments

### **2. JPA Entity**
```
d:\PayRoll\backend\src\main\java\com\payroll\entity\Employee.java
```
- Complete entity class with all fields
- Lombok annotations (@Data, @NoArgsConstructor, @AllArgsConstructor)
- JPA annotations (@Entity, @Table, @Column, etc.)
- Relationships (@ManyToOne)
- Lifecycle callbacks (@PrePersist, @PreUpdate)
- Helper method: `getFullName()`

### **3. Repository Interface**
```
d:\PayRoll\backend\src\main\java\com\payroll\repository\EmployeeRepository.java
```
- Extends JpaRepository
- Custom query methods:
  - `findByOrganizationId()`
  - `findByEmployeeIdAndOrganizationId()`
  - `findByWorkEmailAndOrganizationId()`
  - `findByDepartmentAndOrganizationId()`
  - `findByStatusAndOrganizationId()`
  - `existsByEmployeeIdAndOrganizationId()`
  - `existsByWorkEmailAndOrganizationId()`
  - `countByOrganizationId()`
  - `countByOrganizationIdAndStatus()`

### **4. DTOs**
```
d:\PayRoll\backend\src\main\java\com\payroll\dto\EmployeeRequestDTO.java
d:\PayRoll\backend\src\main\java\com\payroll\dto\EmployeeResponseDTO.java
```
- **EmployeeRequestDTO**: For create/update operations
- **EmployeeResponseDTO**: For API responses with metadata

---

## 🚀 Next Steps

### **1. Restart Backend**
The backend needs to be restarted for Flyway to run the new migration:

```bash
# Stop current backend
Ctrl+C

# Restart backend
mvn spring-boot:run
```

### **2. Verify Migration**
Check if the table was created:

```sql
-- Connect to PostgreSQL
psql -U postgres -d payroll_db

-- Check if employees table exists
\dt employees

-- View table structure
\d employees

-- Check indexes
\di employees*
```

### **3. Create Service Layer**
Next, create:
- `EmployeeService.java` - Business logic
- `EmployeeController.java` - REST API endpoints

### **4. API Endpoints to Implement**
```
POST   /api/v1/employees              - Create employee
GET    /api/v1/employees              - List all employees
GET    /api/v1/employees/{id}         - Get employee by ID
PUT    /api/v1/employees/{id}         - Update employee
DELETE /api/v1/employees/{id}         - Delete employee
GET    /api/v1/employees/org/{orgId}  - Get employees by organization
```

---

## 📊 Summary

✅ **Database Migration Created** - V4__create_employees_table.sql  
✅ **JPA Entity Created** - Employee.java with all 40+ fields  
✅ **Repository Created** - EmployeeRepository.java with custom queries  
✅ **DTOs Created** - Request and Response DTOs  
✅ **Indexes Added** - For optimized queries  
✅ **Constraints Added** - Unique employee ID and email per org  
✅ **Relationships Defined** - Organization and User foreign keys  

**Total Fields: 40+ fields across 4 form steps**

The database schema is now ready to support the complete employee management workflow! 🎉
