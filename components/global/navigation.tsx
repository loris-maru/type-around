"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiCloseLine,
  RiSearchLine,
  RiShoppingCart2Line,
  RiUser3Line,
} from "react-icons/ri";
import { GLOBAL_NAV_ITEMS } from "@/constant/GLOBAL_NAV_ITEMS";
import SearchPanel from "@/components/molecules/search";
import { useCartStore } from "@/stores/cart";
import { cn } from "@/utils/class-names";

export default function Navigation() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  const isSignedInPage = pathname === "/sign-in";

  const cartCount = useCartStore(
    (state) => state.cart.length
  );

  const toggleSearch = useCallback(() => {
    setSearchOpen((prev) => !prev);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  const buttonStyleInactive =
    "relative flex flex-row items-center gap-x-2 rounded-lg w-full px-3.5 py-1 font-whisper text-sm font-light transition-all duration-300 ease-in-out";

  return (
    <>
      <nav
        className={cn(
          "fixed top-5 left-0 z-40 grid w-full gap-x-0.5 px-5",
          cartCount > 0 ? "grid-cols-7" : "grid-cols-6"
        )}
      >
        <Link
          href="/"
          className={cn(
            buttonStyleInactive,
            "bg-transparent font-bold font-ortank text-xl"
          )}
        >
          글자곁
        </Link>
        {GLOBAL_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonStyleInactive,
              "bg-white text-black",
              "hover:bg-black hover:text-white"
            )}
          >
            {item.label}
          </Link>
        ))}
        <button
          type="button"
          aria-label={
            searchOpen ? "Close search" : "Search"
          }
          onClick={toggleSearch}
          className={cn(
            buttonStyleInactive,
            searchOpen
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-black hover:text-white"
          )}
        >
          {searchOpen ? (
            <RiCloseLine
              size={16}
              color="currentColor"
            />
          ) : (
            <RiSearchLine
              size={16}
              color="currentColor"
            />
          )}
          <span>{searchOpen ? "Close" : "Search"}</span>
        </button>

        {/* Auth buttons - only render after Clerk is loaded to prevent hydration mismatch */}
        {isLoaded && (
          <>
            {!isSignedIn && !isSignedInPage && (
              <Link
                href="/sign-in"
                className={cn(
                  buttonStyleInactive,
                  "bg-white text-black",
                  "hover:bg-black hover:text-white"
                )}
                aria-label="Login"
              >
                Login
              </Link>
            )}

            {isSignedIn && (
              <Link
                href="/account"
                aria-label="to Account"
                className={cn(
                  buttonStyleInactive,
                  "bg-white text-black",
                  "hover:bg-black hover:text-white"
                )}
              >
                <RiUser3Line size={16} />
                <span>Account</span>
              </Link>
            )}
          </>
        )}
        {cartCount > 0 && (
          <Link
            href="/cart"
            className={cn(
              buttonStyleInactive,
              "bg-white text-black",
              "hover:bg-black hover:text-white"
            )}
          >
            <RiShoppingCart2Line
              size={20}
              color="black"
            />
          </Link>
        )}
      </nav>

      <SearchPanel
        isOpen={searchOpen}
        onClose={closeSearch}
      />
    </>
  );
}
