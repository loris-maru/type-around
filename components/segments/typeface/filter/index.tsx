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
      <div className="hidden flex-row flex-wrap items-center gap-x-4 rounded-sm border border-medium-gray px-4 py-2 shadow-medium-gray lg:flex">
        {allCategories.map((category) => (
          <div
            key={category}
            className="flex flex-row items-center gap-x-2 font-whisper text-sm"
          >
            <label
              htmlFor={`category-${category}`}
              className="cursor-pointer font-light capitalize"
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
      <div className="flex flex-row flex-wrap gap-x-4 rounded-sm border border-medium-gray px-4 py-2 shadow-medium-gray">
        <span className="mr-2 font-bold font-whisper text-sm">
          Studios:
        </span>
        {allStudioNames.map((studio) => (
          <div
            key={studio}
            className="flex flex-row items-center gap-x-2 font-whisper text-sm"
          >
            <label
              htmlFor={`studio-${studio}`}
              className="cursor-pointer font-light"
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
