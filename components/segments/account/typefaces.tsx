import AddTypeface from "./typefaces/add-typeface";

export default function AccountTypefaces() {
  return (
    <div className="relative w-full">
      <div className="font-medium text-base text-neutral-500 mb-4">
        Total typefaces: 0
      </div>
      <div className="relative w-full grid grid-cols-3 gap-6">
        <AddTypeface />
      </div>
    </div>
  );
}
