import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
    readonly page: Page;
    readonly productTitle: Locator;
    readonly addToBasketButton: Locator;

    constructor(page: Page) {
        super(page);
        this.productTitle = page.locator('.product-title h1');
        this.addToBasketButton = page.getByRole("button", { name: "Add to Basket" });
    }

    async getProductTitle(): Promise<string> {
        return await this.productTitle.innerText();
    }

    async addToBasket() {
        await this.addToBasketButton.click();
    }
}