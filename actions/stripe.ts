"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import {
  stripe,
  STRIPE_CLIENT_ID,
  getStripeRedirectUri,
} from "@/lib/stripe/config";
import { getStudioByEmail } from "@/lib/firebase/studios";

export type StripeConnectResult = {
  success: boolean;
  url?: string;
  error?: string;
  isConnected?: boolean;
};

/**
 * Get Stripe Connect URL for the current user
 * - If not connected: returns OAuth authorization URL
 * - If connected: returns Stripe Login Link for dashboard access
 */
export async function getStripeConnectURL(): Promise<StripeConnectResult> {
  try {
    // Get the current authenticated user
    const { userId } = await auth();
    const user = await currentUser();

    if (
      !userId ||
      !user?.emailAddresses?.[0]?.emailAddress
    ) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const email = user.emailAddresses[0].emailAddress;

    // Fetch the studio from Firestore
    const studio = await getStudioByEmail(email);

    if (!studio) {
      return {
        success: false,
        error:
          "Studio not found. Please set up your studio first.",
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

    const redirectUri = getStripeRedirectUri();

    // Generate Stripe OAuth URL for Standard Connect accounts
    const oauthUrl = new URL(
      "https://connect.stripe.com/oauth/authorize"
    );
    oauthUrl.searchParams.set("response_type", "code");
    oauthUrl.searchParams.set(
      "client_id",
      STRIPE_CLIENT_ID
    );
    oauthUrl.searchParams.set("scope", "read_write");
    oauthUrl.searchParams.set("redirect_uri", redirectUri);
    // Pass the studio ID as state to identify the user on callback
    oauthUrl.searchParams.set("state", studio.id);

    return {
      success: true,
      url: oauthUrl.toString(),
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
