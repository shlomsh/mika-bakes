import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { requireAuth } from '../_auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await requireAuth(req.headers.authorization ?? null);
  } catch (err: unknown) {
    const status = (err as { status?: number }).status || 401;
    return res.status(status).json({ error: err instanceof Error ? err.message : String(err) });
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const {
      name, description, image_url, category_id, recommended,
      ingredients, instructions, sauces, sauce_ingredients,
      garnish_ingredients, garnish_instructions,
    } = req.body;

    // Use a transaction to insert recipe + all related tables
    await sql`BEGIN`;

    try {
      const [recipe] = await sql`
        INSERT INTO recipes (name, description, image_url, category_id, recommended)
        VALUES (${name}, ${description ?? null}, ${image_url ?? null}, ${category_id ?? null}, ${recommended ?? false})
        RETURNING *
      `;

      const recipeId = recipe.id;

      // Insert ingredients
      if (ingredients?.length) {
        for (let i = 0; i < ingredients.length; i++) {
          await sql`
            INSERT INTO recipe_ingredients (recipe_id, description, sort_order)
            VALUES (${recipeId}, ${ingredients[i].description}, ${ingredients[i].sort_order ?? i})
          `;
        }
      }

      // Insert instructions
      if (instructions?.length) {
        for (let i = 0; i < instructions.length; i++) {
          await sql`
            INSERT INTO recipe_instructions (recipe_id, description, step_number)
            VALUES (${recipeId}, ${instructions[i].description}, ${instructions[i].step_number ?? i + 1})
          `;
        }
      }

      // Insert sauces
      if (sauces?.length) {
        for (let i = 0; i < sauces.length; i++) {
          await sql`
            INSERT INTO recipe_sauces (recipe_id, description, step_number)
            VALUES (${recipeId}, ${sauces[i].description}, ${sauces[i].step_number ?? i + 1})
          `;
        }
      }

      // Insert sauce ingredients
      if (sauce_ingredients?.length) {
        for (let i = 0; i < sauce_ingredients.length; i++) {
          await sql`
            INSERT INTO recipe_sauce_ingredients (recipe_id, description, sort_order)
            VALUES (${recipeId}, ${sauce_ingredients[i].description}, ${sauce_ingredients[i].sort_order ?? i})
          `;
        }
      }

      // Insert garnish ingredients
      if (garnish_ingredients?.length) {
        for (let i = 0; i < garnish_ingredients.length; i++) {
          await sql`
            INSERT INTO recipe_garnish_ingredients (recipe_id, description, sort_order)
            VALUES (${recipeId}, ${garnish_ingredients[i].description}, ${garnish_ingredients[i].sort_order ?? i})
          `;
        }
      }

      // Insert garnish instructions
      if (garnish_instructions?.length) {
        for (let i = 0; i < garnish_instructions.length; i++) {
          await sql`
            INSERT INTO recipe_garnish_instructions (recipe_id, description, step_number)
            VALUES (${recipeId}, ${garnish_instructions[i].description}, ${garnish_instructions[i].step_number ?? i + 1})
          `;
        }
      }

      await sql`COMMIT`;
      return res.status(201).json(recipe);
    } catch (innerErr) {
      await sql`ROLLBACK`;
      throw innerErr;
    }
  } catch (err: unknown) {
    console.error('POST /api/recipes error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
