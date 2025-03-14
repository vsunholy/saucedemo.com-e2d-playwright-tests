# 🚀 SauceDemo E2E Playwright Tests 🎉

Welcome to the **SauceDemo E2E Playwright Tests** repository! This project provides a robust suite of end-to-end tests for the [SauceDemo](https://www.saucedemo.com/) web application using [Playwright](https://playwright.dev/). These tests cover everything from user authentication to inventory management and responsive design, ensuring a smooth and reliable user experience.

---

## 📑 Table of Contents
- [🚀 Introduction](#-introduction)
- [🔧 Prerequisites](#-prerequisites)
- [⚙️ Installation](#-installation)
- [🛠️ Running the Tests](#-running-the-tests)
- [📂 Project Structure](#-project-structure)
- [💻 Code Examples](#-code-examples)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [📞 Contact](#-contact)

---

## 🚀 Introduction
This repository contains automated end-to-end tests for the SauceDemo application. Using Playwright, we simulate user interactions to verify that all features—such as login, inventory display, shopping cart operations, and responsive layouts—work flawlessly. Enjoy exploring the tests and feel free to contribute improvements!

---

## 🔧 Prerequisites
Before running the tests, make sure you have:
- [Node.js](https://nodejs.org/) (v14+)
- [npm](https://www.npmjs.com/)
- [Playwright](https://playwright.dev/)

---

## ⚙️ Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/vsunholy/saucedemo.com-e2d-playwright-tests.git
cd saucedemo.com-e2d-playwright-tests
npm install
```

---

## 🛠️ Running the Tests
Execute all tests with:
```bash
npx playwright test
```
To run a specific test file (e.g., login tests), use:
```bash
npx playwright test tests/login.spec.js
```
Generate and view the HTML report by running:
```bash
npx playwright show-report
```

---

## 📂 Project Structure
```
.
├── fixtures
│   └── users.json        // User credentials for tests :contentReference[oaicite:0]{index=0}
├── tests
│   ├── inventory.spec.js // Inventory related tests :contentReference[oaicite:1]{index=1}
│   ├── login.spec.js     // Login functionality tests :contentReference[oaicite:2]{index=2}
│   └── responsive.spec.js // Responsive design tests :contentReference[oaicite:3]{index=3}
└── utils
    └── page-helpers.js   // Helper functions (e.g., login) :contentReference[oaicite:4]{index=4}
```

---

## 💻 Code Examples

### Login Helper Function
This function automates the login process by filling in the username and password, then clicking the login button.
```js
async function login(page, username, password) {
  await page.fill('#user-name', username);
  await page.fill('#password', password);
  await page.click('#login-button');
}

module.exports = { login };
```
*Source: page-helpers.js* :contentReference[oaicite:5]{index=5}

---

### Login Test Example
A test to verify that valid users can log in successfully.
```js
const { test, expect } = require('@playwright/test');
const { login } = require('../utils/page-helpers');
const users = require('../fixtures/users.json');

test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('Login with valid credentials', async ({ page }) => {
    const user = users.stn;
    await login(page, user.username, user.password);
    await expect(page).toHaveURL(/inventory.html/);
  });
});
```
*Source: login.spec.js* :contentReference[oaicite:6]{index=6}

---

### Inventory Test Example
A test to ensure that the inventory items are displayed correctly after login.
```js
const { test, expect } = require('@playwright/test');
const { login } = require('../utils/page-helpers');
const users = require('../fixtures/users.json');

test.describe('Inventory tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('Login with valid credentials and check inventory items', async ({ page }) => {
    const user = users.stn;
    await login(page, user.username, user.password);
    await expect(page).toHaveURL(/inventory.html/);
    // Further inventory item validations...
  });
});
```
*Source: inventory.spec.js* :contentReference[oaicite:7]{index=7}

---

### Responsive Design Test Example
A test to verify that the website layout adapts correctly on mobile devices.
```js
const { test, expect } = require('@playwright/test');

test.describe('Screen tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('should display the website correctly on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.login_logo')).toBeVisible();
  });
});
```
*Source: responsive.spec.js* :contentReference[oaicite:8]{index=8}

---

## 🤝 Contributing
Contributions are welcome! If you have suggestions, bug fixes, or improvements:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/my-new-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/my-new-feature`).
5. Open a pull request.

Please follow the existing code style and include relevant tests.

---

## 📜 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Made with ❤️ and 🚀 by the SauceDemo E2E Playwright Tests Team!
``` 
