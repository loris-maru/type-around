"use client";

import { useState } from "react";
import {
  RiLoaderLine,
  RiUserAddLine,
} from "react-icons/ri";
import MemberAvatar from "./member-avatar";
import { ROLE_DESCRIPTIONS } from "@/constant/MEMBER_ROLES";
import {
  lookupUserByEmail,
  addStudioMember,
} from "@/actions/members";
import type { AddMemberFormProps } from "@/types/components";
import type {
  StudioMember,
  MemberRole,
} from "@/types/studio";

export default function AddMemberForm({
  studio,
  onMemberAdded,
  onCancel,
  onError,
}: AddMemberFormProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [lookupResult, setLookupResult] =
    useState<StudioMember | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLookupUser = async () => {
    if (!inviteEmail.trim()) return;

    setIsLookingUp(true);
    setLookupResult(null);

    const result = await lookupUserByEmail(
      inviteEmail.trim()
    );

    if (result.success && result.member) {
      const foundMember = result.member;
      const foundEmailLower =
        foundMember.email.toLowerCase();
      const existingMember = studio.members?.find(
        (m) =>
          m.email.toLowerCase() === foundEmailLower ||
          m.id === foundMember.id
      );
      if (existingMember) {
        onError(
          "This user is already a member of your studio"
        );
      } else if (
        foundEmailLower === studio.ownerEmail.toLowerCase()
      ) {
        onError("This is the owner's email address");
      } else {
        setLookupResult(foundMember);
      }
    } else {
      onError(result.error || "User not found");
    }

    setIsLookingUp(false);
  };

  const handleAddMember = async () => {
    if (!lookupResult) return;

    setIsSubmitting(true);

    const result = await addStudioMember(
      studio.id,
      lookupResult
    );

    if (result.success && result.members) {
      onMemberAdded(result.members);
    } else {
      onError(result.error || "Failed to add member");
    }

    setIsSubmitting(false);
  };

  const handleRoleChange = (role: MemberRole) => {
    if (lookupResult) {
      setLookupResult({ ...lookupResult, role });
    }
  };

  const displayName =
    lookupResult?.firstName && lookupResult?.lastName
      ? `${lookupResult.firstName} ${lookupResult.lastName}`
      : lookupResult?.email || "";

  return (
    <div className="border border-neutral-200 rounded-lg p-6">
      <h3 className="font-ortank font-bold text-sm mb-4">
        Invite a new member
      </h3>

      {/* Step 1: Email lookup */}
      {!lookupResult && (
        <div className="flex gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter email address..."
            className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg font-whisper placeholder:text-neutral-400"
            onKeyDown={(e) =>
              e.key === "Enter" && handleLookupUser()
            }
          />
          <button
            type="button"
            onClick={handleLookupUser}
            disabled={isLookingUp || !inviteEmail.trim()}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed font-whisper font-medium flex items-center gap-2"
          >
            {isLookingUp ? (
              <>
                <RiLoaderLine className="w-4 h-4 animate-spin" />
                Looking up...
              </>
            ) : (
              "Find User"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 font-whisper"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Step 2: Confirm user */}
      {lookupResult && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
            <MemberAvatar
              imageUrl={lookupResult.imageUrl}
              name={displayName}
              size="lg"
            />
            <div>
              <p className="font-whisper font-medium">
                {displayName}
              </p>
              <p className="text-sm text-neutral-500 font-whisper">
                {lookupResult.email}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={lookupResult.role}
              onChange={(e) =>
                handleRoleChange(
                  e.target.value as MemberRole
                )
              }
              className="px-4 py-3 border border-neutral-300 rounded-lg font-whisper"
            >
              <option value="editor">
                Editor - {ROLE_DESCRIPTIONS.editor}
              </option>
              <option value="admin">
                Admin - {ROLE_DESCRIPTIONS.admin}
              </option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleAddMember}
              disabled={isSubmitting}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed font-whisper font-medium flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RiLoaderLine className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <RiUserAddLine className="w-4 h-4" />
                  Add Member
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 font-whisper"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 text-sm text-neutral-500 font-whisper">
        The user must have an existing account to be added
        as a member.
      </p>
    </div>
  );
}
