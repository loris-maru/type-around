"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { RiAddFill, RiLoader4Line } from "react-icons/ri";
import SubmitFontInUseModal from "@/components/modals/modal-submit-font-in-use";
import {
  createSubmission,
  getAllStudios,
  getSubmissionsByUser,
} from "@/lib/firebase/submissions";
import type {
  FontInUseSubmission,
  StudioSummary,
} from "@/types/my-account";

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
      <div className="relative flex w-full items-center justify-center py-20">
        <RiLoader4Line className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-bold font-ortank text-3xl">
          Fonts In Use
        </h1>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-black px-5 py-2.5 font-medium font-whisper text-white transition-colors hover:bg-neutral-800"
        >
          <RiAddFill className="h-5 w-5" />
          Submit a font in use
        </button>
      </div>

      {submissions.length === 0 ? (
        <p className="font-whisper text-neutral-500">
          You haven&apos;t submitted any fonts in use yet.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="relative flex flex-col rounded-lg border border-neutral-300 bg-white p-4"
            >
              {/* Thumbnail */}
              {submission.images[0] && (
                <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-md bg-neutral-100">
                  <Image
                    src={submission.images[0]}
                    alt={submission.projectName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <h3 className="mb-1 font-bold font-ortank text-lg">
                {submission.projectName}
              </h3>
              <p className="mb-1 text-neutral-500 text-sm">
                by {submission.designerName}
              </p>
              <p className="mb-2 text-neutral-500 text-sm">
                Studio: {submission.studioName}
              </p>

              <div className="mt-auto flex items-center justify-between border-neutral-200 border-t pt-3">
                <span className="font-whisper text-neutral-400 text-xs">
                  {new Date(
                    submission.submittedAt
                  ).toLocaleDateString()}
                </span>
                <span
                  className={`rounded-full px-2 py-1 font-medium text-xs ${statusColor(submission.status)}`}
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
