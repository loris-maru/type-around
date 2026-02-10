import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/mailchimp";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      studioTag?: string;
    };

    const { email, studioTag } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address.",
        },
        { status: 400 }
      );
    }

    const result = await subscribeToNewsletter(
      email,
      studioTag
    );

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
