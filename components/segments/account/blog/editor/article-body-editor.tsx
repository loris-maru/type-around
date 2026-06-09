import RichTextEditor from "@/components/segments/account/studio-page/layout-builder/rich-text-editor";

type ArticleBodyEditorProps = {
  content: string;
  onChange: (value: string) => void;
  studioId: string;
};

export function ArticleBodyEditor({
  content,
  onChange,
  studioId,
}: ArticleBodyEditorProps) {
  return (
    <div className="space-y-3 rounded-lg border border-neutral-300 bg-white p-6">
      <span className="block font-semibold text-black text-sm">
        Body
      </span>
      <RichTextEditor
        content={content}
        onChange={onChange}
        studioId={studioId}
        enableMedia
      />
    </div>
  );
}
