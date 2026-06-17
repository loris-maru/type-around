"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  RiCloseLine,
  RiMenuUnfoldFill,
  RiSearchLine,
  RiShoppingCart2Line,
  RiUser3Line,
} from "react-icons/ri";
import { GLOBAL_NAV_ITEMS } from "@/constant/GLOBAL_NAV_ITEMS";
import { cn } from "@/utils/class-names";
import Logo from "../logo";

type DesktopNavigationProps = {
  searchOpen: boolean;
  cartOpen: boolean;
  cartCount: number;
  showAuth: boolean;
  isSignedIn: boolean;
  isSignedInPage: boolean;
  onToggleSearch: () => void;
  onToggleCart: () => void;
};

const buttonStyleInactive =
  "relative flex w-full flex-row items-center gap-x-2 rounded-lg px-3.5 py-1 font-whisper text-sm font-light transition-all duration-300 ease-in-out";

export default function DesktopNavigation({
  searchOpen,
  cartOpen,
  cartCount,
  showAuth,
  isSignedIn,
  isSignedInPage,
  onToggleSearch,
  onToggleCart,
}: DesktopNavigationProps) {
  const pathname = usePathname();
  const isAccountPage = pathname?.startsWith("/account");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, [menuOpen]);

  /* ── Account page: compact nav — logo left, Menu button right ── */
  if (isAccountPage) {
    return (
      <nav className="fixed top-5 left-0 z-40 hidden w-full items-center justify-between px-5 lg:flex">
        <Link
          href="/"
          className={cn(
            buttonStyleInactive,
            "bg-transparent font-bold font-ortank text-xl"
          )}
        >
          <Logo className="h-auto w-14 text-black" />
        </Link>

        <div
          ref={menuRef}
          className="relative w-36"
        >
          <button
            type="button"
            aria-label={
              menuOpen ? "Close menu" : "Open menu"
            }
            onClick={() => setMenuOpen((p) => !p)}
            className={cn(
              buttonStyleInactive,
              "w-full justify-between",
              menuOpen
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:text-white"
            )}
          >
            <span>Menu</span>
            <RiMenuUnfoldFill size={16} />
          </button>

          {menuOpen && (
            <div className="absolute top-full right-0 z-50 mt-1 flex min-w-[180px] flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg">
              {GLOBAL_NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(
                  item.href
                );
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "px-4 py-2.5 font-whisper text-sm transition-colors",
                      isActive
                        ? "bg-black text-white"
                        : "text-black hover:bg-neutral-50"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  onToggleSearch();
                  setMenuOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 font-whisper text-sm transition-colors",
                  searchOpen
                    ? "bg-black text-white"
                    : "text-black hover:bg-neutral-50"
                )}
              >
                {searchOpen ? (
                  <RiCloseLine size={14} />
                ) : (
                  <RiSearchLine size={14} />
                )}
                <span>
                  {searchOpen ? "Close" : "Search"}
                </span>
              </button>
              {cartCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleCart();
                    setMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 font-whisper text-sm transition-colors",
                    cartOpen
                      ? "bg-black text-white"
                      : "text-black hover:bg-neutral-50"
                  )}
                >
                  <RiShoppingCart2Line size={14} />
                  <span>Cart ({cartCount})</span>
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    );
  }

  /* ── Default nav (non-account pages) ── */
  return (
    <nav
      className={cn(
        "fixed top-5 left-0 z-40 hidden w-full gap-x-0.5 px-5 lg:grid",
        cartCount > 0 ? "grid-cols-8" : "grid-cols-7"
      )}
    >
      <Link
        href="/"
        className={cn(
          buttonStyleInactive,
          "bg-transparent font-bold font-ortank text-xl"
        )}
      >
        <Logo className="h-auto w-14 text-black" />
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
        aria-label={searchOpen ? "Close search" : "Search"}
        onClick={onToggleSearch}
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

      {cartCount > 0 && (
        <button
          type="button"
          onClick={onToggleCart}
          aria-label={cartOpen ? "Close cart" : "Open cart"}
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
  );
}
