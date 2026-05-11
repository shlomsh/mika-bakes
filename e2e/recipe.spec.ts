import { test, expect } from '@playwright/test';

test.describe('Recipe detail page', () => {
  test('clicking a recipe link from recommended list opens the recipe page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // RecipePicks.tsx — TransitionLink wrapping recipe name (no "הצג מתכון" button)
    const recipeLink = page.locator('a[href^="/recipe/"]').filter({ visible: true }).first();

    const count = await recipeLink.count();
    test.skip(count === 0, 'No recommended recipes in the database');

    await recipeLink.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/recipe\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('direct URL to a recipe page loads correctly', async ({ page }) => {
    const response = await page.request.get('/api/recipes/recommended');
    expect(response.ok()).toBeTruthy();

    const recipes = await response.json();
    test.skip(recipes.length === 0, 'No recommended recipes in the database');

    const recipeId = recipes[0].id;
    await page.goto(`/recipe/${recipeId}`);
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Recipe page always renders an image for the recipe
    const recipeImage = page.locator('img[alt]').first();
    await expect(recipeImage).toBeVisible();
  });

  test('recipe accessible from a category page', async ({ page }) => {
    const categoriesResp = await page.request.get('/api/categories');
    const categories = await categoriesResp.json();
    expect(categories.length).toBeGreaterThan(0);

    // Find a category that has at least one recipe
    let targetSlug: string | null = null;
    for (const cat of categories) {
      const catResp = await page.request.get(`/api/category/${cat.slug}`);
      const catData = await catResp.json();
      if (catData.recipes && catData.recipes.length > 0) {
        targetSlug = cat.slug;
        break;
      }
    }
    test.skip(!targetSlug, 'No categories with recipes found');

    await page.goto(`/category/${targetSlug}`);
    await page.waitForLoadState('networkidle');

    // RecipeCard.tsx — TransitionLink wrapping recipe name
    const recipeLink = page.locator('a[href^="/recipe/"]').filter({ visible: true }).first();
    await expect(recipeLink).toBeVisible();

    await recipeLink.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/recipe\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
