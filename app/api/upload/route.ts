import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Storage } from "@google-cloud/storage";
import { getStudioById } from "@/lib/firebase/studios";

function getStorageClient() {
  const credentials = process.env.GOOGLE_CLOUD_CREDENTIALS;

  if (!credentials) {
    throw new Error(
      "GOOGLE_CLOUD_CREDENTIALS environment variable is not set"
    );
  }

  const parsedCredentials = JSON.parse(credentials);

  return new Storage({
    projectId: parsedCredentials.project_id,
    credentials: parsedCredentials,
  });
}

const BUCKET_NAME =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  "type-around.firebasestorage.app";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { studioId, fileName, contentType, folder } =
      body;

    if (!studioId || !fileName || !contentType || !folder) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify user has access to this studio
    const studio = await getStudioById(studioId);
    if (!studio) {
      return NextResponse.json(
        { error: "Studio not found" },
        { status: 404 }
      );
    }

    // Check if user is owner or member
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const userEmail =
      user.primaryEmailAddress?.emailAddress;

    const isOwner = studio.ownerEmail === userEmail;
    const isMember = studio.members?.some(
      (m) => m.email === userEmail
    );

    if (!isOwner && !isMember) {
      return NextResponse.json(
        { error: "You don't have access to this studio" },
        { status: 403 }
      );
    }

    // Generate unique file path
    const fileExtension = fileName.split(".").pop() || "";
    const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `studios/${studioId}/${folder}/${uniqueFileName}`;

    // Get signed URL
    const storage = getStorageClient();
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(filePath);

    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    });

    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${filePath}`;

    return NextResponse.json({
      uploadUrl: signedUrl,
      publicUrl,
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate upload URL",
      },
      { status: 500 }
    );
  }
}
