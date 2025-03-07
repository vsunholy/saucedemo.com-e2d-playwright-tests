const { test, expect } = require('@playwright/test');
const { login } = require('../utils/page-helpers');
const users = require('../fixtures/users.json');

test.describe('Login Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test.describe('Login with valid credentials', () => {
    test('Login with valid credentials', async ({ page }) => {
      const user = users.stn;
      await login(page, user.username, user.password);
      await page.waitForURL(/inventory.html/); 
      await expect(page).toHaveURL(/inventory.html/);
      await expect(page.locator('text=Swag Labs')).toBeVisible();
    });
  });

  test.describe('Use incorrect login credentials', () => {
    test('Use incorrect login credentials', async ({ page }) => {
      const user = users.inv;
      await login(page, user.username, 'incorrectpassword');
      await page.waitForSelector('.error-message-container'); 
      await expect(page.locator('.error-button')).toBeVisible();
      await expect(page.locator('text=Epic sadface: Username and password do not match any user in this service')).toBeVisible();
    });
  });

  test.describe('Locked Out User', () => {
    test('Locked Out User', async ({ page }) => {
      const user = users.lck;
      await login(page, user.username, user.password);
      await page.waitForSelector('.error-message-container'); 
      await expect(page.locator('.error-button')).toBeVisible();
      await expect(page.locator('text=Epic sadface: Sorry, this user has been locked out.')).toBeVisible();
    });
  });
});