import { cn } from "@/lib/utils";

type Tone = "neutral" | "info" | "warning" | "success" | "danger" | "gold";

const tones: Record<Tone, string> = {
  neutral: "bg-navy-900/70 text-ink-muted border-line",
  info: "bg-[rgba(110,136,180,0.14)] text-navy-100 border-[rgba(110,136,180,0.22)]",
  warning: "bg-[rgba(224,173,76,0.14)] text-warning border-[rgba(224,173,76,0.22)]",
  success: "bg-[rgba(87,194,138,0.14)] text-success border-[rgba(87,194,138,0.22)]",
  danger: "bg-[rgba(226,110,102,0.14)] text-danger border-[rgba(226,110,102,0.22)]",
  gold: "bg-[rgba(232,190,120,0.14)] text-gold-400 border-[rgba(232,190,120,0.2)]",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
