import type { ReactNode } from "react";
import { cn } from "@/utils/class-names";

type AccountPageHeaderProps = {
  /** Small uppercase label above the title, e.g. section number or category */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Right-aligned actions (buttons, links) */
  actions?: ReactNode;
  className?: string;
};

/**
 * Swiss-style page header for the account dashboard:
 * a heavy rule, a small tracked label, a Godo display title,
 * and an optional ragged-right description set in Sotto.
 */
export default function AccountPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: AccountPageHeaderProps) {
  return (
    <header
      className={cn(
        "swiss-rule grid w-full grid-cols-12 gap-x-6 pt-3 pb-12",
        className
      )}
    >
      <div className="col-span-8 flex flex-col">
        {eyebrow && (
          <div className="swiss-label mb-6 flex items-center gap-2 text-neutral-500">
            <span className="inline-block h-2 w-2 bg-swiss-red" />
            {eyebrow}
          </div>
        )}
        <h1 className="swiss-h1">{title}</h1>
        {description && (
          <p className="swiss-body mt-6 text-neutral-600">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="col-span-4 flex items-start justify-end gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}
