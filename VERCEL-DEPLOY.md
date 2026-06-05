# Deploying This App To Vercel

## Short Version

The Next.js web app can run on Vercel.

The CLIP service should not run on Vercel for this MVP because it uses PyTorch and downloads/loads a large model. Deploy that service separately, then set `CLIP_SERVICE_URL` in Vercel to the public URL of that service.

## Project Root

Use this repository root as the Vercel project root.

## Environment Variables In Vercel

Add these in:

Vercel Project -> Settings -> Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://eisrtplbgdpircthjosr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CLIP_SERVICE_URL=https://andries123-stocksearch.hf.space
```

Do not commit `.env.local` to GitHub.

## CLIP Service

The CLIP service is live at:

```text
https://andries123-stocksearch.hf.space
```

It exposes:

```text
POST /embed-image
GET /health
```

Use that value in Vercel as `CLIP_SERVICE_URL`.

## Vercel Import Flow

1. Go to Vercel.
2. Click `Add New` -> `Project`.
3. Import this GitHub repository.
4. Add the environment variables above.
5. Deploy.

Vercel will run:

```bash
npm install
npm run build
```

on its own servers, so your work computer does not need Node/npm installed.
