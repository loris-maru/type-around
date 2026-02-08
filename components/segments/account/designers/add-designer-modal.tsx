"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  RiAddFill,
  RiCloseLine,
  RiDeleteBinLine,
  RiGlobalLine,
  RiInstagramLine,
  RiTwitterXLine,
  RiLinkedinLine,
  RiFacebookCircleLine,
  RiBehanceLine,
  RiDribbbleLine,
  RiGithubLine,
  RiYoutubeLine,
  RiTiktokLine,
  RiPinterestLine,
  RiThreadsLine,
  RiMastodonLine,
  RiBlueskyLine,
  RiLoader4Line,
  RiUploadCloud2Line,
  RiUserLine,
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
    document.body.style.overflow = "hidden";
    return () => {
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

      <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 shrink-0">
          <h2 className="font-ortank text-xl font-bold">
            {editingDesigner
              ? "Edit Designer"
              : "Add Designer"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
        >
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Avatar */}
            <div>
              <span className="block font-whisper text-sm font-normal text-black mb-2">
                Avatar
              </span>

              {avatarPreview ? (
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-neutral-100 shrink-0">
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
                      className="text-sm font-whisper font-medium text-black hover:text-neutral-600 transition-colors cursor-pointer"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      className="text-sm font-whisper font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
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
                  className={`flex items-center gap-4 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    isDragging
                      ? "border-black bg-neutral-50"
                      : "border-neutral-300 hover:border-neutral-400"
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                    <RiUserLine className="w-7 h-7 text-neutral-300" />
                  </div>
                  <div className="flex flex-col">
                    <RiUploadCloud2Line className="w-5 h-5 text-neutral-400 mb-1" />
                    <span className="text-sm text-neutral-500">
                      Drop image or click to browse
                    </span>
                    <span className="text-xs text-neutral-400">
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
              />
            </div>

            {/* First name & Last name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block font-whisper text-sm font-normal text-black mb-2"
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
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="John"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block font-whisper text-sm font-normal text-black mb-2"
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
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block font-whisper text-sm font-normal text-black mb-2"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            {/* Biography */}
            <div>
              <label
                htmlFor="biography"
                className="block font-whisper text-sm font-normal text-black mb-2"
              >
                Biography
              </label>
              <textarea
                id="biography"
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                placeholder="A short bio about the designer..."
              />
            </div>

            {/* Website */}
            <div>
              <label
                htmlFor="website"
                className="block font-whisper text-sm font-normal text-black mb-2"
              >
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>

            {/* Social media */}
            <div>
              <span className="block font-whisper text-sm font-normal text-black mb-2">
                Social media
              </span>

              {/* Existing social media */}
              {socialMedia.length > 0 && (
                <div className="space-y-2 mb-3">
                  {socialMedia.map((social, index) => {
                    const Icon = getSocialIcon(social.name);
                    return (
                      <div
                        key={`${social.name}-${social.url}`}
                        className="flex items-center gap-3 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                      >
                        <Icon className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span className="text-sm font-medium text-black">
                          {social.name}
                        </span>
                        <span className="text-sm text-neutral-400 truncate flex-1">
                          {social.url}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveSocialMedia(index)
                          }
                          className="p-1 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                        >
                          <RiDeleteBinLine className="w-4 h-4" />
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
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
                  className="p-2 bg-black text-white rounded-lg hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
                >
                  <RiAddFill className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-200 shrink-0">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.firstName ||
                !formData.lastName
              }
              className="w-full py-3 bg-black text-white font-whisper font-medium rounded-lg hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting && (
                <RiLoader4Line className="w-5 h-5 animate-spin" />
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
