"use client";

import Link from "next/link";
import { Bell, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/db/use-store";
import { alertsRepo, clientsRepo } from "@/lib/db/repo";
import { formatRelative } from "@/lib/utils";

export default function AlertsPage() {
  const alerts = useStore(() => alertsRepo.list());
  const clients = useStore(() => clientsRepo.list());

  const open = alerts.filter((a) => !a.resolved);
  const resolved = alerts.filter((a) => a.resolved);

  function clientName(id?: string) {
    if (!id) return null;
    const c = clients.find((x) => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : null;
  }

  return (
    <>
      <PageHeader
        eyebrow="Surveillance & rappels"
        title="Alertes"
        description="Suivi en temps réel des échéances : revues annuelles, justificatifs expirés, dossiers KYC incomplets, soumissions bloquées."
      />

      {alerts.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Tout est sous contrôle"
          description="Les alertes apparaîtront ici lorsqu'un document expire, qu'une revue annuelle approche ou qu'un dossier reste incomplet."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Stat label="Critiques" value={open.filter((a) => a.severity === "critical").length} tone="danger" />
            <Stat label="Avertissements" value={open.filter((a) => a.severity === "warning").length} tone="warning" />
            <Stat label="Résolues" value={resolved.length} tone="success" />
          </div>

          {open.length > 0 && (
            <div className="card mb-6">
              <div className="px-5 py-3 border-b border-line flex items-center justify-between">
                <h3 className="font-display text-base text-ink">À traiter</h3>
                <span className="text-xs text-ink-muted">{open.length}</span>
              </div>
              <ul className="divide-y divide-line">
                {open.map((a) => {
                  const cn = clientName(a.clientId);
                  return (
                    <li key={a.id} className="px-5 py-4 flex items-center gap-4">
                      <AlertTriangle
                        className={`w-4 h-4 shrink-0 ${
                          a.severity === "critical" ? "text-danger" : a.severity === "warning" ? "text-warning" : "text-navy-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-ink">{a.message}</div>
                        <div className="text-xs text-ink-muted mt-0.5 flex items-center gap-2">
                          {cn && (
                            <Link href={`/clients/${a.clientId}`} className="hover:text-ink">
                              {cn}
                            </Link>
                          )}
                          {cn && <span>·</span>}
                          <span>{formatRelative(a.createdAt)}</span>
                        </div>
                      </div>
                      <button onClick={() => alertsRepo.resolve(a.id)} className="btn-ghost text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Résoudre
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {resolved.length > 0 && (
            <div className="card">
              <div className="px-5 py-3 border-b border-line">
                <h3 className="font-display text-base text-ink">Résolues</h3>
              </div>
              <ul className="divide-y divide-line">
                {resolved.slice(0, 20).map((a) => (
                  <li key={a.id} className="px-5 py-3 flex items-center gap-3 opacity-60">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-sm text-ink-muted flex-1">{a.message}</span>
                    <span className="text-xs text-ink-subtle">{formatRelative(a.createdAt)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "danger" | "warning" | "success" }) {
  const map = {
    danger: "text-[#A8413A]",
    warning: "text-[#8C6B2C]",
    success: "text-[#2F7A5C]",
  };
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-wider text-ink-muted">{label}</div>
      <div className={`font-display text-3xl mt-2 tabular-nums leading-none ${map[tone]}`}>{value}</div>
    </div>
  );
}
