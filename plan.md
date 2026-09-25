# Plan: SauceDemo Checkout E2E Automation

This document is the plan that drove this suite's build, kept as a record of
intent versus outcome, iteration by iteration. It doubles as a small example
of the plan-driven, AI-assisted workflow described in Task D of the
assessment: a living plan.md that scopes the work up front, gets updated as
reality diverges from the plan, and gives a reviewer a paper trail of why the
code looks the way it does.

## Objective

Automate the single highest-value end-to-end flow in SauceDemo: login →
add product to cart → checkout → order confirmation, plus one closely
related negative case, with maintainable structure over raw test count.

## Scope decisions

- **In scope**: one full happy-path flow, one negative case (missing
  checkout info), Page Object Model structure, data-test selectors only.
- **Out of scope**: cross-browser matrix, visual regression, multiple user
  accounts (problem_user, visual_user, etc.), CI pipeline config. These are
  reasonable next steps but were cut to keep the deliverable focused, per
  the assessment's own guidance to prioritize judgment over volume.

## Iteration log

1. **Scaffold** — package.json, Playwright config, .gitignore. No AI used;
   mechanical setup.
2. **Page objects** — LoginPage and InventoryPage first, then CartPage and
   CheckoutPage. Written directly against data-test attributes confirmed by
   inspecting the live site, not guessed from memory.
3. **First test draft** — AI-assisted (see ai-prompts-log.md). Draft worked
   functionally but contained a hard-coded wait and a text-based selector,
   both flagged during review.
4. **Correction pass** — hard-coded wait replaced with a web-first
   assertion; text-based selector replaced with a data-test locator via the
   page object. This is the point where the plan explicitly called for a
   human review gate before anything from an AI draft is treated as final.
5. **Assertion hardening** — added per-step URL assertions and a second
   test for the missing-info negative case, informed directly by Defect 1
   in the Task B defect report (empty-cart checkout gap), to check whether
   the same missing-validation pattern recurred elsewhere in checkout.
6. **Docs** — README and this plan, written last so they reflect what was
   actually built rather than what was originally intended.

## Review gate

No AI-generated code was treated as final without:
- Confirming every selector against data-test attributes actually present
  in the DOM.
- Removing any fixed-duration wait in favor of an explicit assertion.
- Running the test locally and reading the failure output, not just
  trusting that generated code "looks right."
