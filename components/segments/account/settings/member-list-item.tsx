"use client";

import MemberAvatar from "./member-avatar";
import MemberRoleBadge from "./member-role-badge";
import type {
  StudioMember,
  MemberRole,
} from "@/types/studio";

type MemberListItemProps = {
  member: StudioMember;
  currentUserEmail?: string;
  isOwner: boolean;
  canManageMembers: boolean;
  isRemoving: boolean;
  onRoleChange: (
    memberId: string,
    role: MemberRole
  ) => void;
  onRemove: (memberId: string) => void;
};

export default function MemberListItem({
  member,
  currentUserEmail,
  isOwner,
  canManageMembers,
  isRemoving,
  onRoleChange,
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
              <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">
                You
              </span>
            )}
          </div>
          <span className="text-sm text-neutral-500 font-whisper">
            {member.email}
          </span>
        </div>
      </div>

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
  );
}
