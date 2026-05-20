import { apiFetch } from '@/lib/apiClient';
import { RecipeFormValues } from '@/schemas/recipeSchema';

export async function createRecipe(
  values: RecipeFormValues,
  getToken: () => Promise<string | null>
) {
  const {
    name, description, ingredients, instructions, sauces,
    image_url, category_id, garnish_ingredients, garnish_instructions,
  } = values;

  const recipe = await apiFetch<{ id: string }>('/api/recipes', {
    method: 'POST',
    getToken,
    body: JSON.stringify({
      name,
      description: description || null,
      image_url: image_url || null,
      category_id: category_id || null,
      ingredients: ingredients.map((ing, i) => ({ description: ing.description, sort_order: i + 1 })),
      instructions: instructions.map((inst, i) => ({ description: inst.description, step_number: i + 1 })),
      sauces: (sauces || []).map((s, i) => ({ description: s.description, step_number: i + 1 })),
      sauce_ingredients: [],
      garnish_ingredients: (garnish_ingredients || []).map((g, i) => ({ description: g.description, sort_order: i + 1 })),
      garnish_instructions: (garnish_instructions || []).map((g, i) => ({ description: g.description, step_number: i + 1 })),
    }),
  });

  return recipe.id;
}
