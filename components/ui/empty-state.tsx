import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card flex flex-col items-center justify-center px-8 py-16 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(232,190,120,0.18)] bg-[rgba(232,190,120,0.08)] text-gold-400">
          <Icon className="w-6 h-6" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="mb-1.5 font-display text-xl text-ink">{title}</h3>
      {description && <p className="mb-5 max-w-md text-sm leading-6 text-ink-muted">{description}</p>}
      {action}
    </div>
  );
}
