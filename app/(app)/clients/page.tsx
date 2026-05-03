"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Filter, Users, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useStore } from "@/lib/db/use-store";
import { clientsRepo, documentsRepo } from "@/lib/db/repo";
import { kycStatusLabel, kycStatusTone } from "@/lib/labels";
import { formatRelative, formatEUR } from "@/lib/utils";
import type { KycStatus } from "@/lib/db/types";

const FILTERS: { key: KycStatus | "all"; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "en_cours", label: "En cours" },
  { key: "en_attente", label: "En attente" },
  { key: "complet", label: "Complets" },
  { key: "non_demarre", label: "Non démarrés" },
];

export default function ClientsPage() {
  const clients = useStore(() => clientsRepo.list());
  const docs = useStore(() => documentsRepo.list());
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<KycStatus | "all">("all");

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      if (filter !== "all" && c.kycStatus !== filter) return false;
      if (!q) return true;
      const hay = `${c.firstName} ${c.lastName} ${c.email ?? ""} ${c.phone ?? ""}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [clients, q, filter]);

  return (
    <>
      <PageHeader
        eyebrow="Portefeuille"
        title="Clients"
        description="Vos dossiers, leurs statuts KYC et leur suivi documentaire."
        actions={
          <Link href="/clients/nouveau" className="btn-primary">
            + Nouveau client
          </Link>
        }
      />

      {clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucun client pour le moment"
          description="Créez votre premier dossier client manuellement, ou laissez l'intake IA extraire les informations à partir d'une transcription d'appel."
          action={
            <div className="flex items-center gap-2">
              <Link href="/intake" className="btn-secondary">Intake IA depuis transcription</Link>
              <Link href="/clients/nouveau" className="btn-primary">+ Nouveau client</Link>
            </div>
          }
        />
      ) : (
        <>
          <div className="card p-4 mb-4 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" strokeWidth={1.75} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher par nom, email…"
                className="input pl-9"
              />
            </div>
            <div className="flex items-center gap-1 bg-navy-900/55 rounded-lg p-1 border border-line">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`text-xs px-3 py-1.5 rounded-md transition ${
                    filter === f.key ? "bg-navy-700/88 text-ink shadow-[inset_0_0_0_1px_rgba(201,216,238,0.08)]" : "text-ink-muted hover:text-ink hover:bg-navy-800/60"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy-900/55 border-b border-line">
                <tr className="text-left text-xs uppercase tracking-wider text-ink-muted">
                  <th className="font-medium px-5 py-3">Client</th>
                  <th className="font-medium px-5 py-3">KYC</th>
                  <th className="font-medium px-5 py-3">Documents</th>
                  <th className="font-medium px-5 py-3">Patrimoine déclaré</th>
                  <th className="font-medium px-5 py-3">Mise à jour</th>
                  <th className="font-medium px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const cdocs = docs.filter((d) => d.clientId === c.id);
                  const verified = cdocs.filter((d) => d.status === "verifie").length;
                  const issues = cdocs.filter((d) => d.status === "manquant" || d.status === "expire").length;
                  return (
                    <tr key={c.id} className="border-b border-line last:border-0 hover:bg-navy-800/45 transition">
                      <td className="px-5 py-4">
                        <Link href={`/clients/${c.id}`} className="flex items-center gap-3 group">
                          <Avatar name={`${c.firstName} ${c.lastName}`} />
                          <div className="min-w-0">
                            <div className="font-medium text-ink group-hover:text-gold-400 truncate">
                              {c.firstName} {c.lastName}
                            </div>
                            <div className="text-xs text-ink-muted truncate">{c.email ?? c.phone ?? "—"}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <Badge tone={kycStatusTone[c.kycStatus]}>{kycStatusLabel[c.kycStatus]}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-ink tabular-nums">{verified}/{cdocs.length || 4}</div>
                        {issues > 0 && <div className="text-xs text-danger mt-0.5">{issues} à traiter</div>}
                      </td>
                      <td className="px-5 py-4 tabular-nums text-ink-muted">{formatEUR(c.financial?.netWorth)}</td>
                      <td className="px-5 py-4 text-ink-muted text-xs">{formatRelative(c.updatedAt)}</td>
                      <td className="px-5 py-4 text-right">
                        <Link href={`/clients/${c.id}`} className="text-gold-400 hover:text-gold-500 inline-flex items-center gap-1 text-xs">
                          Ouvrir <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="px-6 py-12 text-center text-sm text-ink-muted">
                Aucun résultat pour ces critères.
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
