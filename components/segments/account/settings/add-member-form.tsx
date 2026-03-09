"use client";

import { useState } from "react";
import {
  RiAddFill,
  RiDeleteBinLine,
  RiLoaderLine,
  RiUserAddLine,
} from "react-icons/ri";
import {
  addStudioMember,
  lookupUserByEmail,
} from "@/actions/members";
import { InputDropdown } from "@/components/global/inputs";
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

  const handleAddSocialMedia = () => {
    if (
      !lookupResult ||
      !newSocialName.trim() ||
      !newSocialUrl.trim()
    )
      return;
    try {
      new URL(newSocialUrl);
    } catch {
      onError("Please enter a valid URL");
      return;
    }
    setLookupResult({
      ...lookupResult,
      socialMedia: [
        ...(lookupResult.socialMedia ?? []),
        {
          name: newSocialName.trim(),
          url: newSocialUrl.trim(),
        },
      ],
    });
    setNewSocialName("");
    setNewSocialUrl("");
  };

  const handleRemoveSocialMedia = (index: number) => {
    if (!lookupResult) return;
    setLookupResult({
      ...lookupResult,
      socialMedia: (lookupResult.socialMedia ?? []).filter(
        (_, i) => i !== index
      ),
    });
  };

  const [newSocialName, setNewSocialName] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");

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
            <div className="flex flex-col gap-1">
              <label
                className="font-whisper text-neutral-600 text-sm"
                htmlFor="role"
              >
                Role
              </label>
              <InputDropdown
                value={lookupResult.role}
                options={[
                  {
                    value: "member",
                    label: `Member - ${ROLE_DESCRIPTIONS.member}`,
                  },
                  {
                    value: "admin",
                    label: `Admin - ${ROLE_DESCRIPTIONS.admin}`,
                  },
                ]}
                onChange={(v) =>
                  handleRoleChange(v as MemberRole)
                }
              />
            </div>
            <div>
              <p className="font-medium font-whisper">
                {displayName}
              </p>
              <p className="font-whisper text-neutral-500 text-sm">
                {lookupResult.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="add-member-bio"
                className="mb-1 block font-whisper text-neutral-600 text-sm"
              >
                Biography
              </label>
              <textarea
                id="add-member-bio"
                value={lookupResult.biography ?? ""}
                onChange={(e) =>
                  setLookupResult({
                    ...lookupResult,
                    biography: e.target.value,
                  })
                }
                rows={3}
                placeholder="A short bio..."
                className="w-full resize-none rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm placeholder:text-neutral-400"
              />
            </div>

            <div>
              <label
                htmlFor="add-member-website"
                className="mb-1 block font-whisper text-neutral-600 text-sm"
              >
                Website
              </label>
              <input
                id="add-member-website"
                type="url"
                value={lookupResult.website ?? ""}
                onChange={(e) =>
                  setLookupResult({
                    ...lookupResult,
                    website: e.target.value,
                  })
                }
                placeholder="https://example.com"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm placeholder:text-neutral-400"
              />
            </div>

            <div>
              <span className="mb-1 block font-whisper text-neutral-600 text-sm">
                Social media
              </span>
              {(lookupResult.socialMedia ?? []).length >
                0 && (
                <div className="mb-2 space-y-2">
                  {(lookupResult.socialMedia ?? []).map(
                    (social, index) => (
                      <div
                        key={`${social.name}-${index}`}
                        className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2"
                      >
                        <span className="font-medium text-black text-sm">
                          {social.name}
                        </span>
                        <span className="flex-1 truncate text-neutral-500 text-sm">
                          {social.url}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveSocialMedia(index)
                          }
                          aria-label={`Remove ${social.name}`}
                          className="shrink-0 p-1 text-neutral-400 transition-colors hover:text-red-500"
                        >
                          <RiDeleteBinLine className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSocialName}
                  onChange={(e) =>
                    setNewSocialName(e.target.value)
                  }
                  placeholder="Platform (e.g. Instagram)"
                  className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm placeholder:text-neutral-400"
                />
                <input
                  type="url"
                  value={newSocialUrl}
                  onChange={(e) =>
                    setNewSocialUrl(e.target.value)
                  }
                  placeholder="URL"
                  className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={handleAddSocialMedia}
                  disabled={
                    !newSocialName.trim() ||
                    !newSocialUrl.trim()
                  }
                  className="shrink-0 rounded-lg bg-black p-2 text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
                  aria-label="Add social link"
                >
                  <RiAddFill className="h-5 w-5" />
                </button>
              </div>
            </div>
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
