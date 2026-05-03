"use client";

import Link from "next/link";
import { FileCheck2, Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/db/use-store";
import { clientsRepo, documentsRepo } from "@/lib/db/repo";
import { docStatusLabel, docStatusTone, docTypeLabel } from "@/lib/labels";
import { formatDate, formatRelative } from "@/lib/utils";

export default function DocumentsPage() {
  const docs = useStore(() => documentsRepo.list());
  const clients = useStore(() => clientsRepo.list());

  const byStatus = {
    en_attente: docs.filter((d) => d.status === "en_attente"),
    verifie: docs.filter((d) => d.status === "verifie"),
    expire: docs.filter((d) => d.status === "expire"),
    manquant: docs.filter((d) => d.status === "manquant"),
  };

  function clientName(id: string) {
    const c = clients.find((x) => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : "Client supprimé";
  }

  return (
    <>
      <PageHeader
        eyebrow="Pièces justificatives"
        title="Documents"
        description="Suivi global des documents KYC : en attente, vérifiés, expirés et manquants."
      />

      {docs.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="Aucun document en circulation"
          description="Les documents apparaissent ici dès qu'une demande est envoyée à un client depuis sa fiche."
          action={
            <Link href="/clients" className="btn-primary">Voir les clients</Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Pill label="En attente" count={byStatus.en_attente.length} icon={<Plus className="w-4 h-4" />} tone="warning" />
            <Pill label="Vérifiés" count={byStatus.verifie.length} icon={<CheckCircle2 className="w-4 h-4" />} tone="success" />
            <Pill label="Expirés" count={byStatus.expire.length} icon={<AlertTriangle className="w-4 h-4" />} tone="danger" />
            <Pill label="Manquants" count={byStatus.manquant.length} icon={<AlertTriangle className="w-4 h-4" />} tone="danger" />
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy-900/55 border-b border-line text-xs uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="text-left font-medium px-5 py-3">Client</th>
                  <th className="text-left font-medium px-5 py-3">Type</th>
                  <th className="text-left font-medium px-5 py-3">Statut</th>
                  <th className="text-left font-medium px-5 py-3">Reçu</th>
                  <th className="text-left font-medium px-5 py-3">Expire</th>
                  <th className="text-right font-medium px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} className="border-b border-line last:border-0 hover:bg-navy-800/45">
                    <td className="px-5 py-3">
                      <Link href={`/clients/${d.clientId}`} className="text-ink hover:text-gold-400">
                        {clientName(d.clientId)}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-ink-muted">{docTypeLabel[d.type]}</td>
                    <td className="px-5 py-3"><Badge tone={docStatusTone[d.status]}>{docStatusLabel[d.status]}</Badge></td>
                    <td className="px-5 py-3 text-xs text-ink-muted">{d.uploadedAt ? formatRelative(d.uploadedAt) : "—"}</td>
                    <td className="px-5 py-3 text-xs text-ink-muted">{formatDate(d.expiresAt)}</td>
                    <td className="px-5 py-3 text-right">
                      {d.status === "en_attente" && (
                        <button
                          onClick={() => documentsRepo.update(d.id, { status: "verifie", verifiedAt: new Date().toISOString() })}
                          className="text-xs text-success hover:underline"
                        >
                          Marquer vérifié
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

function Pill({
  label,
  count,
  icon,
  tone,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  tone: "warning" | "success" | "danger";
}) {
  const map = {
    warning: "text-warning bg-[rgba(214,168,93,0.14)] border border-[rgba(214,168,93,0.18)]",
    success: "text-success bg-[rgba(112,186,141,0.14)] border border-[rgba(112,186,141,0.18)]",
    danger: "text-danger bg-[rgba(217,117,106,0.14)] border border-[rgba(217,117,106,0.18)]",
  };
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${map[tone]}`}>{icon}</div>
      <div>
        <div className="font-display text-2xl text-ink tabular-nums leading-none">{count}</div>
        <div className="text-xs text-ink-muted mt-1">{label}</div>
      </div>
    </div>
  );
}
