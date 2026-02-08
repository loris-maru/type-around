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
      <div className="flex items-center gap-2 px-4 py-1.5 border border-neutral-300 rounded-3xl">
        <RiShieldUserLine className="w-4 h-4 text-black" />
        <span className="text-sm font-whisper font-medium text-black">
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
        <div className="flex items-center gap-2 px-6 py-1.5 bg-neutral-50 rounded-lg">
          {role === "admin" ? (
            <RiShieldUserLine className="w-4 h-4 text-neutral-500" />
          ) : (
            <RiEditLine className="w-4 h-4 text-neutral-500" />
          )}
          <span className="text-sm font-whisper text-neutral-600">
            {ROLE_LABELS[role]}
          </span>
        </div>
      )}

      {canManageMembers && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          disabled={isRemoving}
          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
