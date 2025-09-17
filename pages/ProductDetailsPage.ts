import { type Page, type Locator } from '@playwright/test';

export class ProductDetailsPage {
    readonly page: Page;
    readonly productTitle: Locator;
    readonly addToBasketButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productTitle = page.locator('.product-title h1');
        this.addToBasketButton = page.locator('.call-to-action__action > button');
    }

    async getProductTitle(): Promise<string> {
        await this.productTitle.waitFor({ state: 'visible', timeout: 5000 });
        return (await this.productTitle.textContent())?.trim() ?? '';
    }

    async addToBasket() {
        await this.addToBasketButton.nth(0).isEnabled();
        await this.addToBasketButton.nth(0).click();
        await this.page.waitForFunction(() => document.readyState === 'complete');
    }

}