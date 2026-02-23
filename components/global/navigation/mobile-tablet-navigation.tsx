"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import {
  RiAlbumFill,
  RiCloseLine,
  RiSearchLine,
  RiShoppingCart2Line,
  RiUser3Line,
} from "react-icons/ri";
import { GLOBAL_NAV_ITEMS } from "@/constant/GLOBAL_NAV_ITEMS";
import { cn } from "@/utils/class-names";
import Logo from "../logo";

const MOBILE_MENU_VIOLET = "#5b21b6";
const ITEM_STAGGER_DELAY = 0.1;
const PANEL_SPRING = {
  type: "spring" as const,
  stiffness: 90,
  damping: 26,
};
/** Delay before menu items start (after both panels finish ~1s) */
const MENU_ITEMS_ENTER_DELAY = 1.0;

type MobileTabletNavigationProps = {
  searchOpen: boolean;
  cartOpen: boolean;
  mobileMenuOpen: boolean;
  cartCount: number;
  showAuth: boolean;
  isSignedIn: boolean;
  isSignedInPage: boolean;
  onToggleSearch: () => void;
  onToggleCart: () => void;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
};

const iconButtonStyle =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-black transition-colors hover:bg-black hover:text-white";

export default function MobileTabletNavigation({
  searchOpen,
  cartOpen,
  mobileMenuOpen,
  cartCount,
  showAuth,
  isSignedIn,
  isSignedInPage,
  onToggleSearch,
  onToggleCart,
  onToggleMobileMenu,
  onCloseMobileMenu,
}: MobileTabletNavigationProps) {
  const pathname = usePathname();
  const [closingPhase, setClosingPhase] = useState<
    "idle" | "items-out" | "panels-out"
  >("idle");

  const handleClose = useCallback(() => {
    if (closingPhase !== "idle") return;
    setClosingPhase("items-out");
  }, [closingPhase]);

  const handleItemsExitComplete = useCallback(() => {
    setClosingPhase("panels-out");
  }, []);

  const handlePanelsExitComplete = useCallback(() => {
    onCloseMobileMenu();
    setClosingPhase("idle");
  }, [onCloseMobileMenu]);

  return (
    <>
      {/* Mobile/tablet navigation — icon-only bar */}
      <nav className="fixed top-5 right-0 left-0 z-40 flex items-center justify-between px-5 lg:hidden">
        <Link
          href="/"
          className="flex items-center"
          aria-label="Home"
        >
          <Logo className="h-auto w-16 text-black md:w-[4.55rem]" />
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={
              searchOpen ? "Close search" : "Search"
            }
            onClick={onToggleSearch}
            className={cn(
              iconButtonStyle,
              searchOpen && "bg-black text-white"
            )}
          >
            {searchOpen ? (
              <RiCloseLine size={20} />
            ) : (
              <RiSearchLine size={20} />
            )}
          </button>

          {showAuth &&
            (!isSignedIn && !isSignedInPage ? (
              <Link
                href="/sign-in"
                aria-label="Login"
                className={iconButtonStyle}
              >
                <RiUser3Line size={20} />
              </Link>
            ) : (
              isSignedIn && (
                <Link
                  href="/account"
                  aria-label="Account"
                  className={cn(
                    iconButtonStyle,
                    pathname.startsWith("/account") &&
                      "bg-black text-white"
                  )}
                >
                  <RiUser3Line size={20} />
                </Link>
              )
            ))}

          {(cartCount > 0 || cartOpen) && (
            <button
              type="button"
              onClick={onToggleCart}
              aria-label={
                cartOpen ? "Close cart" : "Open cart"
              }
              className={cn(
                iconButtonStyle,
                cartOpen && "bg-black text-white"
              )}
            >
              {cartOpen ? (
                <RiCloseLine size={20} />
              ) : (
                <span className="relative">
                  <RiShoppingCart2Line size={20} />
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 font-bold font-whisper text-[10px] text-white leading-none">
                    {cartCount}
                  </span>
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            aria-label={
              mobileMenuOpen ? "Close menu" : "Open menu"
            }
            onClick={onToggleMobileMenu}
            className={cn(
              iconButtonStyle,
              mobileMenuOpen && "bg-black text-white"
            )}
          >
            <RiAlbumFill size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile/tablet menu overlay — slides from right */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity:
                  closingPhase === "panels-out" ? 0 : 1,
              }}
              exit={{ opacity: 0 }}
              transition={
                closingPhase === "panels-out"
                  ? { duration: 0.3 }
                  : { duration: 0.5, ease: "easeOut" }
              }
              className="fixed inset-0 z-50 lg:hidden"
              onClick={handleClose}
              aria-hidden
            />

            {/* Violet panel — slides in first */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{
                x:
                  closingPhase === "panels-out"
                    ? "100%"
                    : 0,
              }}
              exit={{ x: "100%" }}
              transition={PANEL_SPRING}
              className="fixed top-0 right-0 z-50 h-screen w-screen lg:hidden"
              style={{
                backgroundColor: MOBILE_MENU_VIOLET,
              }}
            />

            {/* Black panel — slides in second (delayed) */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{
                x:
                  closingPhase === "panels-out"
                    ? "100%"
                    : 0,
              }}
              exit={{ x: "100%" }}
              transition={
                closingPhase === "panels-out"
                  ? PANEL_SPRING
                  : { ...PANEL_SPRING, delay: 0.2 }
              }
              onAnimationComplete={
                closingPhase === "panels-out"
                  ? handlePanelsExitComplete
                  : undefined
              }
              className="fixed top-0 right-0 z-50 flex h-screen w-screen flex-col bg-black pt-20 pr-8 pb-12 pl-8 lg:hidden"
            >
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close menu"
                className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-neutral-800"
              >
                <RiCloseLine size={44} />
              </button>

              {/* Menu items container — upper left, each item slides up from its own overflow container */}
              <div className="absolute top-12 left-12 flex flex-1 flex-col items-start justify-start gap-4">
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{
                      y:
                        closingPhase === "items-out"
                          ? "100%"
                          : 0,
                    }}
                    exit={{ y: "100%" }}
                    transition={{
                      ...PANEL_SPRING,
                      delay:
                        closingPhase === "items-out"
                          ? 0
                          : MENU_ITEMS_ENTER_DELAY,
                    }}
                  >
                    <Link
                      href="/"
                      onClick={handleClose}
                      className="block"
                      aria-label="Home"
                    >
                      <Logo className="h-auto w-44 text-white md:w-42" />
                    </Link>
                  </motion.div>
                </div>
                {GLOBAL_NAV_ITEMS.map((item, index) => {
                  const isActive = pathname.startsWith(
                    item.href
                  );
                  const isItemsOut =
                    closingPhase === "items-out";
                  const isLastItem =
                    index === GLOBAL_NAV_ITEMS.length - 1;
                  return (
                    <div
                      key={item.href}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{
                          y: isItemsOut ? "100%" : 0,
                        }}
                        exit={{ y: "100%" }}
                        transition={{
                          ...PANEL_SPRING,
                          delay: isItemsOut
                            ? index * ITEM_STAGGER_DELAY
                            : index * ITEM_STAGGER_DELAY +
                              MENU_ITEMS_ENTER_DELAY,
                        }}
                        onAnimationComplete={
                          isItemsOut && isLastItem
                            ? handleItemsExitComplete
                            : undefined
                        }
                      >
                        <Link
                          href={item.href}
                          onClick={handleClose}
                          className={cn(
                            "block rounded-lg font-bold font-ortank text-[3.375rem] transition-colors md:text-[5.625rem]",
                            isActive
                              ? "bg-white text-black"
                              : "text-white hover:bg-neutral-800"
                          )}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
