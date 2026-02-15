# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server (frontend only, proxies /api to :3001)
npm run build      # Production build (output: dist/)
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

### Local Development (full stack)

Run two processes in separate terminals:

```bash
# Terminal 1 — API routes (Vercel serverless functions + env vars)
vercel dev -l 3001

# Terminal 2 — Frontend (Vite with /api proxy to :3001)
npm run dev
```

Then open http://localhost:5173.

> **Note:** `vercel dev` alone doesn't work for local dev — its SPA rewrite intercepts Vite's internal dev routes. The two-process setup above is the recommended approach. This does not affect production deployment.

No test suite exists in this codebase.

---

## Architecture

**Stack:** React 18 + TypeScript + Vite, Neon Postgres (DB), Clerk (Auth), Vercel Blob (Storage), Vercel Serverless Functions (API), TanStack React Query v5, React Router v6, shadcn/ui + Tailwind CSS. Deployed on Vercel.

**Language:** The app is in Hebrew with RTL layout (`lang="he" dir="rtl"` in `index.html`). Error messages and UI text in components are in Hebrew.

### Environment Variables

| Variable | Accessible from |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Browser (Vite exposes `VITE_*`) |
| `CLERK_SECRET_KEY` | API routes only (no `VITE_` prefix) |
| `DATABASE_URL` | API routes only (auto-injected by Neon Vercel integration) |
| `BLOB_READ_WRITE_TOKEN` | API routes only (auto-injected by Vercel Blob) |

### Routing (`src/App.tsx`)

```
/                        → Index.tsx
/category/:categoryName  → CategoryPage.tsx
/recipe/:recipeId        → RecipePage.tsx
/new-recipe              → NewRecipePage.tsx
*                        → NotFound.tsx
```

App.tsx wraps everything in `QueryClientProvider`, `HelmetProvider`, `TooltipProvider`, `Toaster`, and `Sonner`. `ClerkProvider` wraps the app in `main.tsx`.

### API Routes (`/api`)

```
api/
  _db.ts                   # getDb() — Neon tagged-template SQL helper
  _auth.ts                 # requireAuth(header) — Clerk JWT verification
  categories.ts            # GET /api/categories
  categories/[id].ts       # PUT /api/categories/:id
  recipes/
    index.ts               # POST /api/recipes (create, transactional)
    recommended.ts         # GET /api/recipes/recommended
    search.ts              # GET /api/recipes/search?q=
    upload.ts              # POST /api/recipes/upload → Vercel Blob
  category/[slug].ts       # GET /api/category/:slug
  recipe/[id].ts           # GET + PUT + DELETE /api/recipe/:id
```

- Public routes (no auth): all GETs
- Authenticated routes (require `Authorization: Bearer <clerk_token>`): all mutations
- `api/_db.ts` uses `neon()` tagged-template from `@neondatabase/serverless`
- `api/_auth.ts` uses `createClerkClient` from `@clerk/backend` (installed as a regular dependency alongside `@clerk/clerk-react`)
- Recipe create and update are wrapped in transactions (BEGIN/COMMIT/ROLLBACK)

### Frontend API Client

`src/lib/apiClient.ts` — shared `apiFetch<T>(path, options)` wrapper that attaches Clerk JWT when `getToken` is provided. `getToken` comes from `useAuth()` (Clerk) and is passed as a parameter to mutation functions — it cannot be called inside `queryFn`/`mutationFn` directly since those are not React hooks.

### Data Layer

- **`src/api/recipes.ts`** — `createRecipe(values, getToken)`: uploads image to `/api/recipes/upload`, then POST JSON to `/api/recipes`.
- **`src/api/recipeApi.ts`** — `updateRecipeInDb({ recipeId, values, getToken })`: same upload pattern, then PUT to `/api/recipe/:id`.
- **`src/api/search.ts`** — `searchRecipesByName(query)`: calls `/api/recipes/search?q=`.

### Database Schema (8 tables, Neon Postgres)

| Table | Purpose |
|---|---|
| `recipes` | Core recipe records (name, description, image_url, category_id, recommended) |
| `categories` | Browsable categories (name, slug, color, icon) |
| `recipe_ingredients` | Ordered by `sort_order` |
| `recipe_instructions` | Ordered by `step_number` |
| `recipe_sauces` | Ordered by `step_number` |
| `recipe_sauce_ingredients` | Ordered by `sort_order` |
| `recipe_garnish_ingredients` | Ordered by `sort_order` |
| `recipe_garnish_instructions` | Ordered by `step_number` |

Clean DDL reference: `scripts/neon-schema.sql`.

### Types

`src/types/index.ts` — plain TypeScript interfaces (`Category`, `Recipe`, `RecipeWithDetails`) replacing the old auto-generated Supabase types.

### React Query Patterns

Data fetching uses `useQuery` and `useMutation` from `@tanstack/react-query`. Common query keys:
- `['categories']`
- `['recipes']`
- `['recipe', recipeId]`
- `['recommendedRecipes']`

Mutations call `queryClient.invalidateQueries()` on success. The `useCategories` hook in `src/hooks/useCategories.ts` is the canonical example of this pattern.

### Authentication

`useAuth()` hook (`src/hooks/useAuth.ts`) wraps Clerk's `useAuth` + `useUser`, returning `{ session, user, loading, isAuthenticated, getToken }`. `Auth.tsx` uses `<SignedIn>`, `<SignedOut>`, `<SignInButton mode="modal">`, `<SignOutButton>` from `@clerk/clerk-react`.

---

## General Notes

### Path Alias

`@/` resolves to `src/`. TypeScript strict mode is **off** (`strict: false`, `strictNullChecks: false`, `noImplicitAny: false`).

### UI Components

`src/components/ui/` contains shadcn/ui components — don't modify these directly; use the shadcn CLI to add/update them. Custom app components live in `src/components/`. Form schemas with Zod are in `src/schemas/`.

### vercel.json

The SPA rewrite rule excludes `/api/*` and Vite's internal dev paths so requests are routed correctly:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/((?!api/|src/|@|node_modules/).*)", "destination": "/index.html" }
  ]
}
```

### ESM Import Extensions

`package.json` has `"type": "module"`, which means Node runs all files as ESM. In production, Node's ESM resolver requires **explicit `.js` extensions** on relative imports. All `api/` files must use `.js` extensions even though the source files are `.ts`:

```ts
// ✅ Correct
import { getDb } from './_db.js';
import { requireAuth } from '../_auth.js';

// ❌ Will crash in production (ERR_MODULE_NOT_FOUND)
import { getDb } from './_db';
import { requireAuth } from '../_auth';
```

> Note: `vercel dev` (local) works without extensions because it uses its own TypeScript bundler. The production Node ESM runtime is strict.
