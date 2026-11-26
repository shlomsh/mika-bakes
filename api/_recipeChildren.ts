import type { getDb } from './_db.js';

type Sql = ReturnType<typeof getDb>;
type Item = { description: string; sort_order?: number; step_number?: number };

export type RecipeChildren = {
  ingredients?: Item[];
  instructions?: Item[];
  sauces?: Item[];
  sauce_ingredients?: Item[];
  garnish_ingredients?: Item[];
  garnish_instructions?: Item[];
};

/**
 * Builds (but does not run) the INSERTs for a recipe's 6 child tables, to be
 * passed to sql.transaction([...]) together with the recipe write.
 */
export function childInserts(sql: Sql, recipeId: string, body: RecipeChildren) {
  // `?? []` (not destructuring defaults) so null is treated like a missing list, as before.
  const ingredients = body.ingredients ?? [];
  const instructions = body.instructions ?? [];
  const sauces = body.sauces ?? [];
  const sauce_ingredients = body.sauce_ingredients ?? [];
  const garnish_ingredients = body.garnish_ingredients ?? [];
  const garnish_instructions = body.garnish_instructions ?? [];

  return [
    ...ingredients.map((x, i) => sql`
      INSERT INTO recipe_ingredients (recipe_id, description, sort_order)
      VALUES (${recipeId}, ${x.description}, ${x.sort_order ?? i})`),
    ...instructions.map((x, i) => sql`
      INSERT INTO recipe_instructions (recipe_id, description, step_number)
      VALUES (${recipeId}, ${x.description}, ${x.step_number ?? i + 1})`),
    ...sauces.map((x, i) => sql`
      INSERT INTO recipe_sauces (recipe_id, description, step_number)
      VALUES (${recipeId}, ${x.description}, ${x.step_number ?? i + 1})`),
    ...sauce_ingredients.map((x, i) => sql`
      INSERT INTO recipe_sauce_ingredients (recipe_id, description, sort_order)
      VALUES (${recipeId}, ${x.description}, ${x.sort_order ?? i})`),
    ...garnish_ingredients.map((x, i) => sql`
      INSERT INTO recipe_garnish_ingredients (recipe_id, description, sort_order)
      VALUES (${recipeId}, ${x.description}, ${x.sort_order ?? i})`),
    ...garnish_instructions.map((x, i) => sql`
      INSERT INTO recipe_garnish_instructions (recipe_id, description, step_number)
      VALUES (${recipeId}, ${x.description}, ${x.step_number ?? i + 1})`),
  ];
}
