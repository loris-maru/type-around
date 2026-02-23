import ButtonXL from "@/components/molecules/buttons/button-xl";

export default function CartoucheHeader() {
  return (
    <div className="relative flex w-full flex-col items-center justify-between lg:flex-row">
      <p className="relative mb-3 w-full hyphens-auto font-normal font-whisper text-base text-black leading-normal lg:mb-0 lg:w-1/3 lg:text-lg">
        More than 24 studios that designed more than 200
        fonts. From Korea with love.
      </p>
      <ButtonXL
        href="/typefaces"
        label="View all 200 fonts"
        width="360px"
      />
    </div>
  );
}
