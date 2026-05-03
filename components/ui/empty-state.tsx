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
        "card flex flex-col items-center justify-center text-center px-8 py-16",
        className,
      )}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-navy-800/82 border border-line flex items-center justify-center text-gold-400 mb-4">
          <Icon className="w-6 h-6" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="font-display text-lg text-ink mb-1.5">{title}</h3>
      {description && <p className="text-sm text-ink-muted max-w-md mb-5">{description}</p>}
      {action}
    </div>
  );
}
