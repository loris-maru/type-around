import {
  HOME_CONCEPT_POINT,
  type HomeConceptPoint,
} from "@/mock-data/home";

export default function HighlightPoints() {
  return (
    <section
      className="relative grid w-full grid-cols-1 gap-4 px-8 py-52 lg:grid-cols-3 lg:px-24"
      id="highlightPoints"
    >
      {HOME_CONCEPT_POINT.map(
        (point: HomeConceptPoint, index: number) => (
          <div
            key={point.title}
            className="relative rounded-lg border border-neutral-300 p-4 text-black"
          >
            <div>0{index + 1}</div>
            <div className="mt-2 mb-4 font-arvana font-bold text-3xl leading-tight lg:text-[42px]">
              {point.title}
            </div>
            <p className="font-normal text-base leading-normal">
              {point.description}
            </p>
          </div>
        )
      )}
    </section>
  );
}
