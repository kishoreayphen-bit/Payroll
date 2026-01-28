import { test, expect } from '@playwright/test';

async function loginAsNewUser(page) {
    const uniqueId = Date.now();
    const email = `stat_admin${uniqueId}@test.com`;
    const password = 'Pass@1234';

    await page.goto('/signup');
    await page.fill('#companyName', `Statutory Org ${uniqueId}`);
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

            await page.fill('#companyName', `Stat Org ${uniqueId}`);
            await page.selectOption('select#businessLocation', 'India');
            await page.selectOption('select#industry', 'Technology');
            await page.fill('#addressLine1', '123 Stat Lane');
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
            const orgText = page.getByText(`Statutory Org ${uniqueId}`);
            if (await orgText.isVisible()) await orgText.click();
        }
    }
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 30000 });
}

test.describe('Statutory Settings', () => {
    test.setTimeout(60000); // 1 minute

    test('Enable Statutory Components', async ({ page }) => {
        await loginAsNewUser(page);

        console.log('Navigating to Statutory Settings...');
        await page.goto('/settings/statutory');
        await expect(page.locator('h1')).toContainText('Statutory Compliance');

        // Helper to enable a toggle if not already enabled using text-based filtering
        const ensureToggleEnabled = async (labelStartText) => {
            console.log(`Ensuring ${labelStartText} is enabled...`);
            // Find the row containing the text. The row has class "rounded-lg" and "border".
            // We look for div that has the text and has a checkbox inside.
            const row = page.locator('div.rounded-lg.border').filter({ hasText: labelStartText }).last();

            await expect(row).toBeVisible();

            const checkbox = row.locator('input[type="checkbox"]');
            const isChecked = await checkbox.isChecked();

            if (!isChecked) {
                console.log(`Enabling ${labelStartText}...`);
                // Click the label to toggle
                await row.locator('label').click();
                await page.waitForTimeout(500); // Small wait for UI update
                await expect(checkbox).toBeChecked();
            } else {
                console.log(`${labelStartText} is already enabled.`);
            }
        };

        // Enable PF, ESI, PT, TDS (optional but good to check)
        // Note: Text must match what's in the DOM. "Provident Fund (PF)", "ESI", "Professional Tax"
        await ensureToggleEnabled('Provident Fund (PF)');
        await ensureToggleEnabled('ESI');
        await ensureToggleEnabled('Professional Tax');

        console.log('Saving settings...');
        await page.click('button:has-text("Save")');

        // Handle alert
        page.once('dialog', async dialog => {
            console.log(`Alert: ${dialog.message()}`);
            await dialog.dismiss();
        });

        // Verify persistence
        console.log('Reloading to verify persistence...');
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Verify
        const verifyEnabled = async (labelStartText) => {
            const row = page.locator('div.rounded-lg.border').filter({ hasText: labelStartText }).last();
            await expect(row).toBeVisible();
            const checkbox = row.locator('input[type="checkbox"]');
            await expect(checkbox).toHaveJSProperty('checked', true);
            console.log(`Verified ${labelStartText} is enabled.`);
        };

        await verifyEnabled('Provident Fund (PF)');
        await verifyEnabled('ESI');
        await verifyEnabled('Professional Tax');
    });
});
