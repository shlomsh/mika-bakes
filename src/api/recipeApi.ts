import { apiFetch } from '@/lib/apiClient';
import { RecipeEditFormValues } from '@/schemas/recipeEditSchema';

export async function updateRecipeInDb({
  recipeId,
  values,
  getToken,
}: {
  recipeId: string;
  values: RecipeEditFormValues & { recommended?: boolean };
  getToken: () => Promise<string | null>;
}) {
  const {
    name, description, ingredients, instructions, sauces,
    image_url, sauce_ingredients, recommended, garnish_ingredients,
    garnish_instructions, category_id,
  } = values;

  const body: Record<string, unknown> = {
    name,
    description: description || null,
    image_url: image_url ?? null,
    category_id: category_id || null,
    recommended: recommended ?? false,
    ingredients: ingredients.map((ing, i) => ({ description: ing.description, sort_order: i + 1 })),
    instructions: instructions.map((inst, i) => ({ description: inst.description, step_number: i + 1 })),
    sauces: (sauces || []).map((s, i) => ({ description: s.description, step_number: i + 1 })),
    sauce_ingredients: (sauce_ingredients || []).map((s, i) => ({ description: s.description, sort_order: i + 1 })),
    garnish_ingredients: (garnish_ingredients || []).map((g, i) => ({ description: g.description, sort_order: i + 1 })),
    garnish_instructions: (garnish_instructions || []).map((g, i) => ({ description: g.description, step_number: i + 1 })),
  };

  await apiFetch(`/api/recipe/${recipeId}`, {
    method: 'PUT',
    getToken,
    body: JSON.stringify(body),
  });
}
