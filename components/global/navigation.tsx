"use client";

import { NavigationItem } from "@/types/global";
import Link from "next/link";
import { RiSearchLine } from "react-icons/ri";

const NAV_ITEMS: NavigationItem[] = [
  {
    label: "fonts",
    href: "/fonts",
  },
  {
    label: "Studios",
    href: "/studios",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Navigation() {
  const sectionStyle = {
    borderRight: "1px solid #000000",
    borderBottom: "1px solid #000000",
    borderLeft: "1px solid #000000",
    borderRadius: "0 0 8px 8px",
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex flex-row justify-between items-center pl-4 pr-10">
      <div className="flex flex-col gap-y-2 text-black text-4xl font-ortank font-black pt-2">
        글자곁
      </div>
      <div className="flex flex-row gap-x-1">
        <section
          className="pt-5 pb-2 px-6 flex flex-row gap-x-6 font-whisper text-base font-normal text-black bg-light-gray"
          style={sectionStyle}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-gray-500 transition-colors duration-300"
            >
              {item.label}
            </Link>
          ))}
        </section>
        <section
          className="pt-5 pb-2 px-5 flex flex-row gap-x-14 font-whisper text-lg font-normal bg-light-gray"
          style={sectionStyle}
        >
          <button
            type="button"
            aria-label="Search"
            className="hover:text-gray-500 transition-colors duration-300"
          >
            <RiSearchLine
              size={20}
              color="black"
            />
          </button>
        </section>
      </div>
    </nav>
  );
}
