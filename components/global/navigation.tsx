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
    <nav className="fixed left-0 top-0 z-50 flex w-full flex-row items-center justify-between pl-4 pr-10">
      <Link
        href="/"
        className="font-ortank flex flex-col gap-y-2 pt-2 text-4xl font-black text-black"
      >
        글자곁
      </Link>
      <div className="flex flex-row gap-x-1">
        <section
          className="bg-light-gray font-whisper flex flex-row gap-x-6 px-6 pb-2 pt-5 text-base font-normal text-black"
          style={sectionStyle}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors duration-300 hover:text-gray-500"
            >
              {item.label}
            </Link>
          ))}
        </section>
        <section
          className="bg-light-gray font-whisper flex flex-row gap-x-14 px-5 pb-2 pt-5 text-lg font-normal"
          style={sectionStyle}
        >
          <button
            type="button"
            aria-label="Search"
            className="transition-colors duration-300 hover:text-gray-500"
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
