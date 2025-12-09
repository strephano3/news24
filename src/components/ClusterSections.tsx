import Link from "next/link";
import { fetchArticlesByCluster, MetadataArticle } from "@/lib/cms/fetch-content";
import type { ClusterDefinition } from "@/lib/cluster-config";

export async function ClusterSections({ sections }: { sections: readonly ClusterDefinition[] }) {
  const clustersWithArticles = await Promise.all(
    sections.map(async (section) => {
      const articles = await fetchArticlesByCluster(section.cluster, 3);
      return { ...section, articles };
    }),
  );

  return (
    <section className="space-y-12" aria-label="Categorie editoriali">
      {clustersWithArticles.map(({ id, label, articles }) => (
        <div key={id} id={id} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-2xl font-semibold text-slate-900">{label}</h3>
            <Link
              href={`/cluster/${id}`}
              className="text-sm font-semibold text-brand-600 transition hover:text-brand-500"
            >
              Tutti gli articoli →
            </Link>
          </div>
          {articles.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              Stiamo preparando le prossime analisi per questa sezione.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ClusterCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

function ClusterCard({ article }: { article: MetadataArticle }) {
  return (
    <Link
      href={`/articoli/${article.slug}`}
      className="flex flex-col gap-3 rounded-2xl border border-slate-300 bg-white/95 p-5 shadow-xl shadow-slate-300/80 transition hover:-translate-y-0.5 hover:border-brand-200"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-brand-600">{article.cluster}</p>
      <p className="text-lg font-semibold text-slate-900">{article.title}</p>
      <p className="text-sm text-slate-600">{article.description}</p>
      <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
        <span>EEAT {article.eeatScore}</span>
        <time dateTime={article.publishedAt}>
          {new Date(article.publishedAt).toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "short",
          })}
        </time>
      </div>
    </Link>
  );
}
