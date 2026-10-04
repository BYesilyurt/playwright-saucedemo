import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async removeItem(productId: string) {
    await this.page.getByTestId(`remove-${productId}`).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}