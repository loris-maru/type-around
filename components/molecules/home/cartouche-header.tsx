import ButtonXL from "@/components/molecules/buttons/button-xl";

export default function CartoucheHeader() {
  return (
    <div className="relative w-full flex flex-row justify-between items-center">
      <p className="relative w-1/3 font-whisper text-lg leading-normal text-black font-normal hyphens-auto">
        More than 24 studios that designed more than 200 fonts. From Korea with
        love.
      </p>
      <ButtonXL href="/fonts-collection" label="View all 200 fonts" />
    </div>
  );
}
