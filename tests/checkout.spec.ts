import { test, expect } from '../fixtures/base';
import { users } from '../test-data/users';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginPage, inventoryPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('completes an order', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation('Max', 'Mustermann', '30159');
    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('shows error when first name is missing', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation('', 'Mustermann', '30159');
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('calculates the total price correctly', async ({ page, checkoutPage }) => {
    await checkoutPage.fillInformation('Max', 'Mustermann', '30159');
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(checkoutPage.itemPrices).toHaveCount(2);

    const prices = await checkoutPage.getItemPrices();
    const subtotal = await checkoutPage.getAmount(checkoutPage.subtotalLabel);
    const tax = await checkoutPage.getAmount(checkoutPage.taxLabel);
    const total = await checkoutPage.getAmount(checkoutPage.totalLabel);

    const expectedSubtotal = prices.reduce((sum, price) => sum + price, 0);

    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });
});