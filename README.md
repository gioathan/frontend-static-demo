# Frontend Static Demo

Standalone Next.js copy of Running Trips for visual review and redesign work.
Pages use in-memory fixture data; no backend, database, Redis, Docker, or API
service is required.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The public site supports English and Greek.

## Mock behavior

- Trip listings, detail pages, categories, and marketing sections are served
  from `src/lib/mock-data.ts`.
- `src/lib/mock-backend.ts` handles the app's reads and form submissions in
  memory. Changes are temporary and reset when the server restarts.
- Login accepts any email and password and uses a demo runner account.
- Stripe checkout is represented by a fake payment intent; it does not charge
  a card.

The `.env.local` file is not needed. `.env.example` lists optional frontend
settings for image hosting and sign-in integrations.