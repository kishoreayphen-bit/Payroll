# Pay Run 401 Unauthorized Error - FIX APPLIED

## Problem
When creating a pay run, the frontend was getting a 401 Unauthorized error even though the JWT token was valid.

## Root Cause
The `PayRunController` requires two custom headers:
- `X-Tenant-ID` - Organization/Tenant ID
- `X-User-ID` - User ID

The frontend was sending the JWT token but **not** these required headers. Additionally, the backend's `TokenResponse` was not returning the `userId`, so the frontend had no way to get it.

## Solution Applied

### Backend Changes

#### 1. Updated `TokenResponse.java`
Added `userId` and `username` fields to the response:
```java
public record TokenResponse(
        String token,
        long expiresInSeconds,
        Long userId,        // ✅ NEW
        String username,    // ✅ NEW
        String email,
        List<String> roles
) {}
```

#### 2. Updated `AuthServiceImpl.java`
Modified login and signup methods to include userId and username:
```java
// Signup
return new TokenResponse(token, 60L * 60L * 24L, user.getId(), user.getEmail(), user.getEmail(), List.of("USER"));

// Login
return new TokenResponse(token, 60L * 60L * 24L, user.getId(), user.getEmail(), user.getEmail(), roles);
```

#### 3. Fixed `PayRunService.java`
Fixed method call from `getBankAccountNumber()` to `getAccountNumber()`:
```java
emp.getAccountNumber() != null ? emp.getAccountNumber() : ""
```

### Frontend Changes

#### 1. Updated `authService.js` - Login/Signup
Modified to properly store user data with ID:
```javascript
// Create user object from response
const user = {
    id: response.data.userId,
    username: response.data.username,
    email: response.data.email,
    roles: response.data.roles
};
this.setUser(user);
```

#### 2. Updated `authService.js` - Request Interceptor
Added automatic header injection for all API requests:
```javascript
// Decode token to get user ID and tenant ID
const user = JSON.parse(localStorage.getItem('user') || '{}');
const userId = user?.id;
const tenantId = localStorage.getItem('selectedOrganizationId') || localStorage.getItem('organizationId');

// Add headers if they don't already exist
if (userId && !config.headers['X-User-ID']) {
    config.headers['X-User-ID'] = userId;
}

if (tenantId && !config.headers['X-Tenant-ID']) {
    config.headers['X-Tenant-ID'] = tenantId;
}
```

## Testing Steps

### 1. Restart Backend
```bash
cd d:\PayRoll\backend
# Stop current backend (Ctrl+C)
mvn spring-boot:run
```

### 2. Clear Browser Storage & Re-login
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Clear localStorage
4. Refresh page
5. Login again (this will get the new TokenResponse with userId)

### 3. Test Pay Run Creation
1. Navigate to Pay Run page
2. Click "Create Pay Run"
3. Fill in the form
4. Click Create
5. Check browser console - should see:
   - `X-User-ID header set: <number>`
   - `X-Tenant-ID header set: <number>`
   - Successful 200 response

## Expected Console Output (Success)
```
API Request to: /pay-runs
Token exists: true
Authorization header set: Bearer eyJhbGci...
Decoded token: {sub: "user@example.com", roles: [...], ...}
X-User-ID header set: 1
X-Tenant-ID header set: 1
✅ Pay run created successfully
```

## What Changed
- ✅ Backend now returns `userId` in login/signup response
- ✅ Frontend stores user data with ID in localStorage
- ✅ API interceptor automatically adds `X-User-ID` and `X-Tenant-ID` headers
- ✅ No need to manually add headers in every API call
- ✅ Fixed compilation error in PayRunService

## Impact
This fix applies to **ALL API endpoints** that require `X-User-ID` and `X-Tenant-ID` headers. The interceptor will automatically add them to every request.

## Files Modified
1. `backend/src/main/java/com/payroll/auth/dto/TokenResponse.java`
2. `backend/src/main/java/com/payroll/auth/AuthServiceImpl.java`
3. `backend/src/main/java/com/payroll/service/PayRunService.java`
4. `frontend/src/services/authService.js`

---
**Status:** ✅ FIXED - Requires backend restart and re-login to take effect
**Date:** January 22, 2026
