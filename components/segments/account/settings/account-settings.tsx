"use client";

import { useUser } from "@clerk/nextjs";
import { useMemo, useState } from "react";
import { RiLoaderLine } from "react-icons/ri";
import {
  removeStudioMember,
  updateMemberIsReviewer,
  updateMemberRole,
} from "@/actions/members";
import {
  ButtonAddMember,
  ButtonDismissError,
} from "@/components/molecules/buttons";
import { useStudio } from "@/hooks/use-studio";
import type {
  MemberRole,
  StudioMember,
} from "@/types/studio";
import AddMemberForm from "./add-member-form";
import MemberListItem from "./member-list-item";

export default function AccountSettings() {
  const { user } = useUser();
  const {
    studio,
    isLoading: studioLoading,
    updateStudio,
  } = useStudio();
  const [isAddingMember, setIsAddingMember] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<
    string | null
  >(null);

  const currentUserEmail =
    user?.primaryEmailAddress?.emailAddress;
  const isOwner = studio?.ownerEmail === currentUserEmail;
  const currentMember = studio?.members?.find(
    (m) => m.email === currentUserEmail
  );
  const isAdmin = currentMember?.role === "admin";
  const canManageMembers = isOwner || isAdmin;

  // Combine owner with members for display
  const allMembers = useMemo(() => {
    if (!studio) return [];

    const ownerEmailLower = studio.ownerEmail.toLowerCase();

    // Check if owner exists in members array (to reuse their profile data)
    const ownerInMembers = (studio.members || []).find(
      (m) => m.email.toLowerCase() === ownerEmailLower
    );

    // Use Clerk user data if current user is the owner, or data from members entry
    const ownerMember: StudioMember = {
      id: `owner-${studio.id}`,
      email: studio.ownerEmail,
      firstName:
        ownerInMembers?.firstName || user?.firstName || "",
      lastName:
        ownerInMembers?.lastName || user?.lastName || "",
      imageUrl:
        ownerInMembers?.imageUrl || user?.imageUrl || "",
      role: "owner",
      addedAt: "",
      isReviewer: false,
    };

    // Filter out the owner and deduplicate by email (case-insensitive)
    const seenEmails = new Set<string>([ownerEmailLower]);
    const nonOwnerMembers = (studio.members || []).filter(
      (m) => {
        const emailLower = m.email.toLowerCase();
        if (seenEmails.has(emailLower)) return false;
        seenEmails.add(emailLower);
        return true;
      }
    );

    return [ownerMember, ...nonOwnerMembers];
  }, [studio, user]);

  const handleRemoveMember = async (memberId: string) => {
    if (!studio) return;

    setRemovingMemberId(memberId);

    const result = await removeStudioMember(
      studio.id,
      memberId
    );

    if (result.success && result.members) {
      await updateStudio({ members: result.members });
    } else {
      setError(result.error || "Failed to remove member");
    }

    setRemovingMemberId(null);
  };

  const handleRoleChange = async (
    memberId: string,
    role: MemberRole
  ) => {
    if (!studio) return;

    const result = await updateMemberRole(
      studio.id,
      memberId,
      role
    );

    if (result.success && result.members) {
      await updateStudio({ members: result.members });
    } else {
      setError(result.error || "Failed to update role");
    }
  };

  const handleIsReviewerChange = async (
    memberId: string,
    isReviewer: boolean
  ) => {
    if (!studio) return;

    const result = await updateMemberIsReviewer(
      studio.id,
      memberId,
      isReviewer
    );

    if (result.success && result.members) {
      await updateStudio({ members: result.members });
    } else {
      setError(
        result.error || "Failed to update reviewer status"
      );
    }
  };

  const handleMemberAdded = async (
    members: StudioMember[]
  ) => {
    await updateStudio({ members });
    setIsAddingMember(false);
  };

  const handleCancelAddMember = () => {
    setIsAddingMember(false);
    setError(null);
  };

  if (studioLoading) {
    return (
      <div className="relative flex w-full items-center justify-center py-12">
        <RiLoaderLine className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-col items-start gap-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="mb-2 font-bold font-ortank text-xl">
            Team Members
          </h2>
          <p className="font-whisper text-neutral-500">
            Manage who has access to edit your studio
            account and content.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 font-bold text-white text-xs">
            !
          </div>
          <p className="font-whisper text-red-800">
            {error}
          </p>
          <ButtonDismissError
            onClick={() => setError(null)}
          />
        </div>
      )}

      {/* Members List */}
      <div className="w-full divide-y divide-neutral-200">
        {allMembers.map((member) => (
          <MemberListItem
            key={member.id}
            member={member}
            currentUserEmail={currentUserEmail}
            isOwner={isOwner}
            canManageMembers={canManageMembers}
            isRemoving={removingMemberId === member.id}
            onRoleChange={handleRoleChange}
            onIsReviewerChange={handleIsReviewerChange}
            onRemove={handleRemoveMember}
          />
        ))}
      </div>

      {/* Add Member Form */}
      {canManageMembers && isAddingMember && studio && (
        <AddMemberForm
          studio={studio}
          onMemberAdded={handleMemberAdded}
          onCancel={handleCancelAddMember}
          onError={setError}
        />
      )}

      {/* Add Member Button (shown when not adding) */}
      <div className="flex w-full justify-end">
        <ButtonAddMember
          onClick={() => setIsAddingMember(true)}
        />
      </div>
    </div>
  );
}
