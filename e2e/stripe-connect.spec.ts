import { expect, test } from "@playwright/test";

/**
 * Stripe Connect E2E tests
 *
 * These tests verify the Connect with Stripe flow for studios.
 * Full OAuth flow requires real Stripe Connect setup (ca_ client ID).
 *
 * To run with auth: use storageState from a signed-in session.
 */
test.describe("Stripe Connect", () => {
  test("account page requires auth - redirects when not signed in", async ({
    page,
  }) => {
    await page.goto("/account/test-studio-id");
    await expect(page).toHaveURL(/\/sign-in|\/sign-up/);
  });

  test.describe("OAuth callback", () => {
    // Callback redirects to /account/{state}; unauthenticated users are then
    // redirected to Clerk sign-in with redirect_url containing our destination.
    test("handles error param - redirects with stripe_error", async ({
      page,
    }) => {
      await page.goto(
        "/api/stripe/callback?error=access_denied&error_description=User+denied&state=test-studio-id"
      );
      // Either on account page (signed in) or sign-in with redirect_url
      expect(page.url()).toContain("stripe_error");
      expect(page.url()).toContain("account");
    });

    test("handles missing code - redirects with error", async ({
      page,
    }) => {
      await page.goto(
        "/api/stripe/callback?state=test-studio-id"
      );
      expect(page.url()).toContain("stripe_error");
      expect(page.url()).toContain("account");
    });

    test("handles missing state - redirects with error", async ({
      page,
    }) => {
      await page.goto(
        "/api/stripe/callback?code=ac_test123"
      );
      // Without state, redirects to /account/null - we still get stripe_error
      expect(page.url()).toContain("stripe_error");
      expect(page.url()).toContain("account");
    });

    test("redirects to account with nav=stripe", async ({
      page,
    }) => {
      await page.goto(
        "/api/stripe/callback?error=invalid_scope&error_description=Bad+scope&state=studio-xyz"
      );
      expect(page.url()).toContain("stripe_error");
      expect(page.url()).toContain("studio-xyz");
      // redirect_url is URL-encoded: nav=stripe becomes nav%3Dstripe
      expect(
        page.url().includes("nav=stripe") ||
          page.url().includes("nav%3Dstripe")
      ).toBe(true);
    });
  });

  test.describe("OAuth debug endpoint", () => {
    test("oauth-debug requires auth - returns 401 when not signed in", async ({
      page,
    }) => {
      const res = await page.goto(
        "/api/stripe/oauth-debug"
      );
      expect(res?.status()).toBe(401);
    });
  });

  test.describe("Connect button (requires auth)", () => {
    test.skip("clicking Connect redirects to connect.stripe.com when signed in", async ({
      page,
    }) => {
      // Requires storageState from a signed-in session.
      // Run with: playwright test --project=chromium --grep "Connect button"
      await page.goto("/account/your-studio-id?nav=stripe");
      await page
        .getByRole("button", {
          name: /connect with stripe/i,
        })
        .click();
      await expect(page).toHaveURL(/connect\.stripe\.com/);
    });
  });
});
