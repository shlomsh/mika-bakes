# Mika Bakes

A recipe management app for Mika's baking recipes. Built with React, TypeScript, Vite, shadcn/ui, and Supabase.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS, Radix UI
- **Backend**: Supabase (database + auth + storage)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Hosting**: Vercel

## Development

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

This project is deployed on Vercel. Push to `main` to trigger a deployment.

Build command: `npm run build`
Output directory: `dist`
