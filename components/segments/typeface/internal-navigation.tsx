"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useState } from "react";
import SimpleButton from "@/components/molecules/buttons/simple-button";

export default function TypefaceInternalNavigation() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest;
    const scrollDifference = currentScrollY - lastScrollY;

    if (scrollDifference > 5 && currentScrollY > 100) {
      setIsVisible(false);
    } else if (scrollDifference < -5) {
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  });

  const buttons = [
    {
      href: "#tester",
      label: "Test",
      width: "140px",
      delay: 0,
    },
    {
      href: "#updates",
      label: "Updates",
      width: "140px",
      delay: 0.1,
    },
    {
      href: "#shop",
      label: "Shop",
      width: "140px",
      delay: 0.2,
    },
  ];

  return (
    <div className="fixed bottom-5 left-0 z-100 flex w-full flex-row gap-x-2 px-4 lg:left-1/2 lg:w-auto lg:-translate-x-1/2 lg:px-0">
      {buttons.map((button) => (
        <motion.div
          key={button.href}
          className="min-w-0 flex-1 lg:flex-none"
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: isVisible ? 0 : 100,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            delay: isVisible
              ? button.delay
              : button.delay * 0.5,
          }}
        >
          <SimpleButton
            href={button.href}
            label={button.label}
            width={button.width}
            className="w-full min-w-0 shrink lg:w-[140px]"
          />
        </motion.div>
      ))}
    </div>
  );
}
