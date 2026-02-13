"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  RiCloseLine,
  RiSearchLine,
  RiShoppingCart2Line,
  RiUser3Line,
} from "react-icons/ri";
import CartPanel from "@/components/global/cart-panel";
import SearchPanel from "@/components/molecules/search";
import { GLOBAL_NAV_ITEMS } from "@/constant/GLOBAL_NAV_ITEMS";
import { useCartStore } from "@/stores/cart";
import { cn } from "@/utils/class-names";

export default function Navigation() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, []);

  const isSignedInPage = pathname === "/sign-in";
  const showAuth = mounted && isLoaded;

  const cartCount = useCartStore(
    (state) => state.cart.length
  );

  const toggleSearch = useCallback(() => {
    setSearchOpen((prev) => !prev);
    setCartOpen(false);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setCartOpen((prev) => !prev);
    setSearchOpen(false);
  }, []);

  const closeCart = useCallback(() => {
    setCartOpen(false);
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
        {GLOBAL_NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonStyleInactive,
                isActive
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-black hover:text-white"
              )}
            >
              {item.label}
            </Link>
          );
        })}
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

        {/* Auth buttons - only render after mount + Clerk load to prevent hydration mismatch */}
        {showAuth && !isSignedIn && !isSignedInPage && (
          <Link
            href="/sign-in"
            className={cn(
              buttonStyleInactive,
              pathname.startsWith("/sign-in")
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:text-white"
            )}
            aria-label="Login"
          >
            Login
          </Link>
        )}

        {showAuth && isSignedIn && (
          <Link
            href="/account"
            aria-label="to Account"
            className={cn(
              buttonStyleInactive,
              pathname.startsWith("/account")
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:text-white"
            )}
          >
            <RiUser3Line size={16} />
            <span>Account</span>
          </Link>
        )}

        {/* Cart button — only visible when items in cart */}
        {cartCount > 0 && (
          <button
            type="button"
            onClick={toggleCart}
            aria-label={
              cartOpen ? "Close cart" : "Open cart"
            }
            className={cn(
              buttonStyleInactive,
              "justify-center",
              cartOpen
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:text-white"
            )}
          >
            <span className="relative">
              {cartOpen ? (
                <RiCloseLine size={18} />
              ) : (
                <>
                  <RiShoppingCart2Line size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 font-bold font-whisper text-[10px] text-white leading-none">
                      {cartCount}
                    </span>
                  )}
                </>
              )}
            </span>
          </button>
        )}
      </nav>

      <SearchPanel
        isOpen={searchOpen}
        onClose={closeSearch}
      />
      <CartPanel
        isOpen={cartOpen}
        onClose={closeCart}
      />
    </>
  );
}
