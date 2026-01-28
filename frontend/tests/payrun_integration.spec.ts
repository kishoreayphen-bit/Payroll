
import { test, expect } from '@playwright/test';

test.describe('Payroll & Attendance Integration', () => {

    test.use({ viewport: { width: 1280, height: 720 } }); // Ensure standard viewport

    test('Verify LOP Calculation in Pay Run', async ({ page }) => {
        // 1. Sign Up (New User for clean state)
        const timestamp = Date.now();
        const uniqueUser = `lop_user_${timestamp}`;
        const uniqueEmail = `lop_${timestamp}@example.com`;

        console.log(`Creating user: ${uniqueEmail}`);

        await page.goto('/signup');
        await page.fill('#companyName', `LOP Org ${timestamp}`);
        await page.fill('#email', uniqueEmail);

        // Select Country and State (From auth.spec.ts logic)
        await page.selectOption('#country', 'India');
        await page.waitForTimeout(1000);
        await page.selectOption('#state', 'Karnataka');

        await page.fill('#phoneNumber', '9999999999');

        // Handle "OTP sent" dialog (From auth.spec.ts logic)
        page.once('dialog', async dialog => {
            console.log(`Alert 1: ${dialog.message()}`);
            await dialog.dismiss();
        });
        await page.click('button:has-text("Send OTP")');

        // Wait for OTP inputs
        await page.waitForSelector('#otp-0', { state: 'visible', timeout: 10000 });
        await page.waitForTimeout(500);

        const otp = '123456';
        // Slow typing to avoid focus race conditions
        for (let i = 0; i < 6; i++) {
            await page.fill(`#otp-${i}`, otp[i]);
            await page.waitForTimeout(200);
        }

        // Ensure last digit entered
        const lastDigit = await page.inputValue('#otp-5');
        if (lastDigit !== '6') {
            throw new Error(`OTP entry failed. Last digit is ${lastDigit}`);
        }

        // Handle "Verified" dialog
        page.once('dialog', async dialog => {
            console.log(`Alert 2: ${dialog.message()}`);
            await dialog.dismiss();
        });
        await page.click('button:has-text("Verify")');

        // Wait for Verification Completion (Submit enabled)
        await expect(page.locator('button:has-text("Sign up now")')).toBeEnabled({ timeout: 15000 });

        // Password
        await page.fill('#password', 'Test@123');
        await page.fill('#confirmPassword', 'Test@123');

        // Terms
        await page.locator('input[name="acceptTerms"]').check({ force: true });

        // Submit
        await page.click('button:has-text("Sign up now")');

        // Wait for Login Redirect
        await expect(page).toHaveURL(/.*login/, { timeout: 30000 });

        // Perform Login
        await page.fill('#emailOrUsername', uniqueEmail);
        await page.fill('#password', 'Test@123');
        await page.click('button[type="submit"]');

        // Handle Organization Creation Flow
        await expect(page).toHaveURL(/.*(select-organization|dashboard|tenant\/register)/, { timeout: 30000 });

        // Logic to detect if we need to create org or select one
        const createBtn = page.locator('button:has-text("Create Your First Organization")');
        if (await createBtn.isVisible({ timeout: 5000 })) {
            console.log('Detected "No Organizations Yet" screen. Creating new organization...');
            await createBtn.click();
        } else if (page.url().includes('tenant/register')) {
            console.log('Already on register page');
        }

        // Wait for register page
        await expect(page).toHaveURL(/.*tenant\/register/, { timeout: 30000 });

        console.log('Filling Organization Details...');
        await page.fill('#companyName', `LOP Org ${timestamp}`);
        await page.selectOption('#businessLocation', 'India');
        await page.selectOption('#industry', 'Technology');
        await page.fill('#addressLine1', '123 Test St');

        // State options might need time to load after Country selection (if dependent)
        // But default 'India' was selected.
        await page.selectOption('#state', 'Karnataka');

        await page.fill('#city', 'Bangalore');
        await page.fill('#pinCode', '560001');

        // "Does your organization have existing employees?" -> No
        // Use more specific selector if possible, or force check
        await page.locator('input[value="no"]').check({ force: true });

        // Submit
        await page.click('button:has-text("Save & Continue")');

        console.log('Organization Created. Waiting for Dashboard...');
        await page.waitForURL('/select-organization', { timeout: 30000 }); // Redirects to select-org first

        // Select the org
        await page.click('.group'); // Click the card

        await page.waitForURL('/dashboard', { timeout: 30000 });

        // 2. Add Employee
        await page.click('text=Employees');
        await page.click('button:has-text("Add Employee")');

        await page.fill('input[name="firstName"]', 'LOP');
        await page.fill('input[name="lastName"]', 'Tester');
        await page.fill('input[name="email"]', `emp_${timestamp}@corp.com`);
        await page.fill('input[name="designation"]', 'Analyst');
        await page.click('button:has-text("Generate")'); // Emp ID
        await page.fill('input[name="dateOfJoining"]', '2024-01-01');
        await page.click('button:has-text("Next")');

        // Salary Details
        await page.fill('input[name="annualCtc"]', '600000'); // 50k/month
        await page.click('button:has-text("Next")');

        // Personal Details
        await page.click('button:has-text("Next")');

        // Payment
        await page.click('button:has-text("Save Employee")');
        await expect(page.locator('text=Employee added successfully')).toBeVisible();

        // 3. Mark Attendance (1 Day LOP)
        await page.click('text=Attendance');

        // Auto Initialize first
        await page.click('button:has-text("Auto-Initialize")');
        await expect(page.locator('text=Attendance initialized')).toBeVisible();

        // Find the employee row and mark Day 5 as ABSENT
        const row = page.locator('tr:has-text("LOP Tester")');
        const day5Cell = row.locator('td').nth(5);
        await day5Cell.locator('button').click();

        await expect(page.locator('text=Update Attendance')).toBeVisible();
        await page.click('button:has-text("Mark Absent")');

        if (await page.locator('button:has-text("Close")').isVisible()) {
            await page.click('button:has-text("Close")');
        }

        await expect(day5Cell.locator('button')).toHaveText('A');

        // 4. Run Payroll
        await page.click('text=Payroll');
        await page.click('button:has-text("Run Payroll")');

        await page.click('button:has-text("Create Draft")');

        await page.click('text=View/Edit');

        // 5. Calculate
        await page.click('button:has-text("Calculate Payroll")');
        await expect(page.locator('text=Calculated')).toBeVisible();

        // 6. Verify LOP
        const payRow = page.locator('tr:has-text("LOP Tester")');
        await payRow.click();

        await expect(page.locator('text=LOP Days: 1')).toBeVisible();

        const deductionText = await page.locator('text=LOP Deduction').first().innerText();
        expect(deductionText).not.toContain('₹0.00');

        console.log('LOP Validation Successful');
    });
});
