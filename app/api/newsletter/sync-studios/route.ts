import { NextResponse } from "next/server";
import { getAllStudiosForDisplay } from "@/lib/firebase/studios";
import {
  ensureStudioTag,
  listStudioSegments,
} from "@/lib/mailchimp";

/**
 * POST /api/newsletter/sync-studios
 *
 * Fetches all studios from Firebase and ensures each has a
 * corresponding Mailchimp segment/tag.
 */
export async function POST() {
  try {
    const studios = await getAllStudiosForDisplay();
    const existingSegments = await listStudioSegments();
    const existingNames = new Set(
      existingSegments.map((s) =>
        s.name.replace("Studio: ", "")
      )
    );

    const created: string[] = [];
    const skipped: string[] = [];
    const failed: string[] = [];

    for (const studio of studios) {
      if (existingNames.has(studio.name)) {
        skipped.push(studio.name);
        continue;
      }

      const result = await ensureStudioTag(studio.name);
      if (result.success) {
        created.push(studio.name);
      } else {
        failed.push(studio.name);
      }
    }

    return NextResponse.json({
      success: true,
      total: studios.length,
      created,
      skipped,
      failed,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to sync studios.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/newsletter/sync-studios
 *
 * Lists all existing studio segments in Mailchimp.
 */
export async function GET() {
  try {
    const segments = await listStudioSegments();
    return NextResponse.json({ success: true, segments });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to list segments.",
      },
      { status: 500 }
    );
  }
}
