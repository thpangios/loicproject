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
        "rounded-full bg-navy-600 text-cream-50 font-medium flex items-center justify-center shrink-0",
        className,
      )}
      style={{ width: size, height: size, fontSize }}
    >
      {initials(name) || "?"}
    </div>
  );
}
