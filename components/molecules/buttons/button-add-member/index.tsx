"use client";

import { RiUserAddLine } from "react-icons/ri";

type ButtonAddMemberProps = {
  onClick: () => void;
};

export default function ButtonAddMember({
  onClick,
}: ButtonAddMemberProps) {
  return (
    <button
      aria-label="Add member"
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-2 rounded-lg border border-black bg-transparent px-4 py-3 font-medium font-whisper text-black shadow-button transition-all duration-300 ease-in-out hover:bg-white hover:shadow-button-hover"
    >
      <RiUserAddLine className="h-4 w-4" />
      Add member
    </button>
  );
}
