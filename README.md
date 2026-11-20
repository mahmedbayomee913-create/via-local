# VIA LOCAL

Vite + React frontend with a serverless guide-inquiry API and a private admin dashboard.

## Run locally
```bash
npm install
npm run dev
```

## Guide request backend setup
1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/guide_requests.sql`.
3. In Vercel Project Settings → Environment Variables, set these for Production (and Preview/Development if needed):
   - `SUPABASE_URL`: your Supabase project URL
   - `SUPABASE_ANON_KEY`: the project's legacy anon key (public key; safe to expose only when paired with the RLS rules below)
   - `VIA_LOCAL_DB_SECRET`: the matching server-only secret; never expose it in Vite/client variables or commit it to Git
   - `ADMIN_PASSWORD`: choose a strong password of at least 12 characters
   - `ADMIN_SESSION_SECRET`: a random secret of at least 32 characters
4. Redeploy after saving the variables.

The public form submits to `/api/guide-requests`. Requests are stored in Supabase and appear in the private dashboard at `/admin`. Admin sign-in is handled by a server API and an HttpOnly, Secure, SameSite cookie.

Database access uses the anon key plus a separate server-only secret checked by RLS. The secret hash is stored in the non-exposed `private` schema. The service-role key is not required by this implementation.

## Admin dashboard
- Separate route: `/admin`
- Arabic/English
- Request search, counts, status management, request details, delete, and CSV export
- Refreshes the list every 30 seconds
- Statuses: New, Reviewing, Accepted, Completed, Rejected

## Important
The sample guide profiles are illustrative placeholders, not actual service providers. Submitting a request is an inquiry only; it does not confirm a tour. The database and secure environment variables must be configured before the form can store requests. Do not commit credentials to GitHub.
