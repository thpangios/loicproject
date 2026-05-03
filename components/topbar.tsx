"use client";

import { Search, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/db/use-store";
import { alertsRepo } from "@/lib/db/repo";

export function Topbar() {
  const alerts = useStore(() => alertsRepo.list().filter((a) => !a.resolved));
  const today = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <header className="h-16 bg-navy-900/52 backdrop-blur border-b border-line flex items-center px-8 sticky top-0 z-30">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" strokeWidth={1.75} />
          <input
            placeholder="Rechercher un client, un document, une référence…"
            className="w-full bg-navy-800/68 border border-line rounded-lg pl-9 pr-3 py-2 text-sm placeholder:text-ink-subtle focus:outline-none focus:border-gold-500/70 focus:ring-2 focus:ring-gold-500/10"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 ml-6">
        <div className="text-xs text-ink-muted capitalize hidden md:block">{today}</div>
        <button className="btn-ghost px-2" aria-label="Aide">
          <HelpCircle className="w-4 h-4" strokeWidth={1.75} />
        </button>
        <Link
          href="/alertes"
          className="relative inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink px-3 py-2 rounded-lg hover:bg-navy-800/58 transition"
        >
          <span className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-danger text-cream-50 text-[10px] font-medium flex items-center justify-center">
                {alerts.length}
              </span>
            )}
          </span>
          <span>Alertes</span>
        </Link>
      </div>
    </header>
  );
}
