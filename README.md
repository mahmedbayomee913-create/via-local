# VIA LOCAL

VIA LOCAL is an Arabic/English travel discovery and local-experience platform built with Vite, React, Vercel Functions, and Supabase.

## Run locally
```bash
npm install
npm run dev
```

## Production configuration
Set these in Vercel → Project Settings → Environment Variables for Production, Preview and Development:

- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_ANON_KEY`: Supabase legacy anon key. It is used by server functions only.
- `VIA_LOCAL_DB_SECRET`: server-only secret checked by the database RLS gate. Never expose it through Vite or client-side code.
- `ADMIN_PASSWORD`: unique admin password with at least 12 characters.
- `ADMIN_SESSION_SECRET`: random session-signing secret with at least 32 characters.

The service-role key is not required. Database requests are made by server routes using the anon key plus a separately encrypted server-only secret. The matching hash is stored in the non-exposed `private` schema, and the public tables have RLS enabled.

## Database setup
Run `supabase/guide_requests.sql` in Supabase SQL Editor on a fresh project. It creates the guide inquiry table, destination catalog, guides, experiences, bookings, reviews, user profiles, itineraries, digital passport visits, guide applications, favorites and protected RLS policies.

The deployed project currently has eight initial destination records in Oman. Guide, experience and booking records should be entered and reviewed by the site operator before being published.

## Included product features

### Public website
- Arabic/English interface and destination discovery.
- Live destination catalog loaded from Supabase, with filters and favorites.
- Destination details with embedded map search.
- Published local guide profiles.
- Trip planner that builds a starter itinerary from published destinations and experiences.
- Booking requests with server-calculated price totals and a pending status.
- Customer registration/sign-in through Supabase Auth, profile editing and booking history.
- VIA LOCAL digital passport: submit visited places, track moderation status and verified points.
- Reviews submitted for moderation; only approved reviews appear in the public catalog.
- Guide application form for local providers.
- Basic accessibility metadata fields for ramps, elevators, restrooms and other verified access features.

### Separate admin dashboard
- Private sign-in using an HttpOnly, Secure session cookie.
- Guide inquiry management, search, statuses, details, delete and CSV export.
- CMS CRUD for destinations, guides, experiences and content pages.
- Booking status management.
- Review moderation.
- Guide application review and approval; an approved application creates an unpublished guide profile that an admin can verify and publish.
- Content can be saved as a draft before it is visible publicly.

## Important integration boundaries

- The trip planner currently uses a local rules-based planner over published Supabase content. It does not call a paid external AI model yet.
- Maps are embedded location-search maps. Turn-by-turn routing, distance matrices and live transit require a mapping provider integration and its key.
- Booking requests are not paid reservations. They remain pending until the admin confirms them. No payment processor or refund automation is connected.
- Customer account emails depend on Supabase Auth email settings. For production volume, configure a trusted SMTP provider and the desired email-confirmation policy.
- Accessibility information must be verified by the operator before publishing. An empty field is not evidence that a place is accessible.
- Guide profiles are only real once reviewed and entered/approved by the operator. No placeholder provider should be presented as a verified service.
- Image fields currently accept image URLs. A managed upload workflow can be added when the chosen storage policy is confirmed.

Redeploy after changing environment variables. Never commit passwords, API secrets or private tokens to GitHub.
