import { apiFetch } from '@/lib/apiClient';
import type { Recipe } from '@/types';

type RecipeSearchResult = Pick<Recipe, 'id' | 'name' | 'image_url'>;

export async function searchRecipesByName(query: string): Promise<RecipeSearchResult[]> {
  if (!query) {
    return [];
  }

  return apiFetch<RecipeSearchResult[]>(`/api/recipes/search?q=${encodeURIComponent(query)}`);
}
