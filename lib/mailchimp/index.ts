import crypto from "node:crypto";
import mailchimp, { AUDIENCE_ID } from "./config";

/**
 * Hash an email address to an MD5 hash (Mailchimp subscriber ID format).
 */
function subscriberHash(email: string): string {
  return crypto
    .createHash("md5")
    .update(email.toLowerCase())
    .digest("hex");
}

/**
 * Subscribe an email to the main audience.
 * Optionally tag them with a studio name.
 */
export async function subscribeToNewsletter(
  email: string,
  studioTag?: string
): Promise<{ success: boolean; message: string }> {
  try {
    await mailchimp.lists.addListMember(AUDIENCE_ID, {
      email_address: email,
      status: "subscribed",
      ...(studioTag && {
        tags: [studioTag],
      }),
    });

    return {
      success: true,
      message: "Subscribed successfully.",
    };
  } catch (error: unknown) {
    const err = error as {
      status?: number;
      response?: {
        body?: { title?: string; detail?: string };
      };
    };

    // Member already exists — update tags if needed
    if (
      err.status === 400 &&
      err.response?.body?.title === "Member Exists"
    ) {
      if (studioTag) {
        await addTagsToSubscriber(email, [studioTag]);
      }
      return {
        success: true,
        message: "Already subscribed. Tags updated.",
      };
    }

    const detail =
      err.response?.body?.detail || "Unknown error";
    return { success: false, message: detail };
  }
}

/**
 * Add tags to an existing subscriber.
 */
export async function addTagsToSubscriber(
  email: string,
  tags: string[]
): Promise<void> {
  const hash = subscriberHash(email);
  await mailchimp.lists.updateListMemberTags(
    AUDIENCE_ID,
    hash,
    {
      tags: tags.map((name) => ({
        name,
        status: "active",
      })),
    }
  );
}

/**
 * Create a Mailchimp segment (saved search) for a given studio name.
 * Uses tags to define the segment: anyone tagged with the studio name.
 *
 * Note: The @types/mailchimp__mailchimp_marketing package does not include
 * type definitions for segment methods, but they exist at runtime.
 */
export async function createStudioSegment(
  studioName: string
): Promise<{ id: number; name: string }> {
  const lists = mailchimp.lists as unknown as {
    createSegment: (
      listId: string,
      body: object
    ) => Promise<{ id: number; name: string }>;
  };
  const response = await lists.createSegment(AUDIENCE_ID, {
    name: `Studio: ${studioName}`,
    options: {
      match: "all",
      conditions: [
        {
          condition_type: "StaticSegment",
          field: "static_segment",
          op: "static_is",
          value: studioName,
        },
      ],
    },
  });

  return { id: response.id, name: response.name };
}

/**
 * Ensure a tag exists for a studio. Mailchimp creates tags
 * on-the-fly when assigned to subscribers, so we create a
 * temporary subscriber-less segment as a bookmark.
 */
export async function ensureStudioTag(
  studioName: string
): Promise<{ success: boolean; name: string }> {
  try {
    await createStudioSegment(studioName);
    return { success: true, name: studioName };
  } catch (error: unknown) {
    const err = error as {
      response?: { body?: { detail?: string } };
    };
    return {
      success: false,
      name:
        err.response?.body?.detail ||
        "Failed to create segment",
    };
  }
}

/**
 * List all segments (studio-related ones have "Studio: " prefix).
 *
 * Note: The @types/mailchimp__mailchimp_marketing package does not include
 * type definitions for segment methods, but they exist at runtime.
 */
export async function listStudioSegments(): Promise<
  Array<{ id: number; name: string; memberCount: number }>
> {
  type SegmentEntry = {
    id: number;
    name: string;
    member_count: number;
  };
  const lists = mailchimp.lists as unknown as {
    listSegments: (
      listId: string,
      opts: { count: number }
    ) => Promise<{ segments: SegmentEntry[] }>;
  };
  const response = await lists.listSegments(AUDIENCE_ID, {
    count: 100,
  });

  return response.segments
    .filter((s) => s.name.startsWith("Studio: "))
    .map((s) => ({
      id: s.id,
      name: s.name,
      memberCount: s.member_count,
    }));
}
