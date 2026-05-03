import { cn } from "@/lib/utils";

type Tone = "neutral" | "info" | "warning" | "success" | "danger" | "gold";

const tones: Record<Tone, string> = {
  neutral: "bg-navy-800/82 text-ink-muted border-line",
  info: "bg-[rgba(88,120,168,0.15)] text-navy-100 border-[rgba(88,120,168,0.22)]",
  warning: "bg-[rgba(214,168,93,0.14)] text-warning border-[rgba(214,168,93,0.22)]",
  success: "bg-[rgba(112,186,141,0.14)] text-success border-[rgba(112,186,141,0.22)]",
  danger: "bg-[rgba(217,117,106,0.14)] text-danger border-[rgba(217,117,106,0.22)]",
  gold: "bg-[rgba(198,154,86,0.15)] text-gold-400 border-[rgba(198,154,86,0.22)]",
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
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
