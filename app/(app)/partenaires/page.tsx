"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/db/use-store";
import { clientsRepo, submissionsRepo } from "@/lib/db/repo";
import { submissionStatusLabel, submissionSteps } from "@/lib/labels";
import { formatRelative } from "@/lib/utils";

const PARTNERS_INFO: { name: string; type: string; integration: string }[] = [
  { name: "Cardif (BNP Paribas)", type: "Assurance vie", integration: "API" },
  { name: "Suravenir", type: "Assurance vie", integration: "Automatisation navigateur" },
  { name: "CNP", type: "Assurance vie", integration: "Automatisation navigateur" },
  { name: "Generali", type: "Assurance vie", integration: "Automatisation navigateur" },
];

export default function PartnersPage() {
  const submissions = useStore(() => submissionsRepo.list());
  const clients = useStore(() => clientsRepo.list());

  function clientName(id: string) {
    const c = clients.find((x) => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : "—";
  }

  return (
    <>
      <PageHeader
        eyebrow="Soumissions & contrats"
        title="Partenaires"
        description="Pipeline de soumissions auprès des assureurs et banques partenaires : préparation, envoi, fonds reçus, contrat créé, accès activé."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {PARTNERS_INFO.map((p) => {
          const count = submissions.filter((s) => s.partner.startsWith(p.name.split(" ")[0])).length;
          return (
            <div key={p.name} className="card p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-ink leading-tight">{p.name}</div>
                  <div className="text-xs text-ink-muted">{p.type}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">{p.integration}</span>
                <span className="font-medium text-navy-700 tabular-nums">{count} dossier{count > 1 ? "s" : ""}</span>
              </div>
            </div>
          );
        })}
      </div>

      {submissions.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Aucune soumission en cours"
          description="Démarrez une soumission depuis la fiche client (onglet Soumissions) pour suivre son avancement étape par étape."
          action={<Link href="/clients" className="btn-primary">Voir les clients</Link>}
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-50 border-b border-line text-xs uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="text-left font-medium px-5 py-3">Client</th>
                <th className="text-left font-medium px-5 py-3">Partenaire</th>
                <th className="text-left font-medium px-5 py-3">Avancement</th>
                <th className="text-left font-medium px-5 py-3">Statut</th>
                <th className="text-left font-medium px-5 py-3">MAJ</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => {
                const idx = submissionSteps.indexOf(s.status);
                return (
                  <tr key={s.id} className="border-b border-line last:border-0 hover:bg-cream-50/50">
                    <td className="px-5 py-3">
                      <Link href={`/clients/${s.clientId}`} className="text-ink hover:text-navy-700">
                        {clientName(s.clientId)}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-ink-muted">{s.partner}</td>
                    <td className="px-5 py-3 w-64">
                      <div className="flex items-center gap-1">
                        {submissionSteps.map((step, i) => (
                          <div key={step} className={`h-1.5 flex-1 rounded-full ${i <= idx ? "bg-navy-600" : "bg-cream-200"}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3"><Badge tone="info">{submissionStatusLabel[s.status]}</Badge></td>
                    <td className="px-5 py-3 text-xs text-ink-muted">{formatRelative(s.updatedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
