import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_db.js';

const BASE_URL = 'https://mika-bakes.vercel.app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const sql = getDb();
    const [recipes, categories] = await Promise.all([
      sql`SELECT id, updated_at FROM recipes ORDER BY updated_at DESC`,
      sql`SELECT slug, updated_at FROM categories ORDER BY name`,
    ]);

    const urls: string[] = [];

    const tag = (loc: string, lastmod?: string, priority = '0.8') =>
      `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : ''}\n    <priority>${priority}</priority>\n  </url>`;

    urls.push(tag(`${BASE_URL}/`, undefined, '1.0'));

    for (const cat of categories) {
      urls.push(tag(`${BASE_URL}/category/${cat.slug}`, cat.updated_at, '0.7'));
    }

    for (const recipe of recipes) {
      urls.push(tag(`${BASE_URL}/recipe/${recipe.id}`, recipe.updated_at, '0.9'));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(xml);
  } catch (err: unknown) {
    console.error('GET /sitemap.xml error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
