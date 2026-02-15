import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, name, description, image_url
      FROM recipes
      WHERE recommended = true
    `;
    return res.status(200).json(rows);
  } catch (err: any) {
    console.error('GET /api/recipes/recommended error:', err);
    return res.status(500).json({ error: err.message });
  }
}
