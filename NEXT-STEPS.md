# Next Steps

Your Supabase URL and anon key have been added to `.env.local`.

## Still Needed

Add your Supabase service role key to `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find it in Supabase:

Project Settings -> API -> Project API keys -> `service_role`

Keep this key private. It must not be exposed in browser code.

## Run Supabase Storage SQL

If you have not already done this, run:

```sql
-- supabase/storage.sql
```

This creates the `stock-images` public bucket and storage policies.

## Start CLIP Service

From `clip-service`:

```bash
pip install -r requirements.txt
pip install C:/Users/andvee/Downloads/CLIP-main/CLIP-main
uvicorn app:app --host 0.0.0.0 --port 8000
```

The first run may download the CLIP model weights.

## Start Next.js

From the project root:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
