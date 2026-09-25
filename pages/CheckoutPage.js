class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
  }

  async fillInfo(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async getPriceBreakdown() {
    const parseAmount = (text) => Number(text.replace(/[^0-9.]/g, ''));
    const [subtotalText, taxText, totalText] = await Promise.all([
      this.subtotalLabel.innerText(),
      this.taxLabel.innerText(),
      this.totalLabel.innerText(),
    ]);
    return {
      subtotal: parseAmount(subtotalText),
      tax: parseAmount(taxText),
      total: parseAmount(totalText),
    };
  }
}

module.exports = { CheckoutPage };
