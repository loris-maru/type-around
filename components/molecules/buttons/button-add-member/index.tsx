"use client";

import { RiUserAddLine } from "react-icons/ri";
import type { ButtonAddMemberProps } from "@/types/components";

export default function ButtonAddMember({
  onClick,
}: ButtonAddMemberProps) {
  return (
    <button
      aria-label="Add member"
      type="button"
      onClick={onClick}
      className="swiss-btn shrink-0"
    >
      <RiUserAddLine className="h-4 w-4" />
      Add member
    </button>
  );
}
