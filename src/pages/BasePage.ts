import { Page, expect, test } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { pathUrl } from '../utils/url';

export abstract class BasePage {
  readonly header: HeaderComponent;

  constructor(protected readonly page: Page) {
    this.header = new HeaderComponent(page);
  }

  protected step<T>(title: string, body: () => Promise<T>): Promise<T> {
    return test.step(title, body);
  }

  /** Asserts the current URL (path only) - used after every navigation. */
  async expectUrl(path: string): Promise<void> {
    await expect(this.page, `URL should be ${path}`).toHaveURL(pathUrl(path));
  }
}
