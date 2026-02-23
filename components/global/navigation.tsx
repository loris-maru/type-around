"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CartPanel from "@/components/global/cart-panel";
import SearchPanel from "@/components/molecules/search";
import { useCartStore } from "@/stores/cart";
import DesktopNavigation from "./navigation/desktop-navigation";
import MobileTabletNavigation from "./navigation/mobile-tablet-navigation";

export default function Navigation() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);
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
    setMobileMenuOpen(false);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setCartOpen((prev) => !prev);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  }, []);

  const closeCart = useCallback(() => {
    setCartOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
    setSearchOpen(false);
    setCartOpen(false);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      <DesktopNavigation
        searchOpen={searchOpen}
        cartOpen={cartOpen}
        cartCount={cartCount}
        showAuth={showAuth}
        isSignedIn={!!isSignedIn}
        isSignedInPage={isSignedInPage}
        onToggleSearch={toggleSearch}
        onToggleCart={toggleCart}
      />

      <MobileTabletNavigation
        searchOpen={searchOpen}
        cartOpen={cartOpen}
        mobileMenuOpen={mobileMenuOpen}
        cartCount={cartCount}
        showAuth={showAuth}
        isSignedIn={!!isSignedIn}
        isSignedInPage={isSignedInPage}
        onToggleSearch={toggleSearch}
        onToggleCart={toggleCart}
        onToggleMobileMenu={toggleMobileMenu}
        onCloseMobileMenu={closeMobileMenu}
      />

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
