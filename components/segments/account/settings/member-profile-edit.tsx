"use client";

import { useMemo, useState } from "react";
import {
  RiAddFill,
  RiDeleteBinLine,
  RiLoaderLine,
} from "react-icons/ri";
import { updateMemberProfile } from "@/actions/members";
import CustomSelect from "@/components/global/custom-select";
import FileDropZone from "@/components/global/file-drop-zone";
import { MEMBER_SOCIAL_MEDIA_OPTIONS } from "@/constant/MEMBER_SOCIAL_MEDIA_OPTIONS";
import type { CustomSelectOption } from "@/types/components";
import type { StudioMember } from "@/types/studio";

type MemberProfileEditProps = {
  member: StudioMember;
  studioId: string;
  onSaved: (members: StudioMember[]) => void;
  onError: (error: string) => void;
};

type SocialLink = { name: string; url: string };

function getPlatformOptionsForRow(
  index: number,
  links: SocialLink[]
): CustomSelectOption[] {
  const usedPlatforms = new Set(
    links
      .map((link, i) =>
        i !== index ? link.name.toLowerCase().trim() : null
      )
      .filter((name): name is string => Boolean(name))
  );

  const current = links[index]?.name.toLowerCase().trim();

  return MEMBER_SOCIAL_MEDIA_OPTIONS.filter(
    (option) =>
      option.value === current ||
      !usedPlatforms.has(option.value)
  );
}

function getDefaultPlatform(links: SocialLink[]): string {
  const used = new Set(
    links.map((link) => link.name.toLowerCase().trim())
  );
  const available = MEMBER_SOCIAL_MEDIA_OPTIONS.find(
    (option) => !used.has(option.value)
  );
  return (
    available?.value ?? MEMBER_SOCIAL_MEDIA_OPTIONS[0].value
  );
}

export default function MemberProfileEdit({
  member,
  studioId,
  onSaved,
  onError,
}: MemberProfileEditProps) {
  const [firstName, setFirstName] = useState(
    member.firstName ?? ""
  );
  const [lastName, setLastName] = useState(
    member.lastName ?? ""
  );
  const [email, setEmail] = useState(member.email ?? "");
  const [imageUrl, setImageUrl] = useState(
    member.imageUrl ?? ""
  );
  const [website, setWebsite] = useState(
    member.website ?? ""
  );
  const [socialMedia, setSocialMedia] = useState<
    SocialLink[]
  >(
    (member.socialMedia ?? []).map((link) => ({
      name: link.name.toLowerCase().trim(),
      url: link.url,
    }))
  );
  const [isSaving, setIsSaving] = useState(false);

  const canAddSocialLink = useMemo(
    () =>
      socialMedia.length <
      MEMBER_SOCIAL_MEDIA_OPTIONS.length,
    [socialMedia.length]
  );

  const handleAddSocial = () => {
    if (!canAddSocialLink) return;
    setSocialMedia((prev) => [
      ...prev,
      { name: getDefaultPlatform(prev), url: "" },
    ]);
  };

  const handleRemoveSocial = (index: number) => {
    setSocialMedia((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSocialPlatformChange = (
    index: number,
    platform: string
  ) => {
    setSocialMedia((prev) =>
      prev.map((link, i) =>
        i === index ? { ...link, name: platform } : link
      )
    );
  };

  const handleSocialUrlChange = (
    index: number,
    url: string
  ) => {
    setSocialMedia((prev) =>
      prev.map((link, i) =>
        i === index ? { ...link, url } : link
      )
    );
  };

  const validate = (): string | null => {
    if (!firstName.trim()) {
      return "First name is required";
    }
    if (!lastName.trim()) {
      return "Last name is required";
    }
    if (!email.trim()) {
      return "Email address is required";
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      return "Please enter a valid email address";
    }
    if (website.trim()) {
      try {
        new URL(website.trim());
      } catch {
        return "Please enter a valid website URL";
      }
    }
    for (const link of socialMedia) {
      if (!link.name.trim()) {
        return "Each social link needs a platform";
      }
      if (!link.url.trim()) {
        return `Please enter a URL for ${link.name}`;
      }
      try {
        new URL(link.url.trim());
      } catch {
        return `Please enter a valid URL for ${link.name}`;
      }
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      onError(validationError);
      return;
    }

    setIsSaving(true);
    const result = await updateMemberProfile(
      studioId,
      member.id,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        imageUrl,
        website: website.trim(),
        socialMedia: socialMedia.map((link) => ({
          name: link.name.toLowerCase().trim(),
          url: link.url.trim(),
        })),
      }
    );
    if (result.success && result.members) {
      onSaved(result.members);
    } else {
      onError(result.error ?? "Failed to save");
    }
    setIsSaving(false);
  };

  const inputClassName =
    "w-full rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm placeholder:text-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black";

  return (
    <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <FileDropZone
        label="Profile image"
        accept=".png,.jpg,.jpeg,.webp"
        value={imageUrl}
        onChange={setImageUrl}
        description="PNG, JPEG, or WebP. Upload, replace, or delete your profile photo."
        icon="image"
        studioId={studioId}
        folder="images"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`firstName-${member.id}`}
            className="mb-1 block font-whisper text-neutral-600 text-sm"
          >
            First name
          </label>
          <input
            id={`firstName-${member.id}`}
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className={inputClassName}
            placeholder="First name"
          />
        </div>
        <div>
          <label
            htmlFor={`lastName-${member.id}`}
            className="mb-1 block font-whisper text-neutral-600 text-sm"
          >
            Last name
          </label>
          <input
            id={`lastName-${member.id}`}
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className={inputClassName}
            placeholder="Last name"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`email-${member.id}`}
          className="mb-1 block font-whisper text-neutral-600 text-sm"
        >
          Email address
        </label>
        <input
          id={`email-${member.id}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClassName}
          placeholder="name@example.com"
        />
      </div>

      <div>
        <label
          htmlFor={`website-${member.id}`}
          className="mb-1 block font-whisper text-neutral-600 text-sm"
        >
          Personal website
        </label>
        <input
          id={`website-${member.id}`}
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className={inputClassName}
          placeholder="https://example.com"
        />
      </div>

      <div>
        <span className="mb-2 block font-whisper text-neutral-600 text-sm">
          Social media
        </span>
        {socialMedia.length > 0 && (
          <div className="mb-3 space-y-2">
            {socialMedia.map((social, index) => (
              <div
                key={`${social.name}-${index}`}
                className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-3 sm:flex-row sm:items-end"
              >
                <div className="min-w-0 flex-1 sm:max-w-[180px]">
                  <span className="mb-1 block font-whisper text-neutral-500 text-xs">
                    Platform
                  </span>
                  <CustomSelect
                    value={social.name.toLowerCase()}
                    options={getPlatformOptionsForRow(
                      index,
                      socialMedia
                    )}
                    onChange={(val) =>
                      handleSocialPlatformChange(index, val)
                    }
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor={`social-url-${member.id}-${index}`}
                    className="mb-1 block font-whisper text-neutral-500 text-xs"
                  >
                    Profile URL
                  </label>
                  <input
                    id={`social-url-${member.id}-${index}`}
                    type="url"
                    value={social.url}
                    onChange={(e) =>
                      handleSocialUrlChange(
                        index,
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                    className={inputClassName}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSocial(index)}
                  aria-label={`Remove ${social.name}`}
                  className="shrink-0 self-end rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <RiDeleteBinLine className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={handleAddSocial}
          disabled={!canAddSocialLink}
          className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 font-medium font-whisper text-sm transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RiAddFill className="h-5 w-5" />
          Add social link
        </button>
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
