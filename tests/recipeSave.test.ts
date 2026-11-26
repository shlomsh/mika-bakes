// Recipe create/edit must be all-or-nothing.
// Runs the real handlers against an in-memory Postgres (PGlite), never Neon.
// Run: npm run test:api
//
// The fake getDb() behaves like Neon's HTTP driver (neon()):
//   - every standalone sql`...` is its own HTTP request, so it commits on its own
//     (BEGIN / COMMIT / ROLLBACK sent this way do nothing);
//   - sql.transaction([...]) sends all queries in one request, run in one
//     Postgres transaction: either all commit or none do.
import { test, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { PGlite } from '@electric-sql/pglite';

// api/ files import siblings as './x.js' (needed by Vercel's Node ESM runtime);
// on disk they are .ts, so map those imports for Node's type-stripping loader.
registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context);
    } catch (err) {
      if (specifier.startsWith('.') && specifier.endsWith('.js')) {
        return next(specifier.slice(0, -3) + '.ts', context);
      }
      throw err;
    }
  },
});

const db = new PGlite();
await db.exec(readFileSync(new URL('../scripts/neon-schema.sql', import.meta.url), 'utf8'));

type Query = { text: string; params: unknown[]; then: PromiseLike<unknown[]>['then'] };

const NOOP_OVER_HTTP = /^\s*(BEGIN|COMMIT|ROLLBACK)\s*;?\s*$/i;

function sql(strings: TemplateStringsArray, ...values: unknown[]): Query {
  const text = strings.reduce((acc, s, i) => acc + `$${i}` + s);
  return {
    text,
    params: values,
    // Lazy like Neon's query promise: runs only when awaited on its own.
    then(onFulfilled, onRejected) {
      const run = NOOP_OVER_HTTP.test(text)
        ? Promise.resolve([])
        : db.query(text, values).then((r) => r.rows);
      return run.then(onFulfilled, onRejected);
    },
  };
}
sql.transaction = async (queries: Query[]) =>
  db.transaction(async (tx) => {
    const results: unknown[][] = [];
    for (const q of queries) results.push((await tx.query(q.text, q.params)).rows);
    return results;
  });

mock.module('../api/_db.ts', { namedExports: { getDb: () => sql } });
// Also catch any handler that still calls neon() directly instead of getDb().
mock.module('@neondatabase/serverless', { namedExports: { neon: () => sql } });
mock.module('../api/_auth.ts', { namedExports: { requireAdmin: async () => 'user_admin' } });

const { default: createHandler } = await import('../api/recipes/index.ts');
const { default: recipeHandler } = await import('../api/recipe/[id].ts');

async function call(handler: (req: unknown, res: unknown) => unknown, req: Record<string, unknown>) {
  const out = { status: 0, body: undefined as unknown };
  const res = {
    status(code: number) { out.status = code; return res; },
    json(body: unknown) { out.body = body; return res; },
  };
  const origError = console.error;
  console.error = () => {}; // handlers log the expected failure
  try {
    await handler({ headers: { authorization: 'Bearer x' }, query: {}, ...req }, res);
  } finally {
    console.error = origError;
  }
  return out;
}

const CHILD_TABLES = [
  'recipe_ingredients', 'recipe_instructions', 'recipe_sauces',
  'recipe_sauce_ingredients', 'recipe_garnish_ingredients', 'recipe_garnish_instructions',
];

async function count(table: string) {
  const { rows } = await db.query<{ n: number }>(`SELECT count(*)::int AS n FROM ${table}`);
  return rows[0].n;
}

const fullRecipe = {
  name: 'עוגת שוקולד',
  description: 'רכה',
  ingredients: [{ description: 'קמח' }, { description: 'סוכר' }],
  instructions: [{ description: 'לערבב' }, { description: 'לאפות' }],
  sauces: [{ description: 'רוטב' }],
  sauce_ingredients: [{ description: 'שמנת' }],
  garnish_ingredients: [{ description: 'אגוזים' }],
  garnish_instructions: [{ description: 'לפזר' }],
};

beforeEach(async () => {
  await db.exec('TRUNCATE recipes CASCADE');
});

test('create: saves the recipe and every child row', async () => {
  const res = await call(createHandler, { method: 'POST', body: fullRecipe });
  assert.equal(res.status, 201);
  assert.equal(await count('recipes'), 1);
  for (const t of CHILD_TABLES) assert.ok((await count(t)) > 0, `${t} is empty`);
});

test('create: a failing child insert partway saves nothing', async () => {
  // 2nd instruction violates NOT NULL, after the recipe, ingredients and 1st instruction.
  const body = {
    ...fullRecipe,
    instructions: [{ description: 'לערבב' }, { description: null }],
  };
  const res = await call(createHandler, { method: 'POST', body });
  assert.equal(res.status, 500);
  assert.equal(await count('recipes'), 0, 'recipe row was left behind');
  for (const t of CHILD_TABLES) assert.equal(await count(t), 0, `${t} has orphaned rows`);
});

test('edit: a failing child insert partway loses nothing', async () => {
  const created = await call(createHandler, { method: 'POST', body: fullRecipe });
  assert.equal(created.status, 201);
  const id = (created.body as { id: string }).id;

  const snapshot = async () => {
    const recipe = (await db.query('SELECT name, description FROM recipes WHERE id = $1', [id])).rows;
    const children: Record<string, unknown[]> = {};
    for (const t of CHILD_TABLES) {
      children[t] = (await db.query(`SELECT description FROM ${t} WHERE recipe_id = $1 ORDER BY 1`, [id])).rows;
    }
    return { recipe, children };
  };
  const before = await snapshot();

  const res = await call(recipeHandler, {
    method: 'PUT',
    query: { id },
    body: {
      ...fullRecipe,
      name: 'שם חדש',
      ingredients: [{ description: 'חמאה' }],
      instructions: [{ description: 'חדש' }, { description: null }],
    },
  });
  assert.equal(res.status, 500);
  assert.deepEqual(await snapshot(), before, 'old recipe data changed or was lost');
});

test('edit: replaces all child rows on success', async () => {
  const created = await call(createHandler, { method: 'POST', body: fullRecipe });
  const id = (created.body as { id: string }).id;

  const res = await call(recipeHandler, {
    method: 'PUT',
    query: { id },
    body: { name: 'שם חדש', ingredients: [{ description: 'חמאה' }], instructions: [] },
  });
  assert.equal(res.status, 200);
  assert.equal((res.body as { name: string }).name, 'שם חדש');
  const ingredients = (await db.query('SELECT description FROM recipe_ingredients WHERE recipe_id = $1', [id])).rows;
  assert.deepEqual(ingredients, [{ description: 'חמאה' }]);
  for (const t of CHILD_TABLES.filter((t) => t !== 'recipe_ingredients')) {
    assert.equal(await count(t), 0, `${t} kept old rows`);
  }
});

test('create: null child lists are treated as empty', async () => {
  const res = await call(createHandler, {
    method: 'POST',
    body: { name: 'x', ingredients: [{ description: 'y' }], instructions: null, sauces: null, garnish_instructions: null },
  });
  assert.equal(res.status, 201);
  assert.equal(await count('recipe_ingredients'), 1);
});

test('edit: unknown recipe -> 404', async () => {
  const res = await call(recipeHandler, {
    method: 'PUT',
    query: { id: '00000000-0000-0000-0000-000000000000' },
    body: { name: 'x', ingredients: [{ description: 'y' }] },
  });
  assert.equal(res.status, 404);
});
