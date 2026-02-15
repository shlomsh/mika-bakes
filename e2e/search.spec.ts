import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('search trigger button is present in the header', async ({ page }) => {
    // RecipeSearch.tsx:66-67 — two spans, lg+ shows "חפש מתכון...", smaller shows "חפש..."
    const searchBtn = page.getByRole('button', { name: /חפש/ });
    await expect(searchBtn).toBeVisible();
  });

  test('clicking the search button opens the command dialog', async ({ page }) => {
    await page.getByRole('button', { name: /חפש/ }).click();

    // CommandDialog wraps in a Radix UI Dialog → role="dialog"
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // RecipeSearch.tsx:74 — CommandInput placeholder
    const input = dialog.getByPlaceholder('הקלד שם מתכון...');
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
  });

  test('typing in the search dialog shows results or empty state', async ({ page }) => {
    await page.getByRole('button', { name: /חפש/ }).click();

    const dialog = page.getByRole('dialog');
    const input = dialog.getByPlaceholder('הקלד שם מתכון...');

    // Type a Hebrew letter likely to appear in recipe names
    await input.fill('א');

    // Wait for the 300ms debounce + network request to settle
    await page.waitForLoadState('networkidle');

    // Assert the dialog is still open and didn't crash
    await expect(dialog).toBeVisible();

    // cmdk adds a data-[cmdk-list] attribute on the CommandList wrapper
    const commandList = dialog.locator('[cmdk-list]');
    await expect(commandList).toBeVisible();
  });

  test('Ctrl+K keyboard shortcut opens search dialog', async ({ page }) => {
    // RecipeSearch.tsx:42 — listens for ctrlKey/metaKey + k
    await page.keyboard.press('Control+k');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
  });

  test('Escape closes the search dialog', async ({ page }) => {
    await page.getByRole('button', { name: /חפש/ }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Radix Dialog closes on Escape
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });
});
