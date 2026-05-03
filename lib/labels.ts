import type {
  ComplianceDocStatus,
  ComplianceDocType,
  DocStatus,
  DocType,
  KycStatus,
  MaritalStatus,
  RiskProfile,
  SubmissionStatus,
} from "./db/types";

export const kycStatusLabel: Record<KycStatus, string> = {
  non_demarre: "Non démarré",
  en_cours: "En cours",
  en_attente: "En attente",
  complet: "Complet",
};

export const kycStatusTone: Record<KycStatus, "neutral" | "info" | "warning" | "success"> = {
  non_demarre: "neutral",
  en_cours: "info",
  en_attente: "warning",
  complet: "success",
};

export const docTypeLabel: Record<DocType, string> = {
  piece_identite: "Pièce d'identité",
  justificatif_domicile: "Justificatif de domicile",
  rib: "RIB",
  source_fonds: "Origine des fonds",
  autre: "Autre",
};

export const docStatusLabel: Record<DocStatus, string> = {
  manquant: "Manquant",
  en_attente: "En attente",
  verifie: "Vérifié",
  expire: "Expiré",
};

export const docStatusTone: Record<DocStatus, "neutral" | "info" | "warning" | "success" | "danger"> = {
  manquant: "danger",
  en_attente: "warning",
  verifie: "success",
  expire: "danger",
};

export const complianceTypeLabel: Record<ComplianceDocType, string> = {
  compte_rendu: "Compte rendu de RDV",
  lettre_mission: "Lettre de mission",
  rapport_adequation: "Rapport d'adéquation",
  comparatif_produits: "Comparatif produits",
};

export const complianceStatusLabel: Record<ComplianceDocStatus, string> = {
  brouillon: "Brouillon",
  valide: "Validé",
  envoye: "Envoyé",
};

export const complianceStatusTone: Record<ComplianceDocStatus, "neutral" | "info" | "warning" | "success"> = {
  brouillon: "warning",
  valide: "success",
  envoye: "info",
};

export const submissionStatusLabel: Record<SubmissionStatus, string> = {
  preparation: "Préparation",
  documents_envoyes: "Documents envoyés",
  fonds_recus: "Fonds reçus",
  contrat_cree: "Contrat créé",
  acces_active: "Accès activé",
  termine: "Terminé",
};

export const submissionSteps: SubmissionStatus[] = [
  "preparation",
  "documents_envoyes",
  "fonds_recus",
  "contrat_cree",
  "acces_active",
  "termine",
];

export const riskProfileLabel: Record<RiskProfile, string> = {
  prudent: "Prudent",
  equilibre: "Équilibré",
  dynamique: "Dynamique",
  offensif: "Offensif",
};

export const maritalLabel: Record<MaritalStatus, string> = {
  celibataire: "Célibataire",
  marie: "Marié(e)",
  pacse: "Pacsé(e)",
  divorce: "Divorcé(e)",
  veuf: "Veuf/Veuve",
};
