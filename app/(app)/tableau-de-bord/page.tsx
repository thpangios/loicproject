"use client";

import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  FileCheck2,
  ScrollText,
  Building2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useStore } from "@/lib/db/use-store";
import {
  activityRepo,
  alertsRepo,
  clientsRepo,
  complianceRepo,
  documentsRepo,
  submissionsRepo,
} from "@/lib/db/repo";
import { kycStatusLabel, kycStatusTone } from "@/lib/labels";
import { formatRelative } from "@/lib/utils";

export default function DashboardPage() {
  const clients = useStore(() => clientsRepo.list());
  const alerts = useStore(() => alertsRepo.list().filter((a) => !a.resolved));
  const documents = useStore(() => documentsRepo.list());
  const submissions = useStore(() => submissionsRepo.list());
  const activity = useStore(() => activityRepo.list().slice(0, 8));

  const total = clients.length;
  const complete = clients.filter((c) => c.kycStatus === "complet").length;
  const inProgress = clients.filter((c) => c.kycStatus === "en_cours" || c.kycStatus === "en_attente").length;
  const missingDocs = documents.filter((d) => d.status === "manquant" || d.status === "expire").length;
  const activeSubmissions = submissions.filter((s) => s.status !== "termine").length;

  const recentClients = clients.slice(0, 5);

  return (
    <>
      <PageHeader
        eyebrow="Aperçu général"
        title="Tableau de bord"
        description="Suivi en temps réel de votre activité, des dossiers KYC et des échéances de conformité."
        actions={
          <>
            <Link href="/intake" className="btn-secondary">
              <Sparkles className="w-4 h-4" />
              Nouvel intake IA
            </Link>
            <Link href="/clients/nouveau" className="btn-primary">
              + Nouveau client
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Clients actifs" value={total} icon={Users} hint={total === 0 ? "Aucun client enregistré" : `${complete} dossiers complets`} />
        <StatCard label="KYC en cours" value={inProgress} icon={Clock} tone="warning" hint="Actions requises" />
        <StatCard label="Documents en alerte" value={missingDocs} icon={AlertTriangle} tone={missingDocs > 0 ? "danger" : "default"} hint={missingDocs > 0 ? "Manquants ou expirés" : "Tout est en règle"} />
        <StatCard label="Soumissions en cours" value={activeSubmissions} icon={Building2} tone="success" hint="Partenaires & banques" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-lg text-ink">Clients récents</h2>
              <p className="text-xs text-ink-muted mt-0.5">Les derniers dossiers ouverts ou mis à jour</p>
            </div>
            <Link href="/clients" className="text-xs text-gold-400 hover:text-gold-500 inline-flex items-center gap-1">
              Voir tout <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {recentClients.length === 0 ? (
            <div className="border border-dashed border-line rounded-lg px-6 py-10 text-center">
              <p className="text-sm text-ink-muted mb-3">Aucun client enregistré pour le moment.</p>
              <Link href="/clients/nouveau" className="btn-primary">+ Créer le premier client</Link>
            </div>
          ) : (
            <div className="divide-y divide-line -mx-2">
              {recentClients.map((c) => (
                <Link
                  key={c.id}
                  href={`/clients/${c.id}`}
                  className="flex items-center gap-4 px-2 py-3 rounded-lg hover:bg-navy-800/48 transition"
                >
                  <Avatar name={`${c.firstName} ${c.lastName}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-ink truncate">{c.firstName} {c.lastName}</div>
                    <div className="text-xs text-ink-muted truncate">
                      {c.email ?? "—"} · MAJ {formatRelative(c.updatedAt)}
                    </div>
                  </div>
                  <Badge tone={kycStatusTone[c.kycStatus]}>{kycStatusLabel[c.kycStatus]}</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-ink">Alertes prioritaires</h2>
            <Link href="/alertes" className="text-xs text-gold-400 hover:text-gold-500">Voir tout</Link>
          </div>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-sm text-ink-muted">Aucune alerte en attente.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {alerts.slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      a.severity === "critical" ? "bg-danger" : a.severity === "warning" ? "bg-warning" : "bg-navy-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-ink leading-snug">{a.message}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{formatRelative(a.createdAt)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-display text-lg text-ink mb-5">Activité récente</h2>
          {activity.length === 0 ? (
            <p className="text-sm text-ink-muted text-center py-8">L'activité apparaîtra ici dès vos premières opérations.</p>
          ) : (
            <ol className="space-y-4">
              {activity.map((e) => (
                <li key={e.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-navy-800/82 border border-line flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-ink">{e.summary}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{formatRelative(e.at)}</div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="card p-6 bg-gradient-to-br from-navy-700 to-navy-900 text-cream-50 border-line">
          <div className="label text-gold-400 mb-3">Raccourcis IA</div>
          <h2 className="font-display text-xl text-cream-50 mb-2">Gagnez 10h par semaine</h2>
          <p className="text-sm text-navy-100 mb-5">
            Démarrez un onboarding à partir d'une transcription d'appel ou générez vos documents réglementaires en un clic.
          </p>
          <div className="space-y-2">
            <Link href="/intake" className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-navy-600/60 hover:bg-navy-600 transition">
              <span className="flex items-center gap-2.5 text-sm">
                <Sparkles className="w-4 h-4 text-gold-400" /> Intake KYC IA
              </span>
              <ArrowUpRight className="w-4 h-4 text-navy-200" />
            </Link>
            <Link href="/conformite" className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-navy-600/60 hover:bg-navy-600 transition">
              <span className="flex items-center gap-2.5 text-sm">
                <ScrollText className="w-4 h-4 text-gold-400" /> Générer un rapport
              </span>
              <ArrowUpRight className="w-4 h-4 text-navy-200" />
            </Link>
            <Link href="/documents" className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-navy-600/60 hover:bg-navy-600 transition">
              <span className="flex items-center gap-2.5 text-sm">
                <FileCheck2 className="w-4 h-4 text-gold-400" /> Demander des pièces
              </span>
              <ArrowUpRight className="w-4 h-4 text-navy-200" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
