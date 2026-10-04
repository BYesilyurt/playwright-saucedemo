import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('login with valid user', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL(/inventory/);
  });

  test('shows error for wrong password', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('wrong_password');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toContainText('do not match');
  });

  test('shows error for locked out user', async ({ page }) => {
    await page.getByTestId('username').fill('locked_out_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toContainText('locked out');
  });

  test('shows error when username is empty', async ({ page }) => {
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toContainText('Username is required');
  });
});