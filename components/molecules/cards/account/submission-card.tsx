"use client";

import Image from "next/image";
import { useState } from "react";
import {
  RiCheckLine,
  RiCloseLine,
  RiImageLine,
  RiLoader4Line,
} from "react-icons/ri";
import type { SubmissionCardProps } from "@/types/components";

const isValidImageUrl = (url: string) => {
  if (!url) return false;
  if (url.startsWith("blob:")) return false;
  return true;
};

export default function SubmissionCard({
  submission,
  onAccept,
  onReject,
}: SubmissionCardProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const firstValidImage =
    submission.images.find(isValidImageUrl);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await onAccept(submission);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await onReject(submission.id);
    } finally {
      setIsRejecting(false);
    }
  };

  const isProcessing = isAccepting || isRejecting;

  return (
    <div className="relative flex flex-col p-4 border border-neutral-300 bg-white rounded-lg">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video mb-3 rounded-md overflow-hidden bg-neutral-100">
        {firstValidImage ? (
          <Image
            src={firstValidImage}
            alt={submission.projectName}
            fill
            className="object-cover"
            unoptimized={
              firstValidImage.startsWith("data:") ||
              firstValidImage.includes("firebasestorage")
            }
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <RiImageLine className="w-10 h-10 text-neutral-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 mb-3">
        <h3 className="font-ortank text-lg font-bold mb-1">
          {submission.projectName}
        </h3>
        <p className="text-sm text-neutral-600 mb-1">
          by {submission.designerName}
        </p>
        <p className="text-sm text-neutral-500 mb-2">
          {submission.typefaceName}
        </p>

        {/* Submitted by info */}
        <div className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg">
          <span className="text-xs uppercase tracking-wide text-neutral-400">
            Submitted by
          </span>
          <p className="text-sm font-medium text-black">
            {submission.submittedBy}
          </p>
          <p className="text-xs text-neutral-400">
            {new Date(
              submission.submittedAt
            ).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-neutral-200">
        <button
          type="button"
          onClick={handleReject}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-whisper font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isRejecting ? (
            <RiLoader4Line className="w-4 h-4 animate-spin" />
          ) : (
            <RiCloseLine className="w-4 h-4" />
          )}
          Reject
        </button>
        <button
          type="button"
          onClick={handleAccept}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-whisper font-medium text-green-700 border border-green-300 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isAccepting ? (
            <RiLoader4Line className="w-4 h-4 animate-spin" />
          ) : (
            <RiCheckLine className="w-4 h-4" />
          )}
          Accept
        </button>
      </div>
    </div>
  );
}
