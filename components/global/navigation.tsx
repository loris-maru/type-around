"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiMapPinUserFill,
  RiSearchLine,
} from "react-icons/ri";
import { GLOBAL_NAV_ITEMS } from "@/constant/GLOBAL_NAV_ITEMS";

export default function Navigation() {
  const sectionStyle = {
    borderRight: "1px solid #000000",
    borderBottom: "1px solid #000000",
    borderLeft: "1px solid #000000",
    borderRadius: "0 0 8px 8px",
  };

  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();

  const isSignedInPage = pathname === "/sign-in";

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
          {GLOBAL_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors duration-300 hover:text-gray-500 capitalize"
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

        {/* Auth buttons - only render after Clerk is loaded to prevent hydration mismatch */}
        {isLoaded && (
          <>
            {!isSignedIn && !isSignedInPage && (
              <Link
                href="/sign-in"
                className="font-whisper text-base font-normal text-black px-5 pb-2 pt-5 bg-light-gray"
                style={sectionStyle}
                aria-label="Login"
              >
                Login
              </Link>
            )}

            {isSignedIn && (
              <Link
                href="/account"
                aria-label="to Account"
                className="relative font-whisper text-base font-normal text-black px-5 pb-2 pt-5 bg-light-gray"
                style={sectionStyle}
              >
                <RiMapPinUserFill className="relative -top-1 w-6 h-6" />
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
