import Link from "next/link";
import LinksList from "./footer/links-list";
import SocialMediaNewsletter from "./footer/social-media-newsletter";
import {
  FOOTER_LINKS,
  PRIMARY_LINKS,
} from "@/constant/FOOTER_LINKS";

export default function Footer() {
  return (
    <footer className="relative w-full h-[40vh] p-10 flex flex-row justify-between items-center mt-44">
      <div className="relative flex flex-row gap-2 w-1/2 h-full">
        <div className="relative grid grid-rows-2 gap-1 h-full">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.body}
              href={link.href}
              className="w-[400px] p-5 rounded-lg border border-neutral-300 text-black bg-transparent transition-all duration-300 ease-in-out"
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
