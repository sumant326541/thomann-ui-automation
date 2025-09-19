import { expect, test } from "../fixtures/Fixtures"

test.describe('Shopping Basket: Add Product to Basket flow', () => {
  var selectedCableTitle: String;
  test('should add a random cable to the basket', async ({ cableGuyPage, productDetailsPage, basketPage }) => {
    await test.step('Select random cable from beginning and end section', async () => {
      await cableGuyPage.gotoCableGuyPage();
      await cableGuyPage.selectRandomCableFromBeginningSection();
      await cableGuyPage.selectRandomCableFromEndSection();
    });

    await test.step('Verify total filtered cable count across pages matche expected number below manufacturer logo.', async () => {
      const expectedNumberBelowCableManufacturerLogo: number = await cableGuyPage.selectRandomManufacturerAndGetExpectedCableNumber();
      const totalFilteredCableCount: number = await cableGuyPage.getFilteredCableCount();
      expect(totalFilteredCableCount).toBe(expectedNumberBelowCableManufacturerLogo);
    });

    await test.step('Select a random cable from filtered list and verify, it navigates to correct cable details page.', async () => {
      selectedCableTitle = await cableGuyPage.selectRandomCableFromListAndGetTitle();
      const productDetailsTitle: String = await productDetailsPage.getProductTitle();
      expect(selectedCableTitle).toBe(productDetailsTitle);
    });

    await test.step('Add product to basket and validate basket notification popup.', async () => {
      await productDetailsPage.addToBasket();
      const basketPopup = await basketPage.getBasketPopup();
      await expect(basketPopup).toBeVisible({ timeout: 5000 });
      await expect(basketPage.basketPopup).toContainText(`Item ${selectedCableTitle} is now in the shopping basket.`);
    });
    
  });
});
