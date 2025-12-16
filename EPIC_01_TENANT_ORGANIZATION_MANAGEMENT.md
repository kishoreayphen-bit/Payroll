# EPIC 01: TENANT & ORGANIZATION MANAGEMENT

**Module:** Tenant & Organization Management  
**Priority:** HIGH  
**Sprint:** Sprint 1-2  
**Estimated Effort:** 40 Story Points  

---

## Epic Overview

Enable multi-tenant architecture with organization setup, department management, and hierarchical structure management for the payroll system.

**Business Value:**
- Support multiple organizations in single deployment
- Maintain data isolation between tenants
- Enable organizational hierarchy for reporting
- Support cost center allocation

**Acceptance Criteria:**
- Super admin can create and manage tenants
- Tenant admin can configure organization details
- Department hierarchy can be created and managed
- Cost centers can be assigned to departments
- Data is completely isolated between tenants

---

## User Stories

### Story 1.1: Tenant Registration & Setup

**As a** Super Administrator  
**I want to** register a new tenant organization  
**So that** multiple companies can use the payroll system independently

**Priority:** HIGH  
**Story Points:** 8  
**Sprint:** Sprint 1  

#### Acceptance Criteria
- [ ] Super admin can access tenant registration page
- [ ] System validates unique tenant subdomain
- [ ] Tenant data is completely isolated
- [ ] Default admin user is created for tenant
- [ ] Tenant configuration is saved successfully
- [ ] Welcome email sent to tenant admin

#### Technical Details

**API Endpoints:**
```
POST   /api/v1/admin/tenants              # Create tenant
GET    /api/v1/admin/tenants              # List all tenants
GET    /api/v1/admin/tenants/{id}         # Get tenant details
PUT    /api/v1/admin/tenants/{id}         # Update tenant
DELETE /api/v1/admin/tenants/{id}         # Deactivate tenant
```

**Database Schema:**
```sql
CREATE TABLE tenants (
    id BIGSERIAL PRIMARY KEY,
    tenant_code VARCHAR(50) UNIQUE NOT NULL,
    tenant_name VARCHAR(200) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    subscription_plan VARCHAR(50),
    subscription_start_date DATE,
    subscription_end_date DATE,
    max_employees INTEGER DEFAULT 50,
    is_trial BOOLEAN DEFAULT TRUE,
    trial_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

CREATE INDEX idx_tenants_code ON tenants(tenant_code);
CREATE INDEX idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX idx_tenants_status ON tenants(status);
```

**UI Form Fields:**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Tenant Name | Text | Yes | Min 3, Max 200 chars | "Acme Corporation" |
| Tenant Code | Text | Yes | Uppercase, alphanumeric, 3-10 chars | "ACME" |
| Subdomain | Text | Yes | Lowercase, alphanumeric, 3-30 chars | "acme" |
| Admin First Name | Text | Yes | Min 2 chars | "John" |
| Admin Last Name | Text | Yes | Min 2 chars | "Doe" |
| Admin Email | Email | Yes | Valid email format | "john@acme.com" |
| Admin Phone | Tel | Yes | 10 digits | "(555) 123-4567" |
| Subscription Plan | Dropdown | Yes | Options: Trial, Starter, Professional, Enterprise | Select plan |
| Max Employees | Number | Yes | Min 1, Max 10000 | "50" |
| Industry | Dropdown | No | NAICS codes | Select industry |
| Country | Dropdown | Yes | ISO country codes | "United States" |
| Time Zone | Dropdown | Yes | IANA time zones | "America/New_York" |

**React Component Structure:**
```tsx
// TenantRegistrationForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const tenantSchema = z.object({
  tenantName: z.string().min(3).max(200),
  tenantCode: z.string().regex(/^[A-Z0-9]{3,10}$/),
  subdomain: z.string().regex(/^[a-z0-9]{3,30}$/),
  adminFirstName: z.string().min(2),
  adminLastName: z.string().min(2),
  adminEmail: z.string().email(),
  adminPhone: z.string().regex(/^\d{10}$/),
  subscriptionPlan: z.enum(['TRIAL', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE']),
  maxEmployees: z.number().min(1).max(10000),
  industry: z.string().optional(),
  country: z.string(),
  timeZone: z.string()
});
```

**Backend DTOs:**
```java
// TenantRegistrationRequest.java
@Data
@Validated
public class TenantRegistrationRequest {
    @NotBlank(message = "Tenant name is required")
    @Size(min = 3, max = 200)
    private String tenantName;
    
    @NotBlank
    @Pattern(regexp = "^[A-Z0-9]{3,10}$")
    private String tenantCode;
    
    @NotBlank
    @Pattern(regexp = "^[a-z0-9]{3,30}$")
    private String subdomain;
    
    @NotBlank
    @Size(min = 2, max = 100)
    private String adminFirstName;
    
    @NotBlank
    @Size(min = 2, max = 100)
    private String adminLastName;
    
    @NotBlank
    @Email
    private String adminEmail;
    
    @NotBlank
    @Pattern(regexp = "^\\d{10}$")
    private String adminPhone;
    
    @NotNull
    private SubscriptionPlan subscriptionPlan;
    
    @Min(1)
    @Max(10000)
    private Integer maxEmployees;
    
    private String industry;
    
    @NotBlank
    private String country;
    
    @NotBlank
    private String timeZone;
}
```

**Swagger Documentation:**
```java
@Operation(summary = "Register new tenant", 
           description = "Create a new tenant organization with admin user")
@ApiResponses({
    @ApiResponse(responseCode = "201", description = "Tenant created successfully"),
    @ApiResponse(responseCode = "400", description = "Invalid input data"),
    @ApiResponse(responseCode = "409", description = "Tenant code or subdomain already exists")
})
@PostMapping("/api/v1/admin/tenants")
public ResponseEntity<TenantResponse> registerTenant(
    @Valid @RequestBody TenantRegistrationRequest request
);
```

---

### Story 1.2: Organization Profile Setup

**As a** Tenant Administrator  
**I want to** set up my organization profile  
**So that** organization details are available throughout the system

**Priority:** HIGH  
**Story Points:** 5  
**Sprint:** Sprint 1  

#### Acceptance Criteria
- [ ] Admin can access organization settings page
- [ ] Legal name, business registration, and tax details can be entered
- [ ] Company logo can be uploaded
- [ ] Address and contact information can be saved
- [ ] Changes are audited with timestamp and user

#### UI Form Fields

**Section 1: Basic Information**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Legal Name | Text | Yes | Min 3, Max 200 | "Acme Corporation LLC" |
| Trade Name (DBA) | Text | No | Max 200 | "Acme Corp" |
| Company Logo | File | No | JPG/PNG, Max 2MB, Min 200x200px | Upload logo |
| Tagline | Text | No | Max 100 | "Innovation at its best" |
| Website | URL | No | Valid URL | "https://www.acme.com" |
| Founded Year | Number | No | 1800-current year | "2010" |
| Employee Count Range | Dropdown | Yes | 1-10, 11-50, 51-200, 201-500, 500+ | Select range |

**Section 2: Business Registration**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Business Entity Type | Dropdown | Yes | LLC, Corp, S-Corp, Partnership, Sole Proprietor | Select type |
| Registration Number | Text | No | Alphanumeric, max 50 | "1234567890" |
| Registration State | Dropdown | No | US States | Select state |
| Registration Date | Date | No | Past date | "MM/DD/YYYY" |

**Section 3: Tax Information**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Federal EIN | Text | Yes | XX-XXXXXXX format | "12-3456789" |
| State Tax ID | Text | No | Varies by state | "ST-123456" |
| PAN Number | Text | No | AAAAA9999A format (if India) | "ABCDE1234F" |
| GST Number | Text | No | 15 chars (if applicable) | "22AAAAA0000A1Z5" |
| TAN Number | Text | No | AAAA99999A format | "ABCD12345E" |

**Section 4: Primary Address**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Address Line 1 | Text | Yes | Max 255 | "123 Main Street" |
| Address Line 2 | Text | No | Max 255 | "Suite 100" |
| City | Text | Yes | Max 100 | "New York" |
| State/Province | Dropdown | Yes | Based on country | Select state |
| ZIP/Postal Code | Text | Yes | Format based on country | "10001" |
| Country | Dropdown | Yes | ISO countries | "United States" |

**Section 5: Contact Information**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Primary Phone | Tel | Yes | E.164 format | "+1 (555) 123-4567" |
| Secondary Phone | Tel | No | E.164 format | "+1 (555) 123-4568" |
| Primary Email | Email | Yes | Valid email | "info@acme.com" |
| HR Email | Email | No | Valid email | "hr@acme.com" |
| Payroll Email | Email | No | Valid email | "payroll@acme.com" |

**Database Schema:**
```sql
CREATE TABLE organizations (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    legal_name VARCHAR(200) NOT NULL,
    trade_name VARCHAR(200),
    logo_url VARCHAR(500),
    tagline VARCHAR(100),
    website VARCHAR(255),
    founded_year INTEGER,
    employee_count_range VARCHAR(20),
    
    -- Business Registration
    entity_type VARCHAR(50),
    registration_number VARCHAR(50),
    registration_state VARCHAR(50),
    registration_date DATE,
    
    -- Tax Information
    federal_ein VARCHAR(12) NOT NULL,
    state_tax_id VARCHAR(50),
    pan_number VARCHAR(10),
    gst_number VARCHAR(15),
    tan_number VARCHAR(10),
    
    -- Primary Address
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    
    -- Contact Information
    primary_phone VARCHAR(20) NOT NULL,
    secondary_phone VARCHAR(20),
    primary_email VARCHAR(255) NOT NULL,
    hr_email VARCHAR(255),
    payroll_email VARCHAR(255),
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT unique_org_per_tenant UNIQUE(tenant_id)
);

CREATE INDEX idx_organizations_tenant ON organizations(tenant_id);
CREATE INDEX idx_organizations_ein ON organizations(federal_ein);
```

---

### Story 1.3: Department Management

**As a** HR Manager  
**I want to** create and manage departments  
**So that** employees can be organized into departments for reporting

**Priority:** HIGH  
**Story Points:** 8  
**Sprint:** Sprint 2  

#### Acceptance Criteria
- [ ] HR Manager can create new departments
- [ ] Departments can be organized in a hierarchy (parent-child)
- [ ] Department head can be assigned
- [ ] Cost center can be assigned to department
- [ ] Department can be activated/deactivated
- [ ] Employee count is displayed for each department

#### UI Form Fields

**Department Form:**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Department Code | Text | Yes | Uppercase, 3-10 chars, unique | "ENG" |
| Department Name | Text | Yes | Min 2, Max 100 | "Engineering" |
| Parent Department | Dropdown | No | Select from existing departments | Select parent |
| Department Head | Searchable Dropdown | No | Select employee | Search employee |
| Cost Center | Text | No | Alphanumeric, max 20 | "CC-1001" |
| Budget Allocated | Number | No | Positive number | "100000" |
| Location | Text | No | Max 100 | "New York Office" |
| Email | Email | No | Valid email | "engineering@acme.com" |
| Phone Extension | Text | No | Max 10 | "1234" |
| Description | Textarea | No | Max 500 | Department description |
| Status | Toggle | Yes | Active/Inactive | Active |

**Department List Table Columns:**
- Department Code
- Department Name
- Parent Department
- Department Head
- Employee Count
- Cost Center
- Status
- Actions (Edit, View, Delete)

**Database Schema:**
```sql
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    organization_id BIGINT NOT NULL REFERENCES organizations(id),
    department_code VARCHAR(10) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    parent_department_id BIGINT REFERENCES departments(id),
    department_head_id BIGINT REFERENCES employees(id),
    cost_center VARCHAR(20),
    budget_allocated DECIMAL(15,2),
    location VARCHAR(100),
    email VARCHAR(255),
    phone_extension VARCHAR(10),
    description TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    level INTEGER DEFAULT 0,
    path VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT unique_dept_code_per_org UNIQUE(organization_id, department_code),
    CONSTRAINT check_dept_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX idx_departments_tenant ON departments(tenant_id);
CREATE INDEX idx_departments_org ON departments(organization_id);
CREATE INDEX idx_departments_parent ON departments(parent_department_id);
CREATE INDEX idx_departments_head ON departments(department_head_id);
CREATE INDEX idx_departments_status ON departments(status);
```

**API Endpoints:**
```
POST   /api/v1/departments                # Create department
GET    /api/v1/departments                # List all departments
GET    /api/v1/departments/{id}           # Get department details
PUT    /api/v1/departments/{id}           # Update department
DELETE /api/v1/departments/{id}           # Delete department
GET    /api/v1/departments/hierarchy      # Get department tree
GET    /api/v1/departments/{id}/employees # Get employees in department
```

**React Component:**
```tsx
// DepartmentForm.tsx
const departmentSchema = z.object({
  departmentCode: z.string().regex(/^[A-Z0-9]{3,10}$/),
  departmentName: z.string().min(2).max(100),
  parentDepartmentId: z.number().optional(),
  departmentHeadId: z.number().optional(),
  costCenter: z.string().max(20).optional(),
  budgetAllocated: z.number().positive().optional(),
  location: z.string().max(100).optional(),
  email: z.string().email().optional(),
  phoneExtension: z.string().max(10).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE'])
});
```

---

### Story 1.4: Cost Center Management

**As a** Finance Manager  
**I want to** define and manage cost centers  
**So that** payroll costs can be allocated to different cost centers

**Priority:** MEDIUM  
**Story Points:** 5  
**Sprint:** Sprint 2  

#### Acceptance Criteria
- [ ] Finance manager can create cost centers
- [ ] Cost centers can be assigned to departments
- [ ] Cost center budget can be set
- [ ] Budget utilization can be tracked
- [ ] Alerts when budget exceeds threshold

#### UI Form Fields

**Cost Center Form:**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Cost Center Code | Text | Yes | Alphanumeric, unique, max 20 | "CC-1001" |
| Cost Center Name | Text | Yes | Min 3, Max 100 | "IT Operations" |
| Category | Dropdown | Yes | Department, Project, Location, Other | Select category |
| Owner | Searchable Dropdown | No | Select employee | Search employee |
| Annual Budget | Number | No | Positive number | "500000" |
| Currency | Dropdown | Yes | ISO currency codes | "USD" |
| Start Date | Date | Yes | Valid date | "MM/DD/YYYY" |
| End Date | Date | No | After start date | "MM/DD/YYYY" |
| Description | Textarea | No | Max 500 | Cost center description |
| Alert Threshold (%) | Number | No | 1-100 | "80" |
| Status | Toggle | Yes | Active/Inactive | Active |

**Database Schema:**
```sql
CREATE TABLE cost_centers (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    cost_center_code VARCHAR(20) UNIQUE NOT NULL,
    cost_center_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    owner_id BIGINT REFERENCES employees(id),
    annual_budget DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    alert_threshold INTEGER DEFAULT 80,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

CREATE TABLE cost_center_allocations (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    cost_center_id BIGINT NOT NULL REFERENCES cost_centers(id),
    department_id BIGINT REFERENCES departments(id),
    employee_id BIGINT REFERENCES employees(id),
    allocation_percentage DECIMAL(5,2) DEFAULT 100.00,
    effective_from DATE NOT NULL,
    effective_to DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_allocation_percentage 
        CHECK (allocation_percentage > 0 AND allocation_percentage <= 100)
);
```

---

### Story 1.5: Organizational Hierarchy Visualization

**As a** HR Manager  
**I want to** view the organizational hierarchy  
**So that** I can understand reporting relationships

**Priority:** MEDIUM  
**Story Points:** 5  
**Sprint:** Sprint 2  

#### Acceptance Criteria
- [ ] Org chart displays department hierarchy
- [ ] Employee reporting structure is visible
- [ ] Interactive zoom and pan functionality
- [ ] Export org chart as image/PDF
- [ ] Search and filter functionality

#### UI Components
- Org chart visualization (react-organizational-chart or D3.js)
- Department cards with employee count
- Employee cards with photo and title
- Zoom controls
- Export buttons

---

### Story 1.6: Location/Branch Management

**As a** HR Manager  
**I want to** manage multiple office locations  
**So that** employees can be assigned to specific locations

**Priority:** MEDIUM  
**Story Points:** 5  
**Sprint:** Sprint 2  

#### UI Form Fields

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Location Code | Text | Yes | Unique, max 10 | "NYC-HQ" |
| Location Name | Text | Yes | Min 3, Max 100 | "New York Headquarters" |
| Location Type | Dropdown | Yes | HQ, Branch, Remote, Warehouse | Select type |
| Address | Text | Yes | Max 255 | "123 Main St" |
| City | Text | Yes | Max 100 | "New York" |
| State | Dropdown | Yes | US States | "NY" |
| ZIP Code | Text | Yes | 5 or 9 digits | "10001" |
| Country | Dropdown | Yes | Countries | "United States" |
| Time Zone | Dropdown | Yes | IANA timezones | "America/New_York" |
| Contact Person | Text | No | Max 100 | "John Doe" |
| Phone | Tel | No | Valid format | "(555) 123-4567" |
| Email | Email | No | Valid email | "nyc@acme.com" |
| Is Primary | Checkbox | No | Boolean | Unchecked |
| Status | Toggle | Yes | Active/Inactive | Active |

**Database Schema:**
```sql
CREATE TABLE locations (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    organization_id BIGINT NOT NULL REFERENCES organizations(id),
    location_code VARCHAR(10) NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    location_type VARCHAR(20),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    time_zone VARCHAR(50) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT unique_location_code_per_org UNIQUE(organization_id, location_code)
);
```

---

### Story 1.7: Holiday Calendar Management

**As a** HR Manager  
**I want to** define company holidays  
**So that** payroll processing accounts for non-working days

**Priority:** MEDIUM  
**Story Points:** 3  
**Sprint:** Sprint 2  

#### UI Form Fields

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Holiday Name | Text | Yes | Min 3, Max 100 | "New Year's Day" |
| Holiday Date | Date | Yes | Valid date | "01/01/2025" |
| Holiday Type | Dropdown | Yes | National, Regional, Company | Select type |
| Applicable Locations | Multi-select | No | Select locations | Select locations |
| Is Paid | Checkbox | Yes | Boolean | Checked |
| Is Recurring | Checkbox | No | Boolean | Unchecked |
| Description | Textarea | No | Max 500 | Holiday description |

**Database Schema:**
```sql
CREATE TABLE holidays (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    organization_id BIGINT NOT NULL REFERENCES organizations(id),
    holiday_name VARCHAR(100) NOT NULL,
    holiday_date DATE NOT NULL,
    holiday_type VARCHAR(20),
    is_paid BOOLEAN DEFAULT TRUE,
    is_recurring BOOLEAN DEFAULT FALSE,
    description TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);

CREATE TABLE holiday_locations (
    id BIGSERIAL PRIMARY KEY,
    holiday_id BIGINT NOT NULL REFERENCES holidays(id),
    location_id BIGINT NOT NULL REFERENCES locations(id),
    
    CONSTRAINT unique_holiday_location UNIQUE(holiday_id, location_id)
);
```

---

### Story 1.8: Work Week Configuration

**As a** HR Manager  
**I want to** configure the standard work week  
**So that** attendance and payroll calculations are accurate

**Priority:** MEDIUM  
**Story Points:** 3  
**Sprint:** Sprint 2  

#### UI Form Fields

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Working Days | Checkboxes | Yes | At least 1 day | Mon-Sun |
| Standard Hours/Day | Number | Yes | 1-24 | "8" |
| Standard Hours/Week | Number | Yes | 1-168 | "40" |
| Week Starts On | Dropdown | Yes | Sunday/Monday | "Monday" |
| Overtime Threshold (Daily) | Number | No | 1-24 | "8" |
| Overtime Threshold (Weekly) | Number | No | 1-168 | "40" |
| Overtime Multiplier | Number | Yes | Min 1.0 | "1.5" |

**Database Schema:**
```sql
CREATE TABLE work_week_configs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    organization_id BIGINT NOT NULL REFERENCES organizations(id),
    monday BOOLEAN DEFAULT TRUE,
    tuesday BOOLEAN DEFAULT TRUE,
    wednesday BOOLEAN DEFAULT TRUE,
    thursday BOOLEAN DEFAULT TRUE,
    friday BOOLEAN DEFAULT TRUE,
    saturday BOOLEAN DEFAULT FALSE,
    sunday BOOLEAN DEFAULT FALSE,
    standard_hours_per_day DECIMAL(4,2) DEFAULT 8.00,
    standard_hours_per_week DECIMAL(5,2) DEFAULT 40.00,
    week_starts_on VARCHAR(10) DEFAULT 'MONDAY',
    overtime_threshold_daily DECIMAL(4,2) DEFAULT 8.00,
    overtime_threshold_weekly DECIMAL(5,2) DEFAULT 40.00,
    overtime_multiplier DECIMAL(3,2) DEFAULT 1.50,
    
    effective_from DATE NOT NULL,
    effective_to DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT
);
```

---

## Testing Requirements

### Unit Tests
- Tenant creation with validation
- Department hierarchy validation
- Cost center allocation calculations
- Holiday date calculations

### Integration Tests
- Multi-tenant data isolation
- Department CRUD operations
- Cost center budget tracking
- Location-based filtering

### E2E Tests
- Complete tenant onboarding flow
- Organization setup wizard
- Department creation and assignment
- Hierarchy visualization

---

## Documentation Requirements
- [ ] API documentation in Swagger
- [ ] User guide for organization setup
- [ ] Admin guide for tenant management
- [ ] Video tutorial for department hierarchy

---

**Epic Status:** Ready for Development  
**Last Updated:** December 2024
