"use client";

import { useState } from "react";
import {
  RiDeleteBinLine,
  RiEditLine,
  RiLoaderLine,
} from "react-icons/ri";
import CustomSelect from "@/components/global/custom-select";
import {
  ROLE_LABELS,
  ROLE_OPTIONS,
} from "@/constant/MEMBER_ROLES";
import type { MemberListItemProps } from "@/types/components";
import type { MemberRole } from "@/types/studio";
import MemberAvatar from "./member-avatar";
import MemberProfileEdit from "./member-profile-edit";

export default function MemberListItem({
  member,
  currentUserEmail,
  canManageMembers,
  canEditProfile,
  isRemoving,
  studioId,
  onRoleChange,
  onRemove,
  onProfileUpdate,
  onError,
}: MemberListItemProps) {
  const [isProfileExpanded, setIsProfileExpanded] =
    useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const isCurrentUser = member.email === currentUserEmail;

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onRemove(member.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex w-full flex-col py-4">
      <div className="flex w-full items-center justify-between">
        {/* Left: Avatar, First name, Last name, email */}
        <div className="flex w-full items-center gap-4">
          <MemberAvatar
            imageUrl={member.imageUrl}
            name={
              `${member.firstName} ${member.lastName}`.trim() ||
              member.email
            }
            size="md"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium font-whisper text-black">
                {member.firstName} {member.lastName}
              </span>
              {isCurrentUser && (
                <span className="rounded-2xl bg-white px-4 py-2 text-black text-xs">
                  You
                </span>
              )}
            </div>
            <span className="font-whisper text-neutral-500 text-sm">
              {member.email}
            </span>
          </div>
        </div>

        {/* Right: Role dropdown, edit button (own row), delete button */}
        <div className="flex shrink-0 items-center gap-2">
          {member.role === "owner" ? (
            <span className="font-medium font-whisper text-black">
              {ROLE_LABELS.owner}
            </span>
          ) : canManageMembers && onRoleChange ? (
            <CustomSelect
              value={
                member.role === "editor"
                  ? "member"
                  : member.role
              }
              options={ROLE_OPTIONS}
              onChange={(val) =>
                onRoleChange(member.id, val as MemberRole)
              }
            />
          ) : (
            <span className="font-medium font-whisper text-black">
              {ROLE_LABELS[member.role]}
            </span>
          )}
          {isCurrentUser &&
            canEditProfile &&
            (onProfileUpdate || onError) && (
              <button
                type="button"
                onClick={() =>
                  setIsProfileExpanded((prev) => !prev)
                }
                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-black"
                title="Edit profile"
                aria-label="Edit profile"
              >
                <RiEditLine className="h-4 w-4" />
              </button>
            )}
          {canManageMembers && member.role !== "owner" && (
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={isRemoving}
              className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
              title="Remove member"
            >
              {isRemoving ? (
                <RiLoaderLine className="h-4 w-4 animate-spin" />
              ) : (
                <RiDeleteBinLine className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Profile edit section (toggled by edit button) */}
      {canEditProfile &&
        (onProfileUpdate || onError) &&
        isProfileExpanded && (
          <div className="mt-3 pl-14">
            <MemberProfileEdit
              member={member}
              studioId={studioId}
              onSaved={(members) =>
                onProfileUpdate?.(members)
              }
              onError={(err) => onError?.(err)}
            />
          </div>
        )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-modal flex items-center justify-center overflow-hidden">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click to dismiss */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop click to dismiss */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div
            className="relative mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-member-title"
          >
            <h3
              id="delete-member-title"
              className="mb-2 font-bold font-ortank text-lg"
            >
              Delete member
            </h3>
            <p className="mb-6 font-whisper text-neutral-600 text-sm">
              Are you sure you want to delete the member?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-neutral-300 px-4 py-2 font-medium font-whisper transition-colors hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isRemoving}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium font-whisper text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRemoving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
