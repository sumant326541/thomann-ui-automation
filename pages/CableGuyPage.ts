import { Page, Locator } from '@playwright/test';
import { getListingProductCount as getTotalFilteredCableCount } from '../utils/testHelper';
import { BasePage } from './BasePage';

export class CableGuyPage extends BasePage {
  readonly cableBeginningButton: Locator;
  readonly cableEndButton: Locator;
  readonly cableTypes: Locator;
  readonly cables: Locator;
  readonly cableManufacturers: Locator;
  readonly loader: Locator;
  readonly filteredCables: Locator;
  readonly rightArrowButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cableBeginningButton = page.getByRole("button", { name: "cable beginning" });
    this.cableEndButton = page.getByRole("button", { name: "cable end" });
    this.cableTypes = page.locator('.cg-plugmodal__category__item');
    this.cables = page.locator('div.cg-plugItem');
    this.cableManufacturers = page.locator('div.cg-brands div.item');
    this.loader = page.locator('img[src*="loader-black.gif"]');
    this.filteredCables = page.locator('.product__title');
    this.rightArrowButton = page.locator('.cg-icons__arrow--right');
  }

  async gotoCableGuyPage(): Promise<void> {
    await this.goto(process.env.CABLE_GUY_URL!);
  }

  async selectCableBeginning(): Promise<void> {
    await this.cableBeginningButton.click();
  }

  async selectCableEnd(): Promise<void> {
    await this.cableEndButton.click();
  }

  async selectRandomCableType(): Promise<void> {
    const totalCableTypeCount: number = await this.cableTypes.count();
    const randomCableTypeIndex: number = Math.floor(Math.random() * totalCableTypeCount);
    await this.cableTypes.nth(randomCableTypeIndex).click();
  }

  async selectRandomCable(): Promise<void> {
    const totalCableCount: number = await this.cables.count();
    const randomCableIndex: number = Math.floor(Math.random() * totalCableCount);
    await this.cables.nth(randomCableIndex).click();
  }

  /**
   * Selects a random cable manufacturer
   * @returns {Promise<number>} The expected number of cables after selecting a random manufacturer
   */
  async selectRandomManufacturerAndGetExpectedCableNumber(): Promise<number> {
    const totalCableManufacturerCount: number = await this.cableManufacturers.count();
    const randomCableManufracturerIndex: number = Math.floor(Math.random() * totalCableManufacturerCount);
    await this.cableManufacturers.nth(randomCableManufracturerIndex).click();
    await this.waitForLoaderToDisappear();
    const numberUnderCableManufacturerLogo: string = await this.cableManufacturers.nth(randomCableManufracturerIndex).innerText();
    return Number(numberUnderCableManufacturerLogo);
  }

  /**
   * Selects a random cable type and a random cable from the beginning section
   * 
   * @returns {Promise<void>} Nothing to return
   */
  async selectRandomCableFromBeginningSection(): Promise<void> {
    await this.selectCableBeginning();
    await this.selectRandomCableType();
    await this.selectRandomCable();
    await this.waitForLoaderToDisappear();
  }

  /**
   * Selects a random cable type and a random cable from the end section
   * 
   * @returns {Promise<void>} Nothing to return
   */
  async selectRandomCableFromEndSection(): Promise<void> {
    await this.selectCableEnd();
    await this.selectRandomCableType();
    await this.selectRandomCable();
    await this.waitForLoaderToDisappear();
  }

  async getFilteredCableCount(): Promise<number> {
    return await getTotalFilteredCableCount(this.page, this.filteredCables, this.rightArrowButton);
  }

  /**
   * Selects a random cable from the filtered list
   * 
   * @returns {Promise<string>} The title of the selected cable
   */
  async selectRandomCableFromListAndGetTitle(): Promise<string> {
    const cablesOnPage: number = await this.filteredCables.count();
    const randomProductIndex: number = Math.floor(Math.random() * cablesOnPage);
    const productTitle: string = this.filteredCables.nth(randomProductIndex).textContent() as unknown as string;;
    await this.filteredCables.nth(randomProductIndex).click();
    return productTitle;
  }

  async waitForLoaderToDisappear(): Promise<void> {
    await this.loader.waitFor({ state: 'visible', timeout: 5000 });
    await this.loader.waitFor({ state: 'hidden', timeout: 5000 });
  }
}
