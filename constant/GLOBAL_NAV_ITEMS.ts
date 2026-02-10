export interface NavigationItem {
  label: string;
  href: string;
}

export const GLOBAL_NAV_ITEMS: NavigationItem[] = [
  {
    label: "Fonts",
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
];
