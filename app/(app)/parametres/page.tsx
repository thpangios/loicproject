"use client";

import { Database, Trash2, Settings as SettingsIcon, Shield } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { resetAll } from "@/lib/db/repo";

export default function SettingsPage() {
  function reset() {
    if (!confirm("Réinitialiser toutes les données locales (clients, documents, soumissions, alertes) ?")) return;
    resetAll();
  }

  return (
    <>
      <PageHeader eyebrow="Configuration" title="Paramètres" description="Cabinet, intégrations, et préférences système." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Profil du cabinet" icon={SettingsIcon}>
            <Field label="Nom du cabinet">
              <input className="input" defaultValue="Loïc Ratsaratany — Conseil en gestion de patrimoine" />
            </Field>
            <Field label="N° SIREN">
              <input className="input" placeholder="À renseigner" />
            </Field>
            <Field label="N° ORIAS">
              <input className="input" placeholder="À renseigner" />
            </Field>
            <Field label="Adresse professionnelle">
              <input className="input" placeholder="Adresse, code postal, ville" />
            </Field>
          </Card>

          <Card title="Intégrations" icon={Database}>
            <Integration name="Wealthcome / Walscom" status="non_configure" detail="Synchronisation CRM via API. À connecter pour activer la mise à jour automatique des fiches." />
            <Integration name="Cardif (BNP Paribas)" status="non_configure" detail="Soumission de dossiers d'assurance vie via API officielle." />
            <Integration name="Suravenir" status="non_configure" detail="Automatisation navigateur supervisée — pas de clé API requise." />
            <Integration name="CNP" status="non_configure" detail="Automatisation navigateur supervisée — pas de clé API requise." />
            <Integration name="Supabase" status="planifie" detail="Base de données de production. La couche actuelle utilise localStorage en attendant le branchement." />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Sécurité & RGPD" icon={Shield}>
            <p className="text-xs text-ink-muted leading-relaxed">
              Cogni est hébergé sur infrastructure conforme au RGPD. Les données client sont chiffrées en transit
              et au repos. Toute extraction IA fait l'objet d'une validation humaine obligatoire.
            </p>
          </Card>

          <Card title="Zone de réinitialisation" icon={Trash2}>
            <p className="text-xs text-ink-muted leading-relaxed mb-3">
              Efface toutes les données locales de cette instance (test/démo). Action irréversible.
            </p>
            <button onClick={reset} className="btn-secondary text-danger border-[rgba(217,117,106,0.22)] hover:bg-[rgba(217,117,106,0.12)]">
              <Trash2 className="w-4 h-4" /> Réinitialiser les données
            </button>
          </Card>
        </div>
      </div>
    </>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-gold-400" strokeWidth={1.75} />
        <h3 className="font-display text-base text-ink">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5 block">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      {children}
    </label>
  );
}

function Integration({
  name,
  status,
  detail,
}: {
  name: string;
  status: "actif" | "non_configure" | "planifie";
  detail: string;
}) {
  const statusMap = {
    actif: { label: "Actif", cls: "bg-[rgba(112,186,141,0.14)] text-success border-[rgba(112,186,141,0.22)]" },
    non_configure: { label: "Non configuré", cls: "bg-navy-800/82 text-ink-muted border-line" },
    planifie: { label: "Planifié", cls: "bg-[rgba(198,154,86,0.15)] text-gold-400 border-[rgba(198,154,86,0.22)]" },
  } as const;
  return (
    <div className="border border-line rounded-lg p-4 flex items-start justify-between gap-3">
      <div>
        <div className="text-sm font-medium text-ink">{name}</div>
        <div className="text-xs text-ink-muted mt-1 max-w-md">{detail}</div>
      </div>
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium ${statusMap[status].cls}`}>
        {statusMap[status].label}
      </span>
    </div>
  );
}
