# 🔍 Employee List Debugging Guide

## ✅ Added Comprehensive Logging

I've added detailed console logging to track every step of the employee fetching process.

---

## 📋 How to Debug

### **Step 1: Open Browser Console**
1. Go to http://localhost:5173/employees
2. Press **F12** to open Developer Tools
3. Click on the **Console** tab

### **Step 2: Look for These Messages**

You should see log messages with emojis:

```
⏳ Waiting for organization to load...
🔄 Fetching employees for organization: 1 CompanyName
✅ API Response received: {...}
📊 Employee count: 3
📋 Raw employee data: [...]
Mapping employee: EMP001 John Doe
Mapping employee: EMP002 Jane Smith
✨ Mapped employees: [...]
📌 Setting employees state with 3 employees
🔍 Filter Debug:
  Total employees: 3
  Active view: Active Employees
  Filtered employees: 3
```

---

## 🔴 Possible Issues & Solutions

### **Issue 1: 403 Forbidden Error**

**Symptoms:**
```
❌ Error fetching employees: Error: Request failed with status code 403
Error status: 403
```

**Cause:** API requires authentication but token is missing/invalid

**Solution:**
1. Check if you're logged in
2. Check localStorage for token:
   ```javascript
   localStorage.getItem('token')
   ```
3. If no token, log in again
4. If token exists but still 403, token may be expired

---

### **Issue 2: Employees Fetched But Not Showing**

**Symptoms:**
```
📊 Employee count: 3
📌 Setting employees state with 3 employees
🔍 Filter Debug:
  Total employees: 3
  Filtered employees: 0  ← PROBLEM HERE
```

**Cause:** Employees are being filtered out by view/filter logic

**Solution:**
Check the filter values:
- **Active view:** Should match employee status
- **Search query:** Should be empty
- **Filters:** All should be empty strings

**Quick Fix:**
Try switching to "All Employees" view

---

### **Issue 3: API Not Being Called**

**Symptoms:**
```
⏳ Waiting for organization to load...
(No other messages)
```

**Cause:** Organization not loaded

**Solution:**
1. Check if organization exists in localStorage:
   ```javascript
   localStorage.getItem('selectedOrganizationId')
   ```
2. If missing, go to /select-organization first

---

### **Issue 4: Empty Response from API**

**Symptoms:**
```
✅ API Response received: {...}
📊 Employee count: 0
```

**Cause:** No employees in database for this organization

**Solution:**
1. Add an employee first
2. Check database directly:
   ```sql
   SELECT * FROM employees WHERE organization_id = 1;
   ```

---

## 🧪 Quick Tests

### **Test 1: Check if logged in**
```javascript
// In browser console:
console.log('Token:', localStorage.getItem('token'));
console.log('Org ID:', localStorage.getItem('selectedOrganizationId'));
```

### **Test 2: Check employees state**
```javascript
// In browser console (while on employee list page):
// This won't work directly, but you can see it in React DevTools
```

### **Test 3: Manual API Call**
```javascript
// In browser console:
fetch('http://localhost:8080/api/v1/employees?organizationId=1', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
})
.then(r => r.json())
.then(data => console.log('Employees:', data))
.catch(err => console.error('Error:', err));
```

---

## 📊 Expected Console Output

### **Successful Load:**
```
⏳ Waiting for organization to load...
🔄 Fetching employees for organization: 1 My Company
✅ API Response received: {data: Array(3), status: 200, ...}
📊 Employee count: 3
📋 Raw employee data: [{id: 1, fullName: "John Doe", ...}, ...]
Mapping employee: EMP001 John Doe
Mapping employee: EMP002 Jane Smith
Mapping employee: EMP003 Mike Johnson
✨ Mapped employees: [{id: 1, name: "John Doe", ...}, ...]
📌 Setting employees state with 3 employees
🔍 Filter Debug:
  Total employees: 3
  Active view: Active Employees
  Search query: 
  Filters: {workLocation: "", department: "", ...}
  Filtered employees: 3
  Filtered employee list: [{...}, {...}, {...}]
```

---

## 🎯 Next Steps Based on Console Output

### **If you see 403 Forbidden:**
→ Authentication issue - need to log in again

### **If you see 0 employees fetched:**
→ No employees in database - add one first

### **If you see employees fetched but filtered to 0:**
→ Filter issue - check activeView and filters

### **If you see employees fetched and filtered correctly:**
→ UI rendering issue - check React component

---

## 💡 Common Solutions

### **Solution 1: Clear Filters**
```javascript
// Click "Clear All" button in the UI
// Or switch to "All Employees" view
```

### **Solution 2: Re-login**
```javascript
// Log out and log back in to get fresh token
```

### **Solution 3: Check Organization**
```javascript
// Make sure you're viewing the correct organization
// The one where you added employees
```

---

## 📝 What to Share

If employees still aren't showing, please share:

1. **Console output** - Copy all the log messages
2. **Network tab** - Check if GET /api/v1/employees is called
3. **Response** - What status code and data?
4. **LocalStorage** - Token and organizationId values

This will help identify the exact issue!
