import { test } from '../src/fixtures';

test.describe('Products', () => {
  test('TC10 - Product search returns matching results only', async ({ homePage, productsPage }) => {
    const term = 'Jeans';

    await homePage.open();
    await homePage.header.clickProducts();
    await productsPage.expectLoaded();

    await productsPage.search(term);
    await productsPage.expectSearchResults(term); // "Searched Products" heading + every result matches
  });
});
