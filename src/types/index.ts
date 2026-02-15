// Plain TypeScript interfaces replacing Supabase auto-generated types.
// These mirror the Neon Postgres schema in scripts/neon-schema.sql.

export interface Category {
  id: string;
  slug: string;
  name: string;
  color: string | null;
  icon: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category_id: string | null;
  recommended: boolean;
  created_at: string;
  updated_at: string;
  categories?: { id: string; slug: string; name: string } | null;
}

export interface RecipeWithDetails extends Recipe {
  recipe_ingredients: { description: string; sort_order: number }[];
  recipe_instructions: { description: string; step_number: number }[];
  recipe_sauces: { description: string; step_number: number }[];
  recipe_sauce_ingredients: { description: string; sort_order: number }[];
  recipe_garnish_ingredients: { description: string; sort_order: number }[];
  recipe_garnish_instructions: { description: string; step_number: number }[];
}
