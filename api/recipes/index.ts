import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'node:crypto';
import { getDb } from '../_db.js';
import { requireAdmin } from '../_auth.js';
import { childInserts } from '../_recipeChildren.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await requireAdmin(req.headers.authorization ?? null);
  } catch (err: unknown) {
    const status = (err as { status?: number }).status || 401;
    return res.status(status).json({ error: err instanceof Error ? err.message : String(err) });
  }

  try {
    const sql = getDb();
    const { name, description, image_url, category_id, recommended } = req.body;

    // The id is generated here so the child inserts can reference it in the same
    // non-interactive transaction (one HTTP request, all-or-nothing).
    const recipeId = randomUUID();
    const [[recipe]] = await sql.transaction([
      sql`
        INSERT INTO recipes (id, name, description, image_url, category_id, recommended)
        VALUES (${recipeId}, ${name}, ${description ?? null}, ${image_url ?? null}, ${category_id ?? null}, ${recommended ?? false})
        RETURNING *
      `,
      ...childInserts(sql, recipeId, req.body),
    ]);

    return res.status(201).json(recipe);
  } catch (err: unknown) {
    console.error('POST /api/recipes error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
