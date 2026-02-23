import { InputDropdown } from "@/components/global/inputs";

export default function FontSelector({
  effectiveFontId,
  fontOptions,
  setSelectedFontId,
}: {
  effectiveFontId: string;
  fontOptions: { value: string; label: string }[];
  setSelectedFontId: (fontId: string | null) => void;
}) {
  return (
    <div>
      <label
        htmlFor="character-set-font"
        className="mb-2 block font-semibold text-black text-sm"
      >
        Font
      </label>
      <InputDropdown
        value={effectiveFontId}
        options={fontOptions}
        onChange={(v) => setSelectedFontId(v || null)}
        className="w-full"
        transparent
      />
    </div>
  );
}
