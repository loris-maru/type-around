"use client";

import { RiLoaderLine } from "react-icons/ri";
import { SiStripe } from "react-icons/si";

type ButtonConnectStripeProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function ButtonConnectStripe({
  onClick,
  disabled = false,
}: ButtonConnectStripeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#635BFF] px-6 py-3 text-white transition-colors hover:bg-[#5851db] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {disabled ? (
        <>
          <RiLoaderLine className="h-4 w-4 animate-spin" />
          <span className="font-whisper font-medium">
            Connecting...
          </span>
        </>
      ) : (
        <>
          <SiStripe className="h-4 w-4" />
          <span className="font-whisper font-medium">
            Connect with Stripe
          </span>
        </>
      )}
    </button>
  );
}
