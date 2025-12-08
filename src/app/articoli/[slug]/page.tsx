import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";
import { fetchArticleBySlug, fetchLatestArticles } from "@/lib/cms/fetch-content";
import { proxyHeroImageUrl } from "@/lib/heroImages";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  const article = await fetchArticleBySlug(slug);
  if (!article) {
    return { title: "Articolo non trovato" };
  }
  return {
    title: `${article.title} | NewsRisparmio24`,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = await fetchLatestArticles({ limit: 3, excludeId: article.id });

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm text-brand-600">&larr; Torna alle news</Link>
      <p className="mt-4 text-xs uppercase tracking-[0.4em] text-brand-500">{article.cluster}</p>
      <h1 className="mt-2 text-4xl font-semibold text-slate-900">{article.title}</h1>
      <p className="mt-4 text-lg text-slate-600">{article.description}</p>
      {article.heroImage ? (
        <div className="mt-6 overflow-hidden rounded-3xl bg-slate-100">
          <img
            src={proxyHeroImageUrl(article.heroImage) ?? article.heroImage}
            alt={article.title}
            className="h-auto w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="mt-4 text-xs text-slate-500">
        <span>EEAT score: {article.eeatScore}</span>
        <span className="ml-4">
          Aggiornato il {new Date(article.publishedAt).toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <article className="prose prose-slate mt-8 max-w-none">
        <ReactMarkdown>{article.bodyMarkdown ?? portableTextToMarkdown(article.body)}</ReactMarkdown>
      </article>

      {related.length ? (
        <section className="mt-16">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Interlinking</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Potrebbe interessarti anche</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/articoli/${item.slug}`}
                className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-left transition hover:border-brand-200"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-brand-500">{item.cluster}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function portableTextToMarkdown(body: unknown[] = []) {
  if (!Array.isArray(body)) return "";
  return body
    .map((block: any) => (block?.children?.[0]?.text ? block.children.map((child: any) => child.text).join("") : ""))
    .join("\n\n");
}
