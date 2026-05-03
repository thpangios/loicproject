"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/db/use-store";
import {
  clientsRepo,
  complianceRepo,
  documentsRepo,
  submissionsRepo,
} from "@/lib/db/repo";
import {
  complianceStatusLabel,
  complianceStatusTone,
  complianceTypeLabel,
  docStatusLabel,
  docStatusTone,
  docTypeLabel,
  kycStatusLabel,
  kycStatusTone,
  maritalLabel,
  riskProfileLabel,
  submissionStatusLabel,
  submissionSteps,
} from "@/lib/labels";
import type { ComplianceDocType, DocType, KycStatus, Partner } from "@/lib/db/types";
import { formatDate, formatEUR, formatRelative } from "@/lib/utils";

const REQUIRED_DOCS: DocType[] = ["piece_identite", "justificatif_domicile", "rib", "source_fonds"];
const COMPLIANCE_TYPES: ComplianceDocType[] = [
  "compte_rendu",
  "lettre_mission",
  "rapport_adequation",
  "comparatif_produits",
];

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const client = useStore(() => clientsRepo.get(id));
  const docs = useStore(() => documentsRepo.list(id));
  const compliance = useStore(() => complianceRepo.list(id));
  const submissions = useStore(() => submissionsRepo.list(id));
  const [tab, setTab] = useState<"profile" | "documents" | "conformite" | "soumissions">("profile");

  if (!client) {
    return (
      <div className="card p-12 text-center">
        <p className="text-ink-muted text-sm">Client introuvable.</p>
        <Link href="/clients" className="btn-secondary mt-4 inline-flex">Retour aux clients</Link>
      </div>
    );
  }

  const fullName = `${client.firstName} ${client.lastName}`;

  function setKyc(s: KycStatus) {
    clientsRepo.update(id, { kycStatus: s });
  }

  function requestDoc(type: DocType) {
    documentsRepo.create({ clientId: id, type, status: "en_attente" });
  }

  function markVerified(docId: string) {
    documentsRepo.update(docId, { status: "verifie", verifiedAt: new Date().toISOString() });
  }

  function generateCompliance(type: ComplianceDocType) {
    complianceRepo.create({ clientId: id, type, status: "brouillon" });
  }

  function validateCompliance(cId: string) {
    complianceRepo.update(cId, { status: "valide", validatedAt: new Date().toISOString() });
  }

  function newSubmission(partner: Partner) {
    submissionsRepo.create({ clientId: id, partner, status: "preparation" });
  }

  function deleteClient() {
    if (!confirm(`Supprimer définitivement le dossier de ${fullName} ?`)) return;
    clientsRepo.remove(id);
    router.push("/clients");
  }

  return (
    <>
      <Link href="/clients" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink mb-4">
        <ChevronLeft className="w-4 h-4" /> Retour aux clients
      </Link>

      <div className="flex items-start justify-between gap-6 mb-8">
        <div className="flex items-start gap-4">
          <Avatar name={fullName} size={56} />
          <div>
            <div className="label text-gold-400 mb-1">Dossier client</div>
            <h1 className="font-display text-3xl text-ink leading-tight tracking-tight">{fullName}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-ink-muted">
              <Badge tone={kycStatusTone[client.kycStatus]}>{kycStatusLabel[client.kycStatus]}</Badge>
              <span>·</span>
              <span>Créé le {formatDate(client.createdAt)}</span>
              <span>·</span>
              <span>MAJ {formatRelative(client.updatedAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={deleteClient} className="btn-ghost text-danger hover:bg-[rgba(217,117,106,0.12)]">
            <Trash2 className="w-4 h-4" /> Supprimer
          </button>
          <Link href={`/intake?clientId=${id}`} className="btn-secondary">
            <Sparkles className="w-4 h-4" /> Compléter via IA
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-line mb-6">
        {[
          { k: "profile", label: "Profil" },
          { k: "documents", label: `Documents (${docs.length})` },
          { k: "conformite", label: `Conformité (${compliance.length})` },
          { k: "soumissions", label: `Soumissions (${submissions.length})` },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k as typeof tab)}
            className={`px-4 py-2.5 text-sm transition relative ${
              tab === t.k ? "text-gold-400 font-medium" : "text-ink-muted hover:text-ink"
            }`}
          >
            {t.label}
            {tab === t.k && <span className="absolute bottom-[-1px] left-2 right-2 h-0.5 bg-gold-500 rounded-full" />}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="font-display text-base text-ink mb-4">Informations personnelles</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <Info label="Email" icon={Mail}>{client.email ?? "—"}</Info>
                <Info label="Téléphone" icon={Phone}>{client.phone ?? "—"}</Info>
                <Info label="Date de naissance" icon={Calendar}>{formatDate(client.dob)}</Info>
                <Info label="Situation familiale">{client.maritalStatus ? maritalLabel[client.maritalStatus] : "—"}</Info>
                <Info label="Résidence fiscale">{client.taxResidence ?? "—"}</Info>
                <Info label="Profil de risque">{client.riskProfile ? riskProfileLabel[client.riskProfile] : "—"}</Info>
                <Info label="Adresse" icon={MapPin} colSpan>
                  {client.address
                    ? [client.address.street, client.address.postalCode, client.address.city, client.address.country]
                        .filter(Boolean)
                        .join(", ")
                    : "—"}
                </Info>
                <Info label="Profession" icon={Briefcase}>{client.profession ?? "—"}</Info>
                <Info label="Employeur">{client.employer ?? "—"}</Info>
              </dl>
            </div>

            <div className="card p-6">
              <h3 className="font-display text-base text-ink mb-4">Situation financière</h3>
              <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <Stat label="Revenus annuels" value={formatEUR(client.financial?.annualIncome)} />
                <Stat label="Patrimoine net" value={formatEUR(client.financial?.netWorth)} />
                <Stat label="Immobilier" value={formatEUR(client.financial?.realEstateValue)} />
                <Stat label="Actifs financiers" value={formatEUR(client.financial?.financialAssets)} />
              </dl>
            </div>

            {client.notes && (
              <div className="card p-6">
                <h3 className="font-display text-base text-ink mb-3">Notes</h3>
                <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{client.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <div className="label mb-3">Statut KYC</div>
              <div className="space-y-1.5">
                {(["non_demarre", "en_cours", "en_attente", "complet"] as KycStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setKyc(s)}
                    className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm transition ${
                      client.kycStatus === s ? "bg-navy-800/82 text-gold-400 border border-line" : "hover:bg-navy-800/60 border border-transparent"
                    }`}
                  >
                    <span>{kycStatusLabel[s]}</span>
                    {client.kycStatus === s && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="label mb-3">Prochaine revue</div>
              <p className="text-sm text-ink">{formatDate(client.nextReviewAt) || "Non planifiée"}</p>
              <p className="text-xs text-ink-muted mt-1">Une revue annuelle est recommandée par la réglementation.</p>
            </div>
          </div>
        </div>
      )}

      {tab === "documents" && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base text-ink">Documents requis (KYC)</h3>
              <span className="text-xs text-ink-muted">
                {docs.filter((d) => d.status === "verifie").length} / {REQUIRED_DOCS.length} validés
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REQUIRED_DOCS.map((type) => {
                const existing = docs.find((d) => d.type === type);
                return (
                  <div key={type} className="border border-line rounded-lg p-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-ink">{docTypeLabel[type]}</div>
                      {existing ? (
                        <div className="mt-1.5 flex items-center gap-2">
                          <Badge tone={docStatusTone[existing.status]}>{docStatusLabel[existing.status]}</Badge>
                          {existing.uploadedAt && (
                            <span className="text-xs text-ink-muted">{formatRelative(existing.uploadedAt)}</span>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-ink-muted mt-1">Non demandé</div>
                      )}
                    </div>
                    {!existing ? (
                      <button onClick={() => requestDoc(type)} className="btn-ghost text-xs">
                        <Plus className="w-3.5 h-3.5" /> Demander
                      </button>
                    ) : existing.status !== "verifie" ? (
                      <button onClick={() => markVerified(existing.id)} className="btn-ghost text-xs text-success">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Valider
                      </button>
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-success mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {docs.length === 0 && (
            <p className="text-xs text-ink-muted text-center py-2">
              Les pièces justificatives apparaîtront ici dès leur réception.
            </p>
          )}
        </div>
      )}

      {tab === "conformite" && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-base text-ink">Documents réglementaires</h3>
                <p className="text-xs text-ink-muted mt-0.5">Génération assistée par IA, validation humaine obligatoire.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMPLIANCE_TYPES.map((type) => {
                const existing = compliance.find((c) => c.type === type);
                return (
                  <div key={type} className="border border-line rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-ink">{complianceTypeLabel[type]}</div>
                        {existing ? (
                          <div className="mt-1.5 flex items-center gap-2">
                            <Badge tone={complianceStatusTone[existing.status]}>{complianceStatusLabel[existing.status]}</Badge>
                            <span className="text-xs text-ink-muted">{formatRelative(existing.generatedAt)}</span>
                          </div>
                        ) : (
                          <div className="text-xs text-ink-muted mt-1">Aucune génération</div>
                        )}
                      </div>
                      <FileText className="w-4 h-4 text-gold-400" />
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {!existing ? (
                        <button onClick={() => generateCompliance(type)} className="btn-secondary text-xs px-3 py-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Générer
                        </button>
                      ) : existing.status === "brouillon" ? (
                        <>
                          <button onClick={() => validateCompliance(existing.id)} className="btn-primary text-xs px-3 py-1.5">
                            Valider
                          </button>
                          <button onClick={() => generateCompliance(type)} className="btn-ghost text-xs">
                            Régénérer
                          </button>
                        </>
                      ) : (
                        <button onClick={() => generateCompliance(type)} className="btn-ghost text-xs">
                          Nouvelle version
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === "soumissions" && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base text-ink">Soumissions partenaires</h3>
              <div className="flex items-center gap-1">
                {(["Cardif", "BNP Paribas", "Suravenir", "CNP"] as Partner[]).map((p) => (
                  <button key={p} onClick={() => newSubmission(p)} className="btn-ghost text-xs">
                    <Plus className="w-3 h-3" /> {p}
                  </button>
                ))}
              </div>
            </div>
            {submissions.length === 0 ? (
              <p className="text-sm text-ink-muted text-center py-8">Aucune soumission en cours pour ce client.</p>
            ) : (
              <ul className="space-y-3">
                {submissions.map((s) => {
                  const idx = submissionSteps.indexOf(s.status);
                  const next = submissionSteps[idx + 1];
                  return (
                    <li key={s.id} className="border border-line rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-navy-800/82 text-gold-400 border border-line flex items-center justify-center">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-ink">{s.partner}</div>
                            <div className="text-xs text-ink-muted">{s.product ?? "Produit non spécifié"}</div>
                          </div>
                        </div>
                        <Badge tone="info">{submissionStatusLabel[s.status]}</Badge>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {submissionSteps.map((step, i) => (
                          <div
                            key={step}
                            className={`h-1.5 flex-1 rounded-full ${i <= idx ? "bg-gold-500" : "bg-navy-700/70"}`}
                          />
                        ))}
                      </div>
                      {next && (
                        <button
                          onClick={() => submissionsRepo.update(s.id, { status: next })}
                          className="text-xs text-gold-400 hover:text-gold-500 mt-2"
                        >
                          Passer à : {submissionStatusLabel[next]} →
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Info({
  label,
  icon: Icon,
  children,
  colSpan,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
  colSpan?: boolean;
}) {
  return (
    <div className={colSpan ? "sm:col-span-2" : ""}>
      <dt className="text-xs text-ink-muted flex items-center gap-1.5 mb-1">
        {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />}
        {label}
      </dt>
      <dd className="text-ink">{children}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-ink-muted">{label}</div>
      <div className="font-display text-xl text-ink mt-1 tabular-nums">{value}</div>
    </div>
  );
}
