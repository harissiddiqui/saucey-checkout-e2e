# AI Prompt Log — Task C Automation

Four representative prompts used while building this suite, in the order
used, with what was accepted, corrected, or rejected from each response.

---

### Prompt 1
> "Write a Playwright test in JavaScript for SauceDemo: log in as
> standard_user, add the Sauce Labs Backpack to cart, go to checkout, fill
> in shipping info, finish the order, and assert success."

**Purpose**: generate a fast first draft of the end-to-end flow.

**Output**: a working single-file script (no page objects), with a
`page.waitForTimeout(2000)` after adding the item to cart "to let the cart
update," and the Finish button located by `button:has-text('Finish')`.

**What I did with it**: rejected the hard-coded wait. Playwright's built-in
assertions already wait for the target state, so a fixed delay only adds
flakiness risk and slows the suite for no benefit. Rejected the text-based
selector, since visible button copy is more likely to change than the
underlying `data-test` attribute SauceDemo exposes specifically for
automation. Restructured the flat script into Page Object classes, which
the AI did not do on its own.

---

### Prompt 2
> "Refactor this into a Page Object Model with separate classes for Login,
> Inventory, Cart, and Checkout pages."

**Purpose**: enforce the maintainability standard requested for this task.

**Output**: reasonable class boundaries overall, but placed the cart badge
locator inside `CheckoutPage` instead of `InventoryPage`, and duplicated the
username/password locators inside two different classes.

**What I did with it**: moved the cart badge locator to `InventoryPage`,
where the badge actually renders in the DOM. Removed the duplicated login
locators, keeping `LoginPage` as the single source of truth for those
fields.

---

### Prompt 3
> "Suggest additional assertions for this checkout test that would catch
> real regressions, not just check the happy-path text at the end."

**Purpose**: push past a superficial single-assertion test.

**Output**: suggested asserting the cart item count before checkout,
verifying the URL at each checkout step transition, and asserting the cart
badge disappears after order completion.

**What I did with it**: accepted the item-count and per-step URL
assertions, since they pinpoint exactly where a regression breaks instead
of only failing at the final screen. Rejected the cart-badge-disappears
suggestion: the badge actually resets when the user navigates back to the
inventory page, not at the completion step itself, so this assertion was
based on an incorrect assumption about the app's behavior and would have
produced a misleading test.

---

### Prompt 4
> "Write a playwright.config.js suitable for CI, with retries and trace
> collection."

**Purpose**: get a reasonable baseline config rather than hand-writing
boilerplate.

**Output**: `retries: 2` unconditionally, `trace: 'on-first-retry'`,
HTML reporter.

**What I did with it**: kept the trace and reporter settings. Changed
retries to be conditional (`process.env.CI ? 2 : 1`), since always retrying
twice locally would mask a genuinely flaky or broken assertion during
development.
