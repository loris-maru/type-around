"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import {
  stripe,
  STRIPE_CLIENT_ID,
  getStripeRedirectUri,
} from "@/lib/stripe/config";
import {
  buildStripeConnectOAuthUrl,
  isValidConnectClientId,
} from "@/lib/stripe/oauth";
import {
  getStudioById,
  getStudiosByUserEmail,
} from "@/lib/firebase/studios";

export type StripeConnectResult = {
  success: boolean;
  url?: string;
  error?: string;
  isConnected?: boolean;
};

/**
 * Get Stripe Connect URL for the current user and studio
 * - If not connected: returns OAuth authorization URL
 * - If connected: returns Stripe Login Link for dashboard access
 * @param studioId - Studio ID (from account URL). User must have access.
 */
export async function getStripeConnectURL(
  studioId: string
): Promise<StripeConnectResult> {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    const email =
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress;

    if (!userId || !email) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    // Verify user has access to this studio (owner or member)
    const userStudios = await getStudiosByUserEmail(email);
    const hasAccess = userStudios.some(
      (s) => s.id === studioId
    );
    if (!hasAccess) {
      return {
        success: false,
        error: "You do not have access to this studio.",
      };
    }

    const studio = await getStudioById(studioId);
    if (!studio) {
      return {
        success: false,
        error: "Studio not found.",
      };
    }

    // Check if studio has a Stripe account connected
    if (studio.stripeAccountId) {
      // User is already connected - generate a login link to Stripe dashboard
      try {
        const loginLink =
          await stripe.accounts.createLoginLink(
            studio.stripeAccountId
          );

        return {
          success: true,
          url: loginLink.url,
          isConnected: true,
        };
      } catch (stripeError) {
        // If login link fails (e.g., account was deleted), treat as not connected
        console.error(
          "Failed to create login link:",
          stripeError
        );
        return {
          success: false,
          error:
            "Your Stripe account connection is invalid. Please reconnect.",
          isConnected: false,
        };
      }
    }

    // User is not connected - generate OAuth authorization URL
    if (!STRIPE_CLIENT_ID) {
      return {
        success: false,
        error: "Stripe client ID is not configured",
      };
    }

    // Validate: Connect client_id should be ca_..., not acct_... (account ID)
    if (!isValidConnectClientId(STRIPE_CLIENT_ID)) {
      return {
        success: false,
        error:
          "Invalid Stripe client ID. Use the Connect platform client ID (ca_...) from Dashboard → Connect → Settings, not your account ID (acct_...).",
      };
    }

    const redirectUri = getStripeRedirectUri();
    const oauthUrl = buildStripeConnectOAuthUrl(
      STRIPE_CLIENT_ID,
      redirectUri,
      studio.id
    );

    return {
      success: true,
      url: oauthUrl,
      isConnected: false,
    };
  } catch (error) {
    console.error(
      "Error getting Stripe Connect URL:",
      error
    );
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
    };
  }
}
