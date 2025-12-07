import Image from "next/image";
import Link from "next/link";
import { fetchFeaturedArticles } from "@/lib/cms/fetch-content";

export async function ArticleShowcase() {
  const articles = await fetchFeaturedArticles(4);

  if (!articles.length) {
    return null;
  }

  const [heroArticle, ...secondary] = articles;

  return (
    <section className="grid gap-6 rounded-3xl bg-white/90 p-6 shadow-lg lg:grid-cols-[1.5fr_1fr] lg:p-10">
      <div className="space-y-4 rounded-3xl bg-slate-950/90 p-6 text-white">
        <p className="text-xs uppercase tracking-[0.4em] text-brand-200">In evidenza</p>
        <h2 className="text-3xl font-semibold">
          {heroArticle.title}
        </h2>
        <p className="text-slate-200">{heroArticle.description}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
          <span>Score EEAT: {heroArticle.eeatScore}/100</span>
          <time dateTime={heroArticle.publishedAt}>
            {new Date(heroArticle.publishedAt).toLocaleDateString("it-IT", {
              day: "2-digit",
              month: "long",
            })}
          </time>
        </div>
        <Link
          href={`/articoli/${heroArticle.slug}`}
          className="inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-400"
        >
          Leggi l&apos;analisi completa →
        </Link>
        {heroArticle.heroImage ? (
          <div className="mt-6 overflow-hidden rounded-2xl bg-slate-900/60">
            <Image
              src={heroArticle.heroImage}
              alt={heroArticle.title}
              width={1200}
              height={800}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        ) : null}
      </div>

      <div className="grid gap-4">
        {secondary.length === 0 ? (
          <PlaceholderCard article={heroArticle} />
        ) : (
          secondary.map((article) => <SecondaryCard key={article.id} article={article} />)
        )}
      </div>
    </section>
  );
}

function SecondaryCard({
  article,
}: {
  article: {
    id: string;
    slug: string;
    title: string;
    description: string;
    eeatScore: number;
    publishedAt: string;
  };
}) {
  return (
    <Link
      href={`/articoli/${article.slug}`}
      className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 transition hover:border-brand-200"
    >
      <p className="text-xs uppercase tracking-[0.35em] text-brand-600">Nuova guida</p>
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

function PlaceholderCard({ article }: { article: { slug: string; title: string } }) {
  return (
    <Link
      href={`/articoli/${article.slug}`}
      className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-brand-200 bg-brand-50/70 p-6 text-center text-brand-800"
    >
      <p className="text-sm uppercase tracking-[0.4em]">NewsRisparmio24</p>
      <p className="mt-3 text-lg font-semibold">Torna domani per la prossima analisi.</p>
      <p className="mt-1 text-sm">
        Intanto rileggi &ldquo;{article.title}&rdquo; per scoprire le mosse pratiche che abbiamo testato nel weekend.
      </p>
    </Link>
  );
}
