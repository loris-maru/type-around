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
    <div className="flex w-full flex-col py-5">
      <div className="flex w-full items-start justify-between gap-4">
        {/* Left: Avatar + identity + biography */}
        <div className="flex w-full items-start gap-4">
          <MemberAvatar
            imageUrl={member.imageUrl}
            name={
              `${member.firstName} ${member.lastName}`.trim() ||
              member.email
            }
            size={isProfileExpanded ? "md" : "xl"}
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-3">
              <span className="swiss-h3 text-swiss-ink">
                {member.firstName} {member.lastName}
              </span>
              {isCurrentUser && (
                <span className="swiss-label text-swiss-red">
                  You
                </span>
              )}
            </div>
            <span className="swiss-num text-neutral-500 text-sm">
              {member.email}
            </span>
            {member.biography?.trim() && (
              <p className="swiss-body mt-2 text-neutral-600 text-sm">
                {member.biography}
              </p>
            )}
          </div>
        </div>

        {/* Right: Role dropdown, edit button, delete button */}
        <div className="flex shrink-0 items-center gap-4">
          {member.role === "owner" ? (
            <span className="swiss-label border border-swiss-ink px-3 py-2 text-swiss-ink">
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
            <span className="swiss-label border border-swiss-rule px-3 py-2 text-neutral-600">
              {ROLE_LABELS[member.role]}
            </span>
          )}
          {canEditProfile &&
            (onProfileUpdate || onError) && (
              <button
                type="button"
                onClick={() =>
                  setIsProfileExpanded((prev) => !prev)
                }
                className="flex h-9 w-9 items-center justify-center border border-swiss-rule text-neutral-500 transition-colors hover:border-swiss-ink hover:text-swiss-ink"
                title="Edit member profile"
                aria-label="Edit member profile"
              >
                <RiEditLine className="h-4 w-4" />
              </button>
            )}
          {canManageMembers && member.role !== "owner" && (
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={isRemoving}
              className="flex h-9 w-9 items-center justify-center border border-swiss-rule text-neutral-500 transition-colors hover:border-swiss-red hover:text-swiss-red disabled:opacity-50"
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
          <div className="swiss-rule-light mt-5 pt-5">
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
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 cursor-default bg-black/50"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div
            className="relative mx-4 w-full max-w-sm border border-swiss-ink bg-white p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-member-title"
          >
            <h3
              id="delete-member-title"
              className="swiss-h2 mb-3"
            >
              Delete member
            </h3>
            <p className="swiss-body mb-8 text-neutral-600">
              Are you sure you want to delete the member?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="swiss-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isRemoving}
                className="swiss-btn swiss-btn-red"
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
