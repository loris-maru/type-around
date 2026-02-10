import Link from "next/link";
import {
  FOOTER_LINKS,
  PRIMARY_LINKS,
} from "@/constant/FOOTER_LINKS";
import LinksList from "./footer/links-list";
import SocialMediaNewsletter from "./footer/social-media-newsletter";

export default function Footer() {
  return (
    <footer className="relative mt-44 flex h-[40vh] w-full flex-row items-center justify-between p-10">
      <div className="relative flex h-full w-1/2 flex-row gap-2">
        <div className="relative grid h-full grid-rows-2 gap-1">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.body}
              href={link.href}
              className="w-[400px] rounded-lg border border-neutral-300 bg-transparent p-5 text-black transition-all duration-300 ease-in-out"
            >
              <div className="font-whisper text-base text-black">
                {link.label}
              </div>
              <div className="whitespace-nowrap font-bold font-ortank text-4xl text-black">
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
