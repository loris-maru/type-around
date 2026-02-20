"use client";

import type { MemberListItemProps } from "@/types/components";
import MemberAvatar from "./member-avatar";
import MemberRoleBadge from "./member-role-badge";

export default function MemberListItem({
  member,
  currentUserEmail,
  isOwner,
  canManageMembers,
  isRemoving,
  onRoleChange,
  onIsReviewerChange,
  onRemove,
}: MemberListItemProps) {
  const displayName =
    member.firstName && member.lastName
      ? `${member.firstName} ${member.lastName}`
      : member.email;

  const isCurrentUser = member.email === currentUserEmail;

  return (
    <div className="w-full flex items-center justify-between py-4">
      <div className="w-full flex items-center gap-4">
        <MemberAvatar
          imageUrl={member.imageUrl}
          name={displayName}
          size="md"
        />

        <div>
          <div className="flex items-center gap-2">
            <span className="font-whisper font-medium">
              {displayName}
            </span>
            {isCurrentUser && (
              <span className="text-xs bg-white px-4 py-2 rounded-2xl text-black">
                You
              </span>
            )}
          </div>
          <span className="text-sm text-neutral-500 font-whisper">
            {member.email}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {canManageMembers &&
          member.role !== "owner" &&
          onIsReviewerChange && (
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={member.isReviewer ?? false}
                onChange={(e) =>
                  onIsReviewerChange(
                    member.id,
                    e.target.checked
                  )
                }
                className="h-4 w-4 rounded border-neutral-300"
              />
              <span className="font-whisper text-neutral-600 text-sm">
                Reviewer
              </span>
            </label>
          )}
        <MemberRoleBadge
          role={member.role}
          isOwner={isOwner}
          canManageMembers={canManageMembers}
          isRemoving={isRemoving}
          onRoleChange={
            member.role !== "owner"
              ? (role) => onRoleChange(member.id, role)
              : undefined
          }
          onRemove={
            member.role !== "owner"
              ? () => onRemove(member.id)
              : undefined
          }
        />
      </div>
    </div>
  );
}
