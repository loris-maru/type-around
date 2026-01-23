import { HOME_CONCEPT_POINT, HomeConceptPoint } from "@/mock-data/home";

export default function HighlightPoints() {
  return (
    <div className="relative w-full grid grid-cols-3 gap-x-4 px-24 py-52">
      {HOME_CONCEPT_POINT.map((point: HomeConceptPoint, index: number) => (
        <div
          key={point.title}
          className="relative p-4 border border-neutral-300 rounded-lg text-black"
        >
          <div>0{index + 1}</div>
          <div className="font-arvana text-[42px] font-bold mt-2 mb-4 leading-tight">
            {point.title}
          </div>
          <p className="text-base font-normal leading-normal">
            {point.description}
          </p>
        </div>
      ))}
    </div>
  );
}
