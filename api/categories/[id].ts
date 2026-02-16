import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_db.js';
import { requireAuth } from '../_auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await requireAuth(req.headers.authorization ?? null);
  } catch (err: unknown) {
    const status = (err as { status?: number }).status || 401;
    return res.status(status).json({ error: err instanceof Error ? err.message : String(err) });
  }

  try {
    const sql = getDb();
    const { name, slug, description, color, icon } = req.body;

    const rows = await sql`
      UPDATE categories
      SET name = ${name}, slug = ${slug}, description = ${description ?? null},
          color = ${color ?? null}, icon = ${icon ?? null}, updated_at = now()
      WHERE id = ${id}
      RETURNING *
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json(rows[0]);
  } catch (err: unknown) {
    console.error('PUT /api/categories/[id] error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
