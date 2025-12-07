import { sanityClient } from "@/lib/cms/sanity-client";
import { composeArticle } from "./composer";
import { createArticleBrief } from "./generator";
import { publishArticles, toPortableText } from "./publisher";
import { KeywordMetric } from "../types";

const DAY = 1000 * 60 * 60 * 24;

export async function refreshEvergreenArticles(limit = 2) {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    console.warn("Missing SANITY_WRITE_TOKEN, skipping evergreen refresh");
    return { refreshed: [], created: [] };
  }

  const client = sanityClient({ token, useCdn: false });
  const articles: EvergreenArticle[] = await client.fetch(
    `*[_type == "article" && isEvergreen == true && defined(targetKeyword)]{_id, targetKeyword, lastAuditAt, trafficPotential}`,
  );

  const stale = articles
    .filter((article) => {
      if (!article.lastAuditAt) return true;
      return Date.now() - new Date(article.lastAuditAt).getTime() > 30 * DAY;
    })
    .slice(0, limit);

  const refreshed: Array<{ id: string; keyword: string }> = [];

  for (const article of stale) {
    const metric: KeywordMetric = {
      keyword: removeYearTokens(article.targetKeyword),
      volume: article.trafficPotential ?? 500,
      difficulty: 40,
      cpc: 0.8,
    };

    const brief = await createArticleBrief(metric);
    const refreshedArticle = await composeArticle(brief);

    try {
      await client
        .patch(article._id)
        .set({
          title: refreshedArticle.title,
          description: refreshedArticle.metaDescription,
          body: toPortableText(refreshedArticle.body),
          bodyMarkdown: refreshedArticle.body,
          faq: refreshedArticle.faq,
          ctaBlock: refreshedArticle.cta ?? undefined,
          lastAuditAt: new Date().toISOString(),
        })
        .commit();
      refreshed.push({ id: article._id, keyword: article.targetKeyword });
    } catch (error) {
      console.error("Failed to refresh evergreen article", article._id, error);
    }
  }

  const seedPool = evergreenSeeds().filter(
    (seed) => !articles.some((article) => article.targetKeyword === seed.keyword),
  );
  const toCreate = seedPool.slice(0, Math.max(0, limit - refreshed.length));

  const created: Array<{ id: string; keyword: string }> = [];

  for (const seed of toCreate) {
    const metric: KeywordMetric = {
      keyword: removeYearTokens(seed.keyword),
      volume: seed.volume,
      difficulty: seed.difficulty,
      cpc: seed.cpc,
    };

    const brief = await createArticleBrief(metric);
    const article = await composeArticle(brief);
    article.isEvergreen = true;

    const published = await publishArticles([article]);
    if (published[0]) {
      created.push({ id: published[0].id, keyword: seed.keyword });
    }
  }

  return { refreshed, created };
}

type EvergreenArticle = {
  _id: string;
  targetKeyword: string;
  lastAuditAt?: string;
  trafficPotential?: number;
};

export function evergreenSeeds() {
  return [
    { keyword: "come cambiare fornitore luce e gas in italia", volume: 2400, difficulty: 35, cpc: 1.1 },
    { keyword: "strategie per comprare casa risparmiando su mutuo e tasso", volume: 1700, difficulty: 38, cpc: 1.3 },
    { keyword: "guida cashback carte fintech senza commissioni", volume: 1200, difficulty: 32, cpc: 0.9 },
    { keyword: "come organizzare il budget familiare con app e tabelle", volume: 1500, difficulty: 33, cpc: 0.8 },
    { keyword: "strategie per abbassare bollette tramite pompe di calore", volume: 900, difficulty: 38, cpc: 1.5 },
    { keyword: "come investire nei lavori di riqualificazione energetica", volume: 1100, difficulty: 45, cpc: 1.6 },
  ];
}

function removeYearTokens(value: string) {
  return value.replace(/20\d{2}/g, "").replace(/\s{2,}/g, " ").trim();
}
