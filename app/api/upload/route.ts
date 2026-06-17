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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const studioId = formData.get("studioId") as
      | string
      | null;
    const folder = formData.get("folder") as string | null;

    if (!file || !studioId || !folder) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: file, studioId, folder",
        },
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

    const sanitizedName = file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );
    const uniqueFileName = `${crypto.randomUUID()}_${sanitizedName}`;
    const filePath = `studios/${studioId}/${folder}/${uniqueFileName}`;

    const storage = getStorageClient();
    const bucket = storage.bucket(BUCKET_NAME);
    const gcFile = bucket.file(filePath);

    const buffer = Buffer.from(await file.arrayBuffer());
    await gcFile.save(buffer, {
      metadata: {
        contentType:
          file.type || "application/octet-stream",
      },
      resumable: false,
    });

    try {
      await gcFile.makePublic();
    } catch {
      // Uniform bucket-level access is enabled; public access must be
      // configured via bucket IAM (allUsers → Storage Object Viewer).
    }

    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${filePath}`;

    return NextResponse.json({ publicUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload file",
      },
      { status: 500 }
    );
  }
}
