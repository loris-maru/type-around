export default function FontLineText({
  fontLineText,
  onInputChange,
}: {
  fontLineText: string;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <div>
      <label
        htmlFor="fontLineText"
        className="mb-1 block font-semibold font-whisper text-black text-sm"
      >
        Content
      </label>
      <input
        type="text"
        id="fontLineText"
        name="fontLineText"
        value={fontLineText}
        onChange={onInputChange}
        className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="e.g., The quick brown fox jumps over the lazy dog"
      />
    </div>
  );
}
