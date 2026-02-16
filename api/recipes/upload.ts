import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { requireAuth } from '../_auth.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await requireAuth(req.headers.authorization ?? null);
  } catch (err: unknown) {
    const status = (err as { status?: number }).status || 401;
    return res.status(status).json({ error: err instanceof Error ? err.message : String(err) });
  }

  try {
    const filename = (req.query.filename as string) || `recipe-${Date.now()}.jpg`;

    // Validate file extension
    const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return res.status(400).json({ error: `סוג קובץ לא נתמך: ${ext}. סוגים מותרים: ${ALLOWED_EXTENSIONS.join(', ')}` });
    }

    // Validate content-type header
    const contentType = req.headers['content-type'] || '';
    if (contentType && !contentType.startsWith('image/')) {
      return res.status(400).json({ error: 'סוג תוכן לא חוקי — יש להעלות קובץ תמונה בלבד' });
    }

    // Validate file size via content-length
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    if (contentLength > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'הקובץ גדול מדי — הגודל המרבי הוא 10MB' });
    }

    const blob = await put(filename, req, {
      access: 'public',
    });

    return res.status(200).json({ url: blob.url });
  } catch (err: unknown) {
    console.error('POST /api/recipes/upload error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}
