const { test, expect } = require('@playwright/test');

function uniqueValue(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

async function signupViaApi(page, username, password) {
  const response = await page.request.post('http://127.0.0.1:3000/auth/signup', {
    data: { username, password }
  });
  expect(response.ok()).toBeTruthy();
}

async function loginViaApi(page, username, password) {
  const response = await page.request.post('http://127.0.0.1:3000/auth/login', {
    data: { username, password }
  });
  expect(response.ok()).toBeTruthy();
}

async function signup(page, username, password) {
  await page.getByRole('button', { name: 'Signup' }).click();
  const form = page.locator('.auth-form');
  await form.getByLabel('Username').fill(username);
  await form.getByLabel('Password').fill(password);
  await form.getByRole('button', { name: 'Signup' }).click();
  await expect(form.getByRole('button', { name: 'Login' })).toBeVisible();
}

async function login(page, username, password) {
  const form = page.locator('.auth-form');
  await form.locator('input[name="username"]').fill(username);
  await form.locator('input[name="password"]').fill(password);
  await form.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: `${username}'s lists` })).toBeVisible();
}

test('user can sign up, log in, create a list, and add a todo', async ({ page }) => {
  const username = uniqueValue('e2e-user');
  const listName = uniqueValue('Weekend Plans');

  await page.goto('/');

  await signup(page, username, 'secret1');

  await login(page, username, 'secret1');

  await page.getByPlaceholder('Start a new list').fill(listName);
  await page.getByRole('button', { name: 'Add list' }).click();

  const weekendCard = page.locator('.list-card').filter({
    has: page.getByRole('heading', { name: listName })
  });
  await expect(weekendCard).toBeVisible();

  await weekendCard.getByPlaceholder('Add a task').fill('Buy milk');
  await weekendCard.getByRole('button', { name: 'Add' }).click();

  await expect(weekendCard.getByRole('checkbox', { name: 'Buy milk' })).toBeVisible();
  await expect(weekendCard.getByText('In progress')).toBeVisible();
});

test('user can complete and filter todos', async ({ page }) => {
  const username = uniqueValue('filter-user');
  const listName = uniqueValue('Work');

  await signupViaApi(page, username, 'secret1');
  await loginViaApi(page, username, 'secret1');
  await page.goto('/');
  await expect(page.getByRole('heading', { name: `${username}'s lists` })).toBeVisible();

  await page.getByPlaceholder('Start a new list').fill(listName);
  await page.getByRole('button', { name: 'Add list' }).click();

  const workCard = page.locator('.list-card').first();
  await workCard.getByPlaceholder('Add a task').fill('Finish report');
  await workCard.getByRole('button', { name: 'Add' }).click();

  await workCard.getByRole('checkbox', { name: 'Finish report' }).click();
  await expect(workCard.getByText('Done')).toBeVisible();

  await page.getByRole('button', { name: 'completed' }).click();
  await expect(page.getByRole('checkbox', { checked: true }).first()).toBeVisible();

  await page.getByRole('button', { name: 'active' }).click();
  await expect(page.getByText('No matching tasks here yet. Add one above.')).toBeVisible();
});

test('logout removes access to the workspace', async ({ page }) => {
  const username = uniqueValue('logout-user');

  await signupViaApi(page, username, 'secret1');
  await loginViaApi(page, username, 'secret1');
  await page.goto('/');
  await expect(page.getByRole('heading', { name: `${username}'s lists` })).toBeVisible();

  await page.getByRole('button', { name: 'Log out' }).click();

  await expect(page.getByRole('button', { name: 'Login' }).first()).toBeVisible();
  await expect(page.getByText('You have been signed out.')).toBeVisible();
});
