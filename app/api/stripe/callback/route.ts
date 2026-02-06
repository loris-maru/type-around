import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { stripe, APP_URL } from "@/lib/stripe/config";
import { updateStudioStripeAccountId } from "@/lib/firebase/studios";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // Contains the studio ID
  const error = searchParams.get("error");
  const errorDescription = searchParams.get(
    "error_description"
  );

  // Build redirect URL - go back to account settings
  const redirectUrl = new URL(
    `${APP_URL}/account/${state}`
  );
  redirectUrl.searchParams.set("nav", "stripe");

  // Handle OAuth errors (user denied access, etc.)
  if (error) {
    console.error(
      "Stripe OAuth error:",
      error,
      errorDescription
    );
    redirectUrl.searchParams.set(
      "stripe_error",
      errorDescription || error
    );
    return NextResponse.redirect(redirectUrl.toString());
  }

  // Validate required parameters
  if (!code) {
    redirectUrl.searchParams.set(
      "stripe_error",
      "No authorization code received"
    );
    return NextResponse.redirect(redirectUrl.toString());
  }

  if (!state) {
    redirectUrl.searchParams.set(
      "stripe_error",
      "Invalid state parameter"
    );
    return NextResponse.redirect(redirectUrl.toString());
  }

  try {
    // Exchange the authorization code for an access token and connected account ID
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    });

    const stripeAccountId = response.stripe_user_id;

    if (!stripeAccountId) {
      redirectUrl.searchParams.set(
        "stripe_error",
        "No Stripe account ID received"
      );
      return NextResponse.redirect(redirectUrl.toString());
    }

    // Save the Stripe account ID to Firestore
    await updateStudioStripeAccountId(
      state,
      stripeAccountId
    );

    // Redirect back with success
    redirectUrl.searchParams.set("stripe_success", "true");
    return NextResponse.redirect(redirectUrl.toString());
  } catch (err) {
    console.error(
      "Error exchanging Stripe OAuth code:",
      err
    );

    const errorMessage =
      err instanceof Error
        ? err.message
        : "Failed to connect Stripe account";
    redirectUrl.searchParams.set(
      "stripe_error",
      errorMessage
    );

    return NextResponse.redirect(redirectUrl.toString());
  }
}
