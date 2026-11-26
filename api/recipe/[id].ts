import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_db.js';
import { requireAdmin } from '../_auth.js';
import { childInserts } from '../_recipeChildren.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      return handleGet(id as string, res);
    case 'PUT':
      return handlePut(id as string, req, res);
    case 'DELETE':
      return handleDelete(id as string, req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(id: string, res: VercelResponse) {
  try {
    const sql = getDb();

    const [
      recipes,
      ingredients,
      instructions,
      sauces,
      sauceIngredients,
      garnishIngredients,
      garnishInstructions,
    ] = await Promise.all([
      sql`
        SELECT r.*, json_build_object('id', c.id, 'slug', c.slug, 'name', c.name, 'color', c.color) AS categories
        FROM recipes r
        LEFT JOIN categories c ON r.category_id = c.id
        WHERE r.id = ${id}
      `,
      sql`SELECT description, sort_order FROM recipe_ingredients WHERE recipe_id = ${id} ORDER BY sort_order`,
      sql`SELECT description, step_number FROM recipe_instructions WHERE recipe_id = ${id} ORDER BY step_number`,
      sql`SELECT description, step_number FROM recipe_sauces WHERE recipe_id = ${id} ORDER BY step_number`,
      sql`SELECT description, sort_order FROM recipe_sauce_ingredients WHERE recipe_id = ${id} ORDER BY sort_order`,
      sql`SELECT description, sort_order FROM recipe_garnish_ingredients WHERE recipe_id = ${id} ORDER BY sort_order`,
      sql`SELECT description, step_number FROM recipe_garnish_instructions WHERE recipe_id = ${id} ORDER BY step_number`,
    ]);

    if (recipes.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const recipe = {
      ...recipes[0],
      recipe_ingredients: ingredients,
      recipe_instructions: instructions,
      recipe_sauces: sauces,
      recipe_sauce_ingredients: sauceIngredients,
      recipe_garnish_ingredients: garnishIngredients,
      recipe_garnish_instructions: garnishInstructions,
    };

    return res.status(200).json(recipe);
  } catch (err: unknown) {
    console.error('GET /api/recipe/[id] error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}

async function handlePut(id: string, req: VercelRequest, res: VercelResponse) {
  try {
    await requireAdmin(req.headers.authorization ?? null);
  } catch (err: unknown) {
    const status = (err as { status?: number }).status || 401;
    return res.status(status).json({ error: err instanceof Error ? err.message : String(err) });
  }

  try {
    const sql = getDb();
    const { name, description, image_url, category_id, recommended } = req.body;

    // Checked first so a missing recipe is a 404, not a foreign-key error from the inserts.
    const existing = await sql`SELECT 1 FROM recipes WHERE id = ${id}`;
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // One non-interactive transaction (one HTTP request): if any insert fails,
    // the update and the deletes roll back too, so the old recipe stays intact.
    const [rows] = await sql.transaction([
      sql`
        UPDATE recipes
        SET name = ${name}, description = ${description ?? null},
            image_url = ${image_url ?? null}, category_id = ${category_id ?? null},
            recommended = ${recommended ?? false}, updated_at = now()
        WHERE id = ${id}
        RETURNING *
      `,
      // Delete-reinsert pattern for all 6 related tables
      sql`DELETE FROM recipe_ingredients WHERE recipe_id = ${id}`,
      sql`DELETE FROM recipe_instructions WHERE recipe_id = ${id}`,
      sql`DELETE FROM recipe_sauces WHERE recipe_id = ${id}`,
      sql`DELETE FROM recipe_sauce_ingredients WHERE recipe_id = ${id}`,
      sql`DELETE FROM recipe_garnish_ingredients WHERE recipe_id = ${id}`,
      sql`DELETE FROM recipe_garnish_instructions WHERE recipe_id = ${id}`,
      ...childInserts(sql, id, req.body),
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    return res.status(200).json(rows[0]);
  } catch (err: unknown) {
    console.error('PUT /api/recipe/[id] error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}

async function handleDelete(id: string, req: VercelRequest, res: VercelResponse) {
  try {
    await requireAdmin(req.headers.authorization ?? null);
  } catch (err: unknown) {
    const status = (err as { status?: number }).status || 401;
    return res.status(status).json({ error: err instanceof Error ? err.message : String(err) });
  }

  try {
    const sql = getDb();
    const rows = await sql`DELETE FROM recipes WHERE id = ${id} RETURNING id`;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    return res.status(200).json({ success: true });
  } catch (err: unknown) {
    console.error('DELETE /api/recipe/[id] error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
