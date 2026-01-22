import CartoucheHeader from "@/components/molecules/home/cartouche-header";

export default function HeaderHome() {
  return (
    <div className="relative w-full flex flex-row justify-between items-center">
      <div
        className="relative top-0 left-0 w-screen h-screen z-10 font-ortank text-[20vw] text-white flex items-center px-[6vw]"
        style={{ fontVariationSettings: '"wght" 900, "opsz" 100' }}
      >
        글자곁
      </div>
      <div className="absolute z-20 bottom-0 left-0 w-full px-10 pb-10">
        <CartoucheHeader />
      </div>
    </div>
  );
}
