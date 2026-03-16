# Payment Migration: Stripe → Toss + PayPal

This document describes the migration from Stripe to a dual-provider system (Toss Payments for Korea, PayPal for International).

## Environment Variables

Add these to `.env.local`:

```env
# Toss Payments (Korea)
NEXT_PUBLIC_TOSS_CLIENT_KEY=your_toss_client_key
TOSS_SECRET_KEY=your_toss_secret_key

# PayPal (International)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# App URL (existing)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Webhook URLs

Configure these in each provider's dashboard:

- **Toss**: `https://your-domain.com/api/webhooks/toss`
- **PayPal**: `https://your-domain.com/api/webhooks/paypal`

Subscribe to:

- Toss: `PAYMENT_STATUS_CHANGED` (status: DONE)
- PayPal: `PAYMENT.CAPTURE.COMPLETED`

## Schema Changes

### Studio

- Removed: `stripeAccountId`
- Added: `tossSubMerchantId`, `paypalEmail`

### Order

- Removed: `stripePaymentIntentId`, `stripeSessionId`
- Added: `paymentProvider`, `tossPaymentKey`, `paypalOrderId`

## Checkout Flow

1. User adds fonts to cart → clicks "Proceed to checkout"
2. Redirected to `/checkout`
3. User chooses:
   - **Local Payment**: Toss/KakaoPay/Naver Pay/Card → Toss SDK opens → redirect to success URL → server confirms → download
   - **Global Payment**: PayPal Smart Buttons → create order → approve → capture → download

## Account → Payments

Designers configure payout details at Account → Payments:

- **Toss Sub-merchant ID**: For local (KRW) settlements
- **PayPal Email**: For international (USD) settlements

## KRW to USD Conversion

PayPal uses USD. The rate is configured in `constant/KRW_TO_USD_RATE.ts` (default: 1300). Update periodically for production.
