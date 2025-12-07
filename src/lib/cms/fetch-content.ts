import { sanityClient } from "./sanity-client";

export type MetadataArticle = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cluster: string;
  eeatScore: number;
  publishedAt: string;
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
};

export async function fetchFeaturedArticles(): Promise<MetadataArticle[]> {
  const client = sanityClient({ useCdn: false });

  const query = `*[_type == "article"] | order(coalesce(publishedAt, _createdAt) desc)[0...4]{
    "id": _id,
    "slug": slug.current,
    title,
    description,
    "cluster": coalesce(mainCluster->title, "Trend"),
    eeatScore,
    "publishedAt": coalesce(publishedAt, _createdAt)
  }`;

  try {
    const data = await client.fetch<MetadataArticle[]>(query);
    return data;
  } catch (error) {
    console.error("Failed to fetch featured articles", error);
    return [];
  }
}

export async function fetchArticleBySlug(slug: string): Promise<ArticleDetail | null> {
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
    "publishedAt": coalesce(publishedAt, _createdAt)
  }`;

  try {
    const data = await client.fetch<ArticleDetail | null>(query, { slug });
    return data;
  } catch (error) {
    console.error("Failed to fetch article by slug", slug, error);
    return null;
  }
}
