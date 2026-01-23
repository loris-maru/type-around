import IconMessage from "@/components/icons/icon-message";
import { Studio } from "@/types/typefaces";
import Link from "next/link";
import Image from "next/image";
import IconInstagram from "@/components/icons/icon-instagram";
import IconTwitter from "@/components/icons/icon-twitter";
import IconLinkedin from "@/components/icons/icon-linkedin";

export default function StudioIdCard({
  studio,
}: {
  studio: Studio;
}) {
  return (
    <div className="relative w-full px-[20vw] grid grid-cols-3 gap-x-2">
      <Link
        href={`mailto:${studio.email}`}
        className="relative flex flex-col justify-between bg-white rounded-xl p-5"
      >
        <div>
          <div className="font-whisper text-base font-normal">
            Contact
          </div>
          <div className="font-black text-3xl font-ortank">
            {studio.name}
          </div>
        </div>
        <IconMessage className="w-6 h-6 text-black" />
      </Link>
      <div className="relative flex flex-col justify-between bg-transparent border border-neutral-300 rounded-xl p-5">
        <div className="text-black font-whisper text-sm">
          Follow us on:
        </div>
        <div className="relative grid grid-cols-3 gap-x-2">
          <Link
            href="#"
            className="relative flex flex-col justify-center items-center w-full h-20 border border-neutral-300 rounded-lg"
          >
            <IconInstagram className="w-6 h-6 text-black" />
          </Link>
          <Link
            href="#"
            className="relative flex flex-col justify-center items-center w-full h-20 border border-neutral-300 rounded-lg"
          >
            <IconTwitter className="w-6 h-6 text-black" />
          </Link>
          <Link
            href="#"
            className="relative flex flex-col justify-center items-center w-full h-20 border border-neutral-300 rounded-lg"
          >
            <IconLinkedin className="w-6 h-6 text-black" />
          </Link>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-xl p-5">
        <Image
          src={studio.imageCover}
          alt={studio.name}
          width={100}
          height={100}
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
}
