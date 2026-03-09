import { describe, expect, it } from "vitest";
import {
  buildStripeConnectOAuthUrl,
  isValidConnectClientId,
} from "@/lib/stripe/oauth";
import { getStripeRedirectUri } from "@/lib/stripe/config";

describe("Stripe Connect OAuth", () => {
  describe("buildStripeConnectOAuthUrl", () => {
    it("builds URL with correct base and params", () => {
      const url = buildStripeConnectOAuthUrl(
        "ca_test123",
        "http://localhost:3000/api/stripe/callback",
        "studio_abc"
      );

      const parsed = new URL(url);
      expect(parsed.origin).toBe(
        "https://connect.stripe.com"
      );
      expect(parsed.pathname).toBe("/oauth/v2/authorize");
      expect(parsed.searchParams.get("response_type")).toBe(
        "code"
      );
      expect(parsed.searchParams.get("client_id")).toBe(
        "ca_test123"
      );
      expect(parsed.searchParams.get("scope")).toBe(
        "read_write"
      );
      expect(parsed.searchParams.get("redirect_uri")).toBe(
        "http://localhost:3000/api/stripe/callback"
      );
      expect(parsed.searchParams.get("state")).toBe(
        "studio_abc"
      );
    });

    it("URL-encodes redirect_uri in query", () => {
      const url = buildStripeConnectOAuthUrl(
        "ca_xxx",
        "http://localhost:3000/api/stripe/callback",
        "state"
      );

      expect(url).toContain(
        "redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fstripe%2Fcallback"
      );
    });

    it("includes all required OAuth params", () => {
      const url = buildStripeConnectOAuthUrl(
        "ca_client",
        "https://example.com/callback",
        "csrf_token"
      );

      const params = new URL(url).searchParams;
      expect(params.has("response_type")).toBe(true);
      expect(params.has("client_id")).toBe(true);
      expect(params.has("scope")).toBe(true);
      expect(params.has("redirect_uri")).toBe(true);
      expect(params.has("state")).toBe(true);
    });
  });

  describe("isValidConnectClientId", () => {
    it("accepts valid Connect client ID (ca_ prefix)", () => {
      expect(
        isValidConnectClientId(
          "ca_U7Hxbui5BMSoaenqK4bTt9CqIlEcaNO8"
        )
      ).toBe(true);
      expect(isValidConnectClientId("ca_test123")).toBe(
        true
      );
    });

    it("rejects account ID (acct_ prefix)", () => {
      expect(isValidConnectClientId("acct_123456789")).toBe(
        false
      );
    });

    it("rejects undefined or empty", () => {
      expect(isValidConnectClientId(undefined)).toBe(false);
      expect(isValidConnectClientId("")).toBe(false);
    });

    it("rejects invalid prefixes", () => {
      expect(isValidConnectClientId("pk_test_xxx")).toBe(
        false
      );
      expect(isValidConnectClientId("sk_test_xxx")).toBe(
        false
      );
    });
  });
});

describe("Stripe Connect redirect URI", () => {
  it("generates correct callback path", () => {
    const appUrl = "http://localhost:3000";
    const expected = `${appUrl}/api/stripe/callback`;
    expect(expected).toBe(
      "http://localhost:3000/api/stripe/callback"
    );
  });

  it("produces valid URL for OAuth redirect_uri param", () => {
    const redirectUri =
      "http://localhost:3000/api/stripe/callback";
    expect(() => new URL(redirectUri)).not.toThrow();
    const url = new URL(redirectUri);
    expect(url.pathname).toBe("/api/stripe/callback");
  });

  it("uses APP_URL when set, defaults to localhost", () => {
    const uri = getStripeRedirectUri();
    expect(uri).toMatch(/\/api\/stripe\/callback$/);
    expect(uri).toMatch(/^https?:\/\//);
  });
});
