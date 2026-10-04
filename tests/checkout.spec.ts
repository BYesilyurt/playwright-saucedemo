import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('completes an order', async () => {
    await checkoutPage.fillInformation('Max', 'Mustermann', '30159');
    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('shows error when first name is missing', async () => {
    await checkoutPage.fillInformation('', 'Mustermann', '30159');
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('calculates the total price correctly', async ({ page }) => {
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