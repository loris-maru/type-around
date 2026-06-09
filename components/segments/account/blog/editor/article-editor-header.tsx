import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";

type ArticleEditorHeaderProps = {
  studioId: string;
  isNew: boolean;
};

export function ArticleEditorHeader({
  studioId,
  isNew,
}: ArticleEditorHeaderProps) {
  return (
    <div>
      <Link
        href={`/account/${studioId}?nav=articles`}
        className="mb-4 inline-flex items-center gap-2 font-whisper text-neutral-600 text-sm transition-colors hover:text-black"
      >
        <RiArrowLeftLine className="h-4 w-4" />
        Back to articles
      </Link>
      <h1 className="font-bold font-ortank text-3xl">
        {isNew ? "New article" : "Edit article"}
      </h1>
    </div>
  );
}
