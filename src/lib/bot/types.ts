export type TrendSignal = {
  keyword: string;
  source: "google-trends" | "reddit" | "x";
  score: number;
  velocity: number;
};

export type KeywordMetric = {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
};

export type ArticleBrief = {
  title: string;
  slug?: string;
  outline: string[];
  targetKeyword: string;
  cluster: string;
  monetizationHint?: string;
  faq: Array<{ question: string; answer: string }>;
  trafficPotential?: number;
  summary?: string;
  seoKeywords?: string[];
};

export type CtaRecommendation = {
  label: string;
  url: string;
  network: string;
  badge?: string;
};

export type GeneratedArticle = ArticleBrief & {
  body: string;
  metaDescription: string;
  cta: CtaRecommendation | null;
  isEvergreen: boolean;
};
