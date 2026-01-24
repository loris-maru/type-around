import Image from "next/image";

export default function UpdateCard({
  title,
  image,
  date,
  description,
}: {
  title: string;
  image: string;
  date: Date;
  description: string;
}) {
  return (
    <div className="relative w-full h-[400px] flex flex-col ">
      <div className="relative w-full overflow-hidden mb-3">
        <Image
          src={image}
          alt={title}
          width={100}
          height={100}
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="relative w-full flex flex-row flex-nowrap text-black">
        <div className="relative w-1/3 flex flex-col">
          <div className="font-ortank text-2xl font-black mb-2 leading-tight">
            {title}
          </div>
          <div className="font-whisper text-sm font-normal">
            {date.toLocaleDateString()}
          </div>
        </div>
        <div className="relative w-2/3 font-whisper text-sm font-normal hyphens-auto">
          {description}
        </div>
      </div>
    </div>
  );
}
