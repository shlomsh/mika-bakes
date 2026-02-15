import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = getDb();
    const rows = await sql`SELECT * FROM categories ORDER BY name`;
    return res.status(200).json(rows);
  } catch (err: any) {
    console.error('GET /api/categories error:', err);
    return res.status(500).json({ error: err.message });
  }
}
