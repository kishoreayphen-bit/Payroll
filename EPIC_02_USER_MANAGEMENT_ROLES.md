# EPIC 02: USER MANAGEMENT & ROLES

**Module:** User Management & Roles  
**Priority:** HIGH  
**Sprint:** Sprint 1-2  
**Estimated Effort:** 34 Story Points  

---

## Epic Overview

Implement comprehensive user management with role-based access control (RBAC), permission management, and user authentication/authorization for the payroll system.

**Business Value:**
- Secure access to payroll data
- Role-based permissions for different user types
- Audit trail for user actions
- Multi-level approval workflows

**Acceptance Criteria:**
- Users can be created with specific roles
- Permissions are enforced at API level
- Users can reset passwords securely
- Session management with JWT tokens
- Audit log for all user activities

---

## User Stories

### Story 2.1: User Registration & Authentication

**As a** System Administrator  
**I want to** create user accounts with authentication  
**So that** only authorized users can access the system

**Priority:** HIGH  
**Story Points:** 8  
**Sprint:** Sprint 1  

#### Acceptance Criteria
- [ ] Admin can create new user accounts
- [ ] Users can login with email and password
- [ ] Passwords are encrypted using BCrypt
- [ ] JWT tokens are generated on successful login
- [ ] Refresh token mechanism is implemented
- [ ] Failed login attempts are tracked
- [ ] Account lockout after 5 failed attempts

#### UI Form Fields

**User Registration Form:**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| First Name | Text | Yes | Min 2, Max 50, letters only | "John" |
| Last Name | Text | Yes | Min 2, Max 50, letters only | "Doe" |
| Email Address | Email | Yes | Valid email, unique | "john.doe@company.com" |
| Username | Text | Yes | Min 4, Max 30, alphanumeric, unique | "johndoe" |
| Phone Number | Tel | Yes | 10 digits, valid format | "(555) 123-4567" |
| Role | Dropdown | Yes | Select from available roles | Select role |
| Department | Dropdown | No | Select department | Select department |
| Employee ID | Text | No | Link to employee record | "EMP-1001" |
| Status | Toggle | Yes | Active/Inactive | Active |
| Password | Password | Yes | Min 8 chars, 1 upper, 1 lower, 1 number, 1 special | Enter password |
| Confirm Password | Password | Yes | Must match password | Re-enter password |

**Login Form:**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Email/Username | Text | Yes | Valid format | "email or username" |
| Password | Password | Yes | Not empty | "Enter password" |
| Remember Me | Checkbox | No | Boolean | Unchecked |

**Database Schema:**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    employee_id BIGINT REFERENCES employees(id),
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    profile_picture_url VARCHAR(500),
    
    status VARCHAR(20) DEFAULT 'ACTIVE',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verified_at TIMESTAMP,
    
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_password_change TIMESTAMP,
    
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMP,
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(45),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT check_user_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED'))
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_employee ON users(employee_id);
CREATE INDEX idx_users_status ON users(status);

CREATE TABLE user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    access_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500) NOT NULL,
    access_token_expires TIMESTAMP NOT NULL,
    refresh_token_expires TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_access_token ON user_sessions(access_token);
CREATE INDEX idx_sessions_refresh_token ON user_sessions(refresh_token);
```

**API Endpoints:**
```
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # User login
POST   /api/v1/auth/refresh           # Refresh access token
POST   /api/v1/auth/logout            # User logout
POST   /api/v1/auth/forgot-password   # Request password reset
POST   /api/v1/auth/reset-password    # Reset password with token
POST   /api/v1/auth/verify-email      # Verify email address
GET    /api/v1/auth/me                # Get current user
PUT    /api/v1/auth/change-password   # Change password
```

**React Component (Zod Schema):**
```tsx
// userSchema.ts
import { z } from 'zod';

export const userRegistrationSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters'),
  
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters'),
  
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  
  username: z.string()
    .min(4, 'Username must be at least 4 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  phoneNumber: z.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid phone number format'),
  
  roleId: z.number().min(1, 'Please select a role'),
  
  departmentId: z.number().optional(),
  
  employeeId: z.string().optional(),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain uppercase, lowercase, number, and special character'),
  
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});
```

**Java DTOs:**
```java
// UserRegistrationRequest.java
@Data
@Validated
public class UserRegistrationRequest {
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50)
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$", message = "First name can only contain letters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50)
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$", message = "Last name can only contain letters")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;
    
    @NotBlank(message = "Username is required")
    @Size(min = 4, max = 30)
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
    private String username;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\(\\d{3}\\) \\d{3}-\\d{4}$", message = "Invalid phone number format")
    private String phoneNumber;
    
    @NotNull(message = "Role is required")
    private Long roleId;
    
    private Long departmentId;
    
    private String employeeId;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
             message = "Password must contain uppercase, lowercase, number, and special character")
    private String password;
    
    @NotBlank(message = "Password confirmation is required")
    private String confirmPassword;
}

// LoginRequest.java
@Data
public class LoginRequest {
    @NotBlank(message = "Email or username is required")
    private String emailOrUsername;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    private boolean rememberMe;
}

// LoginResponse.java
@Data
@Builder
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserDTO user;
}
```

**Swagger Documentation:**
```java
@Tag(name = "Authentication", description = "Authentication and authorization endpoints")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    
    @Operation(summary = "User login", description = "Authenticate user and generate JWT tokens")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @ApiResponse(responseCode = "423", description = "Account locked")
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        // Implementation
    }
    
    @Operation(summary = "Register new user", description = "Create a new user account")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "User registered successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "409", description = "Email or username already exists")
    })
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@Valid @RequestBody UserRegistrationRequest request) {
        // Implementation
    }
}
```

---

### Story 2.2: Role Management

**As a** System Administrator  
**I want to** define roles with specific permissions  
**So that** users have appropriate access levels

**Priority:** HIGH  
**Story Points:** 5  
**Sprint:** Sprint 1  

#### Acceptance Criteria
- [ ] Admin can create, edit, delete roles
- [ ] Roles can be assigned multiple permissions
- [ ] System comes with predefined roles
- [ ] Role hierarchy is supported
- [ ] Changes to roles are audited

#### UI Form Fields

**Role Form:**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Role Name | Text | Yes | Min 3, Max 50, unique | "Payroll Manager" |
| Role Code | Text | Yes | Uppercase, unique, max 20 | "PAYROLL_MGR" |
| Description | Textarea | No | Max 500 | Role description |
| Parent Role | Dropdown | No | Select parent role | Select parent |
| Priority Level | Number | Yes | 1-100 | "50" |
| Is System Role | Checkbox | No | Boolean (readonly for system roles) | Unchecked |
| Status | Toggle | Yes | Active/Inactive | Active |

**Predefined System Roles:**
1. **Super Admin** - Full system access
2. **Tenant Admin** - Full access within tenant
3. **HR Manager** - Employee and payroll management
4. **Payroll Manager** - Payroll processing
5. **Finance Manager** - Payment and compliance
6. **Manager** - Team management and approvals
7. **Employee** - Self-service access
8. **Accountant** - Read-only access to financial data
9. **Auditor** - Read-only access for compliance

**Database Schema:**
```sql
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT REFERENCES tenants(id),
    role_name VARCHAR(50) NOT NULL,
    role_code VARCHAR(20) NOT NULL,
    description TEXT,
    parent_role_id BIGINT REFERENCES roles(id),
    priority_level INTEGER DEFAULT 50,
    is_system_role BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT unique_role_code UNIQUE(tenant_id, role_code),
    CONSTRAINT check_role_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    role_id BIGINT NOT NULL REFERENCES roles(id),
    assigned_by BIGINT REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_user_role UNIQUE(user_id, role_id)
);

CREATE INDEX idx_roles_tenant ON roles(tenant_id);
CREATE INDEX idx_roles_code ON roles(role_code);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);
```

**API Endpoints:**
```
POST   /api/v1/roles              # Create role
GET    /api/v1/roles              # List all roles
GET    /api/v1/roles/{id}         # Get role details
PUT    /api/v1/roles/{id}         # Update role
DELETE /api/v1/roles/{id}         # Delete role
POST   /api/v1/roles/{id}/users   # Assign role to users
GET    /api/v1/roles/{id}/users   # Get users with role
```

---

### Story 2.3: Permission Management

**As a** System Administrator  
**I want to** define granular permissions  
**So that** access to features can be controlled precisely

**Priority:** HIGH  
**Story Points:** 8  
**Sprint:** Sprint 1  

#### Acceptance Criteria
- [ ] Permissions are defined for each module
- [ ] Permissions can be assigned to roles
- [ ] Permissions are enforced at API endpoints
- [ ] Permission inheritance from parent roles
- [ ] Permission matrix UI for easy management

#### Permission Structure

**Permission Format:** `MODULE:ENTITY:ACTION`

**Examples:**
- `EMPLOYEE:EMPLOYEE:VIEW`
- `EMPLOYEE:EMPLOYEE:CREATE`
- `EMPLOYEE:EMPLOYEE:EDIT`
- `EMPLOYEE:EMPLOYEE:DELETE`
- `PAYROLL:PAYROLL_RUN:APPROVE`
- `REPORTS:SALARY:EXPORT`

**Permission Categories:**

| Module | Entities | Actions |
|--------|----------|---------|
| EMPLOYEE | Employee, Department, Document | VIEW, CREATE, EDIT, DELETE |
| ATTENDANCE | Attendance, Shift, Leave | VIEW, CREATE, EDIT, DELETE, APPROVE |
| PAYROLL | PayrollRun, SalaryStructure, Component | VIEW, CREATE, EDIT, DELETE, PROCESS, APPROVE |
| TAX | TaxConfig, Investment, Form16 | VIEW, CREATE, EDIT, DELETE, VERIFY |
| PAYMENT | Payment, BankAccount | VIEW, CREATE, APPROVE, PROCESS |
| REPORTS | All Reports | VIEW, EXPORT, PRINT |
| SETTINGS | System, Organization, User | VIEW, EDIT |

**Database Schema:**
```sql
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    permission_code VARCHAR(100) UNIQUE NOT NULL,
    permission_name VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    is_system_permission BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_permission_format 
        CHECK (permission_code ~ '^[A-Z_]+:[A-Z_]+:[A-Z_]+$')
);

CREATE TABLE role_permissions (
    id BIGSERIAL PRIMARY KEY,
    role_id BIGINT NOT NULL REFERENCES roles(id),
    permission_id BIGINT NOT NULL REFERENCES permissions(id),
    granted_by BIGINT REFERENCES users(id),
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_role_permission UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_permissions_code ON permissions(permission_code);
CREATE INDEX idx_permissions_module ON permissions(module);
CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);
```

**Java Permission Check:**
```java
// Permission annotation
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequirePermission {
    String value();
}

// Usage in controller
@RequirePermission("EMPLOYEE:EMPLOYEE:CREATE")
@PostMapping("/api/v1/employees")
public ResponseEntity<EmployeeDTO> createEmployee(@Valid @RequestBody EmployeeRequest request) {
    // Implementation
}

// Permission service
@Service
public class PermissionService {
    public boolean hasPermission(User user, String permissionCode) {
        return user.getRoles().stream()
            .flatMap(role -> role.getPermissions().stream())
            .anyMatch(permission -> permission.getCode().equals(permissionCode));
    }
}
```

---

### Story 2.4: User Profile Management

**As a** User  
**I want to** manage my profile information  
**So that** my details are up to date

**Priority:** MEDIUM  
**Story Points:** 3  
**Sprint:** Sprint 2  

#### UI Form Fields

**Profile Form:**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Profile Picture | File Upload | No | JPG/PNG, Max 2MB, Min 200x200px | Upload photo |
| First Name | Text | Yes | Min 2, Max 50 | "John" |
| Last Name | Text | Yes | Min 2, Max 50 | "Doe" |
| Email | Email | Yes | Valid email (readonly) | "john@company.com" |
| Phone Number | Tel | Yes | Valid format | "(555) 123-4567" |
| Alternative Email | Email | No | Valid email | "john.personal@email.com" |
| Alternative Phone | Tel | No | Valid format | "(555) 987-6543" |
| Date of Birth | Date | No | Past date | "MM/DD/YYYY" |
| Gender | Dropdown | No | Male, Female, Other, Prefer not to say | Select |
| Address Line 1 | Text | No | Max 255 | "123 Main St" |
| Address Line 2 | Text | No | Max 255 | "Apt 4B" |
| City | Text | No | Max 100 | "New York" |
| State | Dropdown | No | US States | Select state |
| ZIP Code | Text | No | 5 or 9 digits | "10001" |
| Country | Dropdown | No | Countries | "United States" |
| Time Zone | Dropdown | No | IANA timezones | "America/New_York" |
| Language | Dropdown | No | en, es, fr | "English" |

**Database Schema:**
```sql
ALTER TABLE users ADD COLUMN alternative_email VARCHAR(255);
ALTER TABLE users ADD COLUMN alternative_phone VARCHAR(20);
ALTER TABLE users ADD COLUMN date_of_birth DATE;
ALTER TABLE users ADD COLUMN gender VARCHAR(20);
ALTER TABLE users ADD COLUMN address_line1 VARCHAR(255);
ALTER TABLE users ADD COLUMN address_line2 VARCHAR(255);
ALTER TABLE users ADD COLUMN city VARCHAR(100);
ALTER TABLE users ADD COLUMN state VARCHAR(100);
ALTER TABLE users ADD COLUMN postal_code VARCHAR(20);
ALTER TABLE users ADD COLUMN country VARCHAR(100);
ALTER TABLE users ADD COLUMN time_zone VARCHAR(50);
ALTER TABLE users ADD COLUMN language VARCHAR(10) DEFAULT 'en';
```

---

### Story 2.5: Password Reset & Change

**As a** User  
**I want to** reset or change my password  
**So that** I can maintain account security

**Priority:** HIGH  
**Story Points:** 3  
**Sprint:** Sprint 1  

#### UI Form Fields

**Forgot Password Form:**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Email Address | Email | Yes | Valid email | "john@company.com" |

**Reset Password Form:**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| New Password | Password | Yes | Min 8, complex | Enter new password |
| Confirm Password | Password | Yes | Must match | Re-enter password |

**Change Password Form:**

| Field Name | Type | Required | Validation | Placeholder |
|------------|------|----------|------------|-------------|
| Current Password | Password | Yes | Not empty | Enter current password |
| New Password | Password | Yes | Min 8, complex | Enter new password |
| Confirm Password | Password | Yes | Must match | Re-enter password |

**Security Features:**
- Password reset token expires in 1 hour
- Token can only be used once
- Email notification on password change
- Failed attempts tracked
- Password history (prevent reuse of last 5 passwords)

---

### Story 2.6: Two-Factor Authentication (2FA)

**As a** User  
**I want to** enable two-factor authentication  
**So that** my account is more secure

**Priority:** MEDIUM  
**Story Points:** 5  
**Sprint:** Sprint 2  

#### UI Components
- QR Code for authenticator app setup
- 6-digit code input
- Backup codes generation (10 codes)
- SMS option (future enhancement)

**Database Schema:**
```sql
ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN two_factor_secret VARCHAR(255);
ALTER TABLE users ADD COLUMN two_factor_method VARCHAR(20);

CREATE TABLE two_factor_backup_codes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    code_hash VARCHAR(255) NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### Story 2.7: Session Management

**As a** User  
**I want to** manage my active sessions  
**So that** I can logout from other devices

**Priority:** MEDIUM  
**Story Points:** 3  
**Sprint:** Sprint 2  

#### UI Components
- Active sessions list
- Device type and location
- Last accessed timestamp
- Logout button for each session
- Logout all sessions button

---

### Story 2.8: User Activity Log

**As a** Administrator  
**I want to** view user activity logs  
**So that** I can audit user actions

**Priority:** MEDIUM  
**Story Points:** 5  
**Sprint:** Sprint 2  

#### Database Schema
```sql
CREATE TABLE user_activity_logs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    module VARCHAR(50),
    entity_type VARCHAR(50),
    entity_id BIGINT,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_payload JSONB,
    response_status INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_tenant ON user_activity_logs(tenant_id);
CREATE INDEX idx_activity_logs_user ON user_activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON user_activity_logs(action);
CREATE INDEX idx_activity_logs_created ON user_activity_logs(created_at);
```

---

### Story 2.9: User Approval Workflow

**As a** HR Manager  
**I want to** approve new user registrations  
**So that** only authorized users get access

**Priority:** LOW  
**Story Points:** 3  
**Sprint:** Sprint 3  

#### Workflow
1. User submits registration
2. Admin receives notification
3. Admin reviews and approves/rejects
4. User receives approval email
5. User can login after approval

---

### Story 2.10: User Deactivation & Reactivation

**As a** Administrator  
**I want to** deactivate and reactivate users  
**So that** access can be controlled

**Priority:** MEDIUM  
**Story Points:** 2  
**Sprint:** Sprint 2  

#### Features
- Soft delete (deactivate)
- Reactivate option
- Terminate all active sessions on deactivation
- Audit trail of status changes

---

### Story 2.11: Bulk User Import

**As a** Administrator  
**I want to** import multiple users from CSV  
**So that** onboarding is faster

**Priority:** LOW  
**Story Points:** 5  
**Sprint:** Sprint 3  

#### CSV Format
```csv
first_name,last_name,email,username,phone,role_code,department_code,employee_id
John,Doe,john@company.com,johndoe,(555) 123-4567,EMPLOYEE,ENG,EMP-1001
```

---

### Story 2.12: User Notification Preferences

**As a** User  
**I want to** configure my notification preferences  
**So that** I receive relevant alerts

**Priority:** LOW  
**Story Points:** 3  
**Sprint:** Sprint 3  

#### Notification Types
- Email notifications
- In-app notifications
- SMS notifications (future)
- Push notifications (future)

**Database Schema:**
```sql
CREATE TABLE user_notification_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    notification_type VARCHAR(50) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    
    CONSTRAINT unique_user_notification UNIQUE(user_id, notification_type, channel)
);
```

---

## Testing Requirements

### Unit Tests
- Password hashing and validation
- JWT token generation and validation
- Permission checking logic
- Role hierarchy validation

### Integration Tests
- Login flow with JWT
- Password reset flow
- 2FA setup and verification
- Session management

### Security Tests
- SQL injection prevention
- XSS prevention
- CSRF protection
- Brute force protection

---

## Documentation Requirements
- [ ] API documentation for all auth endpoints
- [ ] User guide for password management
- [ ] Admin guide for user and role management
- [ ] Security best practices document

---

**Epic Status:** Ready for Development  
**Last Updated:** December 2024
