# Local Backend Testing Guide

## ✅ Setup Complete!

Your backend is now configured to accept requests from Postman and your local frontend.

---

## 🚀 Testing with Postman

### 1. **Signup Request**

**Method:** `POST`  
**URL:** `http://localhost:8080/api/v1/auth/signup`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "Test@123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Expected Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### 2. **Login Request**

**Method:** `POST`  
**URL:** `http://localhost:8080/api/v1/auth/login`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "Test@123"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### 3. **Create Organization (Protected)**

**Method:** `POST`  
**URL:** `http://localhost:8080/api/v1/organizations`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your-token-from-login>
```

**Body (raw JSON):**
```json
{
  "companyName": "Test Company",
  "businessLocation": "India",
  "industry": "Technology",
  "addressLine1": "123 Main St",
  "addressLine2": "Suite 100",
  "state": "Tamil Nadu",
  "city": "Chennai",
  "pinCode": "600001",
  "hasRunPayroll": false
}
```

---

### 4. **Get Organizations (Protected)**

**Method:** `GET`  
**URL:** `http://localhost:8080/api/v1/organizations`  
**Headers:**
```
Authorization: Bearer <your-token-from-login>
```

---

## 🖥️ Testing with Frontend (Local Backend)

### Option 1: Using .env.development (Recommended)

The `.env.development` file is already created with:
```
VITE_API_URL=http://localhost:8080/api/v1
```

**To use it:**
1. Stop your frontend dev server (if running)
2. Restart it:
   ```bash
   cd d:\PayRoll\frontend
   npm run dev
   ```

The frontend will now use your local backend!

---

### Option 2: Temporary Override

If you want to quickly test without restarting, you can temporarily change the API URL in `authService.js`:

**File:** `d:\PayRoll\frontend\src\services\authService.js`

Change line 5 from:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://payroll-ppmh.onrender.com/api/v1';
```

To:
```javascript
const API_URL = 'http://localhost:8080/api/v1';
```

**Remember to change it back after testing!**

---

## 🗄️ Checking Local Database

### PostgreSQL Commands:

```bash
# Connect to database
psql -U postgres -d payroll

# Check users
SELECT * FROM users;

# Check organizations
SELECT * FROM organizations;

# Check user with organizations
SELECT 
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    o.id as org_id,
    o.company_name,
    o.industry
FROM users u
LEFT JOIN organizations o ON o.created_by_user_id = u.id;

# Exit
\q
```

---

## 🔧 Backend Configuration Changes Made

### SecurityConfig.java
- ✅ CORS now allows all origins (for development)
- ✅ All headers allowed
- ✅ Works with Postman (no Origin header required)

**Note:** This is for **development only**. For production, you should restrict CORS to specific origins.

---

## 🐛 Troubleshooting

### Issue: 403 Forbidden
**Solution:** Backend has been updated. Restart it:
```bash
# Stop current backend (Ctrl+C in terminal)
# Start again
cd d:\PayRoll\backend
mvn spring-boot:run
```

### Issue: Connection Refused
**Check:**
1. Backend is running: `http://localhost:8080/actuator/health`
2. Port 8080 is not blocked by firewall
3. PostgreSQL is running

### Issue: Data not in local DB
**Verify:**
1. Check `.env.development` exists in frontend folder
2. Frontend dev server was restarted after creating .env file
3. Check which API URL is being used in browser Network tab

---

## 📊 Testing Workflow

1. **Start Backend:**
   ```bash
   cd d:\PayRoll\backend
   mvn spring-boot:run
   ```

2. **Wait for startup** (look for "Started BackendApplication")

3. **Test with Postman:**
   - Signup → Get token
   - Login → Verify token
   - Create Organization → Check response
   - Get Organizations → Verify data

4. **Check Database:**
   ```bash
   psql -U postgres -d payroll
   SELECT * FROM users;
   SELECT * FROM organizations;
   ```

5. **Test with Frontend:**
   - Start frontend with `.env.development`
   - Signup/Login through UI
   - Create organization
   - Check if data appears in local DB

---

## 🎯 Quick Test Script for Postman

### Collection: Payroll Local Testing

**1. Signup**
```
POST http://localhost:8080/api/v1/auth/signup
Body: {"email":"test@local.com","password":"Test@123","firstName":"Test","lastName":"User"}
```

**2. Login**
```
POST http://localhost:8080/api/v1/auth/login
Body: {"email":"test@local.com","password":"Test@123"}
Save token from response!
```

**3. Create Org**
```
POST http://localhost:8080/api/v1/organizations
Header: Authorization: Bearer {{token}}
Body: {"companyName":"Local Test Co","businessLocation":"India","industry":"Tech","addressLine1":"123 St","state":"TN","city":"Chennai","pinCode":"600001"}
```

**4. Get Orgs**
```
GET http://localhost:8080/api/v1/organizations
Header: Authorization: Bearer {{token}}
```

---

## ✨ Summary

- ✅ Backend CORS configured for Postman
- ✅ Frontend `.env.development` created for local backend
- ✅ All auth endpoints accessible without CORS issues
- ✅ Ready to test data persistence in local PostgreSQL

**Your local backend is now ready for testing!** 🎉
