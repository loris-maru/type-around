import {
  ButtonPreviewPage,
  ButtonSaveChanges,
} from "@/components/molecules/buttons";

type ArticleEditorActionsProps = {
  onPreview: () => void;
  onPublish: () => Promise<void>;
  isSaving: boolean;
  saveError: string | null;
};

export function ArticleEditorActions({
  onPreview,
  onPublish,
  isSaving,
  saveError,
}: ArticleEditorActionsProps) {
  return (
    <>
      {saveError && (
        <p className="font-whisper text-red-600 text-sm">
          {saveError}
        </p>
      )}
      <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3">
        <ButtonPreviewPage onClick={onPreview} />
        <ButtonSaveChanges
          onClick={onPublish}
          disabled={isSaving}
          label="Publish"
          loadingLabel="Publishing..."
        />
      </div>
    </>
  );
}
