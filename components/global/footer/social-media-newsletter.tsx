"use client";

import Link from "next/link";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { SOCIAL_MEDIA_LINKS } from "@/constant/SOCIAL_MEDIA_LINKS";
import { cn } from "@/utils/class-names";

type SubscribeStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

export default function SocialMediaNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] =
    useState<SubscribeStatus>("idle");
  const [message, setMessage] = useState("");
  const timerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!email.trim()) return;

      setStatus("loading");
      setMessage("");

      try {
        const response = await fetch(
          "/api/newsletter/subscribe",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );

        const data = (await response.json()) as {
          success: boolean;
          message: string;
        };

        if (data.success) {
          setStatus("success");
          setMessage(data.message);
          setEmail("");

          // Revert to idle after 6 seconds
          timerRef.current = setTimeout(() => {
            setStatus("idle");
            setMessage("");
          }, 6000);
        } else {
          setStatus("error");
          setMessage(data.message);
        }
      } catch {
        setStatus("error");
        setMessage(
          "Something went wrong. Please try again."
        );
      }
    },
    [email]
  );

  return (
    <div className="relative flex w-1/3 flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        {SOCIAL_MEDIA_LINKS.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-neutral-300 py-10 text-black text-xs transition-all duration-300 ease-in-out hover:bg-black hover:text-light-gray"
          >
            <div>{link.icon}</div>
            <div>{link.name}</div>
          </Link>
        ))}
      </div>

      <div className="relative flex w-full flex-col items-start gap-2 rounded-lg border border-neutral-300 p-4">
        {status === "success" ? (
          <div className="flex w-full items-center gap-2 py-4 text-green-600">
            <RiCheckboxCircleFill
              size={20}
              className="shrink-0"
            />
            <span className="font-whisper text-base">
              Thanks for subscribing! Talk to you soon.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col items-start gap-2"
          >
            <label htmlFor="newsletter-email">
              Stay updated:
            </label>
            <input
              type="email"
              id="newsletter-email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="Enter your email..."
              required
              aria-label="Email address for newsletter"
              className="w-full bg-white p-3 font-whisper text-base text-black placeholder:text-neutral-400"
            />

            {status === "error" && message && (
              <output className="font-whisper text-red-500 text-sm">
                {message}
              </output>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              aria-label="Subscribe to newsletter"
              className={cn(
                "mt-2 cursor-pointer rounded-md bg-black px-4 py-2 font-whisper text-base text-white transition-colors",
                status === "loading" &&
                  "cursor-not-allowed opacity-60"
              )}
            >
              {status === "loading"
                ? "Subscribing..."
                : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
