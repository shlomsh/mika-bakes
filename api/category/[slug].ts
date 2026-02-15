import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = getDb();
    const { slug } = req.query;

    // Fetch category
    const categories = await sql`SELECT * FROM categories WHERE slug = ${slug}`;
    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const category = categories[0];

    // Fetch recipes for this category, including nested category data
    const recipes = await sql`
      SELECT r.*, json_build_object('id', c.id, 'slug', c.slug, 'name', c.name) AS categories
      FROM recipes r
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE r.category_id = ${category.id}
    `;

    return res.status(200).json({ category, recipes });
  } catch (err: any) {
    console.error('GET /api/category/[slug] error:', err);
    return res.status(500).json({ error: err.message });
  }
}
