"use client";

import {
  RiDeleteBinLine,
  RiEditLine,
  RiLoaderLine,
  RiShieldUserLine,
} from "react-icons/ri";
import CustomSelect from "@/components/global/custom-select";
import {
  ROLE_LABELS,
  ROLE_OPTIONS,
} from "@/constant/MEMBER_ROLES";
import type { MemberRoleBadgeProps } from "@/types/components";
import type { MemberRole } from "@/types/studio";

export default function MemberRoleBadge({
  role,
  isOwner,
  canManageMembers,
  isRemoving,
  onRoleChange,
  onRemove,
}: MemberRoleBadgeProps) {
  if (role === "owner") {
    return (
      <div className="flex items-center gap-2 border border-swiss-ink px-3 py-2">
        <RiShieldUserLine className="w-4 h-4 text-black" />
        <span className="swiss-label text-swiss-ink">
          Owner
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {isOwner && onRoleChange ? (
        <CustomSelect
          value={role}
          options={ROLE_OPTIONS}
          onChange={(val) =>
            onRoleChange(val as MemberRole)
          }
        />
      ) : (
        <div className="flex items-center gap-2 border border-swiss-rule px-3 py-2">
          {role === "admin" ? (
            <RiShieldUserLine className="w-4 h-4 text-neutral-500" />
          ) : (
            <RiEditLine className="w-4 h-4 text-neutral-500" />
          )}
          <span className="swiss-label text-neutral-600">
            {ROLE_LABELS[role]}
          </span>
        </div>
      )}

      {canManageMembers && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          disabled={isRemoving}
          className="flex h-9 w-9 items-center justify-center border border-swiss-rule text-neutral-500 transition-colors hover:border-swiss-red hover:text-swiss-red disabled:opacity-50"
          title="Remove member"
        >
          {isRemoving ? (
            <RiLoaderLine className="w-4 h-4 animate-spin" />
          ) : (
            <RiDeleteBinLine className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}
