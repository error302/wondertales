# Deployment

## Current state: local only. No public URL yet.

## Reproduce locally

```bash
cd wondertales
npm install
npm run dev      # http://localhost:3000
```

No API keys, accounts, or network access needed after install. Production
mode: `npm run build && npm run start`.

## Recommended hosting (needs owner approval)

Any static-friendly Next.js host (Vercel, Netlify, Cloudflare Pages). The app
is fully static today (`/`, `/adventure`, `/_not-found` prerendered, no API
routes), so deployment is a plain `next build` with no env vars and no
services. Estimated cost: free tier.

Suggested steps when approved:

1. Push `main` to GitHub.
2. Connect the repo to the host with default Next.js settings.
3. No environment variables required (AI is off; M4 will add server-only vars).
4. Verify: landing loads, full adventure plays, reload resumes, no console
   errors, mobile viewport clean.
5. Record the public URL in README and HACKATHON_SUBMISSION.md.

## Operational notes

- No database, no migrations, no secrets rotation (nothing secret exists yet).
- Progress lives in the visitor's browser; clearing site data resets it.
- `check:no-secrets` must stay green before every push.
