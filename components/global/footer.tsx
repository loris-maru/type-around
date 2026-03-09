import Link from "next/link";
import {
  FOOTER_LINKS,
  PRIMARY_LINKS,
} from "@/constant/FOOTER_LINKS";
import LinksList from "./footer/links-list";
import SocialMediaNewsletter from "./footer/social-media-newsletter";

export default function Footer() {
  return (
    <footer className="relative mt-44 flex min-h-[60vh] w-full flex-col items-center justify-between gap-4 p-5 lg:min-h-[40vh] lg:flex-row lg:p-10">
      <div className="relative flex h-full w-full flex-col gap-2 lg:w-1/2 lg:flex-row">
        <div className="relative flex h-full w-full grid-rows-2 flex-col gap-1 lg:grid lg:w-auto">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={`${link.href}-${link.body}`}
              href={link.href}
              className="w-full max-w-[400px] rounded-lg border border-neutral-300 bg-transparent p-5 text-2xl text-black transition-all duration-300 ease-in-out lg:w-[400px] lg:text-base"
              suppressHydrationWarning
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
