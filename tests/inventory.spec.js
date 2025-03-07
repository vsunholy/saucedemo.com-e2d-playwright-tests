const { test, expect } = require('@playwright/test');
const { login } = require('../utils/page-helpers');
const users = require('../fixtures/users.json');

test.describe('Inventory tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
    });

    test.describe('Displaying the Products List', () => {
        test('Login with valid credentials and check inventory items', async ({ page }) => {
            const user = users.stn;
            await login(page, user.username, user.password);
            await expect(page).toHaveURL(/inventory.html/);
            await expect(page.locator('text=Swag Labs')).toBeVisible();

            const inventoryItems = page.locator('.inventory_item');
            const count = await inventoryItems.count();
            for (let i = 0; i < count; i++) {
                const item = inventoryItems.nth(i);
                await expect(item.locator('img.inventory_item_img')).toBeVisible();
                await expect(item.locator('.inventory_item_name')).toBeVisible();
                await expect(item.locator('.inventory_item_desc')).toBeVisible();
                await expect(item.locator('.inventory_item_price')).toBeVisible();
            }
        });
    });

    test.describe('Add to Cart Functionality', () => {
        test('should update the shopping cart count when items are added', async ({ page }) => {
            const user = users.stn;
            await login(page, user.username, user.password);
            await expect(page).toHaveURL(/inventory.html/);
            await page.locator('.inventory_item').first().locator('text=Add to cart').click();
            await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
            await page.locator('.inventory_item').nth(1).locator('text=Add to cart').click();
            await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
        });
    });

    test.describe('Sorting Functionality', () => {
        test.beforeEach(async ({ page }) => {
            const user = users.stn;
            await login(page, user.username, user.password);
            await expect(page).toHaveURL(/inventory.html/);
        });

        test('should sort products by Name (A to Z)', async ({ page }) => {
            await page.selectOption('.product_sort_container', 'az');
            await expect(page.locator('.inventory_item_name').first()).toHaveText('Sauce Labs Backpack');
        });

        test('should sort products by Name (Z to A)', async ({ page }) => {
            await page.selectOption('.product_sort_container', 'za');
            await expect(page.locator('.inventory_item_name').first()).toHaveText('Test.allTheThings() T-Shirt (Red)');
        });

        test('should sort products by Price (low to high)', async ({ page }) => {
            await page.selectOption('.product_sort_container', 'lohi');
            await expect(page.locator('.inventory_item_price').first()).toHaveText('$7.99');
        });

        test('should sort products by Price (high to low)', async ({ page }) => {
            await page.selectOption('.product_sort_container', 'hilo');
            await expect(page.locator('.inventory_item_price').first()).toHaveText('$49.99');
        });
    });

    test.describe('Viewing Product Details', () => {
        test('should display detailed product information when a product is clicked', async ({ page }) => {
            const user = users.stn;
            await login(page, user.username, user.password);
            await expect(page).toHaveURL(/inventory.html/);
            await page.locator('.inventory_item_name').first().click();
            await expect(page).toHaveURL(/inventory-item.html/);
            await expect(page.locator('.inventory_details_img')).toBeVisible();
            await expect(page.locator('.inventory_details_name')).toBeVisible();
            await expect(page.locator('.inventory_details_desc')).toBeVisible();
            await expect(page.locator('.inventory_details_price')).toBeVisible();
        });
    });

    test.describe('Add/Remove Product from Cart', () => {
        test('should allow adding and removing a product from the cart', async ({ page }) => {
            const user = users.stn;
            await login(page, user.username, user.password);
            await expect(page).toHaveURL(/inventory.html/);
            await page.locator('.inventory_item_name').first().click();
            await expect(page).toHaveURL(/inventory-item.html/);
            await page.locator('button').filter({ hasText: 'Add to cart' }).click();
            await expect(page.locator('button').filter({ hasText: 'Remove' })).toBeVisible();
            await page.locator('button').filter({ hasText: 'Remove' }).click();
            await expect(page.locator('button').filter({ hasText: 'Add to cart' })).toBeVisible();
        });
    });

    test.describe('Returning to the Inventory Page', () => {
        test('should navigate back to the inventory page from product details', async ({ page }) => {
            const user = users.stn;
            await login(page, user.username, user.password);
            await expect(page).toHaveURL(/inventory.html/);
            await page.locator('.inventory_item_name').first().click();
            await expect(page).toHaveURL(/inventory-item.html/);
            await page.locator('[data-test="back-to-products"]').click();
            await expect(page).toHaveURL(/inventory.html/);
        });
    });

    test.describe('Displaying Items in the Cart', () => {
        test('should display all added products in the cart', async ({ page }) => {
            const user = users.stn;
            await login(page, user.username, user.password);
            await expect(page).toHaveURL(/inventory.html/);
            await page.locator('.inventory_item').first().locator('text=Add to cart').click();
            await page.locator('.shopping_cart_link').click();
            await expect(page).toHaveURL(/cart.html/);
            const cartItems = page.locator('.cart_item');
            await expect(cartItems.first()).toBeVisible();
        });
    });

    test.describe('Removing Items from the Cart', () => {
        test('should remove the selected product from the cart and update the cart list', async ({ page }) => {
            const user = users.stn;
            await login(page, user.username, user.password);
            await expect(page).toHaveURL(/inventory.html/);
            await page.locator('.inventory_item').first().locator('text=Add to cart').click();
            await page.locator('.shopping_cart_link').click();
            await expect(page).toHaveURL(/cart.html/);
            const cartItems = page.locator('.cart_item');
            await expect(cartItems.first()).toBeVisible();
            await cartItems.first().locator('text=Remove').click();
            await expect(cartItems).toHaveCount(0);
        });
    });

    test.describe('Checkout Button Functionality', () => {
        test('should redirect to the first step of the checkout process when the Checkout button is clicked', async ({ page }) => {
            const user = users.stn;
            await login(page, user.username, user.password);
            await expect(page).toHaveURL(/inventory.html/);
            await page.locator('.inventory_item').first().locator('text=Add to cart').click();
            await page.locator('.shopping_cart_link').click();
            await expect(page).toHaveURL(/cart.html/);
            await page.locator('text=Checkout').click();
            await expect(page).toHaveURL(/checkout-step-one.html/);
        });
    });
    test.describe('Customer Information Form in Checkout', () => {
        test('should proceed to the Order Overview page when valid customer information is provided', async ({ page }) => {
          const user = users.stn;
          await login(page, user.username, user.password);
          await expect(page).toHaveURL(/inventory.html/);
          await page.locator('.inventory_item').first().locator('text=Add to cart').click();
          await page.locator('.shopping_cart_link').click();
          await expect(page).toHaveURL(/cart.html/);
          await page.locator('text=Checkout').click();
          await expect(page).toHaveURL(/checkout-step-one.html/);
          await page.fill('[data-test="firstName"]', 'Spider');
          await page.fill('[data-test="lastName"]', 'Man');
          await page.fill('[data-test="postalCode"]', '12345');
          await page.locator('[data-test="continue"]').click();
          await expect(page).toHaveURL(/checkout-step-two.html/);
        });
      });
    
    
      test.describe('Empty Fields in Checkout Form', () => {
        test('should display an error message when required fields are empty', async ({ page }) => {
          const user = users.stn;
          await login(page, user.username, user.password);
          await expect(page).toHaveURL(/inventory.html/);
          await page.locator('.inventory_item').first().locator('text=Add to cart').click();
          await page.locator('.shopping_cart_link').click();
          await expect(page).toHaveURL(/cart.html/);
          await page.locator('text=Checkout').click();
          await expect(page).toHaveURL(/checkout-step-one.html/);
          await page.fill('[data-test="firstName"]', 'Bat');
          await page.fill('[data-test="lastName"]', 'man');
          // Postal code intentionally left empty
          await page.locator('[data-test="continue"]').click();
          await expect(page.locator('[data-test="error"]')).toBeVisible();
          await expect(page.locator('[data-test="error"]')).toContainText('Postal Code');
        });
      });
    
    
      test.describe('Order Overview Page', () => {
        test('should display the ordered products, prices, taxes, and total sum on the Order Overview page', async ({ page }) => {
          const user = users.stn;
          await login(page, user.username, user.password);
          await expect(page).toHaveURL(/inventory.html/);
          await page.locator('.inventory_item').first().locator('text=Add to cart').click();
          await page.locator('.shopping_cart_link').click();
          await expect(page).toHaveURL(/cart.html/);
          await page.locator('text=Checkout').click();
          await expect(page).toHaveURL(/checkout-step-one.html/);
          await page.fill('[data-test="firstName"]', 'Super');
          await page.fill('[data-test="lastName"]', 'man');
          await page.fill('[data-test="postalCode"]', '12345');
          await page.locator('[data-test="continue"]').click();
          await expect(page).toHaveURL(/checkout-step-two.html/);
          await expect(page.locator('.cart_item').first()).toBeVisible(); // At least one item
          await expect(page.locator('.summary_subtotal_label')).toBeVisible();
          await expect(page.locator('.summary_subtotal_label')).toContainText('$');
          await expect(page.locator('.summary_tax_label')).toBeVisible();
          await expect(page.locator('.summary_tax_label')).toContainText('$');
          await expect(page.locator('.summary_total_label')).toBeVisible();
          await expect(page.locator('.summary_total_label')).toContainText('$');
        });
      });
    
   
      test.describe('Cancel Order Functionality', () => {
        test('should cancel the order and redirect the user back to the Inventory page', async ({ page }) => {
          const user = users.stn;
          await login(page, user.username, user.password);
          await expect(page).toHaveURL(/inventory.html/);
          await page.locator('.inventory_item').first().locator('text=Add to cart').click();
          await page.locator('.shopping_cart_link').click();
          await expect(page).toHaveURL(/cart.html/);
          await page.locator('text=Checkout').click();
          await expect(page).toHaveURL(/checkout-step-one.html/);
          await page.fill('[data-test="firstName"]', 'Son');
          await page.fill('[data-test="lastName"]', 'Goku');
          await page.fill('[data-test="postalCode"]', '12345');
          await page.locator('[data-test="continue"]').click();
          await expect(page).toHaveURL(/checkout-step-two.html/);
          await page.locator('text=Cancel').click();
          await expect(page).toHaveURL(/inventory.html/);
        });
      });
    
     
      test.describe('Finish Order Functionality', () => {
        test('should complete the order and display the Order Confirmation page', async ({ page }) => {
          const user = users.stn;
          await login(page, user.username, user.password);
          await expect(page).toHaveURL(/inventory.html/);
          await page.locator('.inventory_item').first().locator('text=Add to cart').click();
          await page.locator('.shopping_cart_link').click();
          await expect(page).toHaveURL(/cart.html/);
          await page.locator('text=Checkout').click();
          await expect(page).toHaveURL(/checkout-step-one.html/);
          await page.fill('[data-test="firstName"]', 'Go');
          await page.fill('[data-test="lastName"]', 'han');
          await page.fill('[data-test="postalCode"]', '12345');
          await page.locator('[data-test="continue"]').click();
          await expect(page).toHaveURL(/checkout-step-two.html/);
          await page.locator('text=Finish').click();
          await expect(page).toHaveURL(/checkout-complete.html/);
          await expect(page.locator('.complete-header')).toBeVisible();
          await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
          await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
        });
      });
    
      
      test.describe('Opening the Menu', () => {
        test('should display all available menu options when the hamburger menu icon is clicked', async ({ page }) => {
          const user = users.stn;
          await login(page, user.username, user.password);
          await expect(page).toHaveURL(/inventory.html/);
          await page.locator('#react-burger-menu-btn').click();
          await expect(page.locator('.bm-item-list')).toBeVisible();
          await expect(page.locator('text=All Items')).toBeVisible();
          await expect(page.locator('text=About')).toBeVisible();
          await expect(page.locator('text=Logout')).toBeVisible();
          await expect(page.locator('text=Reset App State')).toBeVisible();
        });
      });
    
      test.describe('Navigation to "All Items"', () => {
        test('should redirect the user to the products list page when "All Items" is selected', async ({ page }) => {
          const user = users.stn;
          await login(page, user.username, user.password);
          await expect(page).toHaveURL(/inventory.html/);
          await page.locator('#react-burger-menu-btn').click();
          await page.locator('text=All Items').click();
          await expect(page).toHaveURL(/inventory.html/);
          await expect(page.locator('.inventory_list')).toBeVisible();
        });
      });
    
      test.describe('Navigation to "About"', () => {
        test('should redirect the user to the Sauce Labs information page', async ({ page }) => {
          const user = users.stn;
          await login(page, user.username, user.password);
          await expect(page).toHaveURL(/inventory.html/);
          await page.locator('#react-burger-menu-btn').click();
          await expect(page.locator('text=About')).toHaveAttribute('href', 'https://saucelabs.com/');
        });
      });
});