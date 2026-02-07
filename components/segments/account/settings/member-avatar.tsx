"use client";

import Image from "next/image";
import { RiUserLine } from "react-icons/ri";
import type { MemberAvatarProps } from "@/types/components";
import {
  AVATAR_SIZE_CLASSES,
  AVATAR_ICON_SIZES,
  AVATAR_IMAGE_SIZES,
} from "@/constant/AVATAR_SIZES";

export default function MemberAvatar({
  imageUrl,
  name,
  size = "md",
}: MemberAvatarProps) {
  return (
    <div
      className={`${AVATAR_SIZE_CLASSES[size]} rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          width={AVATAR_IMAGE_SIZES[size]}
          height={AVATAR_IMAGE_SIZES[size]}
          className="object-cover"
        />
      ) : (
        <RiUserLine
          className={`${AVATAR_ICON_SIZES[size]} text-neutral-500`}
        />
      )}
    </div>
  );
}
