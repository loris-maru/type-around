import Link from "next/link";
import LinksList from "./footer/links-list";
import SocialMediaNewsletter from "./footer/social-media-newsletter";

const FOOTER_LINKS: { href: string; label: string }[] = [
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

const PRIMARY_LINKS: { href: string; label: string; body: string }[] = [
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

export default function Footer() {
  return (
    <footer className="relative w-full h-[40vh] p-10 flex flex-row justify-between items-center">
      <div className="relative flex flex-row gap-2 w-1/2 h-full">
        <div className="relative grid grid-rows-2 gap-1 h-full">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.body}
              href={link.href}
              className="w-[400px] p-5 rounded-lg border border-neutral-300 text-black bg-light-gray transition-all duration-300 ease-in-out hover:bg-light-gray hover:text-white"
            >
              <div className="text-base font-whisper text-black">
                {link.label}
              </div>
              <div className="text-4xl font-bold font-ortank text-black whitespace-nowrap">
                {link.body}
              </div>
            </Link>
          ))}
        </div>
        <LinksList links={FOOTER_LINKS} />
      </div>

      <SocialMediaNewsletter />
    </footer>
  );
}
