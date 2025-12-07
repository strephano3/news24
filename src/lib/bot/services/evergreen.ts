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
      topicLabel: removeYearTokens(article.targetKeyword),
      heroQuery: removeYearTokens(article.targetKeyword),
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
      styleId: seed.styleId,
      topicLabel: seed.topicLabel ?? seed.keyword,
      heroQuery: seed.heroQuery,
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

type SeedTopic = {
  keyword: string;
  styleId: string;
  heroQuery: string;
};

const discoverSeeds: SeedTopic[] = [
  {
    keyword: "budget da 50€ a settimana",
    styleId: "budget-settimanale",
    heroQuery: "budget groceries",
  },
  {
    keyword: "cashback solo carte fintech",
    styleId: "senza-contanti",
    heroQuery: "contactless payment",
  },
  {
    keyword: "bolletta della luce dimezzata",
    styleId: "spesa-tagliata",
    heroQuery: "home energy savings",
  },
  {
    keyword: "conti deposito migliori",
    styleId: "confronto-diretto",
    heroQuery: "savings account statement",
  },
  {
    keyword: "vita senza contanti",
    styleId: "senza-contanti",
    heroQuery: "mobile payment",
  },
  {
    keyword: "oggetti inutili trasformati in bolletta gas",
    styleId: "soldi-nascosti",
    heroQuery: "garage sale",
  },
  {
    keyword: "food prep da 5€ al giorno",
    styleId: "diario-tagli-intelligenti",
    heroQuery: "meal prep containers",
  },
  {
    keyword: "abbonamenti fantasma da eliminare",
    styleId: "abbonamenti-tagliati",
    heroQuery: "subscription cancel",
  },
  {
    keyword: "carte da tenere nel portafoglio",
    styleId: "errore-quotidiano",
    heroQuery: "wallet credit cards",
  },
  {
    keyword: "alert bancari salva-budget",
    styleId: "regola-dieci-minuti",
    heroQuery: "banking app alerts",
  },
];

export function evergreenSeeds() {
  return discoverSeeds.map((topic) => ({
    keyword: topic.keyword,
    volume: 1400,
    difficulty: 30,
    cpc: 1.0,
    styleId: topic.styleId,
    topicLabel: topic.keyword,
    heroQuery: topic.heroQuery,
  }));
}

function removeYearTokens(value: string) {
  return value.replace(/20\d{2}/g, "").replace(/\s{2,}/g, " ").trim();
}
