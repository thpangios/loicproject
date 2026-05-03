"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  FileCheck2,
  ScrollText,
  Building2,
  Bell,
  Settings,
} from "lucide-react";
import { CogniMark } from "@/components/brand/cogni-mark";
import { useStore } from "@/lib/db/use-store";
import { alertsRepo, clientsRepo, submissionsRepo } from "@/lib/db/repo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/tableau-de-bord", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/intake", label: "Intake IA", icon: Sparkles },
  { href: "/documents", label: "Documents", icon: FileCheck2 },
  { href: "/conformite", label: "Conformité", icon: ScrollText },
  { href: "/partenaires", label: "Partenaires", icon: Building2 },
  { href: "/alertes", label: "Alertes", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const clientsCount = useStore(() => clientsRepo.list().length);
  const activeAlerts = useStore(() => alertsRepo.list().filter((a) => !a.resolved).length);
  const activeSubmissions = useStore(() => submissionsRepo.list().filter((s) => s.status !== "termine").length);

  return (
    <aside className="sticky top-0 flex h-screen w-20 shrink-0 flex-col border-r border-line bg-[linear-gradient(180deg,rgba(11,19,33,0.96)_0%,rgba(8,14,25,0.96)_100%)] text-cream-100 backdrop-blur-xl md:w-72">
      <div className="border-b border-line px-4 pb-4 pt-5 md:px-6 md:pb-5 md:pt-7">
        <Link href="/tableau-de-bord" className="flex items-center gap-3">
          <CogniMark className="h-10 w-10 shrink-0" title="Cogni" />
          <div className="hidden leading-[1.02] md:block">
            <div className="font-display text-[19px] text-cream-50">Cogni</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.26em] text-navy-200">Patrimoine Intelligence</div>
          </div>
        </Link>

        <div className="mt-5 hidden rounded-2xl border border-line bg-[linear-gradient(180deg,rgba(24,38,61,0.88),rgba(13,23,39,0.92))] p-4 md:block">
          <div className="label text-gold-400">Workspace health</div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="font-display text-3xl text-cream-50">94%</div>
              <div className="mt-1 text-xs text-navy-200">Performance opérationnelle</div>
            </div>
            <div className="rounded-xl border border-[rgba(111,211,225,0.18)] bg-[rgba(111,211,225,0.08)] px-2.5 py-1 text-[11px] font-medium text-cyan">
              +12% ce mois
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <QuickStat label="Clients" value={clientsCount} />
            <QuickStat label="Alertes" value={activeAlerts} />
            <QuickStat label="Deals" value={activeSubmissions} />
          </div>
        </div>
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-5 md:px-4">
        <div className="mb-2 hidden px-3 text-[10px] uppercase tracking-[0.22em] text-navy-300 md:block">Espace de travail</div>
        <ul className="space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition",
                    active
                      ? "bg-[linear-gradient(180deg,rgba(36,55,84,0.92),rgba(22,35,54,0.92))] text-cream-50 shadow-[inset_0_0_0_1px_rgba(201,216,238,0.08)]"
                      : "text-navy-100 hover:bg-navy-800/62 hover:text-cream-50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl border transition",
                      active
                        ? "border-[rgba(232,190,120,0.18)] bg-[rgba(232,190,120,0.08)] text-gold-400"
                        : "border-transparent bg-navy-900/40 text-navy-200 group-hover:border-line group-hover:text-cream-50",
                    )}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                  </span>
                    <span className="hidden flex-1 md:block">{item.label}</span>
                    {active && <span className="hidden h-2 w-2 rounded-full bg-gold-400 md:block" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line px-3 py-4 md:px-4">
        <Link
          href="/parametres"
          className={cn(
            "flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm transition md:justify-start",
            pathname.startsWith("/parametres")
              ? "bg-[linear-gradient(180deg,rgba(36,55,84,0.92),rgba(22,35,54,0.92))] text-cream-50 shadow-[inset_0_0_0_1px_rgba(201,216,238,0.08)]"
              : "text-navy-100 hover:bg-navy-800/62 hover:text-cream-50",
          )}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent bg-navy-900/40 text-navy-200">
            <Settings className="w-4 h-4" strokeWidth={1.75} />
          </span>
          <span className="hidden md:block">Paramètres</span>
        </Link>

        <div className="mt-4 hidden rounded-2xl border border-line bg-navy-900/44 p-4 md:block">
          <div className="text-[11px] text-navy-200">Connecté en tant que</div>
          <div className="mt-1 text-sm font-medium text-cream-50">Loïc Ratsaratany</div>
          <div className="mt-1 text-[11px] text-navy-300">Conseiller en gestion de patrimoine</div>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-ink-muted">
            <span className="h-2 w-2 rounded-full bg-success" />
            CRM opérationnel et prêt pour la démo
          </div>
        </div>
      </div>
    </aside>
  );
}

function QuickStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-navy-900/40 px-2 py-2.5">
      <div className="text-base font-semibold text-cream-50 tabular-nums">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-navy-300">{label}</div>
    </div>
  );
}
