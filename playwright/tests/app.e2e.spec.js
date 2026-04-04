const { test, expect } = require('@playwright/test');

async function signup(page, username, password) {
  await page.getByRole('button', { name: 'Signup' }).click();
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Signup' }).nth(1).click();
}

async function login(page, username, password) {
  await page.getByRole('button', { name: 'Login' }).first().click();
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).nth(1).click();
}

test('user can sign up, log in, create a list, and add a todo', async ({ page }) => {
  await page.goto('/');

  await signup(page, 'e2e-user', 'secret1');
  await expect(page.getByText('You can log in now.')).toBeVisible();

  await login(page, 'e2e-user', 'secret1');
  await expect(page.getByRole('heading', { name: "e2e-user's lists" })).toBeVisible();

  await page.getByPlaceholder('Start a new list').fill('Weekend Plans');
  await page.getByRole('button', { name: 'Add list' }).click();

  const weekendCard = page.locator('.list-card').filter({ hasText: 'Weekend Plans' });
  await expect(weekendCard).toBeVisible();

  await weekendCard.getByPlaceholder('Add a task').fill('Buy milk');
  await weekendCard.getByRole('button', { name: 'Add' }).click();

  await expect(weekendCard.getByText('Buy milk')).toBeVisible();
  await expect(weekendCard.getByText('In progress')).toBeVisible();
});

test('user can complete and filter todos', async ({ page }) => {
  await page.goto('/');

  await signup(page, 'filter-user', 'secret1');
  await login(page, 'filter-user', 'secret1');

  await page.getByPlaceholder('Start a new list').fill('Work');
  await page.getByRole('button', { name: 'Add list' }).click();

  const workCard = page.locator('.list-card').filter({ hasText: 'Work' });
  await workCard.getByPlaceholder('Add a task').fill('Finish report');
  await workCard.getByRole('button', { name: 'Add' }).click();

  await workCard.getByRole('checkbox').check();
  await expect(workCard.getByText('Done')).toBeVisible();

  await page.getByRole('button', { name: 'completed' }).click();
  await expect(workCard.getByText('Finish report')).toBeVisible();

  await page.getByRole('button', { name: 'active' }).click();
  await expect(page.getByText('No matches found')).toBeVisible();
});

test('logout removes access to the workspace', async ({ page }) => {
  await page.goto('/');

  await signup(page, 'logout-user', 'secret1');
  await login(page, 'logout-user', 'secret1');

  await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible();
  await page.getByRole('button', { name: 'Log out' }).click();

  await expect(page.getByRole('button', { name: 'Login' }).first()).toBeVisible();
  await expect(page.getByText('You have been signed out.')).toBeVisible();
});
