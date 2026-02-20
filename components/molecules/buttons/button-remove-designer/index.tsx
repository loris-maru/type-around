"use client";

type ButtonRemoveDesignerProps = {
  onClick: () => void;
  ariaLabel: string;
  children?: React.ReactNode;
};

export default function ButtonRemoveDesigner({
  onClick,
  ariaLabel,
  children,
}: ButtonRemoveDesignerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="cursor-pointer transition-colors hover:text-red-500"
    >
      {children}
    </button>
  );
}
