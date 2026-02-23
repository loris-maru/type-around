import { type MotionValue, motion } from "motion/react";
import { StudioCard } from "@/components/molecules/cards";
import type { Studio } from "@/types/typefaces";
import { cn } from "@/utils/class-names";

export default function StudiosDesktop({
  studios,
  columnY,
}: {
  studios: Studio[];
  columnY: MotionValue<number>[];
}) {
  return (
    <div className="relative hidden w-full flex-row gap-12 lg:flex">
      {[0, 1, 2].map((colIndex) => (
        <motion.div
          key={`studio-col-${colIndex}`}
          className={cn(
            "flex flex-1 flex-col gap-12",
            colIndex === 1 ? "mt-[200px]" : ""
          )}
          style={{ y: columnY[colIndex] }}
        >
          {studios
            .filter((_, i) => i % 3 === colIndex)
            .map((studio) => (
              <StudioCard
                key={studio.id}
                studio={studio}
              />
            ))}
        </motion.div>
      ))}
    </div>
  );
}
