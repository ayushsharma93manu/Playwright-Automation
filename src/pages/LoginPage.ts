import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface FieldValidity {
  valid: boolean;
  valueMissing: boolean;
  typeMismatch: boolean;
  message: string;
}

/** /login - contains both the "Login" and the "New User Signup!" forms. */
export class LoginPage extends BasePage {
  readonly loginForm: Locator;
  readonly signupForm: Locator;
  readonly loginHeading: Locator;
  readonly signupHeading: Locator;

  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;

  readonly signupName: Locator;
  readonly signupEmail: Locator;
  readonly signupButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loginForm = page.locator('.login-form');
    this.signupForm = page.locator('.signup-form');
    this.loginHeading = page.getByRole('heading', { name: 'Login to your account' });
    this.signupHeading = page.getByRole('heading', { name: 'New User Signup!' });

    this.loginEmail = page.getByTestId('login-email');
    this.loginPassword = page.getByTestId('login-password');
    this.loginButton = page.getByTestId('login-button');

    this.signupName = page.getByTestId('signup-name');
    this.signupEmail = page.getByTestId('signup-email');
    this.signupButton = page.getByTestId('signup-button');
  }

  async expectLoaded(): Promise<void> {
    await this.step('Assert Login page is displayed', async () => {
      await this.expectUrl('/login');
      await expect(this.signupHeading).toHaveText('New User Signup!');
      await expect(this.loginHeading).toBeVisible();
      await expect(this.signupForm).toBeVisible();
      await expect(this.loginForm).toBeVisible();
    });
  }

  async open(): Promise<void> {
    await this.step('Open /login directly', async () => {
      await this.page.goto('/login');
      await this.expectLoaded();
    });
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.step(`Start signup (name="${name}", email="${email}")`, async () => {
      await this.fillSignupForm(name, email);
      await this.signupButton.click();
    });
  }

  async fillSignupForm(name: string, email: string): Promise<void> {
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
  }

  async login(email: string, password: string): Promise<void> {
    await this.step(`Login as "${email}"`, async () => {
      await this.loginEmail.fill(email);
      await this.loginPassword.fill(password);
      await this.loginButton.click();
    });
  }

  async expectSignupError(message: string): Promise<void> {
    await expect(this.signupForm.getByText(message)).toBeVisible();
  }

  async expectLoginError(message: string): Promise<void> {
    await expect(this.loginForm.getByText(message)).toBeVisible();
  }

  /** Reads the browser's native HTML5 validation state of an input. */
  async getValidity(field: Locator): Promise<FieldValidity> {
    return field.evaluate((el) => {
      const input = el as HTMLInputElement;
      return {
        valid: input.checkValidity(),
        valueMissing: input.validity.valueMissing,
        typeMismatch: input.validity.typeMismatch,
        message: input.validationMessage,
      };
    });
  }
}
