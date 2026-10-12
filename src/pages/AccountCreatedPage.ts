import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountCreatedPage extends BasePage {
  readonly heading: Locator;
  readonly successMessage: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByTestId('account-created');
    this.successMessage = page.getByText(
      'Congratulations! Your new account has been successfully created!',
    );
    this.continueButton = page.getByTestId('continue-button');
  }

  async expectLoaded(): Promise<void> {
    await this.step('Assert "Account Created!" page', async () => {
      await this.expectUrl('/account_created');
      await expect(this.heading).toHaveText('Account Created!');
      await expect(this.successMessage).toBeVisible();
    });
  }

  async clickContinue(): Promise<void> {
    await this.step('Click Continue', () => this.continueButton.click());
  }
}
