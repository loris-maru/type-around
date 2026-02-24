import IconCart from "@/components/icons/icon-cart";

export default function ButtonAddToCart({
  isHovered,
  isAddDisabled,
  isInCart,
  hasLicense,
  font,
  handleAddToCart,
}: {
  isHovered: boolean;
  isAddDisabled: boolean;
  isInCart: boolean;
  hasLicense: boolean;
  font: { name?: string };
  handleAddToCart: () => void;
}) {
  return (
    <button
      type="button"
      className="relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 ease-in-out hover:border-white hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 max-lg:border-black! max-lg:bg-light-gray! lg:border-transparent lg:bg-transparent"
      style={{
        opacity: isHovered || isAddDisabled ? 1 : 0.4,
        transform:
          isHovered && !isAddDisabled
            ? "scale(1.1)"
            : "scale(1)",
        borderColor: isInCart
          ? "#16a34a"
          : isHovered && !isAddDisabled
            ? "black"
            : "transparent",
        backgroundColor: isInCart
          ? "#f0fdf4"
          : "transparent",
      }}
      onClick={handleAddToCart}
      aria-label={
        isInCart
          ? "Already in cart"
          : !hasLicense
            ? "Please choose a license type"
            : `Add ${font.name ?? "font"} to cart`
      }
      disabled={isAddDisabled}
    >
      <IconCart
        className={`h-7 w-7 ${isInCart ? "text-green-600" : "text-black"}`}
      />
    </button>
  );
}
