import { test } from '../src/fixtures';

test.describe('Navigation', () => {
  test('TC01 - Navigate from Home to Signup / Login', async ({ homePage, loginPage }) => {
    await homePage.open();
    await homePage.header.clickSignupLogin();
    await loginPage.expectLoaded(); // URL /login, "New User Signup!" + both forms visible
  });
});
