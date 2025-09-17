import { type Page, type Locator } from "@playwright/test";

export class BasketPage {
    readonly page: Page;
    readonly basketPopup: Locator;

    constructor(page: Page) {
        this.page = page;
        this.basketPopup = page.locator('.fx-notification__content');
    }

    async getBasketPopup() {
        return this.basketPopup;
    }

}