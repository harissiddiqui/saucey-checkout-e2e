class InventoryPage {
  constructor(page) {
    this.page = page;
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.inventoryItems = page.locator('.inventory_item');
  }

  addToCartBySlug(productSlug) {
    return this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}

module.exports = { InventoryPage };
