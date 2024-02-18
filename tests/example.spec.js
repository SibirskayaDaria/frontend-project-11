import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Ожидаем, что заголовок "содержит" подстроку.
  await expect(page).toHaveTitle('Playwright');
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Кликаем на ссылку "Get started".
  await page.click('text="Get started"');

  // Ожидаем, что на странице есть заголовок с названием "Installation".
  await expect(page).toHaveSelector('h1', { text: 'Installation' });
});
