import googleTrends from "google-trends-api";
import { KeywordMetric, TrendSignal } from "../types";

export async function enrichWithKeywordMetrics(signals: TrendSignal[]): Promise<KeywordMetric[]> {
  const metrics: KeywordMetric[] = [];

  for (const signal of signals) {
    const [volume, serp] = await Promise.all([
      computeInterestVolume(signal.keyword),
      fetchSerpSignals(signal.keyword),
    ]);

    metrics.push({
      keyword: signal.keyword,
      volume,
      difficulty: serp.difficulty,
      cpc: serp.cpc,
    });
  }

  return metrics;
}

export function selectHighLeverageKeywords(metrics: KeywordMetric[], limit = 3): KeywordMetric[] {
  return metrics
    .filter((metric) => metric.volume > 150)
    .sort((a, b) => a.difficulty - b.difficulty || b.volume - a.volume)
    .slice(0, limit);
}

async function computeInterestVolume(keyword: string): Promise<number> {
  try {
    const startTime = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
    const raw = await googleTrends.interestOverTime({ keyword, startTime, geo: "IT" });
    const parsed = JSON.parse(raw) as InterestOverTimeResponse;
    const timeline = parsed.default?.timelineData ?? [];
    if (!timeline.length) {
      return 200;
    }
    const average =
      timeline.reduce((sum, item) => sum + (item.value?.[0] ?? 0), 0) / timeline.length;
    return Math.max(150, Math.round(average * 20));
  } catch (error) {
    console.warn("Failed to compute interest for keyword", keyword, error);
    return 200;
  }
}

async function fetchSerpSignals(keyword: string): Promise<{ difficulty: number; cpc: number }> {
  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) {
    return { difficulty: 55, cpc: 0.9 };
  }

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_search");
  url.searchParams.set("q", keyword);
  url.searchParams.set("hl", "it");
  url.searchParams.set("gl", "it");
  url.searchParams.set("google_domain", "google.it");
  url.searchParams.set("api_key", apiKey);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn("SerpApi request failed", await response.text());
      return { difficulty: 55, cpc: 0.9 };
    }
    const payload = (await response.json()) as SerpApiSearchResponse;
    const totalResults = Number(payload.search_information?.total_results ?? 1_000_000);
    const adsCount =
      (payload.ads_results?.length ?? 0) +
      (payload.shopping_results?.length ?? 0) +
      (payload.top_stories?.length ?? 0);

    const difficulty = Math.min(95, Math.round(Math.log10(totalResults) * 12 + adsCount * 3));
    const cpc = parseFloat((0.6 + adsCount * 0.25).toFixed(2));

    return { difficulty, cpc };
  } catch (error) {
    console.error("Error fetching SerpApi data", error);
    return { difficulty: 60, cpc: 1 };
  }
}

type InterestOverTimeResponse = {
  default?: {
    timelineData: Array<{
      value: number[];
    }>;
  };
};

type SerpApiSearchResponse = {
  search_information?: {
    total_results?: number;
  };
  ads_results?: Array<Record<string, unknown>>;
  shopping_results?: Array<Record<string, unknown>>;
  top_stories?: Array<Record<string, unknown>>;
};
