import { expect, test } from '@playwright/test';
import { CableGuyPage } from '../pages/CableGuyPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { BasketPage } from '../pages/BasketPage';
import { acceptCookies, normalizeProductTitleToMatchUrl, verifyProductDetailsUrl } from '../utils/testHelper';

import { log } from 'console';

test.describe('Shopping Basket - Add Product Flow', () => {
  let cableGuyPage: CableGuyPage;
  let productDetailsPage: ProductDetailsPage;
  let basketPage: BasketPage;
  let manufacturerCount: number;
  let productListingTitle: string;
  let productDetailsTitle: string;

  test.beforeEach(async ({ page }) => {
    cableGuyPage = new CableGuyPage(page);
    productDetailsPage = new ProductDetailsPage(page);
    basketPage = new BasketPage(page);

    await test.step('Navigate to Cable Guy and accept cookies', async () => {
      await cableGuyPage.navigate();
      await acceptCookies(page);
    });
  });

  test('should add a cable product to the basket', async () => {
    test.slow();

    await test.step('Select random cable beginning and end (including manufacturer)', async () => {
      await cableGuyPage.selectRandomCableFromBeginningSection();
      await cableGuyPage.selectRandomCableFromEndSection();
      await cableGuyPage.selectRandomManufacturer();
    });

    await test.step('Verify displayed product count matches number below manufacturer logo', async () => {
      manufacturerCount = await cableGuyPage.getManufacturerProductsCount();
      const displayedCount = await cableGuyPage.getTotalProductsDisplayedCount();
      expect(displayedCount).toBe(manufacturerCount);

      if (manufacturerCount === 0) {
        log('No products found for the selected manufacturer. Validation skipped.');
        test.info().annotations.push({
          type: 'skip',
          description: 'No products found for the selected manufacturer'
        });
      }
    });

    if (manufacturerCount > 0) {
      await test.step('Select product and verify correct page', async () => {
        productListingTitle = await cableGuyPage.getFirstProductTitle();
        await cableGuyPage.selectFirstProduct();
        productDetailsTitle = await productDetailsPage.getProductTitle();
        expect(productListingTitle).toBe(productDetailsTitle);
        const productUrl = productDetailsPage.page.url();
        const normalizedProductTitle = normalizeProductTitleToMatchUrl(productListingTitle);
        verifyProductDetailsUrl(productUrl, normalizedProductTitle);
      });

      await test.step('Add product to basket and validate basket notification popup', async () => {
        await productDetailsPage.addToBasket();
        const basketPopup = await basketPage.getBasketPopup();
        await expect(basketPopup).toBeVisible({ timeout: 5000 });
      });
    }
  });
});
