<div align="center">
  
# 🔥 Saucedemo.com End-to-End Tests with Playwright 🔥

[![Playwright Tests](https://img.shields.io/badge/Powered%20by-Playwright-45ba4b.svg)](https://playwright.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


<img src="https://user-images.githubusercontent.com/10379601/29446482-04f7036a-841f-11e7-9872-91d1fc2ea683.png" height="200" alt="Playwright Logo"/>

Robust, maintainable and blazing fast E2E tests for the Sauce Demo application
</div>

## ✨ Overview

This repository showcases automated end-to-end tests for the [Sauce Demo](https://www.saucedemo.com) website, a sample e-commerce application designed for testing purposes. These tests demonstrate how to leverage Playwright with JavaScript to create reliable, maintainable test automation for modern web applications.

The test suite covers:

- 🔐 User authentication (login/logout)
- 🛍️ Product browsing and filtering
- 🛒 Shopping cart operations
- 💳 Checkout process
- 👤 User profile management

## 🛠️ Technology Stack

- **[Playwright](https://playwright.dev/)**: Modern end-to-end testing framework for web applications
- **[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)**: ES6+ for clean, modern test code
- **[Node.js](https://nodejs.org/)**: JavaScript runtime environment
- **[GitHub Actions](https://github.com/features/actions)**: CI/CD workflow automation

## 📂 Project Structure

```
📦 saucedemo.com-e2d-playwright-tests
 ┣ 📂 .github/workflows    # GitHub Actions workflow configurations
 ┣ 📂 page-objects         # Page Object Models for different sections
 ┣ 📂 tests                # Test files organized by feature or page
 ┣ 📂 utils                # Helper functions and utilities
 ┣ 📜 playwright.config.js # Playwright configuration
 ┣ 📜 package.json         # Project dependencies and scripts
 ┗ 📜 .eslintrc.js         # ESLint configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### 💻 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/vsunholy/saucedemo.com-e2d-playwright-tests.git
   cd saucedemo.com-e2d-playwright-tests
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### 🧪 Running Tests

Run all tests:
```bash
npm test
```

Run tests in a specific browser:
```bash
npx playwright test --project=chromium
```

Run a specific test file:
```bash
npx playwright test tests/login.spec.js
```

Run tests in UI mode for debugging:
```bash
npx playwright test --ui
```

## 📊 Test Reports

Generate and open HTML test report:
```bash
npx playwright show-report
```

## 🔍 Code Snippets

### Page Object Pattern Example

```javascript
// page-objects/LoginPage.js
class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameInput = '[data-test="username"]';
    this.passwordInput = '[data-test="password"]';
    this.loginButton = '[data-test="login-button"]';
    this.errorMessage = '[data-test="error"]';
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  /**
   * Login with the provided credentials
   */
  async login(username, password) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }

  /**
   * Get the error message text if present
   */
  async getErrorMessage() {
    return this.page.textContent(this.errorMessage);
  }
}

module.exports = { LoginPage };
```

### Test Example

```javascript
// tests/login.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../page-objects/LoginPage');
const { InventoryPage } = require('../page-objects/InventoryPage');

test.describe('Login Functionality', () => {
  /** @type {LoginPage} */
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login with valid credentials', async ({ page }) => {
    // Arrange
    const inventoryPage = new InventoryPage(page);
    
    // Act
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Assert
    await expect(page).toHaveURL(/inventory.html/);
    await expect(inventoryPage.getTitle()).toBeVisible();
  });

  test('should display error with locked out user', async () => {
    // Act
    await loginPage.login('locked_out_user', 'secret_sauce');
    
    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Sorry, this user has been locked out');
  });

  test('should display error with invalid credentials', async () => {
    // Act
    await loginPage.login('invalid_user', 'invalid_password');
    
    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
  });
});
```

### Test Data Helper

```javascript
// utils/test-data.js
/**
 * Collection of test users for authentication tests
 * @type {Object}
 */
const TEST_USERS = {
  STANDARD: {
    username: 'standard_user',
    password: 'secret_sauce',
    description: 'User with standard permissions'
  },
  LOCKED_OUT: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    description: 'User that has been locked out'
  },
  PROBLEM: {
    username: 'problem_user',
    password: 'secret_sauce',
    description: 'User that encounters various issues'
  },
  PERFORMANCE_GLITCH: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    description: 'User that experiences slow load times'
  }
};

/**
 * Sample customer information for checkout tests
 * @type {Object}
 */
const CUSTOMER_INFO = {
  firstName: 'Test',
  lastName: 'Customer',
  postalCode: '12345'
};

module.exports = { TEST_USERS, CUSTOMER_INFO };
```

## 🔄 CI/CD Integration

This repository includes GitHub Actions workflow configurations to run tests automatically on push and pull requests. Here's a snippet from our workflow file:

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## 🌟 Best Practices Demonstrated

- **Page Object Model**: Separation of test logic from page interactions
- **Data-driven testing**: Parameterized tests for different scenarios
- **Visual testing**: Screenshots for visual comparison
- **Parallel execution**: Tests run concurrently for faster feedback
- **Retry logic**: Automatic retry for flaky tests
- **Cross-browser testing**: Tests run across multiple browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-test`
3. Commit your changes: `git commit -am 'Add new test for feature X'`
4. Push to the branch: `git push origin feature/new-test`
5. Submit a pull request

<div align="center">
  
## 📚 Resources

| Resource | Link |
|----------|------|
| Playwright Docs | [playwright.dev/docs/intro](https://playwright.dev/docs/intro) |
| Sauce Demo Website | [saucedemo.com](https://www.saucedemo.com) |
| JavaScript MDN | [developer.mozilla.org/en-US/docs/Web/JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) |

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<img src="https://user-images.githubusercontent.com/10379601/29446482-04f7036a-841f-11e7-9872-91d1fc2ea683.png" height="50" alt="Playwright Logo"/>

**Made with ❤️ by Test Automation Engineers**
</div>
