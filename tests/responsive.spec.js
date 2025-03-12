const { test, expect } = require('@playwright/test');

test.describe('Screen tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });


  test.describe('Desktop View', () => {
    test('should display the website layout correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await expect(page.locator('.login_logo')).toBeVisible();
      await expect(page.locator('#user-name')).toBeVisible();
      await expect(page.locator('#password')).toBeVisible();
      await expect(page.locator('#login-button')).toBeVisible();
    });
  });

  test.describe('Tablet View', () => {
    test('should adapt the website design for tablet screen size', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('.login_logo')).toBeVisible();
      await expect(page.locator('#user-name')).toBeVisible();
      await expect(page.locator('#password')).toBeVisible();
      await expect(page.locator('#login-button')).toBeVisible();
    });
  });

 
  test.describe('Mobile View', () => {
    test('should display the website correctly on mobile devices and ensure all interactive elements are accessible', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('.login_logo')).toBeVisible();
      await expect(page.locator('#user-name')).toBeVisible();
      await expect(page.locator('#password')).toBeVisible();
      await expect(page.locator('#login-button')).toBeVisible();
    });
  });
});