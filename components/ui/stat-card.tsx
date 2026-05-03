import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "warning" | "success" | "danger";
  className?: string;
}) {
  const toneRing: Record<string, string> = {
    default: "text-gold-400 bg-navy-800/88 border border-line",
    warning: "text-warning bg-[rgba(214,168,93,0.14)] border border-[rgba(214,168,93,0.18)]",
    success: "text-success bg-[rgba(112,186,141,0.14)] border border-[rgba(112,186,141,0.18)]",
    danger: "text-danger bg-[rgba(217,117,106,0.14)] border border-[rgba(217,117,106,0.18)]",
  };
  return (
    <div className={cn("card p-5 kpi", className)}>
      <div className="flex items-start justify-between">
        <div>
          <div className="label">{label}</div>
          <div className="font-display text-3xl text-ink mt-2 tabular-nums leading-none kpi-value">{value}</div>
          {hint && <div className="text-xs text-ink-muted mt-2">{hint}</div>}
        </div>
        {Icon && (
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", toneRing[tone])}>
            <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
          </div>
        )}
      </div>
    </div>
  );
}
