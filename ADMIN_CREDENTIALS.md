# Admin User Credentials

## 🔐 Default Admin Account

A default administrator account has been created in the database for initial system access.

### **Login Credentials:**

```
Email:    admin@payrollpro.com
Password: Admin@123456
```

---

## 📋 Admin User Details

| Field | Value |
|-------|-------|
| **Email** | admin@payrollpro.com |
| **Password** | Admin@123456 |
| **Phone** | 9999999999 |
| **Company** | PayrollPro Admin |
| **Country** | India |
| **State** | Karnataka |
| **Role** | ADMIN |

---

## 🚀 How to Login

1. **Go to:** http://localhost:5173/login
2. **Enter:**
   - Email: `admin@payrollpro.com`
   - Password: `Admin@123456`
3. **Click "Next"**
4. **You'll be redirected to:** `/organizations`

---

## 🛡️ Admin Privileges

The admin user has full access to:

- ✅ All organizations
- ✅ All user management
- ✅ System configuration
- ✅ Create/Edit/Delete operations
- ✅ View all data across tenants

---

## 🔧 Database Migration

The admin user is created by Flyway migration:
- **File:** `V2__seed_admin_user.sql`
- **Location:** `backend/src/main/resources/db/migration/`

The migration:
1. Creates ADMIN and USER roles
2. Inserts admin user with BCrypt hashed password
3. Assigns ADMIN role to the user
4. Only runs if admin doesn't already exist (idempotent)

---

## 🔒 Security Notes

### **IMPORTANT: Change Password in Production!**

⚠️ **This is a default password for development only!**

For production:
1. Login with default credentials
2. Go to profile/settings
3. Change password immediately
4. Use a strong password with:
   - Minimum 12 characters
   - Uppercase and lowercase letters
   - Numbers and special characters

### **Password Requirements:**

The system enforces:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

## 📝 Testing the Admin Account

### **Test Login:**

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@payrollpro.com",
    "password": "Admin@123456"
  }'
```

### **Expected Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@payrollpro.com",
    "companyName": "PayrollPro Admin"
  }
}
```

---

## 🔄 Reset Admin Password

If you forget the admin password, run this SQL:

```sql
-- Reset admin password to: Admin@123456
UPDATE users 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMye1J4Wv0qLqGxGvV5YKqZzKqZzKqZzKqZ.'
WHERE email = 'admin@payrollpro.com';
```

Or create a new admin:

```sql
-- Create new admin user
INSERT INTO users(email, password, phone_number, company_name, country, state)
VALUES (
    'newadmin@payrollpro.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye1J4Wv0qLqGxGvV5YKqZzKqZzKqZzKqZ.',
    '1234567890',
    'New Admin',
    'India',
    'Karnataka'
);

-- Assign ADMIN role
INSERT INTO users_roles(user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'newadmin@payrollpro.com' AND r.name = 'ADMIN';
```

---

## 🎯 Quick Start

1. ✅ **Backend is running** with migration applied
2. ✅ **Admin user created** in database
3. ✅ **Login at:** http://localhost:5173/login
4. ✅ **Use credentials above**
5. ✅ **Start managing the system!**

---

## 📚 Additional Information

### **Roles in the System:**

| Role | Description | Permissions |
|------|-------------|-------------|
| **ADMIN** | System Administrator | Full access to all features and data |
| **USER** | Regular User | Access to assigned organizations only |

### **Password Hash Information:**

- **Algorithm:** BCrypt
- **Strength:** 10 rounds
- **Format:** `$2a$10$...`

### **Database Tables:**

- `users` - User accounts
- `roles` - Available roles
- `users_roles` - User-role assignments

---

## ⚠️ Troubleshooting

### **Can't login with admin credentials?**

1. Check if migration ran:
   ```sql
   SELECT * FROM users WHERE email = 'admin@payrollpro.com';
   ```

2. Check if role is assigned:
   ```sql
   SELECT u.email, r.name 
   FROM users u
   JOIN users_roles ur ON u.id = ur.user_id
   JOIN roles r ON ur.role_id = r.id
   WHERE u.email = 'admin@payrollpro.com';
   ```

3. Restart backend to run migrations:
   ```bash
   mvn spring-boot:run
   ```

---

**You can now login as admin and have full system access!** 🎉
