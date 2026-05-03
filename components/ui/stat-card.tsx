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
    default: "text-navy-600 bg-navy-50",
    warning: "text-[#8C6B2C] bg-[#FBF1DE]",
    success: "text-[#2F7A5C] bg-[#E5F1EB]",
    danger: "text-[#A8413A] bg-[#F5E2E0]",
  };
  return (
    <div className={cn("card p-5", className)}>
      <div className="flex items-start justify-between">
        <div>
          <div className="label">{label}</div>
          <div className="font-display text-3xl text-ink mt-2 tabular-nums leading-none">{value}</div>
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
