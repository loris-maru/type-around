import { ButtonSaveChanges } from "@/components/molecules/buttons";

type ProductEditorActionsProps = {
  onSave: () => Promise<void>;
  isSaving: boolean;
  saveError: string | null;
};

export function ProductEditorActions({
  onSave,
  isSaving,
  saveError,
}: ProductEditorActionsProps) {
  return (
    <>
      {saveError && (
        <p className="font-whisper text-red-600 text-sm">
          {saveError}
        </p>
      )}
      <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3">
        <ButtonSaveChanges
          onClick={onSave}
          disabled={isSaving}
          label="Save changes"
          loadingLabel="Saving..."
        />
      </div>
    </>
  );
}
