import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export class ContactUsPage extends BasePage {
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly fileInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Get In Touch' });
    this.nameInput = page.getByTestId('name');
    this.emailInput = page.getByTestId('email');
    this.subjectInput = page.getByTestId('subject');
    this.messageInput = page.getByTestId('message');
    this.fileInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.getByTestId('submit-button');
    this.successMessage = page.getByText('Success! Your details have been submitted successfully.');
  }

  async expectLoaded(): Promise<void> {
    await this.step('Assert Contact Us page', async () => {
      await this.expectUrl('/contact_us');
      await expect(this.heading).toBeVisible();
    });
  }

  async submit(msg: ContactMessage): Promise<void> {
    await this.step('Submit Contact Us form', async () => {
      await this.nameInput.fill(msg.name);
      await this.emailInput.fill(msg.email);
      await this.subjectInput.fill(msg.subject);
      await this.messageInput.fill(msg.message);
      await this.fileInput.setInputFiles({
        name: 'attachment.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Automated test attachment'),
      });
      // The site shows a native confirm() dialog on submit.
      this.page.once('dialog', (dialog) => dialog.accept());
      await this.submitButton.click();
    });
  }

  async expectSubmitted(): Promise<void> {
    await this.step('Assert success message', () => expect(this.successMessage).toBeVisible());
  }
}
