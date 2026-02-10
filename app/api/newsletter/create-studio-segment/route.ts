import { NextResponse } from "next/server";
import { ensureStudioTag } from "@/lib/mailchimp";

/**
 * POST /api/newsletter/create-studio-segment
 *
 * Creates a Mailchimp segment/tag for a studio.
 * Called when a studio is created or renamed.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      studioName?: string;
    };

    if (
      !body.studioName ||
      typeof body.studioName !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "studioName is required.",
        },
        { status: 400 }
      );
    }

    const result = await ensureStudioTag(body.studioName);

    return NextResponse.json({
      success: result.success,
      name: result.name,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create studio segment.",
      },
      { status: 500 }
    );
  }
}
