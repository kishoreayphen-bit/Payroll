import { test, expect } from '@playwright/test';

async function createUser(page) {
    const uniqueId = Date.now();
    const email = `user${uniqueId}@test.com`;
    const password = 'Pass@1234';

    console.log(`Creating user: ${email}`);

    try {
        await page.goto('/signup');
        await page.fill('#companyName', `Test Co ${uniqueId}`);
        await page.fill('#email', email);

        // Select Country and State
        await page.selectOption('#country', 'India');
        // Wait for state options to render
        await page.waitForTimeout(1000);
        await page.selectOption('#state', 'Tamil Nadu');

        await page.fill('#phoneNumber', '9999999999');

        // Handle "OTP sent" dialog
        page.once('dialog', async dialog => {
            console.log(`Alert 1: ${dialog.message()}`);
            await dialog.dismiss();
        });
        await page.click('button:has-text("Send OTP")');

        // Wait for OTP inputs
        await page.waitForSelector('#otp-0', { state: 'visible', timeout: 10000 });
        await page.waitForTimeout(500); // Wait for transition

        const otp = '123456';
        // Slow typing to avoid focus race conditions with React
        for (let i = 0; i < 6; i++) {
            await page.fill(`#otp-${i}`, otp[i]);
            await page.waitForTimeout(200);
        }

        // Verify OTP was entered correctly
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

        // CRITICAL: Wait for Submit button to be enabled (implies verification state is processed)
        console.log('Waiting for verification completion...');
        await expect(page.locator('button[type="submit"]')).toBeEnabled({ timeout: 15000 });

        // Password
        await page.fill('#password', password);
        await page.fill('#confirmPassword', password);

        // Terms
        console.log('Checking terms...');
        await page.locator('input[name="acceptTerms"]').check({ force: true });

        // Submit
        console.log('Submitting form...');
        await page.click('button[type="submit"]');

        // Expect redirect to Login
        await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
        console.log('Redirected to login');

        return { email, password };
    } catch (error) {
        console.error('FAILED in createUser:', error);
        await page.screenshot({ path: `failure-${uniqueId}.png` });
        throw error;
    }
}

test.describe('Authentication', () => {
    test.slow(); // Increase timeout

    test('Sign Up Flow', async ({ page }) => {
        await createUser(page);
    });

    test('Sign In Flow', async ({ page }) => {
        const { email, password } = await createUser(page);

        console.log('Logging in...');
        await page.goto('/login');
        await page.fill('#emailOrUsername', email);
        await page.fill('#password', password);
        await page.click('button[type="submit"]');

        // Expecting Dashboard or Organization Selection
        await expect(page).toHaveURL(/.*(select-organization|dashboard)/);
        console.log('Login successful');
    });

});
