"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Wand2, ChevronRight, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { extractProfile, type ExtractedProfile } from "@/lib/intake-extractor";
import { clientsRepo } from "@/lib/db/repo";
import { maritalLabel, riskProfileLabel } from "@/lib/labels";

export default function IntakePage() {
  const router = useRouter();
  const [transcript, setTranscript] = useState("");
  const [extracted, setExtracted] = useState<ExtractedProfile | null>(null);
  const [edited, setEdited] = useState<ExtractedProfile>({});
  const [phase, setPhase] = useState<"input" | "review">("input");
  const [busy, setBusy] = useState(false);

  function runExtraction() {
    if (!transcript.trim()) return;
    setBusy(true);
    setTimeout(() => {
      const result = extractProfile(transcript);
      setExtracted(result);
      setEdited(result);
      setPhase("review");
      setBusy(false);
    }, 600);
  }

  function update<K extends keyof ExtractedProfile>(k: K, v: ExtractedProfile[K]) {
    setEdited((e) => ({ ...e, [k]: v }));
  }

  function confirm() {
    if (!edited.firstName || !edited.lastName) return;
    const c = clientsRepo.create({
      firstName: edited.firstName,
      lastName: edited.lastName,
      email: edited.email,
      phone: edited.phone,
      dob: edited.dob,
      maritalStatus: edited.maritalStatus,
      profession: edited.profession,
      employer: edited.employer,
      address:
        edited.street || edited.postalCode || edited.city
          ? { street: edited.street, postalCode: edited.postalCode, city: edited.city, country: "France" }
          : undefined,
      financial: {
        annualIncome: edited.annualIncome,
        netWorth: edited.netWorth,
        realEstateValue: edited.realEstateValue,
        financialAssets: edited.financialAssets,
      },
      riskProfile: edited.riskProfile,
      notes: edited.notes ?? `Profil créé via intake IA le ${new Date().toLocaleDateString("fr-FR")}.`,
    });
    router.push(`/clients/${c.id}`);
  }

  const fieldsCount = extracted ? Object.values(extracted).filter((v) => v !== undefined && v !== "").length : 0;

  return (
    <>
      <PageHeader
        eyebrow="Intelligence artificielle"
        title="Intake IA — KYC depuis transcription"
        description="Collez la transcription d'un appel ou des notes de RDV. L'IA en extrait un profil structuré que vous validez avant enregistrement."
      />

      {phase === "input" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="font-medium text-ink text-sm">Transcription ou notes</label>
                <span className="text-xs text-ink-muted">{transcript.length} caractères</span>
              </div>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Exemple : « Bonjour, je m'appelle Pierre Dubois, je suis né le 12 mars 1978. Je suis marié, j'habite au 14 rue Lafayette, 75009 Paris. Je travaille comme directeur financier chez Renault. Mes revenus sont d'environ 95 000€ par an, j'ai un patrimoine net de 850 000€ dont environ 600 000€ d'immobilier. Mon profil est plutôt équilibré… »"
                className="input min-h-[360px] resize-y leading-relaxed"
              />
              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-ink-muted flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" />
                  Aucune donnée n'est envoyée tant que vous ne cliquez pas sur "Lancer l'extraction".
                </div>
                <button onClick={runExtraction} disabled={busy || !transcript.trim()} className="btn-primary">
                  <Wand2 className="w-4 h-4" />
                  {busy ? "Analyse en cours…" : "Lancer l'extraction"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-6 bg-gradient-to-br from-navy-700 to-navy-800 text-cream-50 border-navy-700">
              <Sparkles className="w-6 h-6 text-gold-400 mb-3" strokeWidth={1.5} />
              <h3 className="font-display text-lg text-cream-50 mb-2">Comment ça marche</h3>
              <ol className="space-y-2.5 text-sm text-navy-100">
                <li className="flex gap-2"><span className="text-gold-400">1.</span> Collez la transcription d'un appel ou des notes structurées.</li>
                <li className="flex gap-2"><span className="text-gold-400">2.</span> L'IA extrait identité, situation familiale, professionnelle et patrimoniale.</li>
                <li className="flex gap-2"><span className="text-gold-400">3.</span> Vous relisez, corrigez, et validez champ par champ.</li>
                <li className="flex gap-2"><span className="text-gold-400">4.</span> Le dossier est créé dans le CRM avec un PDF de synthèse.</li>
              </ol>
            </div>
            <div className="card p-5">
              <div className="label mb-2">Conformité RGPD</div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Toutes les extractions nécessitent une validation humaine avant d'être enregistrées. Aucun champ
                n'est poussé en CRM sans votre approbation explicite (Article 21 du contrat de service).
              </p>
            </div>
          </div>
        </div>
      )}

      {phase === "review" && extracted && (
        <div className="space-y-6">
          <div className="card p-5 bg-navy-50 border-navy-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-navy-600 text-cream-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-navy-700">Extraction terminée</div>
              <div className="text-xs text-navy-700/70 mt-0.5">
                {fieldsCount} champ{fieldsCount > 1 ? "s" : ""} détecté{fieldsCount > 1 ? "s" : ""}. Vérifiez et corrigez si nécessaire avant d'enregistrer.
              </div>
            </div>
            <button onClick={() => { setPhase("input"); setExtracted(null); }} className="btn-ghost text-xs">
              Recommencer
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="Identité">
              <Field label="Prénom" detected={!!extracted.firstName}>
                <input className="input" value={edited.firstName ?? ""} onChange={(e) => update("firstName", e.target.value)} />
              </Field>
              <Field label="Nom" detected={!!extracted.lastName}>
                <input className="input" value={edited.lastName ?? ""} onChange={(e) => update("lastName", e.target.value)} />
              </Field>
              <Field label="Date de naissance" detected={!!extracted.dob}>
                <input type="date" className="input" value={edited.dob ?? ""} onChange={(e) => update("dob", e.target.value)} />
              </Field>
              <Field label="Situation familiale" detected={!!extracted.maritalStatus}>
                <select className="input" value={edited.maritalStatus ?? ""} onChange={(e) => update("maritalStatus", e.target.value as ExtractedProfile["maritalStatus"])}>
                  <option value="">—</option>
                  {Object.entries(maritalLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
            </Section>

            <Section title="Coordonnées">
              <Field label="Email" detected={!!extracted.email}>
                <input className="input" value={edited.email ?? ""} onChange={(e) => update("email", e.target.value)} />
              </Field>
              <Field label="Téléphone" detected={!!extracted.phone}>
                <input className="input" value={edited.phone ?? ""} onChange={(e) => update("phone", e.target.value)} />
              </Field>
              <Field label="Rue" detected={!!extracted.street} colSpan>
                <input className="input" value={edited.street ?? ""} onChange={(e) => update("street", e.target.value)} />
              </Field>
              <Field label="Code postal" detected={!!extracted.postalCode}>
                <input className="input" value={edited.postalCode ?? ""} onChange={(e) => update("postalCode", e.target.value)} />
              </Field>
              <Field label="Ville" detected={!!extracted.city}>
                <input className="input" value={edited.city ?? ""} onChange={(e) => update("city", e.target.value)} />
              </Field>
            </Section>

            <Section title="Situation professionnelle">
              <Field label="Profession" detected={!!extracted.profession} colSpan>
                <input className="input" value={edited.profession ?? ""} onChange={(e) => update("profession", e.target.value)} />
              </Field>
              <Field label="Employeur" detected={!!extracted.employer} colSpan>
                <input className="input" value={edited.employer ?? ""} onChange={(e) => update("employer", e.target.value)} />
              </Field>
            </Section>

            <Section title="Patrimoine & risque">
              <Field label="Revenus annuels (€)" detected={!!extracted.annualIncome}>
                <input type="number" className="input" value={edited.annualIncome ?? ""} onChange={(e) => update("annualIncome", e.target.value ? Number(e.target.value) : undefined)} />
              </Field>
              <Field label="Patrimoine net (€)" detected={!!extracted.netWorth}>
                <input type="number" className="input" value={edited.netWorth ?? ""} onChange={(e) => update("netWorth", e.target.value ? Number(e.target.value) : undefined)} />
              </Field>
              <Field label="Immobilier (€)" detected={!!extracted.realEstateValue}>
                <input type="number" className="input" value={edited.realEstateValue ?? ""} onChange={(e) => update("realEstateValue", e.target.value ? Number(e.target.value) : undefined)} />
              </Field>
              <Field label="Actifs financiers (€)" detected={!!extracted.financialAssets}>
                <input type="number" className="input" value={edited.financialAssets ?? ""} onChange={(e) => update("financialAssets", e.target.value ? Number(e.target.value) : undefined)} />
              </Field>
              <Field label="Profil de risque" detected={!!extracted.riskProfile} colSpan>
                <select className="input" value={edited.riskProfile ?? ""} onChange={(e) => update("riskProfile", e.target.value as ExtractedProfile["riskProfile"])}>
                  <option value="">—</option>
                  {Object.entries(riskProfileLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
            </Section>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button onClick={() => setPhase("input")} className="btn-secondary">Retour</button>
            <button
              onClick={confirm}
              disabled={!edited.firstName || !edited.lastName}
              className="btn-primary"
            >
              Valider et créer le client <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h3 className="font-display text-base text-ink mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  detected,
  colSpan,
  children,
}: {
  label: string;
  detected?: boolean;
  colSpan?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={colSpan ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}>
      <span className="text-xs font-medium text-ink-muted flex items-center gap-2">
        {label}
        {detected && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gold-600 bg-[#F4ECD8] border border-[#E5D6AE] rounded-md px-1.5 py-0.5">
            <Sparkles className="w-2.5 h-2.5" /> détecté
          </span>
        )}
      </span>
      {children}
    </label>
  );
}
