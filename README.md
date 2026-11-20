# VIA LOCAL

Vite + React frontend with a serverless guide-inquiry API and a private admin dashboard.

## Run locally
```bash
npm install
npm run dev
```

## Guide request backend setup (required before requests can be saved)
1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/guide_requests.sql`.
3. In Vercel Project Settings → Environment Variables, set these for Production (and Preview if you want test deployments):
   - `SUPABASE_URL`: your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: service-role key (keep secret; never expose it in Vite/client variables)
   - `ADMIN_PASSWORD`: choose a strong password of at least 12 characters
   - `ADMIN_SESSION_SECRET`: a random secret of at least 32 characters
4. Redeploy after saving the variables.

The public form submits to `/api/guide-requests`. Requests are stored in Supabase and appear in the private dashboard at `/admin`. Admin sign-in is handled by a server API and an HttpOnly, Secure, SameSite cookie. No public database access policy is enabled; API routes use the server-only service role key.

## Admin dashboard
- Separate route: `/admin`
- Arabic/English
- Request search, counts, status management, request details, delete, and CSV export
- Refreshes the list every 30 seconds
- Statuses: New, Reviewing, Accepted, Completed, Rejected

## Important
The sample guide profiles are illustrative placeholders, not actual service providers. Submitting a request is an inquiry only; it does not confirm a tour. The database and secure environment variables must be configured before the form can store requests. Do not commit credentials to GitHub.
