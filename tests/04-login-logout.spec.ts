import { test } from '../src/fixtures';

test.describe('Login / Logout', () => {
  test('TC06 - Login with valid credentials', async ({ loginPage, homePage, registeredUser }) => {
    await loginPage.open();
    await loginPage.login(registeredUser.email, registeredUser.password);

    await homePage.expectLoaded();
    await homePage.header.expectLoggedInAs(registeredUser.name); // also asserts Logout link visible
  });

  test('TC07 - Login with a wrong password shows an error', async ({ loginPage, registeredUser }) => {
    await loginPage.open();
    await loginPage.login(registeredUser.email, `${registeredUser.password}_wrong`);

    await loginPage.expectLoginError('Your email or password is incorrect!');
    await loginPage.expectUrl('/login');
  });

  test('TC08 - Logout returns to /login in logged-out state', async ({
    loginPage,
    homePage,
    registeredUser,
  }) => {
    await loginPage.open();
    await loginPage.login(registeredUser.email, registeredUser.password);
    await homePage.expectLoaded();
    await homePage.header.expectLoggedInAs(registeredUser.name);

    await homePage.header.clickLogout();

    await loginPage.expectLoaded();
    await loginPage.header.expectLoggedOut();
  });
});
