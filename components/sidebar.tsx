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
  return (
    <aside className="w-64 shrink-0 bg-navy-900/95 text-cream-100 flex flex-col h-screen sticky top-0 border-r border-line backdrop-blur-sm">
      <div className="px-6 pt-7 pb-6 border-b border-line">
        <Link href="/tableau-de-bord" className="flex items-center gap-3">
          <CogniMark className="w-9 h-9 shrink-0" title="Cogni" />
          <div className="leading-[1.02]">
            <div className="font-display text-[17px] text-cream-50 tracking-[-0.03em]">Cogni</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-navy-200">Patrimoine</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-navy-300 px-3 mb-2">Espace de travail</div>
        <ul className="space-y-0.5">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    active
                      ? "bg-navy-700/95 text-cream-50 shadow-[inset_0_0_0_1px_rgba(201,216,238,0.08)]"
                      : "text-navy-100 hover:text-cream-50 hover:bg-navy-800/85",
                  )}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t border-line">
        <Link
          href="/parametres"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
            pathname.startsWith("/parametres")
              ? "bg-navy-700/95 text-cream-50 shadow-[inset_0_0_0_1px_rgba(201,216,238,0.08)]"
              : "text-navy-100 hover:text-cream-50 hover:bg-navy-800/85",
          )}
        >
          <Settings className="w-4 h-4" strokeWidth={1.75} />
          <span>Paramètres</span>
        </Link>
        <div className="mt-4 px-3 py-3 rounded-lg bg-navy-800/70 border border-line">
          <div className="text-[11px] text-navy-200">Connecté en tant que</div>
          <div className="text-sm text-cream-50 font-medium mt-0.5">Loïc Ratsaratany</div>
          <div className="text-[11px] text-navy-300 mt-0.5">Conseiller en gestion de patrimoine</div>
        </div>
      </div>
    </aside>
  );
}
