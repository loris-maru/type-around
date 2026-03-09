"use client";

import { useState } from "react";
import {
  RiAddFill,
  RiDeleteBinLine,
  RiLoaderLine,
} from "react-icons/ri";
import { updateMemberProfile } from "@/actions/members";
import type { StudioMember } from "@/types/studio";

type MemberProfileEditProps = {
  member: StudioMember;
  studioId: string;
  onSaved: (members: StudioMember[]) => void;
  onError: (error: string) => void;
};

export default function MemberProfileEdit({
  member,
  studioId,
  onSaved,
  onError,
}: MemberProfileEditProps) {
  const [biography, setBiography] = useState(
    member.biography ?? ""
  );
  const [website, setWebsite] = useState(
    member.website ?? ""
  );
  const [socialMedia, setSocialMedia] = useState<
    { name: string; url: string }[]
  >(member.socialMedia ?? []);
  const [newSocialName, setNewSocialName] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSocial = () => {
    if (!newSocialName.trim() || !newSocialUrl.trim())
      return;
    try {
      new URL(newSocialUrl);
    } catch {
      onError("Please enter a valid URL");
      return;
    }
    setSocialMedia((prev) => [
      ...prev,
      {
        name: newSocialName.trim(),
        url: newSocialUrl.trim(),
      },
    ]);
    setNewSocialName("");
    setNewSocialUrl("");
  };

  const handleRemoveSocial = (index: number) => {
    setSocialMedia((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateMemberProfile(
      studioId,
      member.id,
      {
        biography,
        website,
        socialMedia,
      }
    );
    if (result.success && result.members) {
      onSaved(result.members);
    } else {
      onError(result.error ?? "Failed to save");
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <div>
        <label
          htmlFor={`bio-${member.id}`}
          className="mb-1 block font-whisper text-neutral-600 text-sm"
        >
          Biography
        </label>
        <textarea
          id={`bio-${member.id}`}
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
          rows={3}
          placeholder="A short bio..."
          className="w-full resize-none rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm placeholder:text-neutral-400"
        />
      </div>

      <div>
        <label
          htmlFor={`website-${member.id}`}
          className="mb-1 block font-whisper text-neutral-600 text-sm"
        >
          Website
        </label>
        <input
          id={`website-${member.id}`}
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm placeholder:text-neutral-400"
        />
      </div>

      <div>
        <span className="mb-1 block font-whisper text-neutral-600 text-sm">
          Social media
        </span>
        {socialMedia.length > 0 && (
          <div className="mb-2 space-y-2">
            {socialMedia.map((social, index) => (
              <div
                key={`${social.name}-${index}`}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2"
              >
                <span className="font-medium text-black text-sm">
                  {social.name}
                </span>
                <span className="flex-1 truncate text-neutral-500 text-sm">
                  {social.url}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSocial(index)}
                  aria-label={`Remove ${social.name}`}
                  className="shrink-0 p-1 text-neutral-400 transition-colors hover:text-red-500"
                >
                  <RiDeleteBinLine className="h-4 w-4" />
                </button>
              </div>
            ))}
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
            onClick={handleAddSocial}
            disabled={
              !newSocialName.trim() || !newSocialUrl.trim()
            }
            className="shrink-0 rounded-lg bg-black p-2 text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            aria-label="Add social link"
          >
            <RiAddFill className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 font-medium font-whisper text-sm text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {isSaving ? (
            <>
              <RiLoaderLine className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save profile"
          )}
        </button>
      </div>
    </div>
  );
}
