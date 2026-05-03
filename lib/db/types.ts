export type KycStatus = "non_demarre" | "en_cours" | "en_attente" | "complet";
export type DocStatus = "manquant" | "en_attente" | "verifie" | "expire";
export type DocType = "piece_identite" | "justificatif_domicile" | "rib" | "source_fonds" | "autre";
export type ComplianceDocType = "compte_rendu" | "lettre_mission" | "rapport_adequation" | "comparatif_produits";
export type ComplianceDocStatus = "brouillon" | "valide" | "envoye";
export type SubmissionStatus =
  | "preparation"
  | "documents_envoyes"
  | "fonds_recus"
  | "contrat_cree"
  | "acces_active"
  | "termine";
export type AlertSeverity = "info" | "warning" | "critical";
export type RiskProfile = "prudent" | "equilibre" | "dynamique" | "offensif";
export type MaritalStatus = "celibataire" | "marie" | "pacse" | "divorce" | "veuf";
export type Partner = "Cardif" | "BNP Paribas" | "Suravenir" | "CNP" | "Generali" | "AXA" | "Autre";

export interface Address {
  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;
}

export interface FinancialSituation {
  annualIncome?: number;
  netWorth?: number;
  realEstateValue?: number;
  financialAssets?: number;
  liabilities?: number;
  monthlySavingsCapacity?: number;
}

export interface Asset {
  id: string;
  type: "immobilier" | "financier" | "professionnel" | "autre";
  label: string;
  value: number;
  ownership?: number;
  notes?: string;
}

export interface Client {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dob?: string;
  maritalStatus?: MaritalStatus;
  taxResidence?: string;
  profession?: string;
  employer?: string;
  address?: Address;
  financial?: FinancialSituation;
  assets?: Asset[];
  riskProfile?: RiskProfile;
  kycStatus: KycStatus;
  notes?: string;
  nextReviewAt?: string;
  tags?: string[];
}

export interface DocumentRecord {
  id: string;
  clientId: string;
  type: DocType;
  fileName?: string;
  status: DocStatus;
  uploadedAt?: string;
  expiresAt?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface ComplianceDocRecord {
  id: string;
  clientId: string;
  type: ComplianceDocType;
  status: ComplianceDocStatus;
  generatedAt: string;
  validatedAt?: string;
  productSelection?: string;
  contentSnapshot?: string;
}

export interface Submission {
  id: string;
  clientId: string;
  partner: Partner;
  product?: string;
  amount?: number;
  status: SubmissionStatus;
  openedAt: string;
  updatedAt: string;
  reference?: string;
  notes?: string;
}

export interface Alert {
  id: string;
  clientId?: string;
  type:
    | "doc_expire"
    | "doc_manquant"
    | "revue_annuelle"
    | "suivi_client"
    | "kyc_incomplet"
    | "soumission_bloquee";
  severity: AlertSeverity;
  message: string;
  dueAt?: string;
  resolved?: boolean;
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  at: string;
  clientId?: string;
  kind:
    | "client_cree"
    | "kyc_mis_a_jour"
    | "document_recu"
    | "document_verifie"
    | "doc_genere"
    | "doc_valide"
    | "soumission_creee"
    | "soumission_majeure"
    | "alerte_resolue";
  summary: string;
}
