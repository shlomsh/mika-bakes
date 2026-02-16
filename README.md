# Mika Bakes

A Hebrew-language recipe management app for Mika's baking recipes. Built with React, TypeScript, and Vite, deployed on Vercel.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| UI | shadcn/ui, Tailwind CSS, Radix UI |
| Auth | Clerk (Google OAuth) |
| Database | Neon Postgres (serverless) |
| Storage | Vercel Blob (recipe images) |
| API | Vercel Serverless Functions |
| State | TanStack React Query v5 |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |

## Development

### Install dependencies

```bash
npm install
```

### Full-stack local dev

Run two processes in separate terminals:

```bash
# Terminal 1 — API routes (Vercel serverless functions + env vars)
vercel dev -l 3001

# Terminal 2 — Frontend (Vite, proxies /api to :3001)
npm run dev
```

Then open http://localhost:5173.

> **Note:** `vercel dev` alone doesn't work for local dev — its SPA rewrite intercepts Vite's internal dev routes. The two-process setup is the recommended approach.

### E2E Tests

```bash
npm run test:e2e
```

Playwright E2E tests live in `e2e/` and run automatically against Vercel preview deployments via GitHub Actions (`.github/workflows/e2e.yml`).

## Environment Variables

| Variable | Where used |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Browser (Vite exposes `VITE_*`) |
| `CLERK_SECRET_KEY` | API routes only |
| `DATABASE_URL` | API routes only (auto-injected by Neon Vercel integration) |
| `BLOB_READ_WRITE_TOKEN` | API routes only (auto-injected by Vercel Blob) |

## Deployment

Deployed on Vercel. Push to `main` to trigger a production deployment.

- Build command: `npm run build`
- Output directory: `dist`
