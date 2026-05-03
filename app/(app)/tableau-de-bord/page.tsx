"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Building2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
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
import { kycStatusLabel, kycStatusTone, submissionStatusLabel } from "@/lib/labels";
import { formatCompactNumber, formatEUR, formatRelative } from "@/lib/utils";

const growthSeries = [
  { label: "Nov", value: 52 },
  { label: "Dec", value: 58 },
  { label: "Jan", value: 61 },
  { label: "Feb", value: 68 },
  { label: "Mar", value: 74 },
  { label: "Apr", value: 82 },
  { label: "May", value: 91 },
];

const engagementSeries = [
  { label: "S1", value: 62 },
  { label: "S2", value: 71 },
  { label: "S3", value: 78 },
  { label: "S4", value: 84 },
];

export default function DashboardPage() {
  const clients = useStore(() => clientsRepo.list());
  const alerts = useStore(() => alertsRepo.list());
  const documents = useStore(() => documentsRepo.list());
  const submissions = useStore(() => submissionsRepo.list());
  const activity = useStore(() => activityRepo.list().slice(0, 8));
  const compliance = useStore(() => complianceRepo.list());

  const openAlerts = alerts.filter((alert) => !alert.resolved);
  const complete = clients.filter((client) => client.kycStatus === "complet").length;
  const kycInProgress = clients.filter((client) => client.kycStatus === "en_cours" || client.kycStatus === "en_attente").length;
  const verifiedDocs = documents.filter((document) => document.status === "verifie").length;
  const blockedDocs = documents.filter((document) => document.status === "expire" || document.status === "manquant").length;
  const activeSubmissions = submissions.filter((submission) => submission.status !== "termine");
  const totalAum = clients.reduce((sum, client) => sum + (client.financial?.netWorth ?? 0), 0);
  const pipelineValue = activeSubmissions.reduce((sum, submission) => sum + (submission.amount ?? 0), 0);
  const averageTicket = activeSubmissions.length > 0 ? pipelineValue / activeSubmissions.length : 0;
  const completionRate = clients.length > 0 ? Math.round((complete / clients.length) * 100) : 0;
  const reviewCoverage = documents.length > 0 ? Math.round((verifiedDocs / documents.length) * 100) : 0;
  const complianceReady = compliance.filter((record) => record.status === "valide" || record.status === "envoye").length;

  const assetMix = clients.reduce(
    (acc, client) => {
      client.assets?.forEach((asset) => {
        acc.total += asset.value;
        acc[asset.type] += asset.value;
      });
      return acc;
    },
    { immobilier: 0, financier: 0, professionnel: 0, autre: 0, total: 0 },
  );

  const riskMix = {
    prudent: clients.filter((client) => client.riskProfile === "prudent").length,
    equilibre: clients.filter((client) => client.riskProfile === "equilibre").length,
    dynamique: clients.filter((client) => client.riskProfile === "dynamique").length,
    offensif: clients.filter((client) => client.riskProfile === "offensif").length,
  };

  const topClients = [...clients]
    .sort((a, b) => (b.financial?.netWorth ?? 0) - (a.financial?.netWorth ?? 0))
    .slice(0, 4);

  const priorityClients = [...clients]
    .filter((client) => client.kycStatus !== "complet" || openAlerts.some((alert) => alert.clientId === client.id))
    .sort((a, b) => (b.financial?.netWorth ?? 0) - (a.financial?.netWorth ?? 0))
    .slice(0, 4);

  const stageCounts = {
    non_demarre: clients.filter((client) => client.kycStatus === "non_demarre").length,
    en_cours: clients.filter((client) => client.kycStatus === "en_cours").length,
    en_attente: clients.filter((client) => client.kycStatus === "en_attente").length,
    complet: complete,
  };

  const automationCards = [
    {
      title: "Intake IA",
      description: "Extraction KYC depuis compte rendu ou transcription d'appel.",
      impact: "84% des champs reconnus sur la demo",
      href: "/intake",
    },
    {
      title: "Conformite assistee",
      description: "Compte rendu, lettre de mission et adequation pre-remplis.",
      impact: `${complianceReady} documents deja prets a valider`,
      href: "/conformite",
    },
    {
      title: "Relances intelligentes",
      description: "Priorisation automatique des pieces bloquees et revues annuelles.",
      impact: `${openAlerts.length} alertes classees par criticite`,
      href: "/alertes",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Vue exécutive"
        title="Tableau de bord CRM"
        description="Un cockpit premium pour piloter votre portefeuille, accélérer les onboarding KYC et mettre en valeur la qualité de votre accompagnement client."
        actions={
          <>
            <Link href="/intake" className="btn-secondary">
              <Sparkles className="h-4 w-4" />
              Lancer un intake IA
            </Link>
            <Link href="/clients/nouveau" className="btn-primary">
              + Nouveau client
            </Link>
          </>
        }
      />

      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="card overflow-hidden p-6 md:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="label text-gold-400">Performance cabinet</div>
              <h2 className="mt-3 font-display text-4xl leading-tight text-cream-50 md:text-5xl">
                Un CRM qui inspire confiance, fluidifie la relation client et valorise votre expertise.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-ink-muted md:text-[15px]">
                Le parcours est prêt pour une présentation client haut de gamme : données vivantes, priorisation claire,
                insights business et surfaces premium sur chaque page.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Badge tone="gold">Pipeline {formatEUR(pipelineValue)}</Badge>
                <Badge tone="success">{completionRate}% des dossiers KYC finalisés</Badge>
                <Badge tone="info">{reviewCoverage}% de couverture documentaire</Badge>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:w-[420px] lg:grid-cols-1">
              <HeroMetric label="Actifs suivis" value={formatCompactNumber(totalAum)} hint="Patrimoine agrégé" />
              <HeroMetric label="Ticket moyen" value={formatEUR(averageTicket)} hint="Soumissions actives" />
              <HeroMetric label="Alertes critiques" value={String(openAlerts.filter((alert) => alert.severity === "critical").length)} hint="A traiter aujourd'hui" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="label text-gold-400">Pulse score</div>
              <h3 className="mt-2 font-display text-3xl text-cream-50">9.2 / 10</h3>
            </div>
            <div className="rounded-2xl border border-[rgba(87,194,138,0.18)] bg-[rgba(87,194,138,0.1)] px-3 py-2 text-sm font-medium text-success">
              +0.8 cette semaine
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <ScoreRow label="Experience client" value={94} />
            <ScoreRow label="Execution KYC" value={88} />
            <ScoreRow label="Production conformite" value={91} />
            <ScoreRow label="Suivi commercial" value={85} />
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-navy-900/38 p-4">
              <div className="text-sm text-ink">Prochaine opportunité</div>
              <p className="mt-1 text-sm leading-6 text-ink-muted">
                Transformer les dossiers premium en parcours concierge avec checklists dédiées et relances personnalisées.
              </p>
            </div>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Clients actifs" value={clients.length} hint={`${complete} dossiers complets`} delta="+18% QoQ" icon={Users} />
        <StatCard label="KYC en cours" value={kycInProgress} hint="Actions prioritaires ouvertes" delta="-2 en 7 jours" icon={Clock3} tone="warning" />
        <StatCard label="Pièces bloquées" value={blockedDocs} hint="Manquantes ou expirées" delta="Focus automatique" icon={AlertTriangle} tone={blockedDocs > 0 ? "danger" : "default"} />
        <StatCard label="Deals actifs" value={activeSubmissions.length} hint={`${formatEUR(pipelineValue)} de pipeline`} delta="+3 cette quinzaine" icon={Building2} tone="success" />
      </section>

      <section className="mb-6 grid grid-cols-1 gap-6 2xl:grid-cols-[1.5fr_1fr]">
        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="label">Croissance du portefeuille</div>
              <h3 className="mt-2 font-display text-2xl text-ink">Momentum commercial et engagement client</h3>
              <p className="mt-2 text-sm text-ink-muted">
                Visualisation premium du portefeuille pour illustrer la montée en cadence du cabinet.
              </p>
            </div>
            <Badge tone="success">+31% depuis novembre</Badge>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
            <div className="rounded-2xl border border-line bg-navy-900/28 p-4">
              <LineChart data={growthSeries} />
            </div>
            <div className="space-y-3">
              <MiniMetric label="Onboarding fluides" value="96%" hint="Dossiers lancés en moins de 24h" />
              <MiniMetric label="Validation doc" value={`${reviewCoverage}%`} hint={`${verifiedDocs} pièces vérifiées`} />
              <MiniMetric label="Conformite" value={`${complianceReady}`} hint="documents valides ou envoyes" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="label">Pipeline KYC</div>
          <h3 className="mt-2 font-display text-2xl text-ink">Progression des dossiers</h3>
          <div className="mt-5 space-y-4">
            {Object.entries(stageCounts).map(([key, value]) => (
              <StageRow
                key={key}
                label={kycStatusLabel[key as keyof typeof stageCounts]}
                tone={kycStatusTone[key as keyof typeof stageCounts]}
                value={value}
                total={clients.length}
              />
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-navy-900/36 p-4">
            <div className="flex items-center gap-2 text-sm text-ink">
              <ShieldCheck className="h-4 w-4 text-success" />
              {complete} dossiers sont déjà prêts pour des démarches ou arbitrages premium.
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr_0.9fr]">
        <div className="card p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="label">Allocation patrimoniale</div>
          <h3 className="mt-2 font-display text-2xl text-ink">Mix d'actifs du portefeuille</h3>
            </div>
            <span className="text-sm text-ink-muted">{formatCompactNumber(assetMix.total)} au total</span>
          </div>
          <div className="mt-6 rounded-2xl border border-line bg-navy-900/30 p-4">
            <div className="flex h-4 overflow-hidden rounded-full">
              <StackBar value={assetMix.immobilier} total={assetMix.total} className="bg-[#6E88B4]" />
              <StackBar value={assetMix.financier} total={assetMix.total} className="bg-[#E8BE78]" />
              <StackBar value={assetMix.professionnel} total={assetMix.total} className="bg-[#57C28A]" />
              <StackBar value={assetMix.autre} total={assetMix.total} className="bg-[#6FD3E1]" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <AssetLegend label="Immobilier" value={assetMix.immobilier} total={assetMix.total} color="bg-[#6E88B4]" />
              <AssetLegend label="Financier" value={assetMix.financier} total={assetMix.total} color="bg-[#E8BE78]" />
              <AssetLegend label="Professionnel" value={assetMix.professionnel} total={assetMix.total} color="bg-[#57C28A]" />
              <AssetLegend label="Autre" value={assetMix.autre} total={assetMix.total} color="bg-[#6FD3E1]" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="label">Segments risque</div>
          <h3 className="mt-2 font-display text-2xl text-ink">Répartition investisseurs</h3>
          <div className="mt-6 space-y-4">
            <StageRow label="Prudent" tone="success" value={riskMix.prudent} total={clients.length} />
            <StageRow label="Equilibre" tone="info" value={riskMix.equilibre} total={clients.length} />
            <StageRow label="Dynamique" tone="warning" value={riskMix.dynamique} total={clients.length} />
            <StageRow label="Offensif" tone="danger" value={riskMix.offensif} total={clients.length} />
          </div>
          <div className="mt-6 rounded-2xl border border-line bg-navy-900/36 p-4">
            <div className="label">Engagement digital</div>
            <div className="mt-4">
              <BarChart data={engagementSeries} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="label">Top portefeuille</div>
          <h3 className="mt-2 font-display text-2xl text-ink">Clients à plus fort potentiel</h3>
          <div className="mt-5 space-y-3">
            {topClients.map((client) => (
              <div key={client.id} className="rounded-2xl border border-line bg-navy-900/28 p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={`${client.firstName} ${client.lastName}`} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink">
                      {client.firstName} {client.lastName}
                    </div>
                    <div className="text-xs text-ink-muted">{client.tags?.slice(0, 2).join(" • ") || "Portefeuille premium"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-cream-50">{formatEUR(client.financial?.netWorth)}</div>
                    <div className="text-[11px] text-ink-subtle">patrimoine net</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="label">Priorites du jour</div>
              <h3 className="mt-2 font-display text-2xl text-ink">Clients qui méritent une attention immédiate</h3>
            </div>
            <Link href="/clients" className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300">
              Ouvrir le portefeuille <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {priorityClients.map((client) => {
              const clientAlerts = openAlerts.filter((alert) => alert.clientId === client.id).length;
              const clientDocs = documents.filter((document) => document.clientId === client.id);
              const verifiedCount = clientDocs.filter((document) => document.status === "verifie").length;

              return (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}`}
                  className="block rounded-2xl border border-line bg-navy-900/28 p-4 hover:border-navy-300/45 hover:bg-navy-900/40"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={`${client.firstName} ${client.lastName}`} size={44} />
                      <div>
                        <div className="text-sm font-medium text-ink">
                          {client.firstName} {client.lastName}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Badge tone={kycStatusTone[client.kycStatus]}>{kycStatusLabel[client.kycStatus]}</Badge>
                          {clientAlerts > 0 && <Badge tone="danger">{clientAlerts} alerte{clientAlerts > 1 ? "s" : ""}</Badge>}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <PriorityStat label="Patrimoine" value={formatCompactNumber(client.financial?.netWorth ?? 0)} />
                      <PriorityStat label="Docs" value={`${verifiedCount}/${Math.max(clientDocs.length, 4)}`} />
                      <PriorityStat label="Revue" value={formatRelative(client.nextReviewAt)} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(232,190,120,0.18)] bg-[rgba(232,190,120,0.08)] text-gold-400">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="label">Automations IA</div>
                <h3 className="mt-1 font-display text-2xl text-ink">Infographies & workflows</h3>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {automationCards.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="block rounded-2xl border border-line bg-navy-900/30 p-4 hover:border-navy-300/45 hover:bg-navy-900/42"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-ink">{card.title}</div>
                      <p className="mt-1 text-xs leading-5 text-ink-muted">{card.description}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gold-400" />
                  </div>
                  <div className="mt-3 text-xs font-medium text-gold-300">{card.impact}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-6">
          <div className="label">Pipeline deals</div>
          <h3 className="mt-2 font-display text-2xl text-ink">Soumissions en vedette</h3>
            <div className="mt-5 space-y-3">
              {activeSubmissions.slice(0, 3).map((submission) => (
                <div key={submission.id} className="rounded-2xl border border-line bg-navy-900/28 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-ink">{submission.partner}</div>
                      <div className="mt-1 text-xs text-ink-muted">{submission.product ?? "Offre patrimoniale"}</div>
                    </div>
                    <Badge tone="info">{submissionStatusLabel[submission.status]}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-ink-muted">
                    <span>{formatEUR(submission.amount)}</span>
                    <span>MAJ {formatRelative(submission.updatedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="label">Activité récente</div>
              <h3 className="mt-2 font-display text-2xl text-ink">Chronologie du cabinet</h3>
            </div>
            <TrendingUp className="h-5 w-5 text-gold-400" />
          </div>

          <ol className="mt-6 space-y-4">
            {activity.map((event) => (
              <li key={event.id} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-line bg-navy-900/45">
                  <span className="h-2 w-2 rounded-full bg-gold-400" />
                </div>
                <div className="flex-1 rounded-2xl border border-line bg-navy-900/24 p-4">
                  <div className="text-sm text-ink">{event.summary}</div>
                  <div className="mt-1 text-xs text-ink-muted">{formatRelative(event.at)}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="label">Radar alertes</div>
              <h3 className="mt-2 font-display text-2xl text-ink">Surveillance proactive</h3>
            </div>
            <Link href="/alertes" className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300">
              Voir tout <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {openAlerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-line bg-navy-900/28 p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${
                      alert.severity === "critical" ? "bg-danger" : alert.severity === "warning" ? "bg-warning" : "bg-cyan"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="text-sm text-ink">{alert.message}</div>
                    <div className="mt-1 text-xs text-ink-muted">{formatRelative(alert.createdAt)}</div>
                  </div>
                </div>
              </div>
            ))}

            {openAlerts.length === 0 && (
              <div className="rounded-2xl border border-line bg-navy-900/28 p-5 text-center">
                <CheckCircle2 className="mx-auto h-6 w-6 text-success" />
                <div className="mt-2 text-sm text-ink">Aucune alerte active</div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function HeroMetric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-line bg-navy-900/34 p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-ink-subtle">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-cream-50">{value}</div>
      <div className="mt-1 text-xs text-ink-muted">{hint}</div>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-ink">
        <span>{label}</span>
        <span className="font-medium text-cream-50">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-navy-900/48">
        <div className="h-2 rounded-full bg-[linear-gradient(90deg,#6FD3E1_0%,#E8BE78_100%)]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MiniMetric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-line bg-navy-900/28 p-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-ink-subtle">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-cream-50">{value}</div>
      <div className="mt-1 text-xs text-ink-muted">{hint}</div>
    </div>
  );
}

function StageRow({
  label,
  tone,
  value,
  total,
}: {
  label: string;
  tone: "neutral" | "info" | "warning" | "success" | "danger";
  value: number;
  total: number;
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  const barTone = {
    neutral: "bg-navy-300",
    info: "bg-cyan",
    warning: "bg-warning",
    success: "bg-success",
    danger: "bg-danger",
  }[tone];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-ink">
        <span>{label}</span>
        <span className="text-ink-muted">
          {value} <span className="text-ink-subtle">({percent}%)</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-navy-900/48">
        <div className={`h-2 rounded-full ${barTone}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function LineChart({ data }: { data: { label: string; value: number }[] }) {
  const width = 560;
  const height = 240;
  const padding = 26;
  const max = Math.max(...data.map((point) => point.value));
  const min = Math.min(...data.map((point) => point.value));
  const points = data.map((point, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const ratio = (point.value - min) / Math.max(max - min, 1);
    const y = height - padding - ratio * (height - padding * 2);
    return { ...point, x, y };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `M ${points[0]?.x ?? 0} ${height - padding} L ${polyline.replaceAll(" ", " L ")} L ${points[points.length - 1]?.x ?? width} ${height - padding} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[240px] w-full">
        <defs>
          <linearGradient id="line-area" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(232,190,120,0.28)" />
            <stop offset="100%" stopColor="rgba(232,190,120,0)" />
          </linearGradient>
          <linearGradient id="line-stroke" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#6FD3E1" />
            <stop offset="100%" stopColor="#E8BE78" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((step) => {
          const y = padding + (step * (height - padding * 2)) / 3;
          return <line key={step} x1={padding} x2={width - padding} y1={y} y2={y} stroke="rgba(174,187,214,0.12)" strokeDasharray="4 8" />;
        })}

        <path d={area} fill="url(#line-area)" />
        <polyline fill="none" stroke="url(#line-stroke)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={polyline} />

        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="5" fill="#08111F" stroke="#E8BE78" strokeWidth="3" />
            <text x={point.x} y={height - 8} textAnchor="middle" fill="#7F91B6" fontSize="11">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="flex items-end gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex-1">
          <div className="flex h-28 items-end">
            <div className="w-full rounded-t-2xl bg-[linear-gradient(180deg,#6FD3E1_0%,#E8BE78_100%)]" style={{ height: `${item.value}%` }} />
          </div>
          <div className="mt-2 text-center text-[11px] text-ink-muted">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function StackBar({ value, total, className }: { value: number; total: number; className: string }) {
  return <div className={className} style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }} />;
}

function AssetLegend({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-line bg-navy-900/24 px-3 py-3">
      <div className="flex items-center gap-2">
        <span className={`h-3 w-3 rounded-full ${color}`} />
        <div>
          <div className="text-sm text-ink">{label}</div>
          <div className="text-xs text-ink-muted">{formatEUR(value)}</div>
        </div>
      </div>
      <div className="text-sm font-medium text-cream-50">{percent}%</div>
    </div>
  );
}

function PriorityStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-navy-900/32 px-3 py-2 text-center">
      <div className="text-[10px] uppercase tracking-[0.18em] text-ink-subtle">{label}</div>
      <div className="mt-1 text-sm font-medium text-cream-50">{value}</div>
    </div>
  );
}
