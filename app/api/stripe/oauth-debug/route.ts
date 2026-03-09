import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  STRIPE_CLIENT_ID,
  getStripeRedirectUri,
} from "@/lib/stripe/config";

/**
 * Debug route to diagnose Stripe OAuth 400 errors.
 * Fetches the authorize URL and returns Stripe's response.
 * Protected - requires auth.
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const redirectUri = getStripeRedirectUri();
    const clientId = STRIPE_CLIENT_ID;

    if (!clientId) {
      return NextResponse.json({
        error: "NEXT_PUBLIC_STRIPE_CLIENT_ID not set",
        redirectUri,
      });
    }

    const oauthUrl = new URL(
      "https://connect.stripe.com/oauth/v2/authorize"
    );
    oauthUrl.searchParams.set("response_type", "code");
    oauthUrl.searchParams.set("client_id", clientId);
    oauthUrl.searchParams.set("scope", "read_write");
    oauthUrl.searchParams.set("redirect_uri", redirectUri);
    oauthUrl.searchParams.set("state", "debug");

    const res = await fetch(oauthUrl.toString(), {
      redirect: "manual",
      headers: { Accept: "application/json" },
    });

    const contentType =
      res.headers.get("content-type") || "";
    let body: unknown = null;
    if (contentType.includes("application/json")) {
      body = await res.json();
    } else {
      body = await res.text();
    }

    return NextResponse.json({
      status: res.status,
      redirectUri,
      clientIdPrefix: clientId.slice(0, 5) + "...",
      url: oauthUrl.toString(),
      stripeResponse: body,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}
