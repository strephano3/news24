import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchArticlesByCluster } from "@/lib/cms/fetch-content";
import { clusterDefinitions } from "@/lib/cluster-config";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return clusterDefinitions.map((cluster) => ({ slug: cluster.id }));
}

export default async function ClusterPage({ params }: { params: { slug: string } }) {
  const definition = clusterDefinitions.find((cluster) => cluster.id === params.slug);
  if (!definition) {
    notFound();
  }

  const articles = await fetchArticlesByCluster(definition.cluster, 100);

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <nav className="mb-6 text-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-1.5 text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
        >
          ← Torna alla home
        </Link>
      </nav>
      <header className="text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Cluster editoriale</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">{definition.label}</h1>
        <p className="mt-2 text-slate-600">
          Tutti gli articoli pubblicati in questa categoria. Le analisi più recenti sono mostrate per prime.
        </p>
      </header>
      <div className="mt-10 divide-y divide-slate-100 rounded-3xl border border-slate-100 bg-white/80">
        {articles.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500">
            Non ci sono ancora articoli in questa sezione. Torna a breve!
          </p>
        ) : (
          articles.map((article) => (
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
          ))
        )}
      </div>
    </main>
  );
}
