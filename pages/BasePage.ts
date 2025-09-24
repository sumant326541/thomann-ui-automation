import { Page, Locator } from "@playwright/test";
export class BasePage {
  readonly page: Page;
  readonly acceptCookiesButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.acceptCookiesButton = page.locator(
      ".spicy-consent-bar__actions .fx-icon-check",
    );
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
    await this.acceptCookies();
  }

  async acceptCookies(): Promise<void> {
    if (await this.acceptCookiesButton.isVisible()) {
      await this.acceptCookiesButton.click();
    }
  }
}
