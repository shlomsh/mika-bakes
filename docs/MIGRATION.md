# Migration Plan: Supabase → Neon + Clerk + Vercel Blob + Vercel API Routes

## Context

The app currently queries Supabase directly from the browser for all DB access, auth (Google OAuth), and image storage. The goal is to remove Supabase entirely and replace each concern:
- **Database**: Neon Postgres (via Vercel Marketplace, `@neondatabase/serverless`)
- **Auth**: Clerk (`@clerk/clerk-react`) with Google OAuth
- **Image storage**: Vercel Blob (`@vercel/blob`)
- **API layer**: Vercel serverless functions in `/api` — the browser will no longer touch the DB directly

---

## Phase 1: Infrastructure Setup (manual, before any code)

1. In **Vercel dashboard**: connect Neon Postgres via Marketplace → auto-injects `DATABASE_URL`
2. In **Vercel dashboard**: connect Vercel Blob store → auto-injects `BLOB_READ_WRITE_TOKEN`
3. Create a **Clerk app** at clerk.com, enable Google OAuth → copy `PUBLISHABLE_KEY` and `SECRET_KEY`
4. Add to Vercel env vars (and `.env.local` locally):
   - `VITE_CLERK_PUBLISHABLE_KEY` (exposed to browser via Vite)
   - `CLERK_SECRET_KEY` (server-only, no `VITE_` prefix)
5. Recreate the **Postgres schema** in Neon using the 8 `CREATE TABLE` statements from the existing Supabase migrations (no RLS needed — auth is now enforced in API routes). Optionally migrate existing data.

---

## Phase 2: Package Changes

```bash
npm remove @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared
npm install @clerk/clerk-react @neondatabase/serverless @vercel/blob
npm install -D @vercel/node
```

---

## Phase 3: Fix `vercel.json`

The current catchall rewrite intercepts all `/api/*` requests and breaks every serverless function. Must be updated to exclude the API path:

**File**: `vercel.json`
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

---

## Phase 4: New Type System

**Create**: `src/types/index.ts` — plain TypeScript interfaces replacing all `Tables<'...'>` Supabase generics:

```ts
export interface Category { id: string; name: string; slug: string; description: string | null; color: string | null; icon: string | null; created_at: string; updated_at: string; }
export interface Recipe { id: string; name: string; description: string | null; image_url: string | null; category_id: string | null; recommended: boolean; created_at: string; updated_at: string; categories?: { id: string; slug: string; name: string } | null; }
export interface RecipeWithDetails extends Recipe {
  recipe_ingredients: { description: string; sort_order: number }[];
  recipe_instructions: { description: string; step_number: number }[];
  recipe_sauces: { description: string; step_number: number }[];
  recipe_sauce_ingredients: { description: string; sort_order: number }[];
  recipe_garnish_ingredients: { description: string; sort_order: number }[];
  recipe_garnish_instructions: { description: string; step_number: number }[];
}
```

**Update these files** to import from `@/types` instead of `@/integrations/supabase/types`:
- `src/hooks/useCategories.ts`
- `src/components/AppHeader.tsx`
- `src/pages/Index.tsx`
- `src/data/sampleRecipes.ts` (remove `Json` import, use `unknown`)
- `src/components/recipe-page/types.ts`

---

## Phase 5: Auth Migration

### `src/main.tsx`
Wrap app in `<ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>`.

### `src/hooks/useAuth.ts` — replace entirely
Preserve the exact same return shape (`session`, `user`, `loading`, `isAuthenticated`) plus add `getToken` for mutation calls:

```ts
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';

export function useAuth() {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user } = useUser();
  return {
    session: isSignedIn ? { user } : null,
    user: user ?? null,
    loading: !isLoaded,
    isAuthenticated: isSignedIn ?? false,
    getToken,
  };
}
```

### `src/components/Auth.tsx` — replace entirely
Use Clerk's `<SignedIn>`, `<SignedOut>`, `<SignInButton mode="modal">`, `<SignOutButton>`. Preserves the same visual layout (login modal with Google, logout button).

---

## Phase 6: Create Vercel API Routes

New directory structure under `/api`:

```
api/
  _db.ts                   # Neon connection helper
  _auth.ts                 # Clerk token verification helper
  categories.ts            # GET /api/categories
  categories/[id].ts       # PUT /api/categories/:id
  recipes/
    index.ts               # POST /api/recipes (create)
    recommended.ts         # GET /api/recipes/recommended
    search.ts              # GET /api/recipes/search?q=
    upload.ts              # POST /api/recipes/upload (Vercel Blob)
  category/[slug].ts       # GET /api/category/:slug
  recipe/[id].ts           # GET + PUT + DELETE /api/recipe/:id
```

### `api/_db.ts`
```ts
import { neon } from '@neondatabase/serverless';
export const getDb = () => neon(process.env.DATABASE_URL!);
```

### `api/_auth.ts`
```ts
import { createClerkClient } from '@clerk/backend';
export async function requireAuth(authHeader: string | null): Promise<string> {
  if (!authHeader) throw Object.assign(new Error('Unauthorized'), { status: 401 });
  const token = authHeader.replace('Bearer ', '');
  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  const { sub } = await clerk.verifyToken(token);
  return sub; // Clerk userId
}
```

### Public read routes (no auth)
- `GET /api/categories` — `SELECT * FROM categories ORDER BY name`
- `GET /api/recipes/recommended` — `SELECT id, name, description, image_url FROM recipes WHERE recommended = true`
- `GET /api/recipes/search?q=` — `SELECT id, name, image_url FROM recipes WHERE name ILIKE '%q%' LIMIT 10`
- `GET /api/category/[slug]` — fetch category by slug, then its recipes
- `GET /api/recipe/[id]` — 7 parallel queries via `Promise.all`, assembled into `RecipeWithDetails` shape

### Authenticated mutation routes (require `Authorization: Bearer <token>`)
- `PUT /api/categories/[id]` — update category fields
- `POST /api/recipes` — insert recipe + 6 related tables (sequential, no transaction needed for single-user app)
- `PUT /api/recipe/[id]` — update recipe metadata + delete-reinsert all 6 related tables
- `DELETE /api/recipe/[id]` — `DELETE FROM recipes WHERE id = $id` (cascades via FK)
- `POST /api/recipes/upload` — stream file body to Vercel Blob via `put(filename, req, { access: 'public' })`, return `{ url }`; set `export const config = { api: { bodyParser: false } }`

### Image upload flow change
Old: `supabase.storage.from('recipe-images').upload()`
New: Two steps:
1. `POST /api/recipes/upload` with raw file body → returns `{ url: 'https://...vercel-storage.com/...' }`
2. Include `image_url` in the JSON body of `POST /api/recipes` or `PUT /api/recipe/[id]`

---

## Phase 7: Frontend API Client

### Create `src/lib/apiClient.ts`
Shared fetch wrapper that attaches Clerk JWT when `getToken` is provided:

```ts
export async function apiFetch<T>(
  path: string,
  options: RequestInit & { getToken?: () => Promise<string | null> } = {}
): Promise<T> {
  const { getToken, ...rest } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(rest.headers as any) };
  if (getToken) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(path, { ...rest, headers });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText);
  return res.json();
}
```

### Replace frontend data access files

| Old file | What changes |
|---|---|
| `src/api/search.ts` | Replace `supabase.from()` with `apiFetch('/api/recipes/search?q=...')` |
| `src/api/recipes.ts` | Upload file to `/api/recipes/upload` first, then POST JSON to `/api/recipes` |
| `src/api/recipeApi.ts` | Same pattern: upload → PUT JSON to `/api/recipe/:id` |
| `src/hooks/useCategories.ts` | Replace Supabase calls with `apiFetch` to `/api/categories` and `/api/categories/:id` |
| `src/components/RecipePicks.tsx` | `apiFetch('/api/recipes/recommended')` |
| `src/pages/RecipePage.tsx` | `apiFetch('/api/recipe/:id')` for fetch, `apiFetch('/api/recipe/:id', {method:'DELETE',...})` for delete |
| `src/pages/CategoryPage.tsx` | `apiFetch('/api/category/:slug')` |

**Key pattern**: `getToken` (from `useAuth()`) is passed down to mutation functions. Read-only `queryFn`s do not need it.

**Update `RecipeCreateForm.tsx` and `RecipeEditForm.tsx`** to get `getToken` from `useAuth()` and pass it to `createRecipe` / `updateRecipeInDb`.

---

## Phase 8: Delete Supabase Artifacts

- Delete `src/integrations/supabase/client.ts`
- Delete `src/integrations/supabase/types.ts`
- Delete `src/integrations/` directory (if now empty)
- Delete `supabase/` directory at project root (local CLI config, migrations no longer needed)
- Update `CLAUDE.md` to reflect new stack
- Delete `docs/MIGRATION.md` (this file — migration complete)

---

## Environment Variables Summary

| Variable | Where set | Accessible from |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Vercel + `.env.local` | Browser (Vite exposes `VITE_*`) |
| `CLERK_SECRET_KEY` | Vercel + `.env.local` | API routes only |
| `DATABASE_URL` | Auto-injected by Neon integration | API routes only |
| `BLOB_READ_WRITE_TOKEN` | Auto-injected by Vercel Blob | API routes only |

---

## Verification

1. Run `vercel dev` (not `vite dev`) — this runs Vite frontend + serverless functions together with env vars
2. Visit `/` — categories load without auth
3. Sign in via Clerk Google OAuth modal — confirm auth state updates
4. Navigate to a recipe — confirm all related data loads
5. Create a new recipe with an image — confirm Vercel Blob URL appears in DB
6. Edit a recipe — confirm delete-reinsert pattern works
7. Delete a recipe — confirm cascade works
8. Sign out — confirm mutation buttons are hidden
9. Deploy to Vercel — confirm `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` are set in environment
