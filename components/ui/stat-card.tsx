import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  delta,
  icon: Icon,
  tone = "default",
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  delta?: string;
  icon?: LucideIcon;
  tone?: "default" | "warning" | "success" | "danger";
  className?: string;
}) {
  const toneRing: Record<string, string> = {
    default: "text-gold-400 bg-[rgba(232,190,120,0.08)] border border-[rgba(232,190,120,0.15)]",
    warning: "text-warning bg-[rgba(224,173,76,0.14)] border border-[rgba(224,173,76,0.18)]",
    success: "text-success bg-[rgba(87,194,138,0.14)] border border-[rgba(87,194,138,0.18)]",
    danger: "text-danger bg-[rgba(226,110,102,0.14)] border border-[rgba(226,110,102,0.18)]",
  };
  return (
    <div className={cn("metric-tile kpi", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="label">{label}</div>
          <div className="kpi-value mt-3 font-display text-3xl leading-none text-ink tabular-nums">{value}</div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {delta && (
              <span className="rounded-full border border-[rgba(87,194,138,0.18)] bg-[rgba(87,194,138,0.1)] px-2 py-0.5 text-[11px] font-medium text-success">
                {delta}
              </span>
            )}
            {hint && <div className="text-xs text-ink-muted">{hint}</div>}
          </div>
        </div>
        {Icon && (
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", toneRing[tone])}>
            <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
          </div>
        )}
      </div>
    </div>
  );
}
