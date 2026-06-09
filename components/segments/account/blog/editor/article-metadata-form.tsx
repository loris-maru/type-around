import FileDropZone from "@/components/global/file-drop-zone";
import { BLOG_ARTICLE_IMAGE_ACCEPT } from "@/constant/BLOG_ARTICLE_MEDIA_ACCEPT";

type ArticleMetadataFormProps = {
  name: string;
  onNameChange: (value: string) => void;
  introduction: string;
  onIntroductionChange: (value: string) => void;
  authorsInput: string;
  onAuthorsChange: (value: string) => void;
  keywordsInput: string;
  onKeywordsChange: (value: string) => void;
  coverImage: string;
  onCoverImageChange: (value: string) => void;
  studioId: string;
};

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1 block font-semibold text-black text-sm"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClassName =
  "w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black";

export function ArticleMetadataForm({
  name,
  onNameChange,
  introduction,
  onIntroductionChange,
  authorsInput,
  onAuthorsChange,
  keywordsInput,
  onKeywordsChange,
  coverImage,
  onCoverImageChange,
  studioId,
}: ArticleMetadataFormProps) {
  return (
    <div className="space-y-5 rounded-lg border border-neutral-300 bg-white p-6">
      <FormField
        label="Article title"
        htmlFor="article-name"
      >
        <input
          type="text"
          id="article-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter article title"
          className={inputClassName}
        />
      </FormField>

      <FormField
        label="Introduction"
        htmlFor="article-introduction"
      >
        <textarea
          id="article-introduction"
          value={introduction}
          onChange={(e) =>
            onIntroductionChange(e.target.value)
          }
          placeholder="Brief introduction to the article"
          rows={3}
          className={`${inputClassName} resize-none`}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Authors"
          htmlFor="article-authors"
        >
          <input
            type="text"
            id="article-authors"
            value={authorsInput}
            onChange={(e) =>
              onAuthorsChange(e.target.value)
            }
            placeholder="Author 1, Author 2, ..."
            className={inputClassName}
          />
        </FormField>

        <FormField
          label="Keywords"
          htmlFor="article-keywords"
        >
          <input
            type="text"
            id="article-keywords"
            value={keywordsInput}
            onChange={(e) =>
              onKeywordsChange(e.target.value)
            }
            placeholder="keyword1, keyword2, ..."
            className={inputClassName}
          />
        </FormField>
      </div>

      <FileDropZone
        label="Cover image"
        accept={BLOG_ARTICLE_IMAGE_ACCEPT}
        value={coverImage}
        onChange={onCoverImageChange}
        description="PNG, JPEG, WebP, or GIF. Shown at the top of the article."
        icon="image"
        studioId={studioId}
        folder="images"
      />
    </div>
  );
}
