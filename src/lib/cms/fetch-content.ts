import { unstable_noStore as noStore } from "next/cache";
import { sanityClient } from "./sanity-client";

export type MetadataArticle = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cluster: string;
  eeatScore: number;
  publishedAt: string;
  heroImage?: string;
};

export type ArticleDetail = MetadataArticle & {
  body: unknown[];
  bodyMarkdown?: string;
  faq?: Array<{ question: string; answer: string }>;
  ctaBlock?: {
    label: string;
    url: string;
    network: string;
    badge?: string;
  };
  keywords?: string[];
  heroImage?: string;
};

const DEFAULT_LIMIT = 6;

export async function fetchFeaturedArticles(limit = DEFAULT_LIMIT): Promise<MetadataArticle[]> {
  noStore();
  const client = sanityClient({ useCdn: false });

  const query = `*[_type == "article"] | order(coalesce(publishedAt, _createdAt) desc, _createdAt desc)[0...$limit]{
    "id": _id,
    "slug": slug.current,
    title,
    description,
    "cluster": coalesce(mainCluster->title, "Trend"),
    eeatScore,
    "publishedAt": coalesce(publishedAt, _createdAt),
    heroImage
  }`;

  try {
    const data = await client.fetch<MetadataArticle[]>(query, { limit });
    return data;
  } catch (error) {
    console.error("Failed to fetch featured articles", error);
    return [];
  }
}

export async function fetchLatestArticles({ limit = 3, excludeId }: { limit?: number; excludeId?: string } = {}) {
  noStore();
  const client = sanityClient({ useCdn: false });

  const query = `*[_type == "article"${excludeId ? " && _id != $excludeId" : ""}] | order(coalesce(publishedAt, _createdAt) desc, _createdAt desc)[0...$limit]{
    "id": _id,
    "slug": slug.current,
    title,
    description,
    "cluster": coalesce(mainCluster->title, "Trend"),
    eeatScore,
    "publishedAt": coalesce(publishedAt, _createdAt),
    heroImage
  }`;

  try {
    const data = await client.fetch<MetadataArticle[]>(query, { limit, excludeId });
    return data;
  } catch (error) {
    console.error("Failed to fetch latest articles", error);
    return [];
  }
}

export async function fetchArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  noStore();
  const client = sanityClient({ useCdn: false });

  const query = `*[_type == "article" && slug.current == $slug][0]{
    "id": _id,
    "slug": slug.current,
    title,
    description,
    body,
    bodyMarkdown,
    faq,
    keywords,
    ctaBlock,
    "cluster": coalesce(mainCluster->title, "Trend"),
    eeatScore,
    "publishedAt": coalesce(publishedAt, _createdAt),
    heroImage
  }`;

  try {
    const data = await client.fetch<ArticleDetail | null>(query, { slug });
    return data;
  } catch (error) {
    console.error("Failed to fetch article by slug", slug, error);
    return null;
  }
}
