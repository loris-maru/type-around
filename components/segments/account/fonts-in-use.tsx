"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RiAddFill, RiLoader4Line } from "react-icons/ri";
import { FontInUseCard } from "@/components/molecules/cards/account";
import SubmissionCard from "@/components/molecules/cards/account/submission-card";
import { useStudio } from "@/hooks/use-studio";
import {
  deleteSubmission,
  getSubmissionsByStudio,
} from "@/lib/firebase/submissions";
import type { FontInUseSubmission } from "@/types/my-account";
import type { FontInUse } from "@/types/studio";
import { generateUUID } from "@/utils/generate-uuid";
import AddFontInUseModal from "./fonts-in-use/add-font-in-use-modal";

export default function AccountFontsInUse() {
  const { studio, updateStudio } = useStudio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFontInUse, setEditingFontInUse] =
    useState<FontInUse | null>(null);

  const [submissions, setSubmissions] = useState<
    FontInUseSubmission[]
  >([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] =
    useState(false);

  const fontsInUse = useMemo(
    () => studio?.fontsInUse || [],
    [studio?.fontsInUse]
  );
  const typefaces = useMemo(
    () => studio?.typefaces || [],
    [studio?.typefaces]
  );

  // Fetch submissions for this studio
  useEffect(() => {
    if (!studio?.id) return;

    const fetchSubmissions = async () => {
      setIsLoadingSubmissions(true);
      try {
        const studioSubmissions =
          await getSubmissionsByStudio(studio.id);
        setSubmissions(studioSubmissions);
      } catch (err) {
        console.error("Failed to load submissions:", err);
      } finally {
        setIsLoadingSubmissions(false);
      }
    };

    fetchSubmissions();
  }, [studio?.id]);

  const handleSave = useCallback(
    async (fontInUse: FontInUse) => {
      if (!studio) return;

      const existingIndex = fontsInUse.findIndex(
        (f) => f.id === fontInUse.id
      );

      let updatedFontsInUse: FontInUse[];
      if (existingIndex >= 0) {
        updatedFontsInUse = [...fontsInUse];
        updatedFontsInUse[existingIndex] = fontInUse;
      } else {
        updatedFontsInUse = [...fontsInUse, fontInUse];
      }

      await updateStudio({
        fontsInUse: updatedFontsInUse,
      });
    },
    [studio, fontsInUse, updateStudio]
  );

  const handleEdit = useCallback((fontInUse: FontInUse) => {
    setEditingFontInUse(fontInUse);
    setIsModalOpen(true);
  }, []);

  const handleRemove = useCallback(
    async (id: string) => {
      if (!studio) return;
      const updatedFontsInUse = fontsInUse.filter(
        (f) => f.id !== id
      );
      await updateStudio({
        fontsInUse: updatedFontsInUse,
      });
    },
    [studio, fontsInUse, updateStudio]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingFontInUse(null);
  }, []);

  // Accept a submission: move data into studio's fontsInUse, delete the submission
  const handleAcceptSubmission = useCallback(
    async (submission: FontInUseSubmission) => {
      if (!studio) return;

      const newFontInUse: FontInUse = {
        id: generateUUID(),
        images: submission.images,
        projectName: submission.projectName,
        designerName: submission.designerName,
        typefaceId: submission.typefaceId,
        typefaceName: submission.typefaceName,
        description: submission.description,
      };

      // Add to studio's fontsInUse
      const updatedFontsInUse = [
        ...fontsInUse,
        newFontInUse,
      ];
      await updateStudio({
        fontsInUse: updatedFontsInUse,
      });

      // Delete the submission
      await deleteSubmission(submission.id);
      setSubmissions((prev) =>
        prev.filter((s) => s.id !== submission.id)
      );
    },
    [studio, fontsInUse, updateStudio]
  );

  // Reject a submission: delete it
  const handleRejectSubmission = useCallback(
    async (submissionId: string) => {
      await deleteSubmission(submissionId);
      setSubmissions((prev) =>
        prev.filter((s) => s.id !== submissionId)
      );
    },
    []
  );

  return (
    <div className="relative w-full">
      <h1 className="font-ortank text-3xl font-bold mb-8">
        Fonts In Use
      </h1>

      {/* ============================== */}
      {/* My fonts in use */}
      {/* ============================== */}
      <section className="mb-12">
        <h2 className="font-ortank text-xl font-bold mb-4">
          My fonts in use
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {fontsInUse.map((fontInUse) => (
            <FontInUseCard
              key={fontInUse.id}
              fontInUse={fontInUse}
              onEdit={handleEdit}
              onRemove={handleRemove}
            />
          ))}

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-black hover:bg-neutral-50 transition-all duration-300 ease-in-out min-h-[200px] cursor-pointer"
          >
            <RiAddFill className="w-8 h-8 text-neutral-400" />
            <span className="text-neutral-500 font-medium">
              Add Font In Use
            </span>
          </button>
        </div>
      </section>

      {/* ============================== */}
      {/* Submitted cases */}
      {/* ============================== */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-ortank text-xl font-bold">
            Submitted cases
          </h2>
          {submissions.length > 0 && (
            <span className="px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              {submissions.length}
            </span>
          )}
        </div>

        {isLoadingSubmissions ? (
          <div className="flex items-center justify-center py-10">
            <RiLoader4Line className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : submissions.length === 0 ? (
          <p className="text-neutral-500 font-whisper">
            No submitted cases at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                onAccept={handleAcceptSubmission}
                onReject={handleRejectSubmission}
              />
            ))}
          </div>
        )}
      </section>

      <AddFontInUseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingFontInUse={editingFontInUse}
        typefaces={typefaces}
        studioId={studio?.id || ""}
      />
    </div>
  );
}
