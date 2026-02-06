"use client";

import Image from "next/image";
import { RiUserLine } from "react-icons/ri";

type MemberAvatarProps = {
  imageUrl?: string;
  name: string;
  size?: "sm" | "md" | "lg";
};

const SIZE_CLASSES = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const ICON_SIZES = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const IMAGE_SIZES = {
  sm: 32,
  md: 40,
  lg: 48,
};

export default function MemberAvatar({
  imageUrl,
  name,
  size = "md",
}: MemberAvatarProps) {
  return (
    <div
      className={`${SIZE_CLASSES[size]} rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          width={IMAGE_SIZES[size]}
          height={IMAGE_SIZES[size]}
          className="object-cover"
        />
      ) : (
        <RiUserLine
          className={`${ICON_SIZES[size]} text-neutral-500`}
        />
      )}
    </div>
  );
}
