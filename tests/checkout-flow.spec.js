const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { users, checkoutInfo, product } = require('../data/testData');

test.describe('SauceDemo checkout flow', () => {
  test('standard_user can log in, add a product, and complete checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);

    await inventoryPage.addToCartBySlug(product.slug);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('.cart_item')).toHaveCount(1);

    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await checkoutPage.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('checkout is blocked when required customer information is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.addToCartBySlug(product.slug);
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.continueButton.click();
    await expect(checkoutPage.page.locator('[data-test="error"]')).toBeVisible();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});
