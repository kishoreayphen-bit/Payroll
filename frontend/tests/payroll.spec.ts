import { test, expect, Page } from '@playwright/test';

async function loginAsNewUser(page: Page) {
    const uniqueId = Date.now();
    const email = `pay_admin${uniqueId}@test.com`;
    const password = 'Pass@1234';

    await page.goto('/signup');
    await page.fill('#companyName', `Payroll Org ${uniqueId}`);
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
        await page.waitForTimeout(200);
    }

    page.once('dialog', d => d.dismiss());
    await page.click('button:has-text("Verify")');
    await expect(page.locator('button[type="submit"]')).toBeEnabled({ timeout: 15000 });

    await page.fill('#password', password);
    await page.fill('#confirmPassword', password);
    await page.locator('input[name="acceptTerms"]').check({ force: true });
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*(select-organization|dashboard|login)/, { timeout: 30000 });

    if (page.url().includes('login')) {
        await page.waitForLoadState('networkidle');
        await page.fill('#emailOrUsername', email);
        await page.fill('#password', password);
        await page.click('button[type="submit"]');
    }

    await expect(page).toHaveURL(/.*(select-organization|dashboard)/, { timeout: 30000 });

    try {
        const createOrgBtn = page.locator('button:has-text("Create Your First Organization")');
        if (await createOrgBtn.isVisible({ timeout: 5000 })) {
            console.log('Creating new organization...');
            await createOrgBtn.click();
            await page.waitForTimeout(1000);

            await page.fill('#companyName', `Pay Org ${uniqueId}`);
            await page.selectOption('select#businessLocation', 'India');
            await page.selectOption('select#industry', 'Technology');
            await page.fill('#addressLine1', '123 Pay Park');
            await page.selectOption('select#state', 'Tamil Nadu');
            await page.fill('#city', 'Chennai');
            await page.fill('#pinCode', '600001');
            await page.check('input[value="no"]');

            await page.click('button[type="submit"]');
            await page.waitForTimeout(5000);
        }
    } catch (e) {
        console.log('Create Organization button check skipped/failed, proceeding...');
    }

    await expect(page).toHaveURL(/.*(select-organization|dashboard)/, { timeout: 30000 });

    if (page.url().includes('select-organization')) {
        const orgCard = page.locator('.group').first();
        if (await orgCard.isVisible()) {
            await orgCard.click();
        } else {
            const orgText = page.getByText(`Payroll Org ${uniqueId}`);
            if (await orgText.isVisible()) await orgText.click();
        }
    }
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 30000 });
}

async function addEmployee(page: Page) {
    // Navigate to add employee to have someone to pay
    await page.goto('/employees/add');

    const uniqueId = Date.now();
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', `john.doe${uniqueId}@example.com`);
    await page.fill('input[name="employeeId"]', `EMP${uniqueId}`);
    await page.selectOption('select[name="gender"]', 'Male');
    await page.fill('input[name="department"]', 'Engineering');
    await page.fill('input[name="designation"]', 'Developer');
    await page.selectOption('select[name="location"]', 'Bangalore');
    await page.fill('input[name="dateOfJoining"]', '2023-01-01');

    await page.click('button:has-text("Next")');

    await page.fill('input[name="ctc"]', '1200000');
    // Calculate might auto-fill others

    await page.click('button:has-text("Next")');
    await page.fill('input[name="dateOfBirth"]', '1990-01-01');
    await page.fill('input[name="fatherName"]', 'Father Doe');

    await page.click('button:has-text("Next")');
    await page.fill('input[name="accountNumber"]', '1234567890');
    await page.fill('input[name="ifscCode"]', 'HDFC0001234');
    await page.fill('input[name="bankName"]', 'HDFC Bank');

    await page.click('button:has-text("Save Employee")');
    await page.waitForSelector('.bg-green-50'); // Success alert
}

test.describe('Payroll Processing', () => {
    test.slow();
    test.setTimeout(300000); // 5 minutes

    test('Run Payroll Flow', async ({ page }) => {
        await loginAsNewUser(page);

        console.log('Adding an employee for payroll...');
        await addEmployee(page);

        console.log('Navigating to Pay Runs...');
        await page.goto('/pay-runs');

        // Assert "Create Pay Run" is visible
        await expect(page.locator('button:has-text("Create Pay Run")')).toBeVisible();
        await page.click('button:has-text("Create Pay Run")');

        // Fill Modal
        await page.waitForSelector('h2:has-text("Create Pay Run")');
        // Dates should rely on defaults or we can set them
        // Just click Create since defaults are current month
        await page.click('button[type="submit"]'); // "Create Pay Run" in modal

        // Wait for table to populate
        await page.waitForSelector('table', { state: 'visible' });

        // Find the new pay run (Status: DRAFT)
        const draftStatus = page.locator('span', { hasText: 'DRAFT' }).first();
        await expect(draftStatus).toBeVisible();

        // Calculate
        console.log('Calculating Payroll...');
        const calculateBtn = page.locator('button[title="Calculate Payroll"]').first();
        await calculateBtn.click();

        // Status should change to PENDING APPROVAL (after calculation)
        await expect(page.locator('span', { hasText: 'PENDING APPROVAL' }).first()).toBeVisible({ timeout: 15000 });

        // Approve
        console.log('Approving Payroll...');
        const approveBtn = page.locator('button[title="Approve"]').first();
        await approveBtn.click();

        await expect(page.locator('span', { hasText: 'APPROVED' }).first()).toBeVisible({ timeout: 15000 });

        // Complete
        console.log('Completing Payroll...');
        const completeBtn = page.locator('button[title="Mark as Completed"]').first();
        await completeBtn.click();

        await expect(page.locator('span', { hasText: 'COMPLETED' }).first()).toBeVisible({ timeout: 15000 });

        // Generate Payslips
        console.log('Generating Payslips...');
        const payslipsBtn = page.locator('button[title="Generate Payslips"]').first();
        await payslipsBtn.click();

        // Expect alert "Payslips generated successfully"
        page.once('dialog', async dialog => {
            console.log(`Alert: ${dialog.message()}`);
            await dialog.dismiss();
        });

        console.log('Payroll Flow Verified');
    });
});
