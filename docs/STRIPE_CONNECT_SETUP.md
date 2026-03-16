# Stripe Connect Setup

For studios to receive payments when customers buy fonts, each studio must connect their own Stripe account.

## 1. Stripe Dashboard Configuration

### Connect Platform Settings

1. Go to [Stripe Dashboard → Connect → Settings](https://dashboard.stripe.com/settings/connect/onboarding-options/oauth)
2. Copy your **Connect platform client ID** (starts with `ca_`)

### Redirect URIs (Required)

Add your redirect URIs in the same Connect settings page:

- **Local development:** `http://localhost:3000/api/stripe/callback`
- **Production:** `https://yourdomain.com/api/stripe/callback`

> ⚠️ The redirect URI must match **exactly** (including protocol and path). A 400 error usually means the URI is not registered.

**Common mistakes:**

- No trailing slash: use `/api/stripe/callback` not `/api/stripe/callback/`
- Correct protocol: `http` for localhost, `https` for production
- Test vs Live: redirect URIs are per platform; ensure you're in the right mode (test/live) in the Dashboard

## 2. Environment Variables

Add to `.env.local`:

```env
# Stripe Connect (from Dashboard → Connect → Settings)
NEXT_PUBLIC_STRIPE_CLIENT_ID=ca_xxxxxxxxxxxxx

# App URL (used for OAuth redirect)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Use the **Connect client ID** (`ca_...`), not your Stripe account ID (`acct_...`).
> **No trailing slash:** Use `https://type-around.xyz` not `https://type-around.xyz/` — a trailing slash can produce a double slash in the redirect URI and cause Stripe to return 400.

## 3. Debugging a 400 Error

If you get an HTTP 400 when clicking "Connect with Stripe":

1. **Check the exact error** – While signed in, open:

   ```
   http://localhost:3000/api/stripe/oauth-debug
   ```

   This returns the redirect URI we use and Stripe's response (including `error` and `error_description`).

2. **Verify client_id matches test/live mode** – Your `NEXT_PUBLIC_STRIPE_CLIENT_ID` must match the client ID shown in the Dashboard for the mode you're using:
   - **Test mode**: Toggle "Test mode" ON (top right), then go to [Connect settings](https://dashboard.stripe.com/test/settings/connect/onboarding-options/oauth). Copy the client ID shown there.
   - **Live mode**: Toggle "Test mode" OFF, then go to the same path. Use that client ID.
   - Test and live have different client IDs. If you added the redirect URI in test mode, your `.env` must have the **test** client ID.

3. **Verify redirect URI in Stripe** – In the same Connect settings page (with the correct test/live toggle), add:

   ```
   http://localhost:3000/api/stripe/callback
   ```

   No trailing slash. Click Save. The value must match exactly what the debug endpoint shows for `redirectUri`.

4. **Browser Network tab** – On the 400 request, open the Response tab. Stripe returns JSON with `error` (e.g. `invalid_redirect_uri`) and `error_description`.

## 4. CSP / Favicon Warnings

The "img-src blocked" and favicon warnings on Stripe's OAuth page (`connect.stripe.com`) come from Stripe's own CSP, not this app. They are cosmetic and do not affect the Connect flow.

## 5. Connect Flow

1. Studio owner/admin goes to Account → Stripe
2. Clicks "Connect with Stripe"
3. Completes Stripe OAuth
4. Redirected back with success

Once connected, payments for that studio's fonts go directly to their Stripe account.
