import heroImageList from "../../data/hero-images.json";

const FALLBACK_IMAGES = heroImageList as string[];
const FALLBACK_URL_PATTERNS = [/source\.unsplash\.com/, /picsum\.photos/];

export function selectFallbackHero(seed: string) {
  let hash = 0;
  for (const char of seed) {
    hash += char.charCodeAt(0);
  }
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
}

export function shouldUseFallbackHero(url?: string | null) {
  if (!url) return true;
  return FALLBACK_URL_PATTERNS.some((pattern) => pattern.test(url));
}

export async function resolveHeroImageUrl(url?: string | null) {
  if (!url) return null;
  try {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) {
      console.warn("Hero image request failed", url, response.status);
      response.body?.cancel();
      return url;
    }
    response.body?.cancel();
    return response.url || url;
  } catch (error) {
    console.warn("Unable to resolve hero image", url, error);
    return url;
  }
}

export async function normalizeHeroImage(url: string | null | undefined, seed: string) {
  const fallback = selectFallbackHero(seed);
  if (shouldUseFallbackHero(url)) {
    return fallback;
  }
  const resolved = await resolveHeroImageUrl(url);
  return resolved ?? fallback;
}

export function proxyHeroImageUrl(url?: string | null) {
  if (!url) return null;
  const encoded = encodeURIComponent(url);
  return `/api/image-proxy?url=${encoded}`;
}
