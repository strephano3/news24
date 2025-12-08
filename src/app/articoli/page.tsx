import Link from "next/link";
import { fetchFeaturedArticles } from "@/lib/cms/fetch-content";

export const dynamic = "force-dynamic";

export default async function ArticlesIndexPage() {
  const articles = await fetchFeaturedArticles(100);

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <header className="text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Archivio completo</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">Tutti gli articoli</h1>
        <p className="mt-2 text-slate-600">
          Qui trovi tutte le checklist pubblicate finora su NewsRisparmio24. Le più recenti sono in cima.
        </p>
      </header>
      <div className="mt-10 divide-y divide-slate-100 rounded-3xl border border-slate-100 bg-white/80">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articoli/${article.slug}`}
            className="flex flex-col gap-2 p-6 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-600">{article.cluster}</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{article.title}</p>
              <p className="text-sm text-slate-600">{article.description}</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>EEAT {article.eeatScore}/100</p>
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
