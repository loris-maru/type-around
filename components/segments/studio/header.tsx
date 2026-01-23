export default function StudioHeader({
  gradient,
}: {
  gradient: string[];
}) {
  const gradientStyle = {
    background: `linear-gradient(180deg, ${gradient[0]} 29.33%, ${gradient[1]} 100%)`,
  };

  return (
    <div
      className="relative w-full h-screen flex justify-center items-center"
      style={gradientStyle}
    >
      <div className="flex flex-col items-center">
        <h2 className="font-ortank text-xl uppercase tracking-[4px] text-medium">
          Studio
        </h2>
        <h1 className="text-[270px] font-ortank font-black leading-[1.3] text-black">
          로올타입
        </h1>
      </div>
    </div>
  );
}
