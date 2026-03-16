import Image from "next/image";
import Link from "next/link";
import IconInstagram from "@/components/icons/icon-instagram";
import IconLinkedin from "@/components/icons/icon-linkedin";
import IconMessage from "@/components/icons/icon-message";
import IconTwitter from "@/components/icons/icon-twitter";
import type { Studio } from "@/types/typefaces";

export default function StudioIdCard({
  studio,
}: {
  studio: Studio;
}) {
  return (
    <div className="relative grid w-full grid-cols-3 gap-x-2 px-[20vw]">
      <Link
        href={`mailto:${studio.email}`}
        className="relative flex flex-col justify-between rounded-xl bg-white p-5"
      >
        <div>
          <div className="font-normal font-whisper text-base">
            Contact
          </div>
          <div className="font-black font-ortank text-3xl">
            {studio.name}
          </div>
        </div>
        <IconMessage className="h-6 w-6 text-black" />
      </Link>
      <div className="relative flex flex-col justify-between rounded-xl border border-neutral-300 bg-transparent p-5">
        <div className="font-whisper text-black text-sm">
          Follow us on:
        </div>
        <div className="relative grid grid-cols-3 gap-x-2">
          <Link
            href="#"
            className="relative flex h-20 w-full flex-col items-center justify-center rounded-lg border border-neutral-300"
          >
            <IconInstagram className="h-6 w-6 text-black" />
          </Link>
          <Link
            href="#"
            className="relative flex h-20 w-full flex-col items-center justify-center rounded-lg border border-neutral-300"
          >
            <IconTwitter className="h-6 w-6 text-black" />
          </Link>
          <Link
            href="#"
            className="relative flex h-20 w-full flex-col items-center justify-center rounded-lg border border-neutral-300"
          >
            <IconLinkedin className="h-6 w-6 text-black" />
          </Link>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-xl p-5">
        {studio.imageCover?.trim() ? (
          <Image
            src={studio.imageCover.trim()}
            alt={studio.name}
            width={100}
            height={100}
            className="h-auto w-full object-cover"
          />
        ) : (
          <div className="flex h-[100px] w-full items-center justify-center bg-neutral-200">
            <span className="font-black font-ortank text-2xl text-neutral-400">
              {studio.name.charAt(0) || "?"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
