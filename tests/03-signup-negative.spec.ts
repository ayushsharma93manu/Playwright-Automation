import { expect, test } from '../src/fixtures';
import { buildUser } from '../src/data/userFactory';

test.describe('Sign-up negative scenarios', () => {
  test('TC03 - Sign up with an already registered email shows an error', async ({
    loginPage,
    registeredUser,
  }) => {
    await loginPage.open();
    await loginPage.startSignup('Duplicate User', registeredUser.email);

    await loginPage.expectSignupError('Email Address already exist!');
    await loginPage.expectUrl('/login'); // not advanced to /signup
  });

  const emptyCases = [
    { title: 'both name and email empty', name: '', email: '', invalid: ['name', 'email'] },
    { title: 'name empty', name: '', email: buildUser().email, invalid: ['name'] },
    { title: 'email empty', name: 'Some Name', email: '', invalid: ['email'] },
  ] as const;

  for (const c of emptyCases) {
    test(`TC04 - Sign up with empty fields is blocked (${c.title})`, async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.fillSignupForm(c.name, c.email);
      await loginPage.signupButton.click();

      await loginPage.expectUrl('/login'); // form blocked, stays on /login
      for (const field of c.invalid) {
        const locator = field === 'name' ? loginPage.signupName : loginPage.signupEmail;
        const validity = await loginPage.getValidity(locator);
        expect(validity.valueMissing, `${field} should be flagged as required`).toBe(true);
        expect(validity.message).not.toBe('');
      }
    });
  }

  for (const badEmail of ['plainaddress', 'user@', '@example.com']) {
    test(`TC05 - Sign up with invalid email format is blocked ("${badEmail}")`, async ({
      loginPage,
    }) => {
      await loginPage.open();
      await loginPage.fillSignupForm('Valid Name', badEmail);
      await loginPage.signupButton.click();

      await loginPage.expectUrl('/login'); // form blocked
      const validity = await loginPage.getValidity(loginPage.signupEmail);
      expect(validity.typeMismatch, 'browser flags email format as invalid').toBe(true);
      expect(validity.message, 'validation message is shown').not.toBe('');
    });
  }
});
