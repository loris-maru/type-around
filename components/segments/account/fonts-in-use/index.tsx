"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RiLoader4Line } from "react-icons/ri";
import AddFontInUseModal from "@/components/modals/modal-add-font-in-use";
import { ButtonAddCard } from "@/components/molecules/buttons";
import {
  FontInUseCard,
  SubmissionCard,
} from "@/components/molecules/cards";
import { useStudio } from "@/hooks/use-studio";
import {
  deleteSubmission,
  getSubmissionsByStudio,
} from "@/lib/firebase/submissions";
import type { FontInUseSubmission } from "@/types/my-account";
import type { FontInUse } from "@/types/studio";
import { generateUUID } from "@/utils/generate-uuid";
import AccountPageHeader from "../page-header";

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
      <AccountPageHeader
        eyebrow="08 Fonts in use"
        title="Fonts in use"
        description="Showcase real-world uses of your typefaces and review cases submitted by the community."
      />

      {/* ============================== */}
      {/* My fonts in use */}
      {/* ============================== */}
      <section className="mb-12">
        <h2 className="swiss-rule swiss-h2 mb-6 pt-3">
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

          <ButtonAddCard
            label="Add Font In Use"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </section>

      {/* ============================== */}
      {/* Submitted cases */}
      {/* ============================== */}
      <section>
        <div className="swiss-rule mb-6 flex items-baseline gap-4 pt-3">
          <h2 className="swiss-h2">Submitted cases</h2>
          {submissions.length > 0 && (
            <span className="swiss-label text-swiss-red">
              {submissions.length} pending
            </span>
          )}
        </div>

        {isLoadingSubmissions ? (
          <div className="flex items-center justify-center py-10">
            <RiLoader4Line className="h-6 w-6 animate-spin text-neutral-400" />
          </div>
        ) : submissions.length === 0 ? (
          <p className="font-whisper text-neutral-500">
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
