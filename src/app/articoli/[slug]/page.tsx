import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";
import { fetchArticleBySlug } from "@/lib/cms/fetch-content";

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

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm text-brand-600">&larr; Torna alle news</Link>
      <p className="mt-4 text-xs uppercase tracking-[0.4em] text-brand-500">{article.cluster}</p>
      <h1 className="mt-2 text-4xl font-semibold text-slate-900">{article.title}</h1>
      <p className="mt-4 text-lg text-slate-600">{article.description}</p>
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

      {/* Sezioni mockup per affiliazioni/FAQ rimosse: resterà solo il contenuto articolo */}
    </main>
  );
}

function portableTextToMarkdown(body: unknown[] = []) {
  if (!Array.isArray(body)) return "";
  return body
    .map((block: any) => (block?.children?.[0]?.text ? block.children.map((child: any) => child.text).join("") : ""))
    .join("\n\n");
}
