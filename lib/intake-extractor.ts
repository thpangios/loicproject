import type { MaritalStatus, RiskProfile } from "./db/types";

export interface ExtractedProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  maritalStatus?: MaritalStatus;
  profession?: string;
  employer?: string;
  city?: string;
  postalCode?: string;
  street?: string;
  annualIncome?: number;
  netWorth?: number;
  realEstateValue?: number;
  financialAssets?: number;
  riskProfile?: RiskProfile;
  notes?: string;
}

const monthMap: Record<string, string> = {
  janvier: "01", février: "02", fevrier: "02", mars: "03", avril: "04",
  mai: "05", juin: "06", juillet: "07", août: "08", aout: "08",
  septembre: "09", octobre: "10", novembre: "11", décembre: "12", decembre: "12",
};

function num(s: string) {
  const cleaned = s.replace(/[\s.]/g, "").replace(",", ".");
  const n = Number(cleaned);
  return isNaN(n) ? undefined : n;
}

export function extractProfile(text: string): ExtractedProfile {
  const out: ExtractedProfile = {};
  const t = text.replace(/\s+/g, " ");

  const nameMatch = t.match(/(?:je m'appelle|je suis|nom\s*:?|client\s*:?)\s+([A-ZÉÈÀÂÊÎÔÛÇ][\p{L}-]+)\s+([A-ZÉÈÀÂÊÎÔÛÇ][\p{L}-]+)/u)
    ?? t.match(/Monsieur\s+([A-ZÉÈÀÂÊÎÔÛÇ][\p{L}-]+)\s+([A-ZÉÈÀÂÊÎÔÛÇ][\p{L}-]+)/u)
    ?? t.match(/Madame\s+([A-ZÉÈÀÂÊÎÔÛÇ][\p{L}-]+)\s+([A-ZÉÈÀÂÊÎÔÛÇ][\p{L}-]+)/u);
  if (nameMatch) {
    out.firstName = nameMatch[1];
    out.lastName = nameMatch[2];
  }

  const email = t.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (email) out.email = email[0];

  const phone = t.match(/(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}/);
  if (phone) out.phone = phone[0].replace(/\s/g, " ").trim();

  const dobNum = t.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
  if (dobNum) {
    const [_, d, m, y] = dobNum;
    const yy = y.length === 2 ? (Number(y) > 30 ? "19" + y : "20" + y) : y;
    out.dob = `${yy}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  } else {
    const dobLong = t.match(/(\d{1,2})\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)\s+(\d{4})/i);
    if (dobLong) {
      const month = monthMap[dobLong[2].toLowerCase()];
      out.dob = `${dobLong[3]}-${month}-${dobLong[1].padStart(2, "0")}`;
    }
  }

  if (/\bmari[ée]\b/i.test(t)) out.maritalStatus = "marie";
  else if (/\bpacs[ée]\b/i.test(t)) out.maritalStatus = "pacse";
  else if (/\bdivorc[ée]\b/i.test(t)) out.maritalStatus = "divorce";
  else if (/\bveuf|veuve\b/i.test(t)) out.maritalStatus = "veuf";
  else if (/\bc[ée]libataire\b/i.test(t)) out.maritalStatus = "celibataire";

  const prof = t.match(/(?:profession|métier|je suis|travaille comme)\s*:?\s*([^,.;]{3,60})/i);
  if (prof) out.profession = prof[1].trim();

  const employer = t.match(/(?:chez|employeur|entreprise|société)\s+([A-Z][\w& -]{2,40})/);
  if (employer) out.employer = employer[1].trim();

  const cp = t.match(/\b(\d{5})\b\s+([A-ZÉÈ][\p{L}\- ]+)/u);
  if (cp) {
    out.postalCode = cp[1];
    out.city = cp[2].split(/\s+/).slice(0, 3).join(" ").trim();
  }

  const street = t.match(/\b(\d{1,4}\s+(?:rue|avenue|av\.?|bd|boulevard|chemin|impasse|allée|allee|place)\s+[\p{L}\- ']{2,60})/iu);
  if (street) out.street = street[1].trim();

  const income = t.match(/(?:revenus?|salaire|gagne|perçoi[st])[^0-9]{0,30}([0-9][0-9\s.,]{2,})\s*(?:€|euros?|k€|EUR)/i);
  if (income) {
    let v = num(income[1]);
    if (v && /k€/i.test(income[0])) v *= 1000;
    if (v && v < 1000 && /k/i.test(income[0])) v *= 1000;
    out.annualIncome = v;
  }

  const net = t.match(/(?:patrimoine(?:\s+net)?|net\s+worth)[^0-9]{0,30}([0-9][0-9\s.,]{2,})\s*(?:€|euros?|k€|M€|EUR)/i);
  if (net) {
    let v = num(net[1]);
    if (v && /M€/i.test(net[0])) v *= 1_000_000;
    else if (v && /k€/i.test(net[0])) v *= 1000;
    out.netWorth = v;
  }

  const re = t.match(/(?:immobilier|résidence|bien)[^0-9]{0,30}([0-9][0-9\s.,]{2,})\s*(?:€|euros?|k€|M€)/i);
  if (re) {
    let v = num(re[1]);
    if (v && /M€/i.test(re[0])) v *= 1_000_000;
    else if (v && /k€/i.test(re[0])) v *= 1000;
    out.realEstateValue = v;
  }

  const fa = t.match(/(?:assurance vie|pea|portefeuille|placements?|épargne|epargne)[^0-9]{0,30}([0-9][0-9\s.,]{2,})\s*(?:€|euros?|k€|M€)/i);
  if (fa) {
    let v = num(fa[1]);
    if (v && /M€/i.test(fa[0])) v *= 1_000_000;
    else if (v && /k€/i.test(fa[0])) v *= 1000;
    out.financialAssets = v;
  }

  if (/offensif|agressif/i.test(t)) out.riskProfile = "offensif";
  else if (/dynamique/i.test(t)) out.riskProfile = "dynamique";
  else if (/équilibr[ée]|equilibr[ée]/i.test(t)) out.riskProfile = "equilibre";
  else if (/prudent|conservateur|sécurit[ée]/i.test(t)) out.riskProfile = "prudent";

  return out;
}
