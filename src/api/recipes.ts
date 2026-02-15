import { apiFetch } from '@/lib/apiClient';
import { RecipeFormValues } from '@/schemas/recipeSchema';

export async function createRecipe(
  values: RecipeFormValues,
  getToken: () => Promise<string | null>
) {
  const {
    name, description, ingredients, instructions, sauces,
    image_file, category_id, garnish_ingredients, garnish_instructions,
  } = values;

  // 1. Upload image if provided
  let image_url: string | null = null;
  if (image_file && image_file.length > 0) {
    const file = image_file[0];
    const token = await getToken();
    if (!token) throw new Error('לא מחובר — יש להתחבר מחדש לפני שמירה');
    const res = await fetch(`/api/recipes/upload?filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: file,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `העלאת התמונה נכשלה (${res.status})`);
    }
    const data = await res.json();
    image_url = data.url;
  }

  // 2. Create recipe + all related data via API
  const recipe = await apiFetch<{ id: string }>('/api/recipes', {
    method: 'POST',
    getToken,
    body: JSON.stringify({
      name,
      description: description || null,
      image_url,
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
