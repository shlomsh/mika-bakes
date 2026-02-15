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
  } catch (err: any) {
    return res.status(err.status || 401).json({ error: err.message });
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
  } catch (err: any) {
    console.error('PUT /api/categories/[id] error:', err);
    return res.status(500).json({ error: err.message });
  }
}
