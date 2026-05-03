"use client";

import { uid } from "@/lib/utils";
import type {
  ActivityEvent,
  Alert,
  Client,
  ComplianceDocRecord,
  DocumentRecord,
  Submission,
} from "./types";
import { buildDemoSeed } from "./demo-data";

const KEYS = {
  clients: "cogni:clients",
  documents: "cogni:documents",
  compliance: "cogni:compliance",
  submissions: "cogni:submissions",
  alerts: "cogni:alerts",
  activity: "cogni:activity",
} as const;

const DEMO_SEED_VERSION = "crm-premium-v1";
const DEMO_SEED_VERSION_KEY = "cogni:demo-seed-version";
const DEMO_SEED_STATE_KEY = "cogni:demo-seed-state";

type Key = keyof typeof KEYS;

function read<T>(key: Key): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEYS[key]);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function broadcast(key: Key | "all") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("cogni:changed", { detail: { key } }));
}

function write<T>(key: Key, value: T[], notify = true) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS[key], JSON.stringify(value));
  if (notify) {
    broadcast(key);
  }
}

const subscribers = new Set<() => void>();

if (typeof window !== "undefined") {
  window.addEventListener("cogni:changed", () => subscribers.forEach((f) => f()));
  window.addEventListener("storage", () => subscribers.forEach((f) => f()));
}

export function subscribe(fn: () => void) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function hasStoredBusinessData() {
  return (Object.keys(KEYS) as Key[]).some((key) => {
    try {
      const raw = window.localStorage.getItem(KEYS[key]);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch {
      return false;
    }
  });
}

function logActivity(ev: Omit<ActivityEvent, "id" | "at">) {
  const list = read<ActivityEvent>("activity");
  list.unshift({ ...ev, id: uid(), at: new Date().toISOString() });
  write("activity", list.slice(0, 200));
}

export function seedDemoData(force = false) {
  if (typeof window === "undefined") return;
  if (!force && hasStoredBusinessData()) return;

  const seed = buildDemoSeed();
  write("clients", seed.clients, false);
  write("documents", seed.documents, false);
  write("compliance", seed.compliance, false);
  write("submissions", seed.submissions, false);
  write("alerts", seed.alerts, false);
  write("activity", seed.activity, false);
  window.localStorage.setItem(DEMO_SEED_VERSION_KEY, DEMO_SEED_VERSION);
  window.localStorage.setItem(DEMO_SEED_STATE_KEY, "ready");
  broadcast("all");
}

export function ensureDemoData() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(DEMO_SEED_STATE_KEY) === "cleared") return;
  if (hasStoredBusinessData()) {
    if (!window.localStorage.getItem(DEMO_SEED_VERSION_KEY)) {
      window.localStorage.setItem(DEMO_SEED_VERSION_KEY, DEMO_SEED_VERSION);
    }
    return;
  }
  if (window.localStorage.getItem(DEMO_SEED_VERSION_KEY) === DEMO_SEED_VERSION) return;
  seedDemoData(true);
}

export const clientsRepo = {
  list(): Client[] {
    return read<Client>("clients").sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  get(id: string): Client | undefined {
    return read<Client>("clients").find((c) => c.id === id);
  },
  create(input: Omit<Client, "id" | "createdAt" | "updatedAt" | "kycStatus"> & { kycStatus?: Client["kycStatus"] }): Client {
    const now = new Date().toISOString();
    const c: Client = {
      ...input,
      id: uid(),
      createdAt: now,
      updatedAt: now,
      kycStatus: input.kycStatus ?? "en_cours",
    };
    const list = read<Client>("clients");
    list.push(c);
    write("clients", list);
    logActivity({ kind: "client_cree", clientId: c.id, summary: `Client créé : ${c.firstName} ${c.lastName}` });
    return c;
  },
  update(id: string, patch: Partial<Client>): Client | undefined {
    const list = read<Client>("clients");
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    write("clients", list);
    logActivity({ kind: "kyc_mis_a_jour", clientId: id, summary: `Profil mis à jour : ${list[idx].firstName} ${list[idx].lastName}` });
    return list[idx];
  },
  remove(id: string) {
    write("clients", read<Client>("clients").filter((c) => c.id !== id));
    write("documents", read<DocumentRecord>("documents").filter((d) => d.clientId !== id));
    write("compliance", read<ComplianceDocRecord>("compliance").filter((d) => d.clientId !== id));
    write("submissions", read<Submission>("submissions").filter((s) => s.clientId !== id));
    write("alerts", read<Alert>("alerts").filter((a) => a.clientId !== id));
  },
};

export const documentsRepo = {
  list(clientId?: string): DocumentRecord[] {
    const all = read<DocumentRecord>("documents");
    return clientId ? all.filter((d) => d.clientId === clientId) : all;
  },
  create(input: Omit<DocumentRecord, "id">): DocumentRecord {
    const d: DocumentRecord = { ...input, id: uid() };
    const list = read<DocumentRecord>("documents");
    list.push(d);
    write("documents", list);
    logActivity({ kind: "document_recu", clientId: d.clientId, summary: `Document reçu : ${d.fileName ?? d.type}` });
    return d;
  },
  update(id: string, patch: Partial<DocumentRecord>): DocumentRecord | undefined {
    const list = read<DocumentRecord>("documents");
    const idx = list.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;
    list[idx] = { ...list[idx], ...patch };
    write("documents", list);
    if (patch.status === "verifie") {
      logActivity({ kind: "document_verifie", clientId: list[idx].clientId, summary: `Document vérifié : ${list[idx].fileName ?? list[idx].type}` });
    }
    return list[idx];
  },
  remove(id: string) {
    write("documents", read<DocumentRecord>("documents").filter((d) => d.id !== id));
  },
};

export const complianceRepo = {
  list(clientId?: string): ComplianceDocRecord[] {
    const all = read<ComplianceDocRecord>("compliance");
    return clientId ? all.filter((d) => d.clientId === clientId) : all;
  },
  create(input: Omit<ComplianceDocRecord, "id" | "generatedAt"> & { generatedAt?: string }): ComplianceDocRecord {
    const d: ComplianceDocRecord = { ...input, id: uid(), generatedAt: input.generatedAt ?? new Date().toISOString() };
    const list = read<ComplianceDocRecord>("compliance");
    list.push(d);
    write("compliance", list);
    logActivity({ kind: "doc_genere", clientId: d.clientId, summary: `Document généré : ${d.type}` });
    return d;
  },
  update(id: string, patch: Partial<ComplianceDocRecord>): ComplianceDocRecord | undefined {
    const list = read<ComplianceDocRecord>("compliance");
    const idx = list.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;
    list[idx] = { ...list[idx], ...patch };
    write("compliance", list);
    if (patch.status === "valide") {
      logActivity({ kind: "doc_valide", clientId: list[idx].clientId, summary: `Document validé : ${list[idx].type}` });
    }
    return list[idx];
  },
  remove(id: string) {
    write("compliance", read<ComplianceDocRecord>("compliance").filter((d) => d.id !== id));
  },
};

export const submissionsRepo = {
  list(clientId?: string): Submission[] {
    const all = read<Submission>("submissions");
    const filtered = clientId ? all.filter((s) => s.clientId === clientId) : all;
    return filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  create(input: Omit<Submission, "id" | "openedAt" | "updatedAt"> & { openedAt?: string }): Submission {
    const now = new Date().toISOString();
    const s: Submission = { ...input, id: uid(), openedAt: input.openedAt ?? now, updatedAt: now };
    const list = read<Submission>("submissions");
    list.push(s);
    write("submissions", list);
    logActivity({ kind: "soumission_creee", clientId: s.clientId, summary: `Soumission ${s.partner} créée` });
    return s;
  },
  update(id: string, patch: Partial<Submission>): Submission | undefined {
    const list = read<Submission>("submissions");
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;
    list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    write("submissions", list);
    logActivity({ kind: "soumission_majeure", clientId: list[idx].clientId, summary: `Soumission ${list[idx].partner} : ${list[idx].status}` });
    return list[idx];
  },
  remove(id: string) {
    write("submissions", read<Submission>("submissions").filter((s) => s.id !== id));
  },
};

export const alertsRepo = {
  list(): Alert[] {
    return read<Alert>("alerts").sort((a, b) => (a.resolved === b.resolved ? 0 : a.resolved ? 1 : -1));
  },
  create(input: Omit<Alert, "id" | "createdAt"> & { createdAt?: string }): Alert {
    const a: Alert = { ...input, id: uid(), createdAt: input.createdAt ?? new Date().toISOString() };
    const list = read<Alert>("alerts");
    list.push(a);
    write("alerts", list);
    return a;
  },
  resolve(id: string) {
    const list = read<Alert>("alerts");
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return;
    list[idx] = { ...list[idx], resolved: true };
    write("alerts", list);
    logActivity({ kind: "alerte_resolue", clientId: list[idx].clientId, summary: `Alerte résolue : ${list[idx].message}` });
  },
  remove(id: string) {
    write("alerts", read<Alert>("alerts").filter((a) => a.id !== id));
  },
};

export const activityRepo = {
  list(): ActivityEvent[] {
    return read<ActivityEvent>("activity");
  },
};

export function resetAll() {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
  window.localStorage.removeItem(DEMO_SEED_VERSION_KEY);
  window.localStorage.setItem(DEMO_SEED_STATE_KEY, "cleared");
  broadcast("all");
}
