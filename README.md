This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Feedback scheduling (Nylas)

The Feedbacks section in account/typefaces uses [Nylas Scheduler](https://www.nylas.com/products/scheduler/) for appointment booking.

### Creating configs for Eunyou, Noheul, and Loris

**Option A: Scheduler Editor (recommended)**

1. Add `NEXT_PUBLIC_NYLAS_CLIENT_ID` to `.env.local` (from [Nylas Dashboard](https://dashboard.nylas.com)).
2. In Nylas Dashboard → Application → Redirect URIs, add:
   - `http://localhost:3000/account/[your-account-id]/scheduler-setup` (dev)
   - Your production URL + `/account/[id]/scheduler-setup`
3. Visit `/account/[your-id]/scheduler-setup` in your app.
4. Each designer (Eunyou, Noheul, Loris) connects their calendar and creates their config.
5. Copy each config ID and add to `.env.local`:

```env
NEXT_PUBLIC_NYLAS_CONFIG_EUNYOU_NOH=<config_id_from_editor>
NEXT_PUBLIC_NYLAS_CONFIG_NOHEUL_LEE=<config_id_from_editor>
NEXT_PUBLIC_NYLAS_CONFIG_LORIS_OLIVIER=<config_id_from_editor>
```

**Option B: Script (when you have grant IDs)**

If each designer has already connected their calendar, you can create configs via API:

```bash
# Add to .env.local:
NYLAS_API_KEY=your_api_key
NYLAS_GRANT_EUNYOU=grant_id_for_eunyou
NYLAS_GRANT_NOHEUL=grant_id_for_noheul
NYLAS_GRANT_LORIS=grant_id_for_loris

node --env-file=.env.local scripts/create-nylas-configs.mjs
```

### Env vars reference

```env
NEXT_PUBLIC_NYLAS_CLIENT_ID=...        # Required for Scheduler Editor
NEXT_PUBLIC_NYLAS_CONFIG_EUNYOU_NOH=... # Config ID for Eunyou
NEXT_PUBLIC_NYLAS_CONFIG_NOHEUL_LEE=... # Config ID for Noheul
NEXT_PUBLIC_NYLAS_CONFIG_LORIS_OLIVIER=... # Config ID for Loris
NEXT_PUBLIC_NYLAS_SCHEDULER_API_URL=https://api.us.nylas.com  # Optional
```

Without config IDs, the form falls back to a mock calendar.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
