import { test, expect } from '@playwright/test';

async function loginAsNewUser(page) {
    const uniqueId = Date.now();
    const email = `emp_admin${uniqueId}@test.com`;
    const password = 'Pass@1234';

    await page.goto('/signup');
    await page.fill('#companyName', `Emp Co ${uniqueId}`);
    await page.fill('#email', email);
    await page.selectOption('#country', 'India');
    await page.waitForTimeout(1000);
    await page.selectOption('#state', 'Tamil Nadu');
    await page.fill('#phoneNumber', '9999999999');

    page.once('dialog', d => d.dismiss());
    await page.click('button:has-text("Send OTP")');
    await page.waitForSelector('#otp-0');

    const otp = '123456';
    for (let i = 0; i < 6; i++) {
        await page.fill(`#otp-${i}`, otp[i]);
        await page.waitForTimeout(200); // Slow typing
    }

    page.once('dialog', d => d.dismiss());
    await page.click('button:has-text("Verify")');

    await expect(page.locator('button[type="submit"]')).toBeEnabled({ timeout: 15000 });

    await page.fill('#password', password);
    await page.fill('#confirmPassword', password);
    await page.locator('input[name="acceptTerms"]').check({ force: true });
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
    await page.fill('#emailOrUsername', email);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*(select-organization|dashboard)/, { timeout: 15000 });

    // Check if we need to create an organization
    const createOrgBtn = page.locator('button:has-text("Create Your First Organization")');
    if (await createOrgBtn.isVisible()) {
        console.log('Creating new organization...');
        await createOrgBtn.click();
        await page.waitForTimeout(1000);

        await page.fill('#companyName', `Emp Org ${uniqueId}`);
        await page.selectOption('select#businessLocation', 'India');
        await page.selectOption('select#industry', 'Technology');
        await page.fill('#addressLine1', '123 Tech Park');
        await page.selectOption('select#state', 'Tamil Nadu');
        await page.fill('#city', 'Chennai');
        await page.fill('#pinCode', '600001');
        await page.check('input[value="no"]');

        await page.click('button[type="submit"]');
        // Wait for creation and potential redirect
        await page.waitForTimeout(5000);
    }

    await expect(page).toHaveURL(/.*(select-organization|dashboard)/, { timeout: 20000 });

    if (page.url().includes('select-organization')) {
        // Try to click the specific company if generated
        // The text might be `Emp Co ${uniqueId}` or `Emp Org ${uniqueId}` depending on what was created
        // We will just click the first available organization card
        const orgCard = page.locator('.group').first();
        if (await orgCard.isVisible()) {
            await orgCard.click();
        } else {
            // Fallback if text search works
            const orgText = page.getByText(`Emp Co ${uniqueId}`);
            if (await orgText.isVisible()) await orgText.click();
        }
    }

    await expect(page).toHaveURL(/.*dashboard/);
}

test.describe('Employee Management', () => {
    test.slow();

    test('Add New Employee', async ({ page }) => {
        await loginAsNewUser(page);

        // Navigate to Employees
        console.log('Navigating to Employees...');
        // Assuming there is a sidebar link or we can go directly
        await page.goto('/employees');
        await expect(page).toHaveURL(/.*employees/);

        // Click Add Employee
        console.log('Clicking Add Employee...');
        // Wait for button to be visible
        await page.waitForSelector('button:has-text("Add Employee")');
        await page.click('button:has-text("Add Employee")');

        // Step 1: Basic Details
        console.log('Filling Basic Details...');
        const empId = `EMP${Date.now()}`;
        await page.fill('input[name="firstName"]', 'John');
        await page.fill('input[name="lastName"]', 'Doe');
        await page.fill('input[name="employeeId"]', empId);
        await page.fill('input[name="dateOfJoining"]', '2025-01-01');
        await page.fill('input[name="workEmail"]', `john.${empId}@company.com`);
        await page.selectOption('select[name="gender"]', 'male');
        await page.selectOption('select[name="workLocation"]', 'head-office');
        await page.selectOption('select[name="designation"]', 'developer');
        await page.selectOption('select[name="department"]', 'engineering');

        await page.click('button:has-text("Next")');

        // Step 2: Salary Details
        console.log('Filling Salary Details...');
        // Wait for CTC input
        await page.waitForSelector('input[name="annualCtc"]');
        await page.fill('input[name="annualCtc"]', '1200000');

        await page.click('button:has-text("Next")');

        // Step 3: Personal Details
        console.log('Filling Personal Details...');
        await page.waitForSelector('input[name="dateOfBirth"]');
        await page.fill('input[name="dateOfBirth"]', '1990-01-01');
        await page.fill('input[name="fatherName"]', 'Robert Doe');

        await page.click('button:has-text("Next")');

        // Step 4: Payment Information
        console.log('Filling Payment Information...');
        await page.waitForSelector('input[name="bankName"]'); // Default is bank_transfer
        await page.fill('input[name="bankName"]', 'HDFC Bank');
        await page.fill('input[name="accountNumber"]', '1234567890');
        await page.fill('input[name="ifscCode"]', 'HDFC0001234');

        // Submit
        console.log('Saving Employee...');
        await page.click('button:has-text("Save Employee")');

        // Verify Success
        // Wait for alert and redirect
        // Alert might be native or toast? Code uses `alert()`
        page.once('dialog', async dialog => {
            console.log(`Success Alert: ${dialog.message()}`);
            await dialog.dismiss();
        });

        // Wait for redirect to employee list
        await expect(page).toHaveURL(/\/employees$/, { timeout: 15000 });

        // Verify in list
        // Reload page to be safe or just wait? List should auto-refresh or we are redirected to it.
        await page.reload();
        await expect(page.getByText('John Doe')).toBeVisible();
        console.log('Employee verified in list');
    });
});
