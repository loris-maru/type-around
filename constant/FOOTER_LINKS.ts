export type FooterLink = {
  href: string;
  label: string;
};

export const FOOTER_LINKS: FooterLink[] = [
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/faq",
    label: "FAQ",
  },
  {
    href: "/privacy-policy",
    label: "Privacy Policy",
  },
  {
    href: "/terms-of-service",
    label: "Terms of Service",
  },
  {
    href: "/support",
    label: "Support",
  },
  {
    href: "/",
    label: "Contact us",
  },
];

export interface PrimaryLink {
  href: string;
  label: string;
  body: string;
}

export const PRIMARY_LINKS: PrimaryLink[] = [
  {
    href: "/",
    label: "Discover",
    body: "All fonts",
  },
  {
    href: "/",
    label: "Browse",
    body: "All studios",
  },
];
