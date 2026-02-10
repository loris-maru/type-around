"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  RiAddFill,
  RiBehanceLine,
  RiBlueskyLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiDribbbleLine,
  RiFacebookCircleLine,
  RiGithubLine,
  RiGlobalLine,
  RiInstagramLine,
  RiLinkedinLine,
  RiLoader4Line,
  RiMastodonLine,
  RiPinterestLine,
  RiThreadsLine,
  RiTiktokLine,
  RiTwitterXLine,
  RiUploadCloud2Line,
  RiUserLine,
  RiYoutubeLine,
} from "react-icons/ri";
import { uploadFile } from "@/lib/firebase/storage";
import type { AddDesignerModalProps } from "@/types/components";
import type {
  Designer,
  DesignerSocialMedia,
} from "@/types/studio";
import { generateUUID } from "@/utils/generate-uuid";

const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  instagram: RiInstagramLine,
  twitter: RiTwitterXLine,
  linkedin: RiLinkedinLine,
  facebook: RiFacebookCircleLine,
  behance: RiBehanceLine,
  dribbble: RiDribbbleLine,
  github: RiGithubLine,
  youtube: RiYoutubeLine,
  tiktok: RiTiktokLine,
  pinterest: RiPinterestLine,
  threads: RiThreadsLine,
  mastodon: RiMastodonLine,
  bluesky: RiBlueskyLine,
};

function getSocialIcon(
  name: string
): React.ComponentType<{ className?: string }> {
  const key = name.toLowerCase().trim();
  return ICON_MAP[key] || RiGlobalLine;
}

export default function AddDesignerModal({
  isOpen,
  onClose,
  onSave,
  editingDesigner,
  studioId,
}: AddDesignerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    biography: "",
    website: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<
    string | null
  >(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(
    null
  );

  const [socialMedia, setSocialMedia] = useState<
    DesignerSocialMedia[]
  >([]);
  const [newSocialName, setNewSocialName] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  // Prefill form when editing
  useEffect(() => {
    if (!isOpen) return;
    if (editingDesigner) {
      setFormData({
        firstName: editingDesigner.firstName,
        lastName: editingDesigner.lastName,
        email: editingDesigner.email || "",
        biography: editingDesigner.biography || "",
        website: editingDesigner.website || "",
      });
      setAvatarPreview(editingDesigner.avatar || null);
      setAvatarFile(null);
      setSocialMedia(editingDesigner.socialMedia || []);
    } else {
      setAvatarPreview((prev) => {
        if (prev?.startsWith("blob:"))
          URL.revokeObjectURL(prev);
        return null;
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        biography: "",
        website: "",
      });
      setAvatarFile(null);
      setSocialMedia([]);
      setNewSocialName("");
      setNewSocialUrl("");
      setError(null);
    }
  }, [editingDesigner, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Avatar handling
  const handleAvatarFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      !file.type.startsWith("image/") ||
      file.size > 10 * 1024 * 1024
    ) {
      setError("Please select an image file under 10MB.");
      return;
    }
    // Revoke old preview
    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarFile(file);
    if (fileInputRef.current)
      fileInputRef.current.value = "";
  };

  const handleAvatarDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleAvatarDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleAvatarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (
      !file.type.startsWith("image/") ||
      file.size > 10 * 1024 * 1024
    ) {
      setError("Please select an image file under 10MB.");
      return;
    }
    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarFile(file);
  };

  const handleDeleteAvatar = () => {
    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleChangeAvatar = () => {
    fileInputRef.current?.click();
  };

  // Social media handling
  const handleAddSocialMedia = () => {
    if (!newSocialName.trim() || !newSocialUrl.trim())
      return;

    try {
      new URL(newSocialUrl);
    } catch {
      setError("Please enter a valid URL.");
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
    setError(null);
  };

  const handleRemoveSocialMedia = (index: number) => {
    setSocialMedia((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const resetForm = () => {
    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      biography: "",
      website: "",
    });
    setAvatarPreview(null);
    setAvatarFile(null);
    setSocialMedia([]);
    setNewSocialName("");
    setNewSocialUrl("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let avatarUrl = avatarPreview || "";

      // Upload new avatar if a file was selected
      if (avatarFile) {
        avatarUrl = await uploadFile(
          avatarFile,
          "images",
          studioId
        );
      }

      const designer: Designer = {
        id: editingDesigner?.id || generateUUID(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        biography: formData.biography,
        avatar: avatarUrl,
        website: formData.website,
        socialMedia,
      };

      onSave(designer);
      resetForm();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save designer"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-white">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            {editingDesigner
              ? "Edit Designer"
              : "Add Designer"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="cursor-pointer rounded-lg p-1 transition-colors hover:bg-neutral-100"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          <div className="space-y-4 p-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Avatar */}
            <div>
              <span className="mb-2 block font-normal font-whisper text-black text-sm">
                Avatar
              </span>

              {avatarPreview ? (
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleChangeAvatar}
                      className="cursor-pointer font-medium font-whisper text-black text-sm transition-colors hover:text-neutral-600"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      className="cursor-pointer font-medium font-whisper text-red-500 text-sm transition-colors hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                // biome-ignore lint/a11y/noStaticElementInteractions: drop zone triggers file input
                // biome-ignore lint/a11y/useKeyWithClickEvents: drop zone triggers file input
                <div
                  onDragOver={handleAvatarDragOver}
                  onDragLeave={handleAvatarDragLeave}
                  onDrop={handleAvatarDrop}
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 border-dashed p-4 transition-colors ${
                    isDragging
                      ? "border-black bg-neutral-50"
                      : "border-neutral-300 hover:border-neutral-400"
                  }`}
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                    <RiUserLine className="h-7 w-7 text-neutral-300" />
                  </div>
                  <div className="flex flex-col">
                    <RiUploadCloud2Line className="mb-1 h-5 w-5 text-neutral-400" />
                    <span className="text-neutral-500 text-sm">
                      Drop image or click to browse
                    </span>
                    <span className="text-neutral-400 text-xs">
                      PNG, JPG, WebP (max 10MB)
                    </span>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
                aria-label="Upload designer avatar image"
              />
            </div>

            {/* First name & Last name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block font-normal font-whisper text-black text-sm"
                >
                  First name{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="John"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block font-normal font-whisper text-black text-sm"
                >
                  Last name{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-normal font-whisper text-black text-sm"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="john@example.com"
              />
            </div>

            {/* Biography */}
            <div>
              <label
                htmlFor="biography"
                className="mb-2 block font-normal font-whisper text-black text-sm"
              >
                Biography
              </label>
              <textarea
                id="biography"
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                rows={3}
                className="w-full resize-none rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="A short bio about the designer..."
              />
            </div>

            {/* Website */}
            <div>
              <label
                htmlFor="website"
                className="mb-2 block font-normal font-whisper text-black text-sm"
              >
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="https://example.com"
              />
            </div>

            {/* Social media */}
            <div>
              <span className="mb-2 block font-normal font-whisper text-black text-sm">
                Social media
              </span>

              {/* Existing social media */}
              {socialMedia.length > 0 && (
                <div className="mb-3 space-y-2">
                  {socialMedia.map((social, index) => {
                    const Icon = getSocialIcon(social.name);
                    return (
                      <div
                        key={`${social.name}-${social.url}`}
                        className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-neutral-500" />
                        <span className="font-medium text-black text-sm">
                          {social.name}
                        </span>
                        <span className="flex-1 truncate text-neutral-400 text-sm">
                          {social.url}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveSocialMedia(index)
                          }
                          aria-label={`Remove ${social.name} social media`}
                          className="shrink-0 cursor-pointer p-1 text-neutral-400 transition-colors hover:text-red-500"
                        >
                          <RiDeleteBinLine className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add new social media */}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newSocialName}
                    onChange={(e) =>
                      setNewSocialName(e.target.value)
                    }
                    aria-label="Social media platform name"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Platform name"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="url"
                    value={newSocialUrl}
                    onChange={(e) =>
                      setNewSocialUrl(e.target.value)
                    }
                    aria-label="Social media profile URL"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Profile URL"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSocialMedia}
                  disabled={
                    !newSocialName.trim() ||
                    !newSocialUrl.trim()
                  }
                  aria-label="Add social media"
                  className="shrink-0 cursor-pointer rounded-lg bg-black p-2 text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
                >
                  <RiAddFill className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-neutral-200 border-t p-6">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.firstName ||
                !formData.lastName
              }
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-black py-3 font-medium font-whisper text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {isSubmitting && (
                <RiLoader4Line className="h-5 w-5 animate-spin" />
              )}
              {isSubmitting
                ? "Saving..."
                : editingDesigner
                  ? "Save Changes"
                  : "Add Designer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
