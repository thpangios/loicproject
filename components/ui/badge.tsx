import { cn } from "@/lib/utils";

type Tone = "neutral" | "info" | "warning" | "success" | "danger" | "gold";

const tones: Record<Tone, string> = {
  neutral: "bg-cream-100 text-ink-muted border-cream-200",
  info: "bg-navy-50 text-navy-700 border-navy-100",
  warning: "bg-[#FBF1DE] text-[#8C6B2C] border-[#F1E2BF]",
  success: "bg-[#E5F1EB] text-[#2F7A5C] border-[#CCE3D5]",
  danger: "bg-[#F5E2E0] text-[#A8413A] border-[#ECC9C5]",
  gold: "bg-[#F4ECD8] text-[#7A5A22] border-[#E5D6AE]",
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
