"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { clientsRepo } from "@/lib/db/repo";
import type { MaritalStatus, RiskProfile } from "@/lib/db/types";
import { maritalLabel, riskProfileLabel } from "@/lib/labels";

export default function NewClientPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    maritalStatus: "" as MaritalStatus | "",
    taxResidence: "France",
    profession: "",
    employer: "",
    street: "",
    postalCode: "",
    city: "",
    annualIncome: "",
    netWorth: "",
    riskProfile: "" as RiskProfile | "",
    notes: "",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) return;
    setSubmitting(true);
    const c = clientsRepo.create({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email || undefined,
      phone: form.phone || undefined,
      dob: form.dob || undefined,
      maritalStatus: form.maritalStatus || undefined,
      taxResidence: form.taxResidence || undefined,
      profession: form.profession || undefined,
      employer: form.employer || undefined,
      address:
        form.street || form.postalCode || form.city
          ? { street: form.street, postalCode: form.postalCode, city: form.city, country: "France" }
          : undefined,
      financial: {
        annualIncome: form.annualIncome ? Number(form.annualIncome) : undefined,
        netWorth: form.netWorth ? Number(form.netWorth) : undefined,
      },
      riskProfile: form.riskProfile || undefined,
      notes: form.notes || undefined,
    });
    router.push(`/clients/${c.id}`);
  }

  return (
    <>
      <Link href="/clients" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink mb-4">
        <ChevronLeft className="w-4 h-4" /> Retour aux clients
      </Link>
      <PageHeader
        eyebrow="Onboarding manuel"
        title="Nouveau client"
        description="Créez un dossier client en saisissant les informations clés. Vous pourrez compléter le profil ultérieurement."
      />

      <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
        <Section title="Identité">
          <Field label="Prénom" required>
            <input className="input" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} required />
          </Field>
          <Field label="Nom" required>
            <input className="input" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} required />
          </Field>
          <Field label="Date de naissance">
            <input type="date" className="input" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
          </Field>
          <Field label="Situation familiale">
            <select className="input" value={form.maritalStatus} onChange={(e) => set("maritalStatus", e.target.value as MaritalStatus)}>
              <option value="">—</option>
              {Object.entries(maritalLabel).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Résidence fiscale">
            <input className="input" value={form.taxResidence} onChange={(e) => set("taxResidence", e.target.value)} />
          </Field>
        </Section>

        <Section title="Coordonnées">
          <Field label="Email">
            <input type="email" className="input" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Téléphone">
            <input className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="Adresse" colSpan={2}>
            <input className="input" placeholder="Rue" value={form.street} onChange={(e) => set("street", e.target.value)} />
          </Field>
          <Field label="Code postal">
            <input className="input" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
          </Field>
          <Field label="Ville">
            <input className="input" value={form.city} onChange={(e) => set("city", e.target.value)} />
          </Field>
        </Section>

        <Section title="Situation professionnelle & financière">
          <Field label="Profession">
            <input className="input" value={form.profession} onChange={(e) => set("profession", e.target.value)} />
          </Field>
          <Field label="Employeur">
            <input className="input" value={form.employer} onChange={(e) => set("employer", e.target.value)} />
          </Field>
          <Field label="Revenus annuels (€)">
            <input type="number" className="input" value={form.annualIncome} onChange={(e) => set("annualIncome", e.target.value)} />
          </Field>
          <Field label="Patrimoine net (€)">
            <input type="number" className="input" value={form.netWorth} onChange={(e) => set("netWorth", e.target.value)} />
          </Field>
          <Field label="Profil de risque">
            <select className="input" value={form.riskProfile} onChange={(e) => set("riskProfile", e.target.value as RiskProfile)}>
              <option value="">—</option>
              {Object.entries(riskProfileLabel).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>
        </Section>

        <Section title="Notes">
          <Field colSpan={2}>
            <textarea
              className="input min-h-[100px] resize-y"
              placeholder="Contexte, objectifs patrimoniaux, points d'attention…"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
        </Section>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Link href="/clients" className="btn-secondary">Annuler</Link>
          <button type="submit" disabled={submitting} className="btn-primary">Créer le client</button>
        </div>
      </form>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-base text-ink mb-5">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  colSpan,
  children,
}: {
  label?: string;
  required?: boolean;
  colSpan?: 1 | 2;
  children: React.ReactNode;
}) {
  return (
    <label className={colSpan === 2 ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}>
      {label && (
        <span className="text-xs font-medium text-ink-muted">
          {label} {required && <span className="text-danger">*</span>}
        </span>
      )}
      {children}
    </label>
  );
}
