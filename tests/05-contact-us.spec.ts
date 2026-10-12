import { test } from '../src/fixtures';
import { uniqueEmail } from '../src/data/userFactory';

test.describe('Contact Us', () => {
  test('TC09 - Contact Us form submission shows a success message', async ({
    homePage,
    contactUsPage,
  }) => {
    await homePage.open();
    await homePage.header.clickContactUs();
    await contactUsPage.expectLoaded();

    await contactUsPage.submit({
      name: 'Auto Tester',
      email: uniqueEmail('contact'),
      subject: `Automation query ${Date.now()}`,
      message: 'This message was submitted by an automated Playwright test.',
    });

    await contactUsPage.expectSubmitted();
    await contactUsPage.expectUrl('/contact_us');
  });
});
