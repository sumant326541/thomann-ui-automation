import { type Page, type Locator } from '@playwright/test';
import { extractNumber, getTotalProducts as getTotalProductsCount, normalizeProductTitleToMatchUrl } from '../utils/testHelper';

export class CableGuyPage {
  readonly page: Page;
  readonly cableBeginningButton: Locator;
  readonly cableEndButton: Locator;
  readonly cableTypes: Locator;
  readonly cables: Locator;
  readonly manufacturers: Locator;
  readonly manufacturerProductCountTextMessage: Locator;
  readonly loader: Locator;
  readonly productsDisplayedOnPage: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cableBeginningButton = page.locator('.cg-plugButton__subheadline', { hasText: 'cable beginning' });
    this.cableEndButton = page.locator('.cg-plugButton__subheadline', { hasText: 'cable end' });
    this.cableTypes = page.locator('.cg-plugmodal__category__item');
    this.cables = page.locator('.cg-plugItem__wrapper');
    this.manufacturers = page.locator('.cg-brands__item');
    this.loader = page.locator('img[src*="loader-black.gif"]');
    this.manufacturerProductCountTextMessage = page.locator('.cg-count');
    this.productsDisplayedOnPage = page.locator('.product__details');
    this.nextButton = page.locator('.cg-icons__arrow--right');
  }

  async navigate(): Promise<void> {
    await this.page.goto('https://www.thomann.de/intl/cableguy.html');
  }

  async selectCableBeginning(): Promise<void> {
    await this.cableBeginningButton.click();
  }

  async selectCableEnd(): Promise<void> {
    await this.cableEndButton.click();
  }

  async selectRandomCableType(): Promise<void> {
    const count = await this.cableTypes.count();
    if (count > 0) await this.cableTypes.nth(Math.floor(Math.random() * count)).click();
  }

  async selectRandomCable(): Promise<void> {
    const count = await this.cables.count();
    if (count > 0) await this.cables.nth(Math.floor(Math.random() * count)).click();
  }

  async selectRandomManufacturer(): Promise<void> {
    await this.manufacturers.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await this.manufacturers.count();
    if (count > 0) await this.manufacturers.nth(Math.floor(Math.random() * count)).click();
  }

  async selectRandomCableFromBeginningSection(): Promise<void> {
    await this.selectCableBeginning();
    await this.selectRandomCableType();
    await this.selectRandomCable();
    await this.waitForLoaderToDisappear();
  }

  async selectRandomCableFromEndSection(): Promise<void> {
    await this.selectCableEnd();
    await this.selectRandomCableType();
    await this.selectRandomCable();
    await this.waitForLoaderToDisappear();
  }

  async getManufacturerProductsCount(): Promise<number> {
    await this.waitForLoaderToDisappear();
    const text = await this.manufacturerProductCountTextMessage.textContent();
    return extractNumber(text ?? '0');
  }

  async getTotalProductsDisplayedCount(): Promise<number> {
    return await getTotalProductsCount(this.page, this.productsDisplayedOnPage, this.nextButton);
  }

  async getFirstProductTitle(): Promise<string> {
    const productTitle = await this.productsDisplayedOnPage.first().locator('.product__title').textContent();
    return productTitle?.trim() ?? '';
  }

  async getNormalizedProductTitleToMatchUrl(): Promise<string> {
    const productTitle = await this.getFirstProductTitle();
    return normalizeProductTitleToMatchUrl(productTitle);
  }

  async selectFirstProduct(): Promise<void> {
    await this.productsDisplayedOnPage.first().click();
  }

  async waitForLoaderToDisappear(): Promise<void> {

    await this.loader.waitFor({ state: 'visible', timeout: 5000 });
    await this.loader.waitFor({ state: 'hidden', timeout: 5000 });
  }
}
