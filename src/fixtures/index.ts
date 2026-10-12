import { test as base } from '@playwright/test';
import { createUserViaApi, deleteUserViaApi } from '../api/userApi';
import { buildUser, UserData } from '../data/userFactory';
import { AccountCreatedPage } from '../pages/AccountCreatedPage';
import { AccountDeletedPage } from '../pages/AccountDeletedPage';
import { ContactUsPage } from '../pages/ContactUsPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { SignupPage } from '../pages/SignupPage';

type Fixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  accountCreatedPage: AccountCreatedPage;
  accountDeletedPage: AccountDeletedPage;
  contactUsPage: ContactUsPage;
  productsPage: ProductsPage;

  /** Fresh, unique, NOT-yet-registered user. Auto-cleaned if the test registers it. */
  newUser: UserData;
  /** Unique user already registered (via API). Deleted after the test. */
  registeredUser: UserData;
  /** Internal: users to delete after each test (best effort). */
  userRegistry: UserData[];
  /** Auto fixture: blocks ad/tracking hosts that overlay the page and cause flaky clicks. */
  blockAds: void;
};

const BLOCKED_HOSTS = [
  'googlesyndication.com',
  'doubleclick.net',
  'googleadservices.com',
  'google-analytics.com',
  'googletagmanager.com',
  'fundingchoicesmessages.google.com',
  'adservice.google.com',
  'cloudflareinsights.com',
];

export const test = base.extend<Fixtures>({
  blockAds: [
    async ({ context }, use) => {
      if (process.env.BLOCK_ADS !== 'false') {
        await context.route(
          (url) => BLOCKED_HOSTS.some((h) => url.hostname.endsWith(h)),
          (route) => route.abort(),
        );
      }
      await use();
    },
    { auto: true },
  ],

  // ---- page objects ----
  homePage: async ({ page }, use) => use(new HomePage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  signupPage: async ({ page }, use) => use(new SignupPage(page)),
  accountCreatedPage: async ({ page }, use) => use(new AccountCreatedPage(page)),
  accountDeletedPage: async ({ page }, use) => use(new AccountDeletedPage(page)),
  contactUsPage: async ({ page }, use) => use(new ContactUsPage(page)),
  productsPage: async ({ page }, use) => use(new ProductsPage(page)),

  // ---- test data & clean-up ----
  userRegistry: async ({ request }, use) => {
    const users: UserData[] = [];
    await use(users);
    for (const user of users) {
      await deleteUserViaApi(request, user);
    }
  },

  newUser: async ({ userRegistry }, use) => {
    const user = buildUser();
    userRegistry.push(user); // safety net: removes the account if the test created it but failed early
    await use(user);
  },

  registeredUser: async ({ request, userRegistry }, use) => {
    const user = buildUser();
    await createUserViaApi(request, user);
    userRegistry.push(user);
    await use(user);
  },
});

export { expect } from '@playwright/test';
