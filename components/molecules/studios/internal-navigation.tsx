"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useState } from "react";
import SimpleButton from "../buttons/simple-button";

export default function StudioInternalNavigation() {
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
      href: "#about",
      label: "About",
      width: "140px",
      widthMobile: "100px",
      widthSuperDesktop: "180px",
      delay: 0,
    },
    {
      href: "#tester",
      label: "Tester",
      width: "140px",
      widthMobile: "100px",
      widthSuperDesktop: "180px",
      delay: 0.1,
    },
    {
      href: "#families",
      label: "Families",
      width: "140px",
      widthMobile: "100px",
      widthSuperDesktop: "180px",
      delay: 0.2,
    },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 z-100 flex -translate-x-1/2 flex-row gap-x-2">
      {buttons.map((button) => (
        <motion.div
          key={button.href}
          className="shrink-0"
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
            widthMobile={button.widthMobile}
            widthSuperDesktop={button.widthSuperDesktop}
          />
        </motion.div>
      ))}
    </div>
  );
}
