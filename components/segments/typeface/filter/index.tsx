export default function TypefaceFilter({
  allCategories,
  selectedCategories,
  handleCategoryToggle,
  allStudioNames,
  selectedStudios,
  handleStudioToggle,
}: {
  allCategories: string[];
  selectedCategories: string[];
  handleCategoryToggle: (category: string) => void;
  allStudioNames: string[];
  selectedStudios: string[];
  handleStudioToggle: (studio: string) => void;
}) {
  return (
    <div className="relative flex flex-row gap-x-2">
      <div className="flex flex-row gap-x-4 border border-medium-gray shadow-medium-gray py-2 px-4 rounded-sm flex-wrap items-center">
        {allCategories.map((category) => (
          <div
            key={category}
            className="flex flex-row font-whisper text-sm gap-x-2 items-center"
          >
            <label
              htmlFor={`category-${category}`}
              className="font-light capitalize cursor-pointer"
            >
              {category}
            </label>
            <input
              type="checkbox"
              id={`category-${category}`}
              checked={selectedCategories.includes(
                category
              )}
              onChange={() =>
                handleCategoryToggle(category)
              }
              className="cursor-pointer"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-row gap-x-4 border border-medium-gray shadow-medium-gray py-2 px-4 rounded-sm flex-wrap">
        <span className="font-whisper text-sm font-bold mr-2">
          Studios:
        </span>
        {allStudioNames.map((studio) => (
          <div
            key={studio}
            className="flex flex-row font-whisper text-sm gap-x-2 items-center"
          >
            <label
              htmlFor={`studio-${studio}`}
              className="font-light cursor-pointer"
            >
              {studio}
            </label>
            <input
              type="checkbox"
              id={`studio-${studio}`}
              checked={selectedStudios.includes(studio)}
              onChange={() => handleStudioToggle(studio)}
              className="cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
