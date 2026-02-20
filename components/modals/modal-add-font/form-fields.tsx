"use client";

type FormData = {
  styleName: string;
  weight: string;
  width: string;
  isItalic: boolean;
};

type FormFieldsProps = {
  formData: FormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => void;
};

export default function FormFields({
  formData,
  onChange,
}: FormFieldsProps) {
  return (
    <>
      {/* Style Name */}
      <div>
        <label
          htmlFor="styleName"
          className="mb-2 block font-normal font-whisper text-black text-sm"
        >
          Style Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="styleName"
          name="styleName"
          value={formData.styleName}
          onChange={onChange}
          required
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="e.g., Regular, Bold, Light Italic"
        />
      </div>

      {/* Weight & Width */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="weight"
            className="mb-2 block font-normal font-whisper text-black text-sm"
          >
            Weight Value
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={onChange}
            min="100"
            max="900"
            step="100"
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="400"
          />
        </div>
        <div>
          <label
            htmlFor="width"
            className="mb-2 block font-normal font-whisper text-black text-sm"
          >
            Width Value
          </label>
          <input
            type="number"
            id="width"
            name="width"
            value={formData.width}
            onChange={onChange}
            min="50"
            max="200"
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="100"
          />
        </div>
      </div>

      {/* Is Italic */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isItalic"
          name="isItalic"
          checked={formData.isItalic}
          onChange={onChange}
          className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black"
        />
        <label
          htmlFor="isItalic"
          className="font-normal font-whisper text-black text-sm"
        >
          Is Italic?
        </label>
      </div>
    </>
  );
}
