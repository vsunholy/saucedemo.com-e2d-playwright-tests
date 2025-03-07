
async function pgVisible(page) {
    
    await expect(page.locator('.login_logo')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
  }
  
  async function login(page, username, password) {
  
    await page.fill('#user-name', username);
    await page.fill('#password', password);
    await page.click('#login-button');
  }
  

  module.exports = { pgVisible, login };