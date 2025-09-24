import { CableGuyPage } from "../pages/CableGuyPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";
import { BasketPage } from "../pages/BasketPage";
import { test as base } from "@playwright/test";

type TestFixtures = {
  cableGuyPage: CableGuyPage;
  productDetailsPage: ProductDetailsPage;
  basketPage: BasketPage;
};

export const test = base.extend<TestFixtures>({
  //CableGuyPage Fixture
  cableGuyPage: async ({ page }, use) => {
    const cableGuyPage = new CableGuyPage(page);
    await use(cableGuyPage);
  },

  //ProductDetailsPage Fixture
  productDetailsPage: async ({ page }, use) => {
    const productDetailsPage = new ProductDetailsPage(page);
    await use(productDetailsPage);
  },

  //BasketPage Fixture
  basketPage: async ({ page }, use) => {
    const basketPage = new BasketPage(page);
    await use(basketPage);
  },
});
export { expect } from "@playwright/test";
