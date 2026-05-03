"use client";

import Link from "next/link";
import { ScrollText, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/db/use-store";
import { clientsRepo, complianceRepo } from "@/lib/db/repo";
import {
  complianceStatusLabel,
  complianceStatusTone,
  complianceTypeLabel,
} from "@/lib/labels";
import { formatRelative } from "@/lib/utils";

export default function CompliancePage() {
  const compliance = useStore(() => complianceRepo.list());
  const clients = useStore(() => clientsRepo.list());

  function clientName(id: string) {
    const c = clients.find((x) => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : "Client supprimé";
  }

  const byType = {
    compte_rendu: compliance.filter((d) => d.type === "compte_rendu").length,
    lettre_mission: compliance.filter((d) => d.type === "lettre_mission").length,
    rapport_adequation: compliance.filter((d) => d.type === "rapport_adequation").length,
    comparatif_produits: compliance.filter((d) => d.type === "comparatif_produits").length,
  };

  return (
    <>
      <PageHeader
        eyebrow="Documents réglementaires"
        title="Conformité"
        description="Génération assistée par IA des quatre documents réglementaires : compte rendu, lettre de mission, rapport d'adéquation, comparatif produits."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {([
          ["compte_rendu", "Compte rendu RDV"],
          ["lettre_mission", "Lettre de mission"],
          ["rapport_adequation", "Rapport d'adéquation"],
          ["comparatif_produits", "Comparatif produits"],
        ] as const).map(([k, label]) => (
          <div key={k} className="card p-5">
            <div className="text-xs uppercase tracking-wider text-ink-muted">{label}</div>
            <div className="font-display text-3xl text-ink mt-2 tabular-nums leading-none">{byType[k]}</div>
            <div className="text-xs text-ink-muted mt-2">générés au total</div>
          </div>
        ))}
      </div>

      {compliance.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="Aucun document généré"
          description="Ouvrez la fiche d'un client puis l'onglet Conformité pour générer compte rendu, lettre de mission, rapport d'adéquation ou comparatif produits."
          action={<Link href="/clients" className="btn-primary"><Sparkles className="w-4 h-4" /> Choisir un client</Link>}
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy-900/55 border-b border-line text-xs uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="text-left font-medium px-5 py-3">Client</th>
                <th className="text-left font-medium px-5 py-3">Document</th>
                <th className="text-left font-medium px-5 py-3">Statut</th>
                <th className="text-left font-medium px-5 py-3">Généré</th>
                <th className="text-right font-medium px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {compliance.map((d) => (
                <tr key={d.id} className="border-b border-line last:border-0 hover:bg-navy-800/45">
                  <td className="px-5 py-3">
                    <Link href={`/clients/${d.clientId}`} className="text-ink hover:text-gold-400">
                      {clientName(d.clientId)}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-ink-muted">{complianceTypeLabel[d.type]}</td>
                  <td className="px-5 py-3"><Badge tone={complianceStatusTone[d.status]}>{complianceStatusLabel[d.status]}</Badge></td>
                  <td className="px-5 py-3 text-xs text-ink-muted">{formatRelative(d.generatedAt)}</td>
                  <td className="px-5 py-3 text-right">
                    {d.status === "brouillon" && (
                      <button
                        onClick={() => complianceRepo.update(d.id, { status: "valide", validatedAt: new Date().toISOString() })}
                        className="text-xs text-success hover:underline"
                      >
                        Valider
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
