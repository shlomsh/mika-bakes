import { test, expect } from '@playwright/test';

test.describe('Category page', () => {
  test('clicking a category card navigates to the category page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Index.tsx renders CategoryCards twice (mobile hidden + desktop visible).
    // Use filter to target only the visible instance.
    const firstCategoryLink = page.locator('a[href^="/category/"]').filter({ visible: true }).first();
    await expect(firstCategoryLink).toBeVisible();

    await firstCategoryLink.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/category\//);

    // CategoryPage.tsx:82 — "מתכונים בקטגוריית: {name}"
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('מתכונים בקטגוריית');
  });

  test('category page shows back-to-home link', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.locator('a[href^="/category/"]').filter({ visible: true }).first().click();
    await page.waitForLoadState('networkidle');

    // Desktop button is hidden sm:inline-flex — visible at 1280px viewport
    const backLink = page.getByRole('link', { name: 'חזרה לדף הבית' }).first();
    await expect(backLink).toBeVisible();
  });

  test('direct URL to a category page loads correctly', async ({ page }) => {
    // Use the API to get a real slug rather than hardcoding
    const response = await page.request.get('/api/categories');
    expect(response.ok()).toBeTruthy();

    const categories = await response.json();
    expect(categories.length).toBeGreaterThan(0);

    const slug = categories[0].slug;
    await page.goto(`/category/${slug}`);
    await page.waitForLoadState('networkidle');

    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).not.toContainText('קטגוריה לא נמצאה');
    await expect(h1).toContainText('מתכונים בקטגוריית');
  });
});
