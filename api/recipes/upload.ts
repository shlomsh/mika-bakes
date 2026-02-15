import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { requireAuth } from '../_auth.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await requireAuth(req.headers.authorization ?? null);
  } catch (err: any) {
    return res.status(err.status || 401).json({ error: err.message });
  }

  try {
    const filename = (req.query.filename as string) || `recipe-${Date.now()}.jpg`;

    const blob = await put(filename, req, {
      access: 'public',
    });

    return res.status(200).json({ url: blob.url });
  } catch (err: any) {
    console.error('POST /api/recipes/upload error:', err);
    return res.status(500).json({ error: err.message });
  }
}
