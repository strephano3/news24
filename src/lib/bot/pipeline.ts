import { composeArticle } from "./services/composer";
import { createArticleBrief } from "./services/generator";
import { publishArticles } from "./services/publisher";
import { evergreenSeeds, refreshEvergreenArticles } from "./services/evergreen";
import { ArticleBrief, GeneratedArticle, KeywordMetric } from "./types";

function currentMonthSuffix() {
  return new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric" }).format(new Date());
}

export async function generateEvergreenBriefs(limit = 3): Promise<ArticleBrief[]> {
  const pool = evergreenSeeds();
  const month = currentMonthSuffix();
  const seedSelection = [...pool].slice(0, limit);
  const metrics: KeywordMetric[] = seedSelection.map((seed) => ({
    keyword: `${seed.keyword} ${month}`,
    volume: seed.volume,
    difficulty: seed.difficulty,
    cpc: seed.cpc,
  }));
  return Promise.all(metrics.map((metric) => createArticleBrief(metric)));
}

export async function runDailyPipeline() {
  const briefs = await generateEvergreenBriefs(3);
  const articles: GeneratedArticle[] = await Promise.all(briefs.map((brief) => composeArticle(brief)));
  const evergreenArticles = articles.map((article) => ({ ...article, isEvergreen: true }));
  const published = await publishArticles(evergreenArticles);
  const { refreshed, created } = await refreshEvergreenArticles();

  return {
    signals: 0,
    briefs: briefs.length,
    published: published.length,
    refreshed: refreshed.length,
    evergreenCreated: created.length,
  };
}

export async function runEvergreenJob(limit = 3) {
  const { refreshed, created } = await refreshEvergreenArticles(limit);
  return {
    refreshed: refreshed.length,
    created: created.length,
  };
}
