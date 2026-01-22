import Link from "next/link";
import IconInstagram from "@/components/icons/icon-instagram";
import IconLinkedin from "@/components/icons/icon-linkedin";
import IconTwitter from "@/components/icons/icon-twitter";

export const SOCIAL_MEDIA_LINKS = [
  {
    name: "Instagram",
    href: "/",
    icon: <IconInstagram />,
  },
  {
    name: "Twitter",
    href: "/",
    icon: <IconTwitter />,
  },
  {
    name: "LinkedIn",
    href: "/",
    icon: <IconLinkedin />,
  },
];

export default function SocialMediaNewsletter() {
  return (
    <div className="relative w-1/3 flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        {SOCIAL_MEDIA_LINKS.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex flex-col gap-2 items-center justify-center rounded-lg border border-neutral-300 py-10 bg-light-gray text-black transition-all duration-300 ease-in-out hover:bg-black hover:text-light-gray"
          >
            <div>{link.icon}</div>
            <div>{link.name}</div>
          </Link>
        ))}
      </div>
      <form className="relative w-full flex flex-col items-start gap-2 p-4 border border-neutral-300 rounded-lg">
        <label htmlFor="email">Stay updated:</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email..."
          className="p-3 w-full bg-white text-base font-whisper text-black placeholder:text-neutral-400"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md font-whisper text-base mt-2 cursor-pointer"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
