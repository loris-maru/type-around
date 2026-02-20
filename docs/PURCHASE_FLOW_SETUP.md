# Purchase Flow Setup

## Overview

The purchase flow has been implemented with the following steps:

1. **Cart** – User adds font items from typeface shop pages
2. **Checkout** – User clicks "Checkout" in cart panel
3. **Auth** – If not signed in → Clerk sign-up → redirect back to checkout
4. **Stripe** – User completes payment on Stripe Checkout page
5. **Webhook** – On payment success: order updated in Firebase, email sent via Postmark
6. **Download** – User lands on `/order/[orderId]?token=xxx` with purchase list and download button

## Environment Variables

Add these to `.env.local`:

```env
# Postmark (email)
POSTMARK_SERVER_TOKEN=your_postmark_server_token
POSTMARK_FROM_EMAIL=orders@yourdomain.com

# Stripe webhook (for payment success)
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Firebase Setup

1. Create a Firestore database named **"orders"** in Firebase Console (if not already done)
2. The `orders` collection will store order documents with: id, userId, email, items, totalCents, status, downloadToken, createdAt

## Stripe Webhook Setup

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to local: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Copy the webhook signing secret (`whsec_...`) to `STRIPE_WEBHOOK_SECRET`
5. For production, create a webhook endpoint in Stripe Dashboard pointing to `https://yourdomain.com/api/stripe/webhook` with event `checkout.session.completed`

## Postmark Setup

1. Create a Postmark account: https://postmarkapp.com
2. Create a server and get the API token
3. Add `POSTMARK_SERVER_TOKEN` and `POSTMARK_FROM_EMAIL` to env

## Routes

- `/checkout` – Initiates checkout (redirects to Stripe or sign-up)
- `/order/[orderId]?token=xxx` – Order download page (requires valid token)
- `/sign-up` – Clerk sign-up (supports `?redirect_url=/checkout`)

## Tests

- **Unit tests** (Vitest): `pnpm test`
- **E2E tests** (Playwright): `pnpm test:e2e`

E2E tests cover: order page (invalid token, missing token), checkout redirect when not signed in, and the full cart flow (add to cart, remove, clear, checkout redirect) when studios and typefaces are available.
