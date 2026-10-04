import { test, expect } from '../fixtures/base';
import { users } from '../test-data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('login with valid user', async ({ page, loginPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test('shows error for wrong password', async ({ loginPage }) => {
    await loginPage.login(users.standard.username, 'wrong_password');
    await expect(loginPage.errorMessage).toContainText('do not match');
  });

  test('shows error for locked out user', async ({ loginPage }) => {
    await loginPage.login(users.locked.username, users.locked.password);
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('shows error when username is empty', async ({ loginPage }) => {
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });
});