import { test } from '../src/fixtures';

test.describe('Sign-up flow', () => {
  test('TC02 - Register a new user end-to-end, then delete the account', async ({
    homePage,
    loginPage,
    signupPage,
    accountCreatedPage,
    accountDeletedPage,
    newUser,
  }) => {
    await test.step('1. Home -> Signup / Login', async () => {
      await homePage.open();
      await homePage.header.clickSignupLogin();
      await loginPage.expectLoaded();
    });

    await test.step('2. Enter name + unique email and click Signup', async () => {
      await loginPage.startSignup(newUser.name, newUser.email);
      await signupPage.expectLoaded(newUser);
    });

    await test.step('3. Fill account + address details and Create Account', async () => {
      await signupPage.createAccount(newUser);
    });

    await test.step('4. Assert Account Created page', async () => {
      await accountCreatedPage.expectLoaded();
    });

    await test.step('5. Continue -> user is logged in', async () => {
      await accountCreatedPage.clickContinue();
      await homePage.expectLoaded();
      await homePage.header.expectLoggedInAs(newUser.name);
    });

    await test.step('6. Delete account (clean-up) and assert Account Deleted!', async () => {
      await homePage.header.clickDeleteAccount();
      await accountDeletedPage.expectLoaded();
      await accountDeletedPage.clickContinue();
      await homePage.expectLoaded();
      await homePage.header.expectLoggedOut();
    });
  });
});
