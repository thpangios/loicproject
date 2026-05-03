import { cn, initials } from "@/lib/utils";

export function Avatar({
  name,
  size = 36,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const fontSize = Math.max(11, Math.round(size * 0.38));
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-[rgba(232,190,120,0.12)] bg-[radial-gradient(circle_at_30%_20%,rgba(232,190,120,0.28),rgba(78,103,145,0.85)_42%,rgba(17,28,46,0.96)_100%)] font-semibold text-cream-50 shadow-[0_14px_30px_rgba(3,9,20,0.26)]",
        className,
      )}
      style={{ width: size, height: size, fontSize }}
    >
      {initials(name) || "?"}
    </div>
  );
}
