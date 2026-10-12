import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly allProductsHeading: Locator;
  readonly searchedHeading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  private readonly productNames: Locator;

  constructor(page: Page) {
    super(page);
    this.allProductsHeading = page.getByRole('heading', { name: 'All Products' });
    this.searchedHeading = page.getByRole('heading', { name: 'Searched Products' });
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.productNames = page.locator('.features_items .productinfo p');
  }

  async expectLoaded(): Promise<void> {
    await this.step('Assert Products page', async () => {
      await this.expectUrl('/products');
      await expect(this.allProductsHeading).toBeVisible();
    });
  }

  async search(term: string): Promise<void> {
    await this.step(`Search for "${term}"`, async () => {
      await this.searchInput.fill(term);
      await this.searchButton.click();
    });
  }

  async expectSearchResults(term: string): Promise<void> {
    await this.step(`Assert results only match "${term}"`, async () => {
      await expect(this.page).toHaveURL(new RegExp(`/products\\?search=${term}`, 'i'));
      await expect(this.searchedHeading).toBeVisible();
      await expect(this.productNames.first()).toBeVisible();

      const names = await this.productNames.allTextContents();
      expect(names.length, 'at least one product is returned').toBeGreaterThan(0);
      for (const name of names) {
        expect(name.toLowerCase(), `"${name}" should match "${term}"`).toContain(term.toLowerCase());
      }
    });
  }
}
