# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server (frontend only, proxies /api to :3001)
npm run build      # Production build (output: dist/)
npm run build:dev  # Development-mode build (source maps, no minification)
npm run lint       # ESLint
npm run preview    # Preview production build locally
npm run test:e2e   # Playwright E2E tests (requires running app or BASE_URL)
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

No unit test suite exists. E2E tests use Playwright (`e2e/` directory) and run against a live deployment in CI (`.github/workflows/e2e.yml`).

---

## Architecture

**Stack:** React 18 + TypeScript + Vite, Neon Postgres (DB), Clerk (Auth), Vercel Blob (Storage), Vercel Serverless Functions (API), TanStack React Query v5, React Router v6, shadcn/ui + Tailwind CSS. Deployed on Vercel.

**Language:** The app is in Hebrew with RTL layout (`lang="he" dir="rtl"` in `index.html`). Error messages and UI text in components are in Hebrew. Zod schema error messages are also in Hebrew.

**PWA:** The app is a Progressive Web App via `vite-plugin-pwa`. The Service Worker auto-updates and caches API responses in a cache named `api-responses`. The PWA manifest is also in Hebrew (`lang: "he"`, `dir: "rtl"`).

### Environment Variables

| Variable | Accessible from |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Browser (Vite exposes `VITE_*`) |
| `CLERK_SECRET_KEY` | API routes only (no `VITE_` prefix) |
| `DATABASE_URL` | API routes only (auto-injected by Neon Vercel integration) |
| `BLOB_READ_WRITE_TOKEN` | API routes only (auto-injected by Vercel Blob) |

### Routing (`src/App.tsx`)

All page components are **lazy-loaded** via `React.lazy` + `Suspense`:

```
/                        → Index.tsx
/category/:categoryName  → CategoryPage.tsx
/recipe/:recipeId        → RecipePage.tsx
/new-recipe              → NewRecipePage.tsx
*                        → NotFound.tsx
```

`App.tsx` also includes a `ScrollToTop` component (scrolls to top on route change) and `PWAReloadPrompt`. Provider order (outer to inner): `HelmetProvider` → `QueryClientProvider` → `TooltipProvider` → `BrowserRouter`. `ClerkProvider` wraps the app in `main.tsx`.

**React Query config** (in `App.tsx`):
- `staleTime: Infinity` — recipes never refetch within a session
- `gcTime: 30 min` — keeps unused cache entries for 30 minutes

### API Routes (`/api`)

```
api/
  _db.ts                   # getDb() — Neon tagged-template SQL helper (singleton)
  _auth.ts                 # requireAuth(header) — Clerk JWT verification
  categories.ts            # GET /api/categories
  categories/[id].ts       # PUT /api/categories/:id
  recipes/
    index.ts               # POST /api/recipes (create, transactional)
    recommended.ts         # GET /api/recipes/recommended
    search.ts              # GET /api/recipes/search?q= (ILIKE, limit 10, returns id/name/image_url)
    upload.ts              # POST /api/recipes/upload → Vercel Blob (max 10MB, jpg/jpeg/png/gif/webp/avif)
  category/[slug].ts       # GET /api/category/:slug (returns category + recipes)
  recipe/[id].ts           # GET + PUT + DELETE /api/recipe/:id
```

- Public routes (no auth): all GETs
- Authenticated routes (require `Authorization: Bearer <clerk_token>`): all mutations (POST, PUT, DELETE)
- `api/_db.ts` uses `neon()` tagged-template from `@neondatabase/serverless`
- `api/_auth.ts` uses `createClerkClient` from `@clerk/backend`
- Recipe create (`POST /api/recipes`) and update (`PUT /api/recipe/:id`) are wrapped in transactions (BEGIN/COMMIT/ROLLBACK). Update uses delete-then-reinsert for all related tables.

### Frontend API Client

`src/lib/apiClient.ts` — shared `apiFetch<T>(path, options)` wrapper that attaches Clerk JWT when `getToken` is provided. `getToken` comes from `useAuth()` (Clerk) and is passed as a parameter to mutation functions — it cannot be called inside `queryFn`/`mutationFn` directly since those are not React hooks.

### Data Layer

- **`src/api/recipes.ts`** — `createRecipe(values, getToken)`: uploads image to `/api/recipes/upload`, then POST JSON to `/api/recipes`.
- **`src/api/recipeApi.ts`** — `updateRecipeInDb({ recipeId, values, getToken, currentImageUrl })`: uploads image if changed, then PUT to `/api/recipe/:id`.
- **`src/api/search.ts`** — `searchRecipesByName(query)`: calls `/api/recipes/search?q=`, returns `{ id, name, image_url }[]`.

### Database Schema (8 tables, Neon Postgres)

| Table | Purpose |
|---|---|
| `recipes` | Core recipe records (name, description, image_url, category_id, recommended) |
| `categories` | Browsable categories (name, slug, color, icon, description) |
| `recipe_ingredients` | Ordered by `sort_order` |
| `recipe_instructions` | Ordered by `step_number` |
| `recipe_sauces` | Ordered by `step_number` |
| `recipe_sauce_ingredients` | Ordered by `sort_order` |
| `recipe_garnish_ingredients` | Ordered by `sort_order` |
| `recipe_garnish_instructions` | Ordered by `step_number` |

Clean DDL reference: `scripts/neon-schema.sql`.

### Types

`src/types/index.ts` — plain TypeScript interfaces:

```ts
interface Category          // id, slug, name, color, icon, description, created_at, updated_at
interface Recipe            // id, name, description, image_url, category_id, recommended, timestamps, optional categories join
interface RecipeWithDetails // Recipe + all 6 related arrays (ingredients, instructions, sauces, sauce_ingredients, garnish_ingredients, garnish_instructions)
```

### React Query Patterns

Data fetching uses `useQuery` and `useMutation` from `@tanstack/react-query`. Common query keys:
- `['categories']`
- `['recipes']`
- `['recipe', recipeId]`
- `['recommendedRecipes']`

Mutations call `queryClient.invalidateQueries()` on success **and** call `bustSwCache()` to purge stale entries from the Service Worker cache. See `src/hooks/useCategories.ts` as the canonical example.

### Authentication

`useAuth()` hook (`src/hooks/useAuth.ts`) wraps Clerk's `useAuth` + `useUser`, returning `{ session, user, loading, isAuthenticated, getToken }`. `Auth.tsx` uses `<SignedIn>`, `<SignedOut>`, `<SignInButton mode="modal">`, `<SignOutButton>` from `@clerk/clerk-react`. `NewRecipePage` redirects unauthenticated users away.

---

## Source Directory Layout

```
src/
├── api/                        # API client functions (called from hooks/pages)
│   ├── recipeApi.ts            # updateRecipeInDb()
│   ├── recipes.ts              # createRecipe()
│   └── search.ts               # searchRecipesByName()
├── components/
│   ├── form/                   # Dynamic field array sub-components
│   │   ├── IngredientsFieldArray.tsx
│   │   ├── IngredientsListFieldArray.tsx
│   │   └── InstructionsFieldArray.tsx
│   ├── recipe-edit/            # Edit form section components
│   │   ├── BasicInfoSection.tsx
│   │   ├── GarnishSection.tsx
│   │   ├── IngredientsSection.tsx
│   │   ├── InstructionsSection.tsx
│   │   └── SauceSection.tsx
│   ├── recipe-page/            # Recipe detail display components
│   │   ├── RecipeContent.tsx
│   │   ├── RecipeDisplay.tsx
│   │   ├── RecipeHeader.tsx
│   │   ├── RecipeLoading.tsx
│   │   └── RecipeNotFound.tsx
│   ├── skeletons/              # Loading skeleton placeholders
│   │   ├── CategoryCardSkeleton.tsx
│   │   ├── RecipeCardSkeleton.tsx
│   │   ├── RecipePageSkeleton.tsx
│   │   └── RecipePicksSkeleton.tsx
│   ├── ui/                     # shadcn/ui components — DO NOT edit directly
│   ├── AppHeader.tsx           # Logo + RecipeSearch + Auth
│   ├── Auth.tsx                # Clerk SignedIn/Out buttons
│   ├── CategoryCards.tsx       # Grid of category cards (editable for admins)
│   ├── CategoryForm.tsx        # Dialog form for category editing
│   ├── DynamicIcon.tsx         # Renders a Lucide icon by name string
│   ├── MikaHero.tsx            # Welcome hero section
│   ├── PWAReloadPrompt.tsx     # Notifies users about PWA updates
│   ├── RecipeCard.tsx          # Individual recipe card
│   ├── RecipeCreateForm.tsx    # Full create-recipe form
│   ├── RecipeEditForm.tsx      # Full edit-recipe form
│   ├── RecipePicks.tsx         # Carousel of recommended recipes
│   ├── RecipeSearch.tsx        # cmdk command palette (Ctrl+K)
│   ├── SEOHead.tsx             # react-helmet-async wrapper
│   └── TransitionLink.tsx      # Link with page transition support
├── data/
│   └── sampleRecipes.ts        # Type re-exports only
├── hooks/
│   ├── useAuth.ts              # Clerk auth wrapper hook
│   ├── useCategories.ts        # Categories CRUD with React Query
│   └── use-mobile.tsx          # useIsMobile() — breakpoint at 768px
├── lib/
│   ├── apiClient.ts            # apiFetch<T>() — fetch with auto-auth header
│   ├── categoryColors.ts       # getCategoryColor() / getCategoryBgStyle() — OKLCH palette
│   ├── swCacheBust.ts          # bustSwCache(...paths) — purge SW api-responses cache
│   └── utils.ts                # cn() — clsx + twMerge
├── pages/
│   ├── Index.tsx               # Home: MikaHero + CategoryCards + RecipePicks
│   ├── CategoryPage.tsx        # Category detail + recipe list
│   ├── RecipePage.tsx          # Recipe detail, edit/delete for admins
│   ├── NewRecipePage.tsx       # Auth-guarded create form, accepts ?categoryId=
│   └── NotFound.tsx            # 404
├── schemas/
│   ├── recipeSchema.ts         # Zod schema for create (ingredients/instructions min 1)
│   └── recipeEditSchema.ts     # Zod schema for update (no min length requirement)
├── types/
│   └── index.ts                # Category, Recipe, RecipeWithDetails interfaces
├── App.tsx                     # Router + providers + QueryClient config
├── main.tsx                    # ClerkProvider + React root mount
└── index.css                   # Tailwind base + custom styles
```

---

## General Notes

### Path Alias

`@/` resolves to `src/`. TypeScript strict mode is **off** (`strict: false`, `strictNullChecks: false`, `noImplicitAny: false`).

### UI Components

`src/components/ui/` contains shadcn/ui components — don't modify these directly; use the shadcn CLI to add/update them. Custom app components live in `src/components/`. Form schemas with Zod are in `src/schemas/`.

### Category Colors

The database stores Tailwind class names (e.g. `bg-rose-200`) as the `color` field on categories. **Do not use these class names directly in JSX.** Always resolve them via `getCategoryColor(colorClass)` or `getCategoryBgStyle(colorClass)` from `src/lib/categoryColors.ts`, which maps class names to OKLCH color values for perceptual uniformity.

### Service Worker Cache Busting

After any mutation that changes data visible via GET routes, call `bustSwCache(...paths)` from `src/lib/swCacheBust.ts` to purge the relevant entries from the Service Worker's `api-responses` cache. Without this, admins will see stale cached responses even after their own writes. Pass partial URL paths — e.g. `bustSwCache('/api/categories')`. See `useCategories.ts` for the pattern.

### vercel.json

**Rewrites:** Routes `/api/*` to serverless functions; everything else falls back to `index.html` (SPA).

**Cache headers (CDN):**
| Route | Cache |
|---|---|
| `/sw.js` | No cache (must-revalidate) |
| `/assets/*`, `/uploads/*` | 1 year, immutable |
| `/api/categories`, `/api/recipe/:id`, `/api/category/:slug`, `/api/recipes/recommended` | 1h s-maxage, 24h stale-while-revalidate |
| `/api/recipes/search` | 60s s-maxage, 5m stale-while-revalidate |

### PWA / Service Worker

Configured in `vite.config.ts` via `VitePWA`. The SW is disabled in dev mode (`devOptions.enabled: false`). Runtime caching strategies:
- Google Fonts CSS: `StaleWhileRevalidate`
- Google Fonts `.woff2` files: `CacheFirst` (1 year)
- Vercel Blob images (`*.public.blob.vercel-storage.com`): `CacheFirst` (30 days, up to 100 entries)
- All `/api/*` GET responses: `StaleWhileRevalidate` (cache name: `api-responses`, 7-day max age)

### Build Chunks

`vite.config.ts` splits the bundle into manual chunks for long-lived caching:
- `vendor-react` — react, react-dom
- `vendor-query` — @tanstack/react-query, react-router-dom
- `vendor-clerk` — @clerk/clerk-react
- `vendor-ui` — major Radix UI components

### Tailwind Custom Theme

Custom additions in `tailwind.config.ts`:
- **Fonts:** `fredoka`, `frank-ruhl-libre` (loaded from Google Fonts)
- **Colors:** `pastelYellow`, `pastelBlue`, `pastelOrange`, `pastelGreen`, `coral`, `choco`, `off-white`
- **Border radius:** lg = 1.25rem, md = 0.75rem, sm = 0.5rem

Custom color classes are safelisted so Tailwind does not purge them when they are generated dynamically (e.g. from DB values).

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

### E2E Tests

Playwright tests in `e2e/` cover:
- **home.spec.ts** — Page title, RTL/Hebrew attributes, header, search button, categories, recommended recipes
- **recipe.spec.ts** — Navigation to recipe from recommended list, direct URL access, access from category page
- **search.spec.ts** — Search dialog open/close, typing shows results, Ctrl+K shortcut
- **category.spec.ts** — Category page behavior

Tests run against a live deployment URL set via `BASE_URL` env var (see `.github/workflows/e2e.yml`). The Playwright config uses Hebrew locale and Jerusalem timezone.

### Scripts

- **`scripts/neon-schema.sql`** — Canonical DDL for the full database schema
- **`scripts/seed-shakshuka.mjs`** — Seeds the Shakshuka recipe with full details (transactional)
- **`scripts/migrate-images-to-blob.mjs`** — One-off migration: re-uploads Supabase images to Vercel Blob and updates DB URLs
