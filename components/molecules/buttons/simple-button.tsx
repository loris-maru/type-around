"use client";

import Link from "next/link";

export default function SimpleButton({
  label,
  href,
  width,
}: {
  label: string;
  href: string;
  width: string;
}) {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const targetElement =
        document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="relative border border-black rounded-lg text-black bg-light-gray flex items-center justify-center py-4 transition-all duration-300 ease-in-out button-shadow hover:-translate-x-1 hover:-translate-y-1 hover:bg-white"
      style={{ width }}
    >
      {label}
    </Link>
  );
}
