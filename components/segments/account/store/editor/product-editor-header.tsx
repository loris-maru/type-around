import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";

type ProductEditorHeaderProps = {
  studioId: string;
  isNew: boolean;
};

export function ProductEditorHeader({
  studioId,
  isNew,
}: ProductEditorHeaderProps) {
  return (
    <div>
      <Link
        href={`/account/${studioId}?nav=store`}
        className="mb-4 inline-flex items-center gap-2 font-whisper text-neutral-600 text-sm transition-colors hover:text-black"
      >
        <RiArrowLeftLine className="h-4 w-4" />
        Back to store
      </Link>
      <h1 className="font-bold font-ortank text-3xl">
        {isNew ? "New product" : "Edit product"}
      </h1>
    </div>
  );
}
