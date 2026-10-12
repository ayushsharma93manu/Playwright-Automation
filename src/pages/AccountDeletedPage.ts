import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountDeletedPage extends BasePage {
  readonly heading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByTestId('account-deleted');
    this.continueButton = page.getByTestId('continue-button');
  }

  async expectLoaded(): Promise<void> {
    await this.step('Assert "Account Deleted!" page', async () => {
      await this.expectUrl('/delete_account');
      await expect(this.heading).toHaveText('Account Deleted!');
    });
  }

  async clickContinue(): Promise<void> {
    await this.step('Click Continue', () => this.continueButton.click());
  }
}
