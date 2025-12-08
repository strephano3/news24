const FALLBACK_IMAGES = Array.from({ length: 200 }, (_, index) => {
  const id = 100 + index;
  return `https://picsum.photos/id/${id}/1600/900`;
});

export function selectFallbackHero(seed: string) {
  let hash = 0;
  for (const char of seed) {
    hash += char.charCodeAt(0);
  }
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
}

export function shouldUseFallbackHero(url?: string | null) {
  return !url || /source\.unsplash\.com/.test(url);
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
