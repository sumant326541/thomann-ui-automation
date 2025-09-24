/**
 * testHelper.ts
 *
 * Contains Playwright test-specific helper functions.
 * Use this file for common reusable methods across test suite.
 */
import { Page, Locator } from "@playwright/test";

/**
 * Count all products across paginated pages.
 *
 * @param page - Playwright Page instance
 * @param products - Locator for products on the page
 * @param rightArrowButton - Locator for the "Next" pagination button
 * @returns total number of products across all pages
 */
export async function getListingProductCount(
  page: Page,
  products: Locator,
  rightArrowButton: Locator,
): Promise<number> {
  let totalCount = 0;

  while (true) {
    const count = await products.count();
    totalCount += count;

    if (!(await rightArrowButton.isVisible())) {
      break;
    }

    await rightArrowButton.click();
    await products.first().isVisible();
  }

  return totalCount;
}
