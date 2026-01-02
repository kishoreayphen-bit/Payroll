# 📚 Salary Components API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

---

## 🔧 Salary Component Management APIs

### **1. Get All Components**
```http
GET /salary-components?organizationId={id}
```

**Description:** Get all active salary components for an organization

**Query Parameters:**
- `organizationId` (required) - Organization ID

**Response:**
```json
[
  {
    "id": 1,
    "organizationId": 1,
    "name": "Basic Salary",
    "code": "BASIC",
    "type": "EARNING",
    "calculationType": "PERCENTAGE",
    "baseComponentId": null,
    "baseComponentName": null,
    "formula": null,
    "isTaxable": true,
    "isStatutory": false,
    "isActive": true,
    "displayOrder": 1,
    "description": "Basic salary component"
  }
]
```

---

### **2. Get Component by ID**
```http
GET /salary-components/{id}
```

**Description:** Get a specific salary component

**Path Parameters:**
- `id` (required) - Component ID

**Response:** Same as above (single object)

---

### **3. Get Components by Type**
```http
GET /salary-components/by-type?organizationId={id}&type={EARNING|DEDUCTION}
```

**Description:** Get components filtered by type

**Query Parameters:**
- `organizationId` (required) - Organization ID
- `type` (required) - EARNING or DEDUCTION

---

### **4. Get Earnings**
```http
GET /salary-components/earnings?organizationId={id}
```

**Description:** Get all earning components

**Query Parameters:**
- `organizationId` (required) - Organization ID

---

### **5. Get Deductions**
```http
GET /salary-components/deductions?organizationId={id}
```

**Description:** Get all deduction components

**Query Parameters:**
- `organizationId` (required) - Organization ID

---

### **6. Create Component**
```http
POST /salary-components
```

**Description:** Create a new salary component

**Request Body:**
```json
{
  "organizationId": 1,
  "name": "Transport Allowance",
  "code": "TRANSPORT",
  "type": "EARNING",
  "calculationType": "FIXED",
  "baseComponentId": null,
  "formula": null,
  "isTaxable": false,
  "isStatutory": false,
  "isActive": true,
  "displayOrder": 5,
  "description": "Monthly transport allowance"
}
```

**Response:** Created component (201 Created)

---

### **7. Update Component**
```http
PUT /salary-components/{id}
```

**Description:** Update an existing salary component

**Path Parameters:**
- `id` (required) - Component ID

**Request Body:** Same as Create

**Response:** Updated component (200 OK)

---

### **8. Delete Component**
```http
DELETE /salary-components/{id}
```

**Description:** Soft delete a salary component

**Path Parameters:**
- `id` (required) - Component ID

**Response:** 204 No Content

---

## 👤 Employee Salary Management APIs

### **1. Get Employee Components**
```http
GET /employees/{employeeId}/salary-components
```

**Description:** Get all salary components assigned to an employee

**Path Parameters:**
- `employeeId` (required) - Employee ID

**Response:**
```json
[
  {
    "id": 1,
    "employeeId": 123,
    "employeeName": "John Doe",
    "componentId": 1,
    "componentName": "Basic Salary",
    "componentCode": "BASIC",
    "componentType": "EARNING",
    "calculationType": "PERCENTAGE",
    "value": 50.00,
    "calculatedAmount": 25000.00,
    "effectiveFrom": "2024-01-01",
    "effectiveTo": null,
    "isActive": true,
    "remarks": null
  }
]
```

---

### **2. Get Components on Date**
```http
GET /employees/{employeeId}/salary-components/on-date?date={YYYY-MM-DD}
```

**Description:** Get salary components valid on a specific date

**Path Parameters:**
- `employeeId` (required) - Employee ID

**Query Parameters:**
- `date` (required) - Date in YYYY-MM-DD format

---

### **3. Assign Component to Employee**
```http
POST /employees/{employeeId}/salary-components
```

**Description:** Assign a salary component to an employee

**Path Parameters:**
- `employeeId` (required) - Employee ID

**Request Body:**
```json
{
  "componentId": 1,
  "value": 50.00,
  "effectiveFrom": "2024-01-01",
  "effectiveTo": null,
  "remarks": "Initial assignment"
}
```

**Response:** Created assignment (201 Created)

---

### **4. Update Employee Component**
```http
PUT /employee-salary-components/{id}
```

**Description:** Update an employee's component assignment

**Path Parameters:**
- `id` (required) - Assignment ID

**Request Body:**
```json
{
  "value": 55.00,
  "effectiveFrom": "2024-01-01",
  "effectiveTo": "2024-12-31",
  "isActive": true,
  "remarks": "Updated value"
}
```

**Response:** Updated assignment (200 OK)

---

### **5. Remove Component from Employee**
```http
DELETE /employee-salary-components/{id}
```

**Description:** Remove a salary component from an employee

**Path Parameters:**
- `id` (required) - Assignment ID

**Response:** 204 No Content

---

### **6. Get Salary Breakdown** ⭐
```http
GET /employees/{employeeId}/salary-breakdown
```

**Description:** Calculate and get detailed salary breakdown for an employee

**Path Parameters:**
- `employeeId` (required) - Employee ID

**Response:**
```json
{
  "employeeId": 123,
  "employeeName": "John Doe",
  "employeeId_code": "EMP001",
  "annualCtc": 600000.00,
  "monthlyCtc": 50000.00,
  "earnings": [
    {
      "componentId": 1,
      "componentName": "Basic Salary",
      "componentCode": "BASIC",
      "calculationType": "PERCENTAGE",
      "value": 50.00,
      "baseAmount": 50000.00,
      "calculatedAmount": 25000.00,
      "isTaxable": true,
      "isStatutory": false
    },
    {
      "componentId": 2,
      "componentName": "HRA",
      "componentCode": "HRA",
      "calculationType": "PERCENTAGE",
      "value": 50.00,
      "baseAmount": 25000.00,
      "calculatedAmount": 12500.00,
      "isTaxable": true,
      "isStatutory": false
    },
    {
      "componentId": 4,
      "componentName": "Conveyance",
      "componentCode": "CONVEYANCE",
      "calculationType": "FIXED",
      "value": 1600.00,
      "baseAmount": 1600.00,
      "calculatedAmount": 1600.00,
      "isTaxable": false,
      "isStatutory": false
    }
  ],
  "deductions": [
    {
      "componentId": 9,
      "componentName": "PF",
      "componentCode": "PF_EMPLOYEE",
      "calculationType": "PERCENTAGE",
      "value": 12.00,
      "baseAmount": 25000.00,
      "calculatedAmount": 3000.00,
      "isTaxable": false,
      "isStatutory": true
    }
  ],
  "totalEarnings": 39100.00,
  "totalDeductions": 3000.00,
  "grossSalary": 39100.00,
  "netSalary": 36100.00
}
```

---

## 🧪 Testing with cURL

### **Create a Component:**
```bash
curl -X POST http://localhost:8080/api/v1/salary-components \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": 1,
    "name": "Basic Salary",
    "code": "BASIC",
    "type": "EARNING",
    "calculationType": "PERCENTAGE",
    "isTaxable": true,
    "isStatutory": false,
    "displayOrder": 1
  }'
```

### **Get All Components:**
```bash
curl http://localhost:8080/api/v1/salary-components?organizationId=1
```

### **Assign Component to Employee:**
```bash
curl -X POST http://localhost:8080/api/v1/employees/1/salary-components \
  -H "Content-Type: application/json" \
  -d '{
    "componentId": 1,
    "value": 50.00,
    "effectiveFrom": "2024-01-01"
  }'
```

### **Get Salary Breakdown:**
```bash
curl http://localhost:8080/api/v1/employees/1/salary-breakdown
```

---

## 📊 Common Use Cases

### **Use Case 1: Setup Salary Structure**
1. Create Basic component (PERCENTAGE of CTC)
2. Create HRA component (PERCENTAGE of Basic)
3. Create Conveyance component (FIXED amount)
4. Create PF component (PERCENTAGE of Basic)

### **Use Case 2: Assign to Employee**
1. Assign Basic (50% value)
2. Assign HRA (50% value)
3. Assign Conveyance (₹1,600)
4. Assign PF (12% value)

### **Use Case 3: Calculate Salary**
1. Call `/employees/{id}/salary-breakdown`
2. Get detailed breakdown with all calculations
3. Display to user

---

## ⚠️ Error Responses

### **400 Bad Request**
```json
{
  "error": "Component with code BASIC already exists"
}
```

### **404 Not Found**
```json
{
  "error": "Salary component not found with id: 123"
}
```

---

## 🔐 Authentication

All endpoints require authentication (JWT token in Authorization header).

```http
Authorization: Bearer {your-jwt-token}
```

---

## 📝 Notes

- All monetary values are in BigDecimal with 2 decimal places
- Dates are in ISO format (YYYY-MM-DD)
- Soft delete is used (isActive flag)
- Component codes must be unique per organization
- Effective dates support historical tracking

---

**Ready to test!** 🚀
