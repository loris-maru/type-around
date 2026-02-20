import { expect, test } from "@playwright/test";

test.describe("Purchase flow", () => {
  test.describe("Order page", () => {
    test("redirects to home when token is missing", async ({
      page,
    }) => {
      await page.goto("/order/test-order-id");
      await expect(page).toHaveURL("/");
    });

    test("shows 'Order not found' for invalid token", async ({
      page,
    }) => {
      await page.goto(
        "/order/test-order-id?token=invalid-token"
      );
      await expect(
        page.getByRole("heading", {
          name: /order not found/i,
        })
      ).toBeVisible();
      await expect(
        page.getByText(
          /does not exist or the link has expired/i
        )
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: /back to studio/i })
      ).toBeVisible();
    });
  });

  test.describe("Checkout - redirect when not signed in", () => {
    test("redirects to sign-up when visiting checkout without auth", async ({
      page,
    }) => {
      await page.goto("/checkout");
      await expect(page).toHaveURL(/\/sign-up/);
      await expect(page).toHaveURL(
        /redirect_url=.*%2Fcheckout/
      );
    });
  });

  test.describe("Checkout - empty cart redirect", () => {
    test("redirects away from checkout when cart is empty or user not signed in", async ({
      page,
    }) => {
      await page.goto("/checkout");
      // Wait for redirect: not signed in -> sign-up, or signed in + empty cart -> studio
      await expect(page).toHaveURL(/\/(studio|sign-up)/, {
        timeout: 10000,
      });
    });
  });

  test.describe("Cart and checkout flow", () => {
    test("navigate to studios, studio, typeface, add to cart, open cart panel", async ({
      page,
    }) => {
      await page.goto("/studios");

      // Wait for studios to load
      const studioCard = page
        .getByRole("link", { name: /.*/ })
        .first();
      await expect(studioCard).toBeVisible({
        timeout: 10000,
      });

      // Click first studio link (studio cards link to /studio/[slug])
      const firstStudioLink = page
        .locator('a[href^="/studio/"]')
        .first();
      const studioCount = await firstStudioLink.count();
      if (studioCount === 0) {
        test.skip(
          true,
          "No studios available - skipping cart flow test"
        );
      }

      await firstStudioLink.click();
      await expect(page).toHaveURL(/\/studio\/[^/]+$/);

      // Find first typeface link (TypefaceLine wraps content in Link to /studio/.../typeface/...)
      const typefaceLink = page
        .locator('a[href*="/typeface/"]')
        .first();
      const typefaceCount = await typefaceLink.count();
      if (typefaceCount === 0) {
        test.skip(
          true,
          "No typefaces available - skipping cart flow test"
        );
      }

      await typefaceLink.click();
      await expect(page).toHaveURL(
        /\/studio\/.+\/typeface\/.+/
      );

      // Add to cart - find button with aria-label "Add X to cart"
      const addToCartBtn = page
        .getByRole("button", { name: /add .+ to cart/i })
        .first();
      const addBtnCount = await addToCartBtn.count();
      if (addBtnCount === 0) {
        test.skip(
          true,
          "No add-to-cart button (no shop) - skipping"
        );
      }

      await addToCartBtn.click();

      // Cart button should appear in nav (only visible when cartCount > 0)
      const cartButton = page.getByRole("button", {
        name: /open cart/i,
      });
      await expect(cartButton).toBeVisible({
        timeout: 3000,
      });

      // Open cart panel
      await cartButton.click();

      // Cart panel should show items
      await expect(
        page.getByRole("heading", { name: /cart \(\d+\)/i })
      ).toBeVisible();
      await expect(
        page.getByRole("button", {
          name: /proceed to checkout/i,
        })
      ).toBeVisible();
    });

    test("add to cart, remove item, clear cart", async ({
      page,
    }) => {
      await page.goto("/studios");

      const studioLink = page
        .locator('a[href^="/studio/"]')
        .first();
      if ((await studioLink.count()) === 0) {
        test.skip(true, "No studios available");
      }
      await studioLink.click();

      const typefaceLink = page
        .locator('a[href*="/typeface/"]')
        .first();
      if ((await typefaceLink.count()) === 0) {
        test.skip(true, "No typefaces available");
      }
      await typefaceLink.click();

      const addToCartBtn = page
        .getByRole("button", { name: /add .+ to cart/i })
        .first();
      if ((await addToCartBtn.count()) === 0) {
        test.skip(true, "No add-to-cart button");
      }
      await addToCartBtn.click();

      // Add second item if available
      const secondAddBtn = page
        .getByRole("button", { name: /add .+ to cart/i })
        .nth(1);
      if ((await secondAddBtn.count()) > 0) {
        await secondAddBtn.click();
      }

      await page
        .getByRole("button", { name: /open cart/i })
        .click();

      // Remove first item
      const removeBtn = page
        .getByRole("button", {
          name: /remove .+ from cart/i,
        })
        .first();
      await removeBtn.click();

      // Clear cart
      await page
        .getByRole("button", { name: /clear cart/i })
        .click();

      // Cart should show empty state
      await expect(
        page.getByText(/your cart is empty/i)
      ).toBeVisible();

      // Cart button should disappear from nav
      await expect(
        page.getByRole("button", { name: /open cart/i })
      ).not.toBeVisible();
    });

    test("checkout from cart redirects to sign-up when not signed in", async ({
      page,
    }) => {
      await page.goto("/studios");

      const studioLink = page
        .locator('a[href^="/studio/"]')
        .first();
      if ((await studioLink.count()) === 0) {
        test.skip(true, "No studios available");
      }
      await studioLink.click();

      const typefaceLink = page
        .locator('a[href*="/typeface/"]')
        .first();
      if ((await typefaceLink.count()) === 0) {
        test.skip(true, "No typefaces available");
      }
      await typefaceLink.click();

      const addToCartBtn = page
        .getByRole("button", { name: /add .+ to cart/i })
        .first();
      if ((await addToCartBtn.count()) === 0) {
        test.skip(true, "No add-to-cart button");
      }
      await addToCartBtn.click();

      await page
        .getByRole("button", { name: /open cart/i })
        .click();
      await page
        .getByRole("button", {
          name: /proceed to checkout/i,
        })
        .click();

      // Should redirect to sign-up with checkout redirect
      await expect(page).toHaveURL(/\/sign-up/);
      await expect(page).toHaveURL(
        /redirect_url=.*%2Fcheckout/
      );
    });
  });
});
