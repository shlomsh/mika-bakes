import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle('ספר המתכונים של מיקה');
  });

  test('html element has RTL direction and Hebrew lang', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'he');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });

  test('header contains site logo link', async ({ page }) => {
    const logo = page.getByRole('link', { name: 'ספר המתכונים של מיקה' });
    await expect(logo).toBeVisible();
  });

  test('search trigger button is visible in header', async ({ page }) => {
    const searchBtn = page.getByRole('button', { name: /חפש/ });
    await expect(searchBtn).toBeVisible();
  });

  test('categories section heading is visible', async ({ page }) => {
    // Index.tsx renders two <h2>קטגוריות</h2> (mobile + desktop sidebar)
    const heading = page.getByRole('heading', { name: 'קטגוריות' }).first();
    await expect(heading).toBeVisible();
  });

  test('at least one category card is rendered', async ({ page }) => {
    // Index.tsx renders CategoryCards twice (mobile hidden + desktop visible).
    // Use filter to target only the visible instance.
    const categoryLink = page.locator('a[href^="/category/"]').filter({ visible: true }).first();
    await expect(categoryLink).toBeVisible();
  });

  test('recommended recipes section heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'מומלצים' })).toBeVisible();
  });
});
