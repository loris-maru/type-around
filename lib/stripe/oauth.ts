/**
 * Stripe Connect OAuth URL builder.
 * Extracted for testability.
 */
export function buildStripeConnectOAuthUrl(
  clientId: string,
  redirectUri: string,
  state: string
): string {
  const url = new URL(
    "https://connect.stripe.com/oauth/v2/authorize"
  );
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("scope", "read_write");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  return url.toString();
}

export function isValidConnectClientId(
  clientId: string | undefined
): boolean {
  if (!clientId) return false;
  return (
    clientId.startsWith("ca_") &&
    !clientId.startsWith("acct_")
  );
}
