import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-6 mb-8", className)}>
      <div>
        {eyebrow && <div className="label text-gold-600 mb-2">{eyebrow}</div>}
        <h1 className="font-display text-3xl text-ink tracking-tight leading-tight">{title}</h1>
        {description && <p className="text-sm text-ink-muted mt-2 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
