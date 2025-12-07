import { ArticleBrief, CtaRecommendation } from "../types";

const partners: Array<CtaRecommendation & { keywords: RegExp[] }> = [
  {
    label: "Confronta offerte luce e gas",
    url: "https://example.com/partner/energia",
    network: "Utility Affiliate",
    badge: "Risparmia fino al 20%",
    keywords: [/bollett(e|a)/i, /luce/i, /gas/i, /energia/i],
  },
  {
    label: "Carta cashback senza canone",
    url: "https://example.com/partner/cashback",
    network: "Fintech Partner",
    badge: "Bonus di benvenuto",
    keywords: [/cashback/i, /carta/i, /spesa/i],
  },
  {
    label: "App budget familiare gratis",
    url: "https://example.com/partner/app-budget",
    network: "App Affiliation",
    badge: "Setup in 5 minuti",
    keywords: [/risparmi/i, /budget/i, /famigli/i],
  },
];

const defaultCta: CtaRecommendation = {
  label: "Entra nella newsletter Risparmio Alert",
  url: "https://example.com/newsletter",
  network: "Owned Media",
  badge: "5000+ iscritti",
};

export function recommendCta(brief: ArticleBrief): CtaRecommendation {
  const normalizedKeyword = `${brief.targetKeyword} ${brief.monetizationHint ?? ""}`;
  const match = partners.find((partner) =>
    partner.keywords.some((regex) => regex.test(normalizedKeyword)),
  );

  return match
    ? { label: match.label, url: match.url, network: match.network, badge: match.badge }
    : defaultCta;
}
