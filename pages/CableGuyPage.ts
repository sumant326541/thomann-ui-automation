import { Page, Locator } from "@playwright/test";
import { getListingProductCount as getTotalFilteredCableCount } from "../utils/testHelper";
import { BasePage } from "./BasePage";
import { expect } from "../fixtures/Fixtures";
import seedrandom from "seedrandom";
export class CableGuyPage extends BasePage {
  readonly cableBeginningButton: Locator;
  readonly cableEndButton: Locator;
  readonly cableTypes: Locator;
  readonly cables: Locator;
  readonly cableManufacturers: Locator;
  readonly manufacturersCableCount: Locator;
  readonly loader: Locator;
  readonly filteredCables: Locator;
  readonly rightArrowButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cableBeginningButton = page.getByRole("button", {
      name: "cable beginning",
    });
    this.cableEndButton = page.getByRole("button", { name: "cable end" });
    this.cableTypes = page.locator(".cg-plugmodal__category__item");
    this.cables = page.locator("div.cg-plugItem");
    this.cableManufacturers = page.locator("div.cg-brands div.item");
    this.manufacturersCableCount = page.locator(
      "div.cg-brands .cg-brands__item__count",
    );
    this.loader = page.locator('img[src*="loader-black.gif"]');
    this.filteredCables = page.locator(".product__title");
    this.rightArrowButton = page.locator(".cg-icons__arrow--right");
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

  async selectRandomCableType(position?: string): Promise<void> {
    const totalCableTypeCount: number = await this.cableTypes.count();
    const rng = seedrandom(process.env.TEST_SEED!);
    const randomCableTypeIndex: number = Math.floor(
      rng() * totalCableTypeCount,
    );
    await this.cableTypes.nth(randomCableTypeIndex).click();
    console.debug(
      `Selected ${position} cable type index: ${randomCableTypeIndex} out of ${totalCableTypeCount}`,
    );
  }

  async selectRandomCable(position?: string): Promise<void> {
    const totalCableCount: number = await this.cables.count();
    const rng = seedrandom(process.env.TEST_SEED!);
    const randomCableIndex: number = Math.floor(rng() * totalCableCount);
    await this.cables.nth(randomCableIndex).click();
    console.debug(
      `Selected ${position} cable index: ${randomCableIndex} out of ${totalCableCount}`,
    );
    await this.waitForLoaderToDisappear();
  }

  /**
   * Selects a random cable manufacturer
   * @returns {Promise<number>} The expected number of cables after selecting a random manufacturer
   */
  async selectRandomManufacturerAndGetManufaturerCableCount(): Promise<number> {
    const totalCableManufacturerCount: number =
      await this.cableManufacturers.count();
    const rng = seedrandom(process.env.TEST_SEED!);
    const randomCableManufracturerIndex: number = Math.floor(
      rng() * totalCableManufacturerCount,
    );
    await this.cableManufacturers.nth(randomCableManufracturerIndex).click();
    console.debug(
      `Selected cable manufacturer index: ${randomCableManufracturerIndex} out of ${totalCableManufacturerCount}`,
    );
    await this.waitForLoaderToDisappear();
    const ManufacturerCableCount: string = await this.manufacturersCableCount
      .nth(randomCableManufracturerIndex)
      .innerText();
    return Number(ManufacturerCableCount);
  }

  /**
   * Selects a random cable type and a random cable from the beginning section
   *
   * @returns {Promise<void>} Nothing to return
   */
  async selectRandomCableFromBeginningSection(): Promise<void> {
    const position = "Beginning";
    await this.selectCableBeginning();
    await this.selectRandomCableType(position);
    await this.selectRandomCable(position);
  }

  /**
   * Selects a random cable type and a random cable from the end section
   *
   * @returns {Promise<void>} Nothing to return
   */
  async selectRandomCableFromEndSection(): Promise<void> {
    const position = "end";
    await this.selectCableEnd();
    await this.selectRandomCableType(position);
    await this.selectRandomCable(position);
  }

  async getFilteredCableCount(): Promise<number> {
    return await getTotalFilteredCableCount(
      this.page,
      this.filteredCables,
      this.rightArrowButton,
    );
  }

  /**
   * Selects a random cable from the filtered list
   *
   * @returns {Promise<string>} The title of the selected cable
   */
  async selectRandomCableFromListAndGetTitle(): Promise<string> {
    const cablesOnPage: number = await this.filteredCables.count();
    const randomProductIndex: number = Math.floor(Math.random() * cablesOnPage);
    const productTitle: string = (await this.filteredCables
      .nth(randomProductIndex)
      .textContent()) as unknown as string;
    await this.filteredCables.nth(randomProductIndex).click();
    return productTitle;
  }

  /**
   * Waits for loader to disappear. If the loader never appears, continues immediately.
   * @param hiddenTimeout - optional timeout to wait for loader to disappear and not wait for full default timeout of expect (5000ms default)
   */
  async waitForLoaderToDisappear(visibleTimeout = 2000): Promise<void> {
    try {
      await expect(this.loader).toBeVisible({ timeout: visibleTimeout });
    } catch {
      // Loader never appeared or already disappeared
    }
    await expect(this.loader).toBeHidden();
  }
}
