# Debugging Organizations Not Listing Issue

## 🔍 Problem
Organizations created in the database are not showing up in the organization selection page.

## 🛠️ Debugging Steps

### Step 1: Check Browser Console
1. Open the organization selection page: `http://localhost:5173/select-organization`
2. Open browser DevTools (F12)
3. Go to Console tab
4. Look for these logs:
   - "Fetching organizations..."
   - "API Response:"
   - "Organizations data:"
   - Any error messages

### Step 2: Check Network Tab
1. In DevTools, go to Network tab
2. Refresh the page
3. Look for the request to `/api/v1/organizations`
4. Click on it and check:
   - **Status Code**: Should be 200
   - **Response Headers**: Check if Authorization header is present
   - **Response Body**: Should contain array of organizations
   - **Request Headers**: Should have `Authorization: Bearer <token>`

### Step 3: Use Test Page
1. Navigate to: `http://localhost:5173/test-organizations`
2. Click "Fetch Organizations" button
3. Check the result displayed on the page
4. This will show the exact API response

### Step 4: Check Database
Run this SQL query to verify organizations exist:

```sql
-- Connect to database
psql -U postgres -d payroll

-- Check organizations
SELECT * FROM organizations;

-- Check with user info
SELECT 
    o.id,
    o.company_name,
    o.industry,
    o.city,
    o.state,
    o.created_by_user_id,
    u.email as created_by_email
FROM organizations o
LEFT JOIN users u ON o.created_by_user_id = u.id;
```

### Step 5: Check Backend Logs
Look at the Spring Boot console for:
- Any errors when calling GET /api/v1/organizations
- SQL queries being executed
- Authentication issues

### Step 6: Test Backend Directly
Use Postman or curl to test the backend:

1. First, login to get token:
```bash
POST http://localhost:8080/api/v1/auth/login
Body: {
  "email": "your@email.com",
  "password": "yourpassword"
}
```

2. Copy the token from response

3. Get organizations:
```bash
GET http://localhost:8080/api/v1/organizations
Headers: 
  Authorization: Bearer <your-token>
  Content-Type: application/json
```

## 🔧 Common Issues and Solutions

### Issue 1: Empty Array Response
**Symptom**: API returns `[]`
**Possible Causes**:
- No organizations created for this user
- Wrong user ID in query
- Database query filtering incorrectly

**Solution**:
1. Check database: `SELECT * FROM organizations WHERE created_by_user_id = <your_user_id>;`
2. Verify user ID matches logged-in user

### Issue 2: 401 Unauthorized
**Symptom**: API returns 401 status
**Possible Causes**:
- Token expired
- Token not being sent
- Token invalid

**Solution**:
1. Check localStorage: `localStorage.getItem('token')`
2. Login again to get fresh token
3. Check if token is in request headers

### Issue 3: 403 Forbidden
**Symptom**: API returns 403 status
**Possible Causes**:
- User doesn't have permission
- CORS issue
- Security configuration blocking request

**Solution**:
1. Check Spring Security configuration
2. Verify user roles
3. Check CORS settings

### Issue 4: Network Error
**Symptom**: "Network Error" in console
**Possible Causes**:
- Backend not running
- Wrong API URL
- CORS blocking request

**Solution**:
1. Verify backend is running: `http://localhost:8080/actuator/health`
2. Check VITE_API_URL in `.env`
3. Check CORS configuration in backend

### Issue 5: Organizations Exist but Not Showing
**Symptom**: Database has data, API returns data, but UI shows empty
**Possible Causes**:
- Frontend state not updating
- Rendering issue
- Data format mismatch

**Solution**:
1. Check console logs for data
2. Check if `organizations` state is being set
3. Verify data structure matches what component expects

## 📋 Checklist

- [ ] Backend is running on port 8080
- [ ] Frontend is running on port 5173
- [ ] User is logged in (token in localStorage)
- [ ] Database has organizations table
- [ ] Organizations exist in database
- [ ] Organizations belong to logged-in user
- [ ] API endpoint returns 200 status
- [ ] API response contains organization data
- [ ] Frontend receives the data
- [ ] Frontend state updates with data
- [ ] Component re-renders with data

## 🔍 Expected Data Flow

```
1. User logs in
   ↓
2. Token stored in localStorage
   ↓
3. Navigate to /select-organization
   ↓
4. Component mounts, useEffect runs
   ↓
5. fetchOrganizations() called
   ↓
6. api.get('/organizations') with token in header
   ↓
7. Backend receives request
   ↓
8. Backend gets user from token
   ↓
9. Backend queries: SELECT * FROM organizations WHERE created_by_user_id = ?
   ↓
10. Backend returns JSON array
   ↓
11. Frontend receives response
   ↓
12. setOrganizations(response.data)
   ↓
13. Component re-renders with data
   ↓
14. Organizations displayed in grid
```

## 🧪 Quick Test Commands

### Check if backend is running:
```bash
curl http://localhost:8080/actuator/health
```

### Check database:
```bash
psql -U postgres -d payroll -c "SELECT COUNT(*) FROM organizations;"
```

### Check frontend can reach backend:
Open browser console and run:
```javascript
fetch('http://localhost:8080/api/v1/organizations', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(d => console.log('Organizations:', d))
.catch(e => console.error('Error:', e));
```

## 📝 What to Report

If issue persists, provide:
1. Console logs (all messages)
2. Network tab screenshot (organizations request)
3. Database query result
4. Backend logs (last 50 lines)
5. Token value (first 20 characters only)
6. User email you're logged in with
