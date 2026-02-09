"use client";

import { useState } from "react";
import {
  RiLoaderLine,
  RiUserAddLine,
} from "react-icons/ri";
import {
  addStudioMember,
  lookupUserByEmail,
} from "@/actions/members";
import { ROLE_DESCRIPTIONS } from "@/constant/MEMBER_ROLES";
import type { AddMemberFormProps } from "@/types/components";
import type {
  MemberRole,
  StudioMember,
} from "@/types/studio";
import MemberAvatar from "./member-avatar";

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
    <div className="rounded-lg border border-neutral-200 p-6">
      <h3 className="mb-4 font-bold font-ortank text-sm">
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
            aria-label="Email address to invite member"
            className="flex-1 rounded-lg border border-neutral-300 px-4 py-3 font-whisper placeholder:text-neutral-400"
            onKeyDown={(e) =>
              e.key === "Enter" && handleLookupUser()
            }
          />
          <button
            type="button"
            onClick={handleLookupUser}
            disabled={isLookingUp || !inviteEmail.trim()}
            className="flex items-center gap-2 rounded-lg bg-black px-6 py-3 font-medium font-whisper text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {isLookingUp ? (
              <>
                <RiLoaderLine className="h-4 w-4 animate-spin" />
                Looking up...
              </>
            ) : (
              "Find User"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-neutral-300 px-4 py-3 font-whisper hover:bg-neutral-50"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Step 2: Confirm user */}
      {lookupResult && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg bg-neutral-50 p-4">
            <MemberAvatar
              imageUrl={lookupResult.imageUrl}
              name={displayName}
              size="lg"
            />
            <div>
              <p className="font-medium font-whisper">
                {displayName}
              </p>
              <p className="font-whisper text-neutral-500 text-sm">
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
              className="rounded-lg border border-neutral-300 px-4 py-3 font-whisper"
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
              className="flex items-center gap-2 rounded-lg bg-black px-6 py-3 font-medium font-whisper text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {isSubmitting ? (
                <>
                  <RiLoaderLine className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <RiUserAddLine className="h-4 w-4" />
                  Add Member
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-neutral-300 px-4 py-3 font-whisper hover:bg-neutral-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 font-whisper text-neutral-500 text-sm">
        The user must have an existing account to be added
        as a member.
      </p>
    </div>
  );
}
