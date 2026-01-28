# Zoho-Style Variable Components Workflow - Implementation Guide

## ✅ ALREADY IMPLEMENTED!

Your system **already has** the complete Zoho-style workflow for variable/one-time components. Here's how it works:

---

## 🎯 Complete Workflow

### Step 1: Create Variable Component in Settings

**Location:** Settings → Salary Components → Add Component

**Configuration for Variable Components:**

| Field | Value | Required |
|-------|-------|----------|
| **Component Name** | e.g., "Diwali Bonus" | ✅ Yes |
| **Name in Payslip** | e.g., "Diwali Bonus" | Optional |
| **Component Code** | e.g., "DIWALI_BONUS" | ✅ Yes |
| **Type** | Earning | ✅ Yes |
| **Calculation Type** | Fixed / Percentage / Formula | ✅ Yes |
| **Recurring** | ❌ **Uncheck this** | Critical |
| **Variable / One-time** | ✅ **Check this** | **Critical** |
| **Taxable** | Usually Yes | Recommended |
| **Active** | ✅ Yes | ✅ Yes |

**Critical Flags for Dropdown Visibility:**
```
✅ isVariable = true     ← Component appears in Pay Run dropdown
❌ isRecurring = false   ← Component does NOT auto-pay monthly
✅ isActive = true       ← Component is available for use
```

---

### Step 2: Component Appears in Pay Run Dropdown

**Location:** Pay Runs → Open Pay Run Details → Click Employee Name → Add Earning/Deduction

**What Happens:**
1. Click on any employee name in pay run details
2. Employee drawer opens on the right side
3. Click **"+ Add Earning"** or **"+ Add Deduction"** button
4. Modal opens with dropdown showing **ONLY variable components**

**Backend Filter (Already Implemented):**
```java
// SalaryComponentService.java - Line 46-53
public List<VariableComponentDTO> getVariableComponents(Long organizationId, ComponentType type) {
    return salaryComponentRepository
        .findByOrganizationIdAndIsActiveTrueAndIsVariableTrueAndTypeOrderByNameAsc(
            organizationId, type)
        .stream()
        .map(this::convertToVariableDTO)
        .collect(Collectors.toList());
}
```

**Filters Applied:**
- ✅ `isActive = true`
- ✅ `isVariable = true`
- ✅ `type = EARNING` or `DEDUCTION` (based on button clicked)
- ✅ Sorted by name alphabetically

---

### Step 3: Add Component to Employee

**In the Modal:**
1. **Select Component** from dropdown (e.g., "Diwali Bonus")
2. **Enter Amount** (e.g., 5000)
3. **Taxable** checkbox (pre-filled from component settings)
4. **Notes** (optional - e.g., "Festival bonus")
5. Click **"Add Earning"**

**What Happens:**
- Component added to employee for **this pay run only**
- Amount is **NOT stored** in salary structure
- Component **remains available** in dropdown for next month
- Shows in employee's pay breakdown for this pay run

---

## 🔄 Behavior Comparison

### Variable Component (isVariable = true, isRecurring = false)
| Aspect | Behavior |
|--------|----------|
| **Appears in dropdown?** | ✅ Yes |
| **Auto-paid monthly?** | ❌ No |
| **Stored in salary structure?** | ❌ No |
| **Available next month?** | ✅ Yes (as option) |
| **Amount carries over?** | ❌ No (must re-enter) |
| **Use case** | Bonuses, incentives, one-time payments |

### Recurring Component (isRecurring = true, isVariable = false)
| Aspect | Behavior |
|--------|----------|
| **Appears in dropdown?** | ❌ No |
| **Auto-paid monthly?** | ✅ Yes |
| **Stored in salary structure?** | ✅ Yes |
| **Available next month?** | ✅ Yes (auto-included) |
| **Amount carries over?** | ✅ Yes |
| **Use case** | Basic salary, HRA, fixed allowances |

---

## 📋 Example Configurations

### Example 1: Diwali Bonus (Variable Earning)
```
Name: Diwali Bonus
Code: DIWALI_BONUS
Type: EARNING
Calculation Type: FIXED
Recurring: ❌ No
Variable: ✅ Yes
Taxable: ✅ Yes
PF Applicable: ❌ No
Active: ✅ Yes

Result: Appears in "Add Earning" dropdown every month
```

### Example 2: Performance Incentive (Variable Earning)
```
Name: Performance Incentive
Code: PERF_INCENTIVE
Type: EARNING
Calculation Type: FIXED
Recurring: ❌ No
Variable: ✅ Yes
Taxable: ✅ Yes
PF Applicable: ❌ No
Active: ✅ Yes

Result: Appears in "Add Earning" dropdown
```

### Example 3: Loan Deduction (Variable Deduction)
```
Name: Loan Deduction
Code: LOAN_DEDUCT
Type: DEDUCTION
Calculation Type: FIXED
Recurring: ❌ No
Variable: ✅ Yes
Taxable: ❌ No
PF Applicable: ❌ No
Active: ✅ Yes

Result: Appears in "Add Deduction" dropdown
```

### Example 4: Basic Salary (Recurring - NOT in dropdown)
```
Name: Basic Salary
Code: BASIC
Type: EARNING
Calculation Type: FIXED
Recurring: ✅ Yes
Variable: ❌ No
Taxable: ✅ Yes
PF Applicable: ✅ Yes
Active: ✅ Yes

Result: ❌ Does NOT appear in dropdown (auto-paid monthly)
```

---

## 🎯 How to Use (Step-by-Step)

### Phase 1: Setup (One-time)

1. **Login** to application
2. Go to **Settings → Salary Components**
3. Click **"Add Component"**
4. Fill in details:
   - Name: "Diwali Bonus"
   - Code: "DIWALI_BONUS"
   - Type: Earning
   - Calculation Type: Fixed
   - **Uncheck "Recurring"**
   - **Check "Variable / One-time"**
   - Check "Taxable"
5. Click **"Create Component"**

### Phase 2: Use in Pay Run (Monthly)

1. Go to **Pay Runs**
2. Click **"Draft Next Pay Run"** (auto-calculates)
3. Click on any **employee name** in the list
4. Employee drawer opens on right side
5. Click **"+ Add Earning"** button
6. **Dropdown shows "Diwali Bonus"** ← Your variable component
7. Select "Diwali Bonus"
8. Enter amount: 5000
9. Add notes: "Festival bonus"
10. Click **"Add Earning"**
11. Component added to employee for this month only

### Phase 3: Next Month

1. Create new pay run
2. **"Diwali Bonus" still available in dropdown**
3. Amount is **NOT pre-filled** (must enter again)
4. Can apply to different employees each month

---

## 🔧 Technical Implementation

### Backend Endpoint
```
GET /api/v1/salary-components/variable?organizationId={id}&type={EARNING|DEDUCTION}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Diwali Bonus",
    "code": "DIWALI_BONUS",
    "type": "EARNING",
    "isTaxable": true
  },
  {
    "id": 2,
    "name": "Performance Incentive",
    "code": "PERF_INCENTIVE",
    "type": "EARNING",
    "isTaxable": true
  }
]
```

### Frontend Components

**1. Settings Modal:** `EditComponentModal.jsx`
- Has "Variable / One-time" checkbox (line 317-328)
- Saves `isVariable` flag to backend

**2. Pay Run Drawer:** `PayRunEmployeeDrawer.jsx`
- Opens when clicking employee name
- Has "Add Earning" and "Add Deduction" buttons

**3. Add Component Modal:** `PayRunManagementModals.jsx`
- Fetches variable components via API (line 104-115)
- Shows dropdown with filtered components (line 150-160)
- Allows entering amount and notes

**4. API Service:** `salaryComponentApi.js`
- `getVariableComponents(type)` function (line 16-20)
- Calls backend `/variable` endpoint

---

## ✅ Verification Checklist

### Test 1: Create Variable Component
- [ ] Go to Settings → Salary Components
- [ ] Click "Add Component"
- [ ] See "Variable / One-time" checkbox
- [ ] Create component with Variable = Yes, Recurring = No
- [ ] Component saved successfully

### Test 2: Dropdown Shows Variable Components
- [ ] Go to Pay Runs
- [ ] Create/open a pay run
- [ ] Click on employee name
- [ ] Drawer opens on right
- [ ] Click "+ Add Earning"
- [ ] Modal opens with dropdown
- [ ] Dropdown shows ONLY variable components
- [ ] Dropdown is empty if no variable components exist

### Test 3: Add Component to Employee
- [ ] Select component from dropdown
- [ ] Enter amount
- [ ] Click "Add Earning"
- [ ] Component appears in employee's breakdown
- [ ] Amount shows correctly

### Test 4: Next Month Behavior
- [ ] Create new pay run next month
- [ ] Open employee drawer
- [ ] Click "+ Add Earning"
- [ ] Same component still available in dropdown
- [ ] Amount is NOT pre-filled (blank)

---

## 🐛 Troubleshooting

### Issue 1: Dropdown is Empty

**Cause:** No variable components created yet

**Solution:**
1. Go to Settings → Salary Components
2. Create at least one component with:
   - Type = Earning (for Add Earning dropdown)
   - Variable = Yes
   - Recurring = No
   - Active = Yes

### Issue 2: Component Not Appearing in Dropdown

**Check these flags:**
- ✅ `isVariable` = true
- ✅ `isActive` = true
- ❌ `isRecurring` = false
- ✅ `type` = EARNING (for Add Earning) or DEDUCTION (for Add Deduction)

**Fix:** Edit the component in Settings and update the flags

### Issue 3: Component Auto-Pays Every Month

**Cause:** Component is marked as Recurring

**Solution:**
1. Edit component in Settings
2. Uncheck "Recurring"
3. Check "Variable / One-time"
4. Save

### Issue 4: Dropdown Not Loading

**Check:**
1. Browser console (F12) for errors
2. Network tab - look for `/salary-components/variable` API call
3. Response should contain array of components
4. If empty array, no variable components exist

---

## 📊 Summary Table

| Setting | Recurring Component | Variable Component |
|---------|--------------------|--------------------|
| **Recurring** | ✅ Yes | ❌ No |
| **Variable** | ❌ No | ✅ Yes |
| **In Dropdown** | ❌ No | ✅ Yes |
| **Auto-paid** | ✅ Yes | ❌ No |
| **In Salary Structure** | ✅ Yes | ❌ No |
| **Manual Entry** | ❌ No | ✅ Yes |
| **Example** | Basic, HRA | Bonus, Incentive |

---

## 🎉 Conclusion

Your system **already implements** the complete Zoho-style workflow:

✅ **Settings** - Create components with Variable flag  
✅ **Backend** - Filters by `isVariable = true`  
✅ **Frontend** - Dropdown shows only variable components  
✅ **Pay Run** - Add components to employees per month  
✅ **Next Month** - Components remain available (not auto-filled)

**No additional implementation needed!** Just use the workflow as documented above.

---

## 📝 Quick Reference

**To make a component appear in dropdown:**
```
Settings → Salary Components → Add Component
├─ Type: Earning
├─ Recurring: ❌ No
├─ Variable: ✅ Yes
└─ Active: ✅ Yes
```

**To add component to employee:**
```
Pay Runs → Open Pay Run → Click Employee Name
└─ Click "+ Add Earning" → Select from dropdown → Enter amount → Add
```

**Result:**
- Component added for this month only
- Available in dropdown next month
- Amount NOT carried over
