"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  getStudioByEmail,
  updateStudio,
} from "@/lib/firebase/studios";
import type {
  StudioMember,
  MemberRole,
} from "@/types/studio";

export type MemberActionResult = {
  success: boolean;
  error?: string;
  member?: StudioMember;
  members?: StudioMember[];
};

/**
 * Look up a Clerk user by email address
 */
export async function lookupUserByEmail(
  email: string
): Promise<MemberActionResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const clerk = await clerkClient();
    const users = await clerk.users.getUserList({
      emailAddress: [email],
    });

    if (users.data.length === 0) {
      return {
        success: false,
        error:
          "No user found with this email. They must have a Clerk account first.",
      };
    }

    const user = users.data[0];
    const primaryEmail = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    );

    return {
      success: true,
      member: {
        id: user.id,
        email: primaryEmail?.emailAddress || email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        imageUrl: user.imageUrl || "",
        role: "editor",
        addedAt: new Date().toISOString(),
        isReviewer: false,
      },
    };
  } catch (error) {
    console.error("Error looking up user:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to look up user",
    };
  }
}

/**
 * Add a member to the studio
 */
export async function addStudioMember(
  studioId: string,
  member: StudioMember
): Promise<MemberActionResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Get the current user's email to verify they own the studio
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const currentEmail = currentUser.emailAddresses.find(
      (e) => e.id === currentUser.primaryEmailAddressId
    )?.emailAddress;

    if (!currentEmail) {
      return {
        success: false,
        error: "Could not verify your identity",
      };
    }

    // Fetch the studio
    const studio = await getStudioByEmail(currentEmail);
    if (!studio) {
      return { success: false, error: "Studio not found" };
    }

    // Check if user is owner or admin
    const isOwner = studio.ownerEmail === currentEmail;
    const currentMember = studio.members?.find(
      (m) => m.id === userId
    );
    const isAdmin = currentMember?.role === "admin";

    if (!isOwner && !isAdmin) {
      return {
        success: false,
        error: "You don't have permission to add members",
      };
    }

    // Check if member already exists (by ID or email, case-insensitive)
    const memberEmailLower = member.email.toLowerCase();
    const existingMember = studio.members?.find(
      (m) =>
        m.id === member.id ||
        m.email.toLowerCase() === memberEmailLower
    );
    if (existingMember) {
      return {
        success: false,
        error: "This user is already a member",
      };
    }

    // Check if trying to add the owner (case-insensitive)
    if (
      memberEmailLower === studio.ownerEmail.toLowerCase()
    ) {
      return {
        success: false,
        error: "The owner is already a member by default",
      };
    }

    // Add the new member
    const updatedMembers = [
      ...(studio.members || []),
      member,
    ];
    await updateStudio(studioId, {
      members: updatedMembers,
    });

    return {
      success: true,
      members: updatedMembers,
    };
  } catch (error) {
    console.error("Error adding member:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to add member",
    };
  }
}

/**
 * Remove a member from the studio
 */
export async function removeStudioMember(
  studioId: string,
  memberId: string
): Promise<MemberActionResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Get the current user's email
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const currentEmail = currentUser.emailAddresses.find(
      (e) => e.id === currentUser.primaryEmailAddressId
    )?.emailAddress;

    if (!currentEmail) {
      return {
        success: false,
        error: "Could not verify your identity",
      };
    }

    // Fetch the studio
    const studio = await getStudioByEmail(currentEmail);
    if (!studio) {
      return { success: false, error: "Studio not found" };
    }

    // Check if user is owner or admin
    const isOwner = studio.ownerEmail === currentEmail;
    const currentMember = studio.members?.find(
      (m) => m.id === userId
    );
    const isAdmin = currentMember?.role === "admin";

    if (!isOwner && !isAdmin) {
      return {
        success: false,
        error:
          "You don't have permission to remove members",
      };
    }

    // Remove the member
    const updatedMembers = (studio.members || []).filter(
      (m) => m.id !== memberId
    );
    await updateStudio(studioId, {
      members: updatedMembers,
    });

    return {
      success: true,
      members: updatedMembers,
    };
  } catch (error) {
    console.error("Error removing member:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to remove member",
    };
  }
}

/**
 * Update a member's role
 */
export async function updateMemberRole(
  studioId: string,
  memberId: string,
  role: MemberRole
): Promise<MemberActionResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Get the current user's email
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const currentEmail = currentUser.emailAddresses.find(
      (e) => e.id === currentUser.primaryEmailAddressId
    )?.emailAddress;

    if (!currentEmail) {
      return {
        success: false,
        error: "Could not verify your identity",
      };
    }

    // Fetch the studio
    const studio = await getStudioByEmail(currentEmail);
    if (!studio) {
      return { success: false, error: "Studio not found" };
    }

    // Only owner can change roles
    const isOwner = studio.ownerEmail === currentEmail;
    if (!isOwner) {
      return {
        success: false,
        error: "Only the owner can change member roles",
      };
    }

    // Update the member's role
    const updatedMembers = (studio.members || []).map(
      (m) => (m.id === memberId ? { ...m, role } : m)
    );
    await updateStudio(studioId, {
      members: updatedMembers,
    });

    return {
      success: true,
      members: updatedMembers,
    };
  } catch (error) {
    console.error("Error updating member role:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update role",
    };
  }
}

/**
 * Update a member's isReviewer flag
 */
export async function updateMemberIsReviewer(
  studioId: string,
  memberId: string,
  isReviewer: boolean
): Promise<MemberActionResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const currentEmail = currentUser.emailAddresses.find(
      (e) => e.id === currentUser.primaryEmailAddressId
    )?.emailAddress;

    if (!currentEmail) {
      return {
        success: false,
        error: "Could not verify your identity",
      };
    }

    const studio = await getStudioByEmail(currentEmail);
    if (!studio) {
      return { success: false, error: "Studio not found" };
    }

    const isOwner = studio.ownerEmail === currentEmail;
    const currentMember = studio.members?.find(
      (m) => m.id === userId
    );
    const isAdmin = currentMember?.role === "admin";

    if (!isOwner && !isAdmin) {
      return {
        success: false,
        error:
          "You don't have permission to update members",
      };
    }

    const updatedMembers = (studio.members || []).map(
      (m) => (m.id === memberId ? { ...m, isReviewer } : m)
    );
    await updateStudio(studioId, {
      members: updatedMembers,
    });

    return {
      success: true,
      members: updatedMembers,
    };
  } catch (error) {
    console.error(
      "Error updating member isReviewer:",
      error
    );
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update reviewer status",
    };
  }
}
