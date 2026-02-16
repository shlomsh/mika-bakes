import { apiFetch } from '@/lib/apiClient';
import { RecipeEditFormValues } from '@/schemas/recipeEditSchema';

export async function updateRecipeInDb({
  recipeId,
  values,
  getToken,
  currentImageUrl,
}: {
  recipeId: string;
  values: RecipeEditFormValues & { recommended?: boolean };
  getToken: () => Promise<string | null>;
  currentImageUrl?: string | null;
}) {
  const {
    name, description, ingredients, instructions, sauces,
    image_file, sauce_ingredients, recommended, garnish_ingredients,
    garnish_instructions, category_id,
  } = values;

  // 1. Upload image if a new one is provided
  let image_url: string | undefined = currentImageUrl ?? undefined;
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

  // 2. Build the update payload
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

  // 3. Update via API
  await apiFetch(`/api/recipe/${recipeId}`, {
    method: 'PUT',
    getToken,
    body: JSON.stringify(body),
  });
}
