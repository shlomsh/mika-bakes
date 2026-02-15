import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { getDb } from '../_db';
import { requireAuth } from '../_auth';

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
        SELECT r.*, json_build_object('id', c.id, 'slug', c.slug, 'name', c.name) AS categories
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
  } catch (err: any) {
    console.error('GET /api/recipe/[id] error:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function handlePut(id: string, req: VercelRequest, res: VercelResponse) {
  try {
    await requireAuth(req.headers.authorization ?? null);
  } catch (err: any) {
    return res.status(err.status || 401).json({ error: err.message });
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const {
      name, description, image_url, category_id, recommended,
      ingredients, instructions, sauces, sauce_ingredients,
      garnish_ingredients, garnish_instructions,
    } = req.body;

    await sql`BEGIN`;

    try {
      // Update core recipe
      const rows = await sql`
        UPDATE recipes
        SET name = ${name}, description = ${description ?? null},
            image_url = ${image_url ?? null}, category_id = ${category_id ?? null},
            recommended = ${recommended ?? false}, updated_at = now()
        WHERE id = ${id}
        RETURNING *
      `;

      if (rows.length === 0) {
        await sql`ROLLBACK`;
        return res.status(404).json({ error: 'Recipe not found' });
      }

      // Delete-reinsert pattern for all 6 related tables
      await sql`DELETE FROM recipe_ingredients WHERE recipe_id = ${id}`;
      await sql`DELETE FROM recipe_instructions WHERE recipe_id = ${id}`;
      await sql`DELETE FROM recipe_sauces WHERE recipe_id = ${id}`;
      await sql`DELETE FROM recipe_sauce_ingredients WHERE recipe_id = ${id}`;
      await sql`DELETE FROM recipe_garnish_ingredients WHERE recipe_id = ${id}`;
      await sql`DELETE FROM recipe_garnish_instructions WHERE recipe_id = ${id}`;

      if (ingredients?.length) {
        for (let i = 0; i < ingredients.length; i++) {
          await sql`
            INSERT INTO recipe_ingredients (recipe_id, description, sort_order)
            VALUES (${id}, ${ingredients[i].description}, ${ingredients[i].sort_order ?? i})
          `;
        }
      }

      if (instructions?.length) {
        for (let i = 0; i < instructions.length; i++) {
          await sql`
            INSERT INTO recipe_instructions (recipe_id, description, step_number)
            VALUES (${id}, ${instructions[i].description}, ${instructions[i].step_number ?? i + 1})
          `;
        }
      }

      if (sauces?.length) {
        for (let i = 0; i < sauces.length; i++) {
          await sql`
            INSERT INTO recipe_sauces (recipe_id, description, step_number)
            VALUES (${id}, ${sauces[i].description}, ${sauces[i].step_number ?? i + 1})
          `;
        }
      }

      if (sauce_ingredients?.length) {
        for (let i = 0; i < sauce_ingredients.length; i++) {
          await sql`
            INSERT INTO recipe_sauce_ingredients (recipe_id, description, sort_order)
            VALUES (${id}, ${sauce_ingredients[i].description}, ${sauce_ingredients[i].sort_order ?? i})
          `;
        }
      }

      if (garnish_ingredients?.length) {
        for (let i = 0; i < garnish_ingredients.length; i++) {
          await sql`
            INSERT INTO recipe_garnish_ingredients (recipe_id, description, sort_order)
            VALUES (${id}, ${garnish_ingredients[i].description}, ${garnish_ingredients[i].sort_order ?? i})
          `;
        }
      }

      if (garnish_instructions?.length) {
        for (let i = 0; i < garnish_instructions.length; i++) {
          await sql`
            INSERT INTO recipe_garnish_instructions (recipe_id, description, step_number)
            VALUES (${id}, ${garnish_instructions[i].description}, ${garnish_instructions[i].step_number ?? i + 1})
          `;
        }
      }

      await sql`COMMIT`;
      return res.status(200).json(rows[0]);
    } catch (innerErr) {
      await sql`ROLLBACK`;
      throw innerErr;
    }
  } catch (err: any) {
    console.error('PUT /api/recipe/[id] error:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function handleDelete(id: string, req: VercelRequest, res: VercelResponse) {
  try {
    await requireAuth(req.headers.authorization ?? null);
  } catch (err: any) {
    return res.status(err.status || 401).json({ error: err.message });
  }

  try {
    const sql = getDb();
    const rows = await sql`DELETE FROM recipes WHERE id = ${id} RETURNING id`;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('DELETE /api/recipe/[id] error:', err);
    return res.status(500).json({ error: err.message });
  }
}
