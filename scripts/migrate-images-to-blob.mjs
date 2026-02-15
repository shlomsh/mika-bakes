/**
 * Migration script: fetch all Supabase images and re-upload to Vercel Blob,
 * then update the DB image_url for each recipe.
 *
 * Run once:
 *   node scripts/migrate-images-to-blob.mjs
 */

import { neon } from '@neondatabase/serverless';
import { put } from '@vercel/blob';

const DATABASE_URL = process.env.DATABASE_URL;
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!DATABASE_URL) throw new Error('Missing DATABASE_URL');
if (!BLOB_READ_WRITE_TOKEN) throw new Error('Missing BLOB_READ_WRITE_TOKEN');

const sql = neon(DATABASE_URL);

// Fetch all recipes with Supabase image URLs
const recipes = await sql`
  SELECT id, name, image_url
  FROM recipes
  WHERE image_url LIKE 'https://ztjtvmxlrlwxilknbdtr.supabase.co/%'
`;

console.log(`Found ${recipes.length} recipes with Supabase image URLs\n`);

let succeeded = 0;
let failed = 0;

for (const recipe of recipes) {
  const { id, name, image_url } = recipe;
  const ext = image_url.split('.').pop().toLowerCase().split('?')[0]; // jpg, png, etc.
  const filename = `recipe-images/${id}.${ext}`;

  process.stdout.write(`  Migrating "${name}" (${ext})... `);

  try {
    // Fetch the image from Supabase
    const response = await fetch(image_url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || `image/${ext}`;
    const buffer = await response.arrayBuffer();

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType,
      token: BLOB_READ_WRITE_TOKEN,
    });

    // Update DB
    await sql`
      UPDATE recipes
      SET image_url = ${blob.url}, updated_at = now()
      WHERE id = ${id}
    `;

    console.log(`✓ → ${blob.url}`);
    succeeded++;
  } catch (err) {
    console.log(`✗ FAILED: ${err.message}`);
    failed++;
  }
}

console.log(`\nDone. ${succeeded} succeeded, ${failed} failed.`);
