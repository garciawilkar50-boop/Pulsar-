# Pulsar

Pulsar is a social network prototype built around **pulses** (short posts) and **resonances** (reactions). It intentionally avoids follower counts and follow buttons.

## Stack
- Next.js App Router + TypeScript
- Supabase Auth, Postgres and Row Level Security
- Responsive dark-first UI with solid colors (no gradients)

## Local setup
1. Install Node.js 20.9+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in your Supabase project URL and publishable/anon key.
4. In the Supabase SQL Editor, run `supabase/schema.sql`.
5. In Supabase Authentication > URL Configuration, set the Site URL and add `http://localhost:3000/auth/callback` and your production `/auth/callback` URL to allowed redirects.
6. In Authentication > Providers, enable Google and/or GitHub and configure credentials.
7. Run `npm run dev` and open http://localhost:3000.

## Deploy
Import this repository into Vercel, add the environment variables, update Supabase Site URL and allowed redirects, then deploy.

## Current scope
This is an MVP foundation: OAuth, pulse creation, feed, resonances, profile editing and database policies. Configure OAuth credentials before expecting sign-in to work. No service-role key is needed for this MVP.

## Security
Never expose a Supabase service-role key in client-side code. Review moderation, rate limits, reporting, email verification and privacy requirements before public launch.