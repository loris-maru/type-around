export default function TypefaceAbout({
  description,
}: {
  description: string;
}) {
  if (!description?.trim()) return null;

  return (
    <section
      className="relative my-20 flex w-full flex-col px-5 lg:px-24"
      id="about"
    >
      <h3 className="mb-4 font-black font-ortank text-2xl text-black">
        About
      </h3>
      <p className="hyphens-auto font-whisper text-base text-neutral-700 leading-relaxed">
        {description}
      </p>
    </section>
  );
}
