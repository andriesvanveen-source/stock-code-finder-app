# Stock Code Finder

A Next.js + Supabase MVP for finding store stock codes from item photos.

## What It Does

- Record known parts with photos, stock codes, and descriptions.
- Generate CLIP image embeddings through a Python FastAPI service.
- Store images in Supabase Storage and embeddings in Postgres with `pgvector`.
- Search for likely stock-code matches from a new photo.

## Local Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Run `supabase/storage.sql` in the Supabase SQL editor, or create a public Storage bucket named `stock-images`.
4. Copy `.env.example` to `.env.local` and fill in values.
5. Start the CLIP service:

```bash
cd clip-service
pip install -r requirements.txt
pip install C:/Users/andvee/Downloads/CLIP-main/CLIP-main
uvicorn app:app --host 0.0.0.0 --port 8000
```

6. Start the Next.js app:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment Shape

- Deploy the Next.js app to Vercel.
- Keep Supabase hosted.
- Deploy `clip-service` on a Python-capable server. GPU is best, CPU is acceptable for an MVP.

Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only.
