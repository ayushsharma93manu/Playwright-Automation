import { Locator, Page, expect, test } from '@playwright/test';

/** Top navigation bar shared by every page. */
export class HeaderComponent {
  private readonly root: Locator;
  readonly signupLoginLink: Locator;
  readonly productsLink: Locator;
  readonly contactUsLink: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly loggedInAs: Locator;

  constructor(page: Page) {
    this.root = page.locator('#header');
    this.signupLoginLink = this.root.locator('a[href="/login"]');
    this.productsLink = this.root.locator('a[href="/products"]');
    this.contactUsLink = this.root.locator('a[href="/contact_us"]');
    this.logoutLink = this.root.locator('a[href="/logout"]');
    this.deleteAccountLink = this.root.locator('a[href="/delete_account"]');
    this.loggedInAs = this.root.locator('li').filter({ hasText: 'Logged in as' });
  }

  async clickSignupLogin(): Promise<void> {
    await test.step('Header: click "Signup / Login"', () => this.signupLoginLink.click());
  }

  async clickProducts(): Promise<void> {
    await test.step('Header: click "Products"', () => this.productsLink.click());
  }

  async clickContactUs(): Promise<void> {
    await test.step('Header: click "Contact us"', () => this.contactUsLink.click());
  }

  async clickLogout(): Promise<void> {
    await test.step('Header: click "Logout"', () => this.logoutLink.click());
  }

  async clickDeleteAccount(): Promise<void> {
    await test.step('Header: click "Delete Account"', () => this.deleteAccountLink.click());
  }

  async expectLoggedInAs(name: string): Promise<void> {
    await test.step(`Assert header shows "Logged in as ${name}"`, async () => {
      await expect(this.loggedInAs).toContainText(`Logged in as ${name}`);
      await expect(this.logoutLink).toBeVisible();
    });
  }

  async expectLoggedOut(): Promise<void> {
    await test.step('Assert logged-out state in header', async () => {
      await expect(this.loggedInAs).toHaveCount(0);
      await expect(this.logoutLink).toHaveCount(0);
      await expect(this.signupLoginLink).toBeVisible();
    });
  }
}
