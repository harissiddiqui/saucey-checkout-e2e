// First draft, generated with AI assistance from the prompt in ai-prompts-log.md.
// Known issues carried over from this draft, addressed in the next commit:
//   1. Hard-coded wait after add-to-cart instead of a web-first assertion.
//   2. Finish button located by visible text instead of its data-test attribute.
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { users, checkoutInfo, product } = require('../data/testData');

test('standard_user can log in, add a product, and complete checkout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);

  await inventoryPage.addToCartBySlug(product.slug);
  await page.waitForTimeout(2000); // TODO: replace with a proper wait condition

  await inventoryPage.goToCart();
  await cartPage.checkout();
  await checkoutPage.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);

  await page.locator('button:has-text("Finish")').click();
  await expect(page.locator('text=Thank you for your order!')).toBeVisible();
});
