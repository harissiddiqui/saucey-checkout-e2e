# saucey-checkout-e2e

Playwright end-to-end test suite for the SauceDemo checkout flow, built as part of an SQA Engineer assessment.

## What this covers

- **Happy path**: log in as `standard_user`, add a product to the cart, complete checkout, and verify the order confirmation, with an assertion at every step transition (inventory → cart → checkout step one → checkout step two → complete).
- **Negative case**: checkout is correctly blocked when required customer information is missing.

## Project structure

```
saucey-checkout-e2e/
├── pages/                  # Page Object Model classes
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── data/
│   └── testData.js         # Test users, checkout info, product fixtures
├── tests/
│   └── checkout-flow.spec.js
├── plan.md                 # Plan-driven development log for this suite
├── ai-prompts-log.md       # AI prompts used, output, and what was corrected
├── playwright.config.js
└── package.json
```

## Design decisions

- **Page Object Model**: tests never reference raw selectors directly. Each page's locators and actions live in one class, so a UI change only requires updating one file.
- **`data-test` attribute selectors only**: SauceDemo exposes `data-test` attributes specifically for automation. These are far more stable than CSS classes or visible text, which are more likely to change with styling or copy edits.
- **No hard-coded waits**: every assertion relies on Playwright's built-in web-first waiting (`expect(locator).toHaveText(...)`, `toHaveURL(...)`, etc.) rather than `waitForTimeout`. See `ai-prompts-log.md` for a case where an AI-generated hard-coded wait was caught and removed.
- **Step-level assertions**: the test checks the URL at every checkout step, not just the final confirmation message, so a failure points to the exact step that broke.

## Setup

1. Install Node.js 18 or later (this project was built and run on Node 24.19.0).
2. Install dependencies:
   ```
   npm install
   ```
3. Install Playwright's browser binaries (one-time):
   ```
   npx playwright install
   ```

## Running the tests

```
npm test
```

Run with a visible browser window:
```
npm run test:headed
```

View the HTML report after a run:
```
npm run report
```

## Notes and limitations

- Tests run against the live public demo site (`https://www.saucedemo.com`). Since it's a shared public demo environment, occasional flakiness from external causes (network latency, site availability) is possible; retries are configured in `playwright.config.js` to absorb transient issues without masking real failures locally (`retries: 1` locally, `2` on CI).
- Test data (name, postal code) is centralized in `data/testData.js` rather than hard-coded in the test, so it can be swapped without touching test logic.
- This suite intentionally covers one critical end-to-end flow plus one closely related negative case, rather than a large number of shallow tests, per the assessment's guidance to prioritize meaningful coverage over volume.
