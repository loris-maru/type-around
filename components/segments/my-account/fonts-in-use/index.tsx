"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { RiAddFill, RiLoader4Line } from "react-icons/ri";
import {
  createSubmission,
  getAllStudios,
  getSubmissionsByUser,
} from "@/lib/firebase/submissions";
import type {
  FontInUseSubmission,
  StudioSummary,
} from "@/types/my-account";
import SubmitFontInUseModal from "./submit-font-in-use-modal";

export default function MyAccountFontsInUse() {
  const { user } = useUser();

  const [submissions, setSubmissions] = useState<
    FontInUseSubmission[]
  >([]);
  const [studios, setStudios] = useState<StudioSummary[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch submissions & studios
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userSubmissions, allStudios] =
          await Promise.all([
            getSubmissionsByUser(user.id),
            getAllStudios(),
          ]);
        setSubmissions(userSubmissions);
        setStudios(allStudios);
      } catch (err) {
        console.error(
          "Failed to load fonts-in-use data:",
          err
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleSubmit = useCallback(
    async (data: Omit<FontInUseSubmission, "id">) => {
      const newSubmission = await createSubmission(data);
      setSubmissions((prev) => [newSubmission, ...prev]);
    },
    []
  );

  const statusLabel = (
    status: FontInUseSubmission["status"]
  ) => {
    switch (status) {
      case "pending":
        return "Pending review";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const statusColor = (
    status: FontInUseSubmission["status"]
  ) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  if (isLoading) {
    return (
      <div className="relative w-full flex items-center justify-center py-20">
        <RiLoader4Line className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-ortank text-3xl font-bold">
          Fonts In Use
        </h1>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white font-whisper font-medium rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <RiAddFill className="w-5 h-5" />
          Submit a font in use
        </button>
      </div>

      {submissions.length === 0 ? (
        <p className="text-neutral-500 font-whisper">
          You haven&apos;t submitted any fonts in use yet.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="relative flex flex-col p-4 border border-neutral-300 bg-white rounded-lg"
            >
              {/* Thumbnail */}
              {submission.images[0] && (
                <div className="relative w-full aspect-video mb-3 rounded-md overflow-hidden bg-neutral-100">
                  <Image
                    src={submission.images[0]}
                    alt={submission.projectName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <h3 className="font-ortank text-lg font-bold mb-1">
                {submission.projectName}
              </h3>
              <p className="text-sm text-neutral-500 mb-1">
                by {submission.designerName}
              </p>
              <p className="text-sm text-neutral-500 mb-2">
                Studio: {submission.studioName}
              </p>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-200">
                <span className="text-xs text-neutral-400 font-whisper">
                  {new Date(
                    submission.submittedAt
                  ).toLocaleDateString()}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(submission.status)}`}
                >
                  {statusLabel(submission.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <SubmitFontInUseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        studios={studios}
        userId={user?.id || ""}
        userName={
          user?.fullName ||
          user?.primaryEmailAddress?.emailAddress ||
          "Unknown"
        }
      />
    </div>
  );
}
