import { Locator, Page, expect } from '@playwright/test';
import { UserData } from '../data/userFactory';
import { BasePage } from './BasePage';

/** /signup - "Enter Account Information" + "Address Information". */
export class SignupPage extends BasePage {
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly day: Locator;
  readonly month: Locator;
  readonly year: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly company: Locator;
  readonly address1: Locator;
  readonly address2: Locator;
  readonly country: Locator;
  readonly state: Locator;
  readonly city: Locator;
  readonly zipcode: Locator;
  readonly mobile: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Enter Account Information' });
    this.nameInput = page.getByTestId('name');
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.day = page.getByTestId('days');
    this.month = page.getByTestId('months');
    this.year = page.getByTestId('years');
    this.firstName = page.getByTestId('first_name');
    this.lastName = page.getByTestId('last_name');
    this.company = page.getByTestId('company');
    this.address1 = page.getByTestId('address');
    this.address2 = page.getByTestId('address2');
    this.country = page.getByTestId('country');
    this.state = page.getByTestId('state');
    this.city = page.getByTestId('city');
    this.zipcode = page.getByTestId('zipcode');
    this.mobile = page.getByTestId('mobile_number');
    this.createAccountButton = page.getByTestId('create-account');
  }

  /** Asserts the page + that name/email were carried over from the previous step. */
  async expectLoaded(user: Pick<UserData, 'name' | 'email'>): Promise<void> {
    await this.step('Assert "Enter Account Information" page', async () => {
      await this.expectUrl('/signup');
      await expect(this.heading).toHaveText('Enter Account Information');
      await expect(this.nameInput).toHaveValue(user.name);
      await expect(this.emailInput).toHaveValue(user.email);
    });
  }

  async fillAccountInformation(user: UserData): Promise<void> {
    await this.step('Fill account information', async () => {
      // The radio/checkbox inputs are styled by a plugin, so click their <label>.
      const titleId = user.title === 'Mr' ? 'id_gender1' : 'id_gender2';
      await this.page.locator(`label[for="${titleId}"]`).click();
      await expect(this.page.locator(`#${titleId}`)).toBeChecked();

      await this.passwordInput.fill(user.password);
      await this.day.selectOption(user.dobDay);
      await this.month.selectOption(user.dobMonth);
      await this.year.selectOption(user.dobYear);
      await this.page.locator('label[for="newsletter"]').click();
    });
  }

  async fillAddressInformation(user: UserData): Promise<void> {
    await this.step('Fill address information', async () => {
      await this.firstName.fill(user.firstName);
      await this.lastName.fill(user.lastName);
      await this.company.fill(user.company);
      await this.address1.fill(user.address1);
      await this.address2.fill(user.address2);
      await this.country.selectOption(user.country);
      await this.state.fill(user.state);
      await this.city.fill(user.city);
      await this.zipcode.fill(user.zipcode);
      await this.mobile.fill(user.mobile);
    });
  }

  async createAccount(user: UserData): Promise<void> {
    await this.step('Create account', async () => {
      await this.fillAccountInformation(user);
      await this.fillAddressInformation(user);
      await this.createAccountButton.click();
    });
  }
}
