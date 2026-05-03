"use client";

import { Search, HelpCircle, Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/db/use-store";
import { alertsRepo, clientsRepo } from "@/lib/db/repo";

export function Topbar() {
  const alerts = useStore(() => alertsRepo.list().filter((a) => !a.resolved));
  const clients = useStore(() => clientsRepo.list());
  const today = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-[rgba(8,14,25,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-[1480px] items-center gap-4 px-5 md:px-8">
        <div className="flex-1">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" strokeWidth={1.75} />
            <input
              placeholder="Rechercher un client, un document, une référence…"
              className="w-full rounded-xl border border-line bg-[linear-gradient(180deg,rgba(17,28,46,0.96),rgba(9,18,33,0.94))] py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-gold-500/70 focus:ring-4 focus:ring-gold-500/10"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-lg border border-line bg-navy-900/55 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-ink-subtle xl:block">
              / recherche intelligente
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <div className="rounded-2xl border border-line bg-navy-900/42 px-4 py-2.5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-subtle">Cabinet pulse</div>
            <div className="mt-1 flex items-center gap-2 text-sm text-ink">
              <span className="font-medium">{clients.length} clients actifs</span>
              <span className="h-1 w-1 rounded-full bg-navy-300" />
              <span className="capitalize text-ink-muted">{today}</span>
            </div>
          </div>
        </div>

        <div className="ml-2 flex items-center gap-2 md:ml-4">
          <Link href="/intake" className="hidden rounded-2xl border border-[rgba(232,190,120,0.18)] bg-[rgba(232,190,120,0.08)] px-3 py-2 text-sm text-gold-300 hover:bg-[rgba(232,190,120,0.12)] lg:inline-flex lg:items-center lg:gap-2">
            <Sparkles className="h-4 w-4" />
            Intake IA
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <button className="btn-ghost px-2" aria-label="Aide">
            <HelpCircle className="w-4 h-4" strokeWidth={1.75} />
          </button>

          <Link
            href="/alertes"
            className="relative inline-flex items-center gap-2 rounded-xl border border-line bg-navy-900/34 px-3 py-2 text-sm text-ink-muted hover:border-navy-300/45 hover:text-ink"
          >
            <span className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              {alerts.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-medium text-cream-50">
                  {alerts.length}
                </span>
              )}
            </span>
            <span className="hidden md:block">Alertes</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
