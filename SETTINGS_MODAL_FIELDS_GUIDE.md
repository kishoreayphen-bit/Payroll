# Settings Component Modal - Complete Field Guide

## ✅ Current Modal Status

The Settings component creation modal (`EditComponentModal.jsx`) **already has all the required fields**, including the **Recurring** checkbox.

---

## 📋 All Available Fields

### **Basic Information**
1. **Component Name** (required)
   - Display name for the component
   - Example: "Performance Bonus", "Basic Salary"

2. **Name in Payslip** (optional)
   - How it appears on employee payslips
   - Example: "Perf. Bonus", "Basic"

3. **Component Code** (required)
   - Unique identifier (uppercase, underscores)
   - Example: "PERF_BONUS", "BASIC_SALARY"

### **Component Type**
4. **Type** (required)
   - Dropdown: Earning / Deduction

5. **Calculation Type** (required)
   - Dropdown: Fixed Amount / Percentage / Formula

### **Conditional Fields**

6. **Base Component** (appears when Calculation Type = Percentage)
   - Select which component to calculate percentage from
   - Example: Calculate HRA as 40% of Basic

7. **Formula** (appears when Calculation Type = Formula)
   - Textarea for complex calculations
   - Example: `(BASIC + HRA) * 0.12`

### **Configuration Checkboxes (2 Large Boxes)**

8. **Recurring** ✅
   - Location: Lines 302-314 in EditComponentModal.jsx
   - Label: "Recurring"
   - Description: "Part of monthly salary structure"
   - **This field EXISTS and is visible!**

9. **Variable / One-time** ✅
   - Location: Lines 316-328 in EditComponentModal.jsx
   - Label: "Variable / One-time"
   - Description: "Available in pay run dropdowns"
   - **This field EXISTS and is visible!**

### **Additional Configuration Checkboxes**

10. **Include in CTC**
    - Whether component is part of Cost to Company

11. **Calculate on pro-rata basis**
    - Adjust based on days worked

12. **Taxable**
    - Subject to income tax

13. **PF Applicable**
    - Include in Provident Fund calculation

14. **Statutory**
    - Government-mandated component

### **Other Fields**

15. **Display Order**
    - Number field for sorting order

16. **Description**
    - Textarea for component notes

---

## 🎨 Modal Layout

```
┌─────────────────────────────────────────────┐
│ Add Component (Zoho)                    [X] │
├─────────────────────────────────────────────┤
│                                             │
│ Component Name *                            │
│ [________________]                          │
│                                             │
│ Name in Payslip                             │
│ [________________]                          │
│                                             │
│ Component Code *                            │
│ [________________]                          │
│                                             │
│ Type *              Calculation Type *      │
│ [Earning ▼]         [Fixed Amount ▼]        │
│                                             │
│ ┌─────────────────┐ ┌─────────────────┐    │
│ │ ☑ Recurring     │ │ ☑ Variable/     │    │
│ │ Part of monthly │ │ One-time        │    │
│ │ salary structure│ │ Available in    │    │
│ │                 │ │ pay run         │    │
│ └─────────────────┘ └─────────────────┘    │
│                                             │
│ ☑ Include in CTC                            │
│ ☑ Calculate on pro-rata basis               │
│ ☑ Taxable                                   │
│ ☑ PF Applicable                             │
│ ☑ Statutory                                 │
│                                             │
│ Display Order                               │
│ [0]                                         │
│                                             │
│ Description                                 │
│ [________________]                          │
│ [________________]                          │
│                                             │
│ [Cancel]              [Create Component]    │
└─────────────────────────────────────────────┘
```

---

## ✅ Verification Checklist

**To verify the modal has all fields:**

1. **Open Settings**
   - Go to Settings → Salary Components

2. **Click "Add Component"**
   - Pink gradient button at top right

3. **Check for these fields:**
   - ✅ Component Name input
   - ✅ Name in Payslip input
   - ✅ Component Code input
   - ✅ Type dropdown (Earning/Deduction)
   - ✅ Calculation Type dropdown (Fixed/Percentage/Formula)
   - ✅ **Two large boxes with:**
     - ✅ **Recurring checkbox** (left box)
     - ✅ **Variable / One-time checkbox** (right box)
   - ✅ Include in CTC checkbox
   - ✅ Pro-rata checkbox
   - ✅ Taxable checkbox
   - ✅ PF Applicable checkbox
   - ✅ Statutory checkbox
   - ✅ Display Order input
   - ✅ Description textarea

---

## 🔧 How to Create Variable Component

**For components to appear in Pay Run dropdown:**

1. **Component Name:** "Performance Bonus"
2. **Code:** "PERF_BONUS"
3. **Type:** Earning
4. **Calculation Type:** Fixed Amount
5. **Recurring:** ❌ **UNCHECK THIS**
6. **Variable / One-time:** ✅ **CHECK THIS**
7. **Taxable:** ✅ Check (usually)
8. **Active:** ✅ (implicit - components are active by default)

**Result:** Component appears in Pay Run → Add Earning dropdown

---

## 🐛 Troubleshooting

### Issue: "Modal shows old fields"

**Possible causes:**
1. **Browser cache** - Hard refresh (Ctrl+Shift+R)
2. **Frontend not rebuilt** - Restart dev server
3. **Wrong modal opening** - Verify you're in Settings → Salary Components

**Solution:**
```bash
# In frontend directory
npm run dev
```
Then hard refresh browser (Ctrl+Shift+R)

### Issue: "Recurring checkbox not visible"

**Verification:**
1. The Recurring checkbox **exists** at lines 302-314 in `EditComponentModal.jsx`
2. It's in a large bordered box on the left side
3. Label: "Recurring"
4. Description: "Part of monthly salary structure"

**If not visible:**
- Check browser console for errors (F12)
- Verify `EditComponentModal.jsx` is being used (not old ComponentModal)
- Hard refresh browser

### Issue: "Changes not reflecting"

**Steps:**
1. Stop frontend server (Ctrl+C)
2. Clear browser cache
3. Restart frontend: `npm run dev`
4. Hard refresh browser: Ctrl+Shift+R
5. Navigate to Settings → Salary Components
6. Click "Add Component"

---

## 📄 File Locations

**Modal Component:**
- `d:\PayRoll\frontend\src\components\EditComponentModal.jsx`
- Lines 302-314: Recurring checkbox
- Lines 316-328: Variable checkbox

**Settings Page:**
- `d:\PayRoll\frontend\src\pages\SalaryComponentsPage.jsx`
- Line 36: Imports EditComponentModal as ComponentModal

**Import Statement:**
```javascript
import ComponentModal from '../components/EditComponentModal';
```

---

## 🎯 Summary

**The modal HAS all required fields:**
- ✅ Component Name, Name in Payslip, Code
- ✅ Type, Calculation Type
- ✅ **Recurring checkbox (EXISTS!)**
- ✅ **Variable checkbox (EXISTS!)**
- ✅ All configuration checkboxes
- ✅ Display Order, Description

**If you don't see these fields:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Check you're in Settings → Salary Components
3. Click "Add Component" button
4. Modal should show all fields

**The Recurring checkbox is definitely there!** It's in a large bordered box on the left side of the Configuration section.
