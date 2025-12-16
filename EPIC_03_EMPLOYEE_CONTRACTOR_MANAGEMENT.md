# EPIC 03: EMPLOYEE & CONTRACTOR MANAGEMENT

**Module:** Employee & Contractor Management  
**Priority:** HIGH  
**Sprint:** Sprint 2-4  
**Estimated Effort:** 55 Story Points  

---

## Epic Overview

Comprehensive employee and contractor lifecycle management including registration, onboarding, profile management, document management, and organizational assignments.

**Business Value:**
- Centralized employee information repository
- Streamlined onboarding process
- Document management and compliance
- Employee self-service capabilities
- Detailed employee profiles for payroll processing

**Acceptance Criteria:**
- Complete employee CRUD operations
- Multi-step employee registration form
- Document upload and management
- Employee status tracking (Active, Inactive, Terminated)
- Department and role assignments
- Bank account management for salary disbursement
- Tax information collection

---

## User Stories

### Story 3.1: Employee Registration

**As a** HR Manager  
**I want to** register new employees with complete information  
**So that** all employee data is captured for payroll processing

**Priority:** HIGH  
**Story Points:** 13  
**Sprint:** Sprint 2  

#### Acceptance Criteria
- [ ] Multi-step registration form with validation
- [ ] Auto-generate employee ID
- [ ] Upload profile photo and documents
- [ ] Save as draft functionality
- [ ] Email notification to employee
- [ ] All required fields validated
- [ ] Data saved to database successfully

#### UI Form - Multi-Step Wizard

**Step 1: Personal Information**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Employee ID | Text | No | Auto-generated, format: EMP-YYYY-#### | "EMP-2024-0001" (readonly) |
| First Name | Text | Yes | Min 2, Max 50, letters only | "John" |
| Middle Name | Text | No | Max 50, letters only | "Michael" |
| Last Name | Text | Yes | Min 2, Max 50, letters only | "Doe" |
| Date of Birth | Date | Yes | Past date, age >= 18 | "MM/DD/YYYY" |
| Gender | Dropdown | Yes | Male, Female, Other, Prefer not to say | Select |
| Marital Status | Dropdown | No | Single, Married, Divorced, Widowed | Select |
| Nationality | Dropdown | Yes | Country list | "United States" |
| Profile Photo | File Upload | No | JPG/PNG, Max 2MB, 300x300px | Upload photo |
| Personal Email | Email | Yes | Valid email, unique | "john.doe@email.com" |
| Mobile Number | Tel | Yes | 10 digits, valid format | "(555) 123-4567" |
| Alternate Phone | Tel | No | Valid format | "(555) 987-6543" |
| Blood Group | Dropdown | No | A+, A-, B+, B-, O+, O-, AB+, AB- | Select |

**Step 2: Address Information**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Current Address Line 1 | Text | Yes | Max 255 | "123 Main Street" |
| Current Address Line 2 | Text | No | Max 255 | "Apt 4B" |
| City | Text | Yes | Max 100 | "New York" |
| State/Province | Dropdown | Yes | Based on country | "New York" |
| ZIP/Postal Code | Text | Yes | Format based on country | "10001" |
| Country | Dropdown | Yes | Country list | "United States" |
| Permanent Address Same | Checkbox | No | If checked, copy current address | Unchecked |
| Permanent Address Line 1 | Text | Conditional | Max 255, required if not same | "456 Oak Avenue" |
| Permanent Address Line 2 | Text | No | Max 255 | "Unit 2" |
| Permanent City | Text | Conditional | Max 100 | "Boston" |
| Permanent State | Dropdown | Conditional | Based on country | "Massachusetts" |
| Permanent ZIP | Text | Conditional | Format based on country | "02101" |
| Permanent Country | Dropdown | Conditional | Country list | "United States" |

**Step 3: Employment Details**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Work Email | Email | Yes | Valid email, unique, company domain | "john.doe@company.com" |
| Joining Date | Date | Yes | Cannot be future date (unless offer) | "MM/DD/YYYY" |
| Employment Type | Dropdown | Yes | Full-time, Part-time, Contract, Intern | Select |
| Employee Status | Dropdown | Yes | Active, Probation, Inactive, Terminated | "Active" |
| Probation Period (Months) | Number | Conditional | 0-12, required if status=Probation | "3" |
| Probation End Date | Date | Auto-calc | Calculated from joining + probation period | "MM/DD/YYYY" (readonly) |
| Department | Dropdown | Yes | Select from departments | Select department |
| Designation/Job Title | Text | Yes | Min 2, Max 100 | "Software Engineer" |
| Reporting Manager | Searchable Dropdown | Yes | Select employee | Search manager |
| Work Location | Dropdown | Yes | Select from locations | Select location |
| Shift | Dropdown | No | Select from shifts | Select shift |
| Cost Center | Dropdown | No | Select from cost centers | Select cost center |

**Step 4: Identity & Tax Documents**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| SSN (Social Security Number) | Text | Yes | XXX-XX-XXXX format, unique | "***-**-****" (masked) |
| Passport Number | Text | No | Alphanumeric, max 20 | "A12345678" |
| Passport Expiry | Date | Conditional | Future date, required if passport # provided | "MM/DD/YYYY" |
| Driver License Number | Text | No | Alphanumeric, max 20 | "DL123456789" |
| Driver License Expiry | Date | Conditional | Future date | "MM/DD/YYYY" |
| PAN Number (India) | Text | Conditional | AAAAA9999A format | "ABCDE1234F" |
| Aadhar Number (India) | Text | Conditional | 12 digits | "1234-5678-9012" |
| Tax Filing Status | Dropdown | Yes | Single, Married, Head of Household | Select |
| W-4 Allowances | Number | Yes | 0-99 | "1" |
| Additional Withholding | Number | No | Positive amount | "0" |
| Upload SSN Card | File Upload | No | PDF/JPG/PNG, Max 5MB | Upload file |
| Upload Passport | File Upload | No | PDF/JPG/PNG, Max 5MB | Upload file |
| Upload Driver License | File Upload | No | PDF/JPG/PNG, Max 5MB | Upload file |
| Upload PAN Card | File Upload | Conditional | PDF/JPG/PNG, Max 5MB | Upload file |
| Upload Aadhar Card | File Upload | Conditional | PDF/JPG/PNG, Max 5MB | Upload file |

**Step 5: Bank Account Details**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Bank Name | Text | Yes | Min 2, Max 100 | "Chase Bank" |
| Account Holder Name | Text | Yes | Min 2, Max 100 | "John Doe" |
| Account Number | Text | Yes | 4-17 digits, numeric | "1234567890" |
| Confirm Account Number | Text | Yes | Must match, no paste | "1234567890" |
| Routing Number | Text | Yes | 9 digits, valid ABA | "021000021" |
| Account Type | Dropdown | Yes | Checking, Savings | "Checking" |
| Bank Branch | Text | No | Max 100 | "Main Street Branch" |
| IFSC Code (India) | Text | Conditional | 11 chars, format: AAAA0BBBBBB | "SBIN0001234" |
| SWIFT Code | Text | No | 8 or 11 chars | "CHASUS33" |
| Upload Cancelled Check | File Upload | No | PDF/JPG/PNG, Max 5MB | Upload file |
| Upload Bank Statement | File Upload | No | PDF, Max 10MB | Upload file |

**Step 6: Emergency Contact**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Contact Name 1 | Text | Yes | Min 2, Max 100 | "Jane Doe" |
| Relationship 1 | Dropdown | Yes | Spouse, Parent, Sibling, Friend, Other | Select |
| Phone Number 1 | Tel | Yes | Valid format | "(555) 234-5678" |
| Email 1 | Email | No | Valid email | "jane@email.com" |
| Contact Name 2 | Text | No | Min 2, Max 100 | "Robert Smith" |
| Relationship 2 | Dropdown | Conditional | Same options | Select |
| Phone Number 2 | Tel | Conditional | Valid format | "(555) 345-6789" |
| Email 2 | Email | No | Valid email | "robert@email.com" |

**Step 7: Educational & Professional Details**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Highest Qualification | Dropdown | Yes | High School, Bachelor's, Master's, PhD | Select |
| Field of Study | Text | No | Max 100 | "Computer Science" |
| University/College | Text | No | Max 200 | "MIT" |
| Graduation Year | Number | No | 1950-current year | "2020" |
| Previous Employer | Text | No | Max 200 | "Previous Company Inc." |
| Previous Job Title | Text | No | Max 100 | "Junior Developer" |
| Years of Experience | Number | No | 0-50 | "5" |
| Upload Resume/CV | File Upload | No | PDF/DOC, Max 5MB | Upload file |
| Upload Degree Certificate | File Upload | No | PDF/JPG/PNG, Max 5MB | Upload file |
| Upload Experience Letter | File Upload | No | PDF, Max 5MB | Upload file |

**Database Schema:**
```sql
CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    organization_id BIGINT NOT NULL REFERENCES organizations(id),
    
    -- Auto-generated ID
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    
    -- Personal Information
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    marital_status VARCHAR(20),
    nationality VARCHAR(100) NOT NULL,
    profile_photo_url VARCHAR(500),
    personal_email VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    blood_group VARCHAR(5),
    
    -- Current Address
    current_address_line1 VARCHAR(255) NOT NULL,
    current_address_line2 VARCHAR(255),
    current_city VARCHAR(100) NOT NULL,
    current_state VARCHAR(100) NOT NULL,
    current_postal_code VARCHAR(20) NOT NULL,
    current_country VARCHAR(100) NOT NULL,
    
    -- Permanent Address
    permanent_address_same BOOLEAN DEFAULT FALSE,
    permanent_address_line1 VARCHAR(255),
    permanent_address_line2 VARCHAR(255),
    permanent_city VARCHAR(100),
    permanent_state VARCHAR(100),
    permanent_postal_code VARCHAR(20),
    permanent_country VARCHAR(100),
    
    -- Employment Details
    work_email VARCHAR(255) UNIQUE NOT NULL,
    joining_date DATE NOT NULL,
    employment_type VARCHAR(20) NOT NULL,
    employee_status VARCHAR(20) DEFAULT 'ACTIVE',
    probation_period_months INTEGER,
    probation_end_date DATE,
    department_id BIGINT REFERENCES departments(id),
    designation VARCHAR(100) NOT NULL,
    reporting_manager_id BIGINT REFERENCES employees(id),
    location_id BIGINT REFERENCES locations(id),
    shift_id BIGINT REFERENCES shifts(id),
    cost_center_id BIGINT REFERENCES cost_centers(id),
    
    -- Identity & Tax
    ssn_encrypted TEXT NOT NULL,
    ssn_last_four VARCHAR(4),
    passport_number VARCHAR(20),
    passport_expiry DATE,
    driver_license_number VARCHAR(20),
    driver_license_expiry DATE,
    pan_number VARCHAR(10),
    aadhar_number_encrypted TEXT,
    tax_filing_status VARCHAR(30),
    w4_allowances INTEGER DEFAULT 0,
    additional_withholding DECIMAL(10,2),
    
    -- Bank Details
    bank_name VARCHAR(100) NOT NULL,
    account_holder_name VARCHAR(100) NOT NULL,
    account_number_encrypted TEXT NOT NULL,
    account_last_four VARCHAR(4),
    routing_number VARCHAR(9) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    bank_branch VARCHAR(100),
    ifsc_code VARCHAR(11),
    swift_code VARCHAR(11),
    
    -- Education & Experience
    highest_qualification VARCHAR(50),
    field_of_study VARCHAR(100),
    university VARCHAR(200),
    graduation_year INTEGER,
    previous_employer VARCHAR(200),
    previous_job_title VARCHAR(100),
    years_of_experience INTEGER,
    
    -- Status Tracking
    termination_date DATE,
    termination_reason TEXT,
    rehire_eligible BOOLEAN,
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT check_employee_status 
        CHECK (employee_status IN ('ACTIVE', 'PROBATION', 'INACTIVE', 'TERMINATED', 'ON_LEAVE')),
    CONSTRAINT check_employment_type 
        CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN')),
    CONSTRAINT check_account_type 
        CHECK (account_type IN ('CHECKING', 'SAVINGS'))
);

CREATE TABLE emergency_contacts (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id),
    contact_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_documents (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id),
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by BIGINT REFERENCES users(id),
    
    CONSTRAINT check_document_type CHECK (document_type IN (
        'SSN_CARD', 'PASSPORT', 'DRIVER_LICENSE', 'PAN_CARD', 
        'AADHAR_CARD', 'BANK_STATEMENT', 'CANCELLED_CHECK', 
        'RESUME', 'DEGREE_CERTIFICATE', 'EXPERIENCE_LETTER', 
        'OFFER_LETTER', 'JOINING_LETTER', 'OTHER'
    ))
);

CREATE INDEX idx_employees_tenant ON employees(tenant_id);
CREATE INDEX idx_employees_org ON employees(organization_id);
CREATE INDEX idx_employees_id ON employees(employee_id);
CREATE INDEX idx_employees_email ON employees(work_email);
CREATE INDEX idx_employees_dept ON employees(department_id);
CREATE INDEX idx_employees_manager ON employees(reporting_manager_id);
CREATE INDEX idx_employees_status ON employees(employee_status);
CREATE INDEX idx_emergency_contacts_employee ON emergency_contacts(employee_id);
CREATE INDEX idx_employee_documents_employee ON employee_documents(employee_id);
```

**API Endpoints:**
```
POST   /api/v1/employees                    # Register new employee
GET    /api/v1/employees                    # List all employees
GET    /api/v1/employees/{id}               # Get employee details
PUT    /api/v1/employees/{id}               # Update employee
DELETE /api/v1/employees/{id}               # Delete employee (soft)
POST   /api/v1/employees/{id}/documents     # Upload document
GET    /api/v1/employees/{id}/documents     # Get employee documents
GET    /api/v1/employees/generate-id        # Generate next employee ID
POST   /api/v1/employees/draft              # Save as draft
```

**React Component (Zod Schema for Step 1):**
```tsx
import { z } from 'zod';

const personalInfoSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Only letters allowed'),
  
  middleName: z.string()
    .max(50)
    .regex(/^[a-zA-Z\s'-]*$/, 'Only letters allowed')
    .optional(),
  
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Only letters allowed'),
  
  dateOfBirth: z.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .refine((date) => {
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 18;
    }, 'Employee must be at least 18 years old'),
  
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).optional(),
  
  nationality: z.string().min(1, 'Nationality is required'),
  
  personalEmail: z.string().email('Invalid email format'),
  
  mobileNumber: z.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format'),
  
  alternatePhone: z.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone format')
    .optional(),
  
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).optional()
});
```

**Java DTO:**
```java
@Data
@Validated
public class EmployeeRegistrationRequest {
    
    // Personal Information
    @NotBlank
    @Size(min = 2, max = 50)
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$")
    private String firstName;
    
    @Size(max = 50)
    @Pattern(regexp = "^[a-zA-Z\\s'-]*$")
    private String middleName;
    
    @NotBlank
    @Size(min = 2, max = 50)
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$")
    private String lastName;
    
    @NotNull
    @Past
    private LocalDate dateOfBirth;
    
    @NotNull
    private Gender gender;
    
    private MaritalStatus maritalStatus;
    
    @NotBlank
    private String nationality;
    
    @NotBlank
    @Email
    private String personalEmail;
    
    @NotBlank
    @Pattern(regexp = "^\\(\\d{3}\\) \\d{3}-\\d{4}$")
    private String mobileNumber;
    
    @Pattern(regexp = "^\\(\\d{3}\\) \\d{3}-\\d{4}$")
    private String alternatePhone;
    
    private String bloodGroup;
    
    // ... other sections
}
```

---

### Story 3.2: Employee List & Search

**As a** HR Manager  
**I want to** view and search all employees  
**So that** I can quickly find employee information

**Priority:** HIGH  
**Story Points:** 5  
**Sprint:** Sprint 2  

#### Acceptance Criteria
- [ ] Paginated employee list with sorting
- [ ] Advanced search and filters
- [ ] Export to Excel/PDF
- [ ] Bulk operations support
- [ ] Quick view employee details

#### UI Components

**Data Table Columns:**
- Employee ID
- Full Name (with photo thumbnail)
- Department
- Designation
- Email
- Phone
- Joining Date
- Status (badge)
- Actions (View, Edit, Delete)

**Search & Filters:**
- Search by: Name, Email, Employee ID, Phone
- Filter by: Department, Status, Employment Type, Location, Date Range
- Sort by: Name, ID, Joining Date, Department

**Bulk Operations:**
- Export selected employees
- Change department (bulk)
- Change status (bulk)
- Send email to selected

---

### Story 3.3: Employee Profile View

**As a** HR Manager or Employee  
**I want to** view detailed employee profile  
**So that** I can access all employee information in one place

**Priority:** HIGH  
**Story Points:** 8  
**Sprint:** Sprint 3  

#### Acceptance Criteria
- [ ] Tab-based profile layout
- [ ] All information sections visible
- [ ] Document viewer integrated
- [ ] Activity timeline/history
- [ ] Edit button for authorized users
- [ ] Print profile option

#### UI Tabs:
1. **Personal Info** - Basic details, contact, address
2. **Employment** - Job details, department, manager
3. **Bank Details** - Account information (masked for non-authorized)
4. **Tax Info** - SSN, tax filing status, allowances
5. **Documents** - All uploaded documents with viewer
6. **Salary** - Current salary structure (if authorized)
7. **Attendance** - Attendance summary and history
8. **Leave** - Leave balances and history
9. **Performance** - Reviews and ratings (future)
10. **History** - Audit trail of changes

---

### Story 3.4: Employee Edit & Update

**As a** HR Manager  
**I want to** edit employee information  
**So that** employee records stay current

**Priority:** HIGH  
**Story Points:** 5  
**Sprint:** Sprint 3  

#### Acceptance Criteria
- [ ] Edit form with current data pre-filled
- [ ] Change tracking with history
- [ ] Validation on all fields
- [ ] Confirmation before save
- [ ] Audit log of changes
- [ ] Email notification on critical changes

---

### Story 3.5: Department-wise Employee View

**As a** Manager  
**I want to** view employees in my department  
**So that** I can manage my team

**Priority:** MEDIUM  
**Story Points:** 3  
**Sprint:** Sprint 3  

#### Features:
- Department tree view
- Employee count per department
- Filter by department
- Drill-down to sub-departments

---

**Continued in next file due to length...**

---

## Testing Requirements

### Unit Tests
- Employee ID generation logic
- SSN encryption/decryption
- Age validation (18+)
- Probation end date calculation

### Integration Tests
- Complete employee registration flow
- Document upload and retrieval
- Employee search and filter
- Bulk operations

### E2E Tests
- End-to-end employee onboarding
- Profile view and edit
- Document management

---

**Epic Status:** Ready for Development  
**Last Updated:** December 2024
