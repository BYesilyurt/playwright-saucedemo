# playwright-saucedemo

![Playwright Tests](https://github.com/BYesilyurt/playwright-saucedemo/actions/workflows/playwright.yml/badge.svg)

End-to-end tests for [saucedemo.com](https://www.saucedemo.com) using Playwright and TypeScript.

## Test coverage

| Area      | Tests                                                        |
|-----------|--------------------------------------------------------------|
| Login     | valid login, wrong password, locked out user, empty fields   |
| Inventory | product list, sorting by price and name                      |
| Cart      | add and remove products, cart badge, cart content            |
| Checkout  | complete order, form validation, price and tax calculation   |

All tests run in Chromium, Firefox and WebKit.

## Project structure

```
pages/       Page objects for each page of the shop
fixtures/    Custom Playwright fixtures that provide the page objects
test-data/   Central test users
tests/       Test specs
```

## Getting started

```bash
npm install
npx playwright install
npm test
```

Open the HTML report:

```bash
npm run report
```

## CI

Tests run automatically on every push via GitHub Actions. On failure, screenshots, videos and traces are attached to the report.

## Notes

I used page objects so that each page has its own class with its elements and actions. If the page changes, I only need to update one file instead of every test.

The fixtures create the page objects automatically, so the tests stay short and easy to read.

One problem I had was a timing issue in the checkout price test. The test read the prices before the overview page was loaded, so the list was empty. I fixed it by waiting for the correct page and the number of items before reading the values.

Next steps I want to add: tests for the problem_user, API tests and visual tests.