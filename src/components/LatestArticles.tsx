import Link from "next/link";
import { type MetadataArticle, fetchFeaturedArticles } from "@/lib/cms/fetch-content";

export async function LatestArticles() {
  const articles = await fetchFeaturedArticles();

  if (!articles.length) {
    return <p className="mt-6 text-slate-500">Ancora nessun articolo generato.</p>;
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/articoli/${article.slug}`}
          className="rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-sm transition hover:border-brand-200"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-brand-500">
            {article.cluster}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{article.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{article.description}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Score EEAT: {article.eeatScore}/100</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "short",
              })}
            </time>
          </div>
        </Link>
      ))}
    </div>
  );
}
