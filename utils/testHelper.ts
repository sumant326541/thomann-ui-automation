/**
 * testHelper.ts
 * 
 * Contains Playwright test-specific helper functions.
 * Use this file for common reusable methods across test suite.
 */
import { expect, Page, Locator } from '@playwright/test';
import fs from 'fs';

/**
 * Example: Accept cookies if the banner appears with text "Alright!".
 */
export async function acceptCookies(page: Page): Promise<void> {

  const acceptButton = page.locator('.fx-space-left--xs', { hasText: 'Alright!' });
  if (await acceptButton.isVisible()) {
    await acceptButton.click();
  }
}

/**
 * Extracts the first integer found in a string.
 * Example: "12 cables of Sennheiser found" → 12
 * 
 * @param str - The input string containing a number.
 * @returns number - The first integer found in the string.
 */
export function extractNumber(str: string): number {
  const match = str.match(/\d+/);
  if (!match) {
    throw new Error(`No number found in string: "${str}"`);
  }
  return parseInt(match[0], 10);
}

/**
 * Count all products across paginated pages.
 * 
 * @param page - Playwright Page instance
 * @param productLocator - Locator for products on the page
 * @param nextButtonLocator - Locator for the "Next" pagination button
 * @returns total number of products across all pages
 */
export async function getTotalProducts(
  page: Page,
  products: Locator,
  nextButton: Locator
): Promise<number> {
  let totalCount = 0;

  if ((await products.count()) === 0) {
    return 0;
  }

  while (true) {
    const count = await products.count();
    totalCount += count;

    if (!(await nextButton.isVisible()) || (await nextButton.isDisabled())) {
      break;
    }

    await nextButton.click();
    await products.first().isVisible({ timeout: 5000 });
  }

  return totalCount;
}

/**
 * Normalize the product title to match URL style
 * @param productTitle - product title from listing page
 * @returns 
 */
export function normalizeProductTitleToMatchUrl(productTitle: string): string {
  const normalizedProductTitle = productTitle
      .toLowerCase()
      .replace(/kable/g, 'cable')        // replace 'kable' with 'cable'
      .replace(/[\/\-\s]+/g, '_')        // replace '/', '-', and spaces (including multiple) with a underscore
      .replace(/[^a-z0-9_]/g, '')        // remove all other special characters except underscore
      .replace(/^_+|_+$/g, '');          // trim leading/trailing underscores

  return normalizedProductTitle;
}

export function verifyProductDetailsUrl(productUrl: string, normalizedProductTitle: string) {
  try {
    expect(productUrl.replace("kable","cable")).toContain(normalizedProductTitle);
  } catch {
    fs.appendFileSync('failed_urls.txt', productUrl + '\n');
    const partialMatch = normalizedProductTitle.slice(0, 10);
    expect(productUrl.replace("kable","cable")).toContain(partialMatch);
    throw new Error(`URL mismatch: ${productUrl} does not contain ${normalizedProductTitle}`);
  }
}