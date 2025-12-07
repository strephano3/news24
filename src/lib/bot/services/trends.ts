import googleTrends from "google-trends-api";
import { TrendSignal } from "../types";

export type TrendOptions = {
  geo?: string;
  limit?: number;
};

const CURRENT_YEAR = new Date().getFullYear();
const KEYWORD_GUARD =
  /(bonus|bollett|energia|gas|conto|cashback|carta|mutuo|trasporti|nido|isee|arera|inps|mef|aeeeg|famiglia)/i;

export async function fetchTrendSignals(options: TrendOptions = {}): Promise<TrendSignal[]> {
  const { geo = "IT", limit = 12 } = options;

  try {
    const raw = await googleTrends.dailyTrends({ trendDate: new Date(), geo });
    const parsed = JSON.parse(raw) as GoogleTrendsDailyResponse;

    const deduped = new Map<string, TrendSignal>();

    parsed.default.trendingSearchesDays.forEach((day) => {
      day.trendingSearches.forEach((search) => {
        const traffic = parseTraffic(search.formattedTraffic);
        const keyword = refineKeyword(search.title.query);
        const velocity = search.articles?.length ?? 0;

        if (keyword && !deduped.has(keyword)) {
          deduped.set(keyword, {
            keyword,
            source: "google-trends",
            score: traffic,
            velocity,
          });
        }
      });
    });

    const signals = Array.from(deduped.values()).slice(0, limit);
    if (signals.length > 0) {
      return signals;
    }
  } catch (error) {
    console.error("Failed to fetch Google Trends data", error);
  }

  const fallback = createFallbackKeywords();
  return Array.from({ length: limit }).map((_, index) => ({
    keyword: fallback[index % fallback.length],
    source: "google-trends",
    score: 60,
    velocity: 1,
  }));
}

type GoogleTrendsDailyResponse = {
  default: {
    trendingSearchesDays: Array<{
      date: string;
      formattedDate: string;
      trendingSearches: Array<{
        title: { query: string; exploreLink: string };
        formattedTraffic: string;
        articles?: Array<{ title: string }>;
      }>;
    }>;
  };
};

function parseTraffic(formatted: string): number {
  if (!formatted) return 50;
  const match = formatted.match(/([0-9.,]+)([A-Za-z+]+)/);
  if (!match) return 50;
  const value = parseFloat(match[1].replace(",", "."));
  const suffix = match[2].toUpperCase();

  const multiplier = suffix.includes("M") ? 1_000 : suffix.includes("K") ? 1 : 0.1;
  return Math.round(value * multiplier);
}

function refineKeyword(raw: string | undefined): string | null {
  if (!raw) return null;

  const cleaned = raw.replace(/[“”"']/g, "").trim();
  const normalized = cleaned.toLowerCase();

  const yearMatch = normalized.match(/20\d{2}/);
  if (yearMatch) {
    const year = parseInt(yearMatch[0], 10);
    if (Number.isFinite(year) && year < CURRENT_YEAR) {
      return null;
    }
  }

  if (KEYWORD_GUARD.test(normalized)) {
    return cleaned;
  }

  const heuristics: Array<{ test: RegExp; keyword: string }> = [
    { test: /risparmio/, keyword: "idee per risparmiare sulle bollette luce e gas" },
    { test: /energia|gas/, keyword: "confronto offerte energia domestica" },
    { test: /carte|payment|bancomat/, keyword: "cashback carte e app senza commissioni" },
    { test: /trasport/, keyword: "bonus trasporti requisiti e domanda" },
    { test: /mutuo|casa/, keyword: "agevolazioni mutuo prima casa" },
    { test: /famiglia|nido|figli/, keyword: "bonus nido e famiglia requisiti" },
  ];

  for (const heuristic of heuristics) {
    if (heuristic.test.test(normalized)) {
      return heuristic.keyword;
    }
  }

  return null;
}

function createFallbackKeywords(): string[] {
  return [
    "bonus sociale bollette aggiornato",
    "cashback carte spesa",
    "come richiedere bonus nido",
    "offerte energia indicizzate confronto",
    "conti deposito con tassi migliori",
    "mutuo green agevolazioni",
  ];
}
