import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in environment variables"
  );
}

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY,
  {
    apiVersion: "2025-12-15.clover",
    typescript: true,
  }
);

// Stripe Connect OAuth configuration
export const STRIPE_CLIENT_ID =
  process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID;
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

// Generate the OAuth redirect URI
export const getStripeRedirectUri = () =>
  `${APP_URL}/api/stripe/callback`;
