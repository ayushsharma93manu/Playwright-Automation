import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly featuredHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.featuredHeading = page.locator('.features_items h2.title');
  }

  async open(): Promise<void> {
    await this.step('Open home page', async () => {
      await this.page.goto('/');
      await this.expectLoaded();
    });
  }

  async expectLoaded(): Promise<void> {
    await this.expectUrl('/');
    await expect(this.page).toHaveTitle('Automation Exercise');
    await expect(this.featuredHeading).toHaveText('Features Items');
  }
}
