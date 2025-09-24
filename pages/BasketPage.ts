import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class BasketPage extends BasePage {
  readonly basketPopup: Locator;

  constructor(page: Page) {
    super(page);
    this.basketPopup = page.locator(".fx-notification__content");
  }

  get basketPopupLocator(): Locator {
    return this.basketPopup;
  }
}
