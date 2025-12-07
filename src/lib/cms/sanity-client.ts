import { createClient, type ClientConfig } from "@sanity/client";

const token = process.env.SANITY_WRITE_TOKEN;

const defaultConfig: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-07-01",
  useCdn: false,
  token,
  perspective: "published",
};

export function sanityClient(overrides?: Partial<ClientConfig>) {
  const config = { ...defaultConfig, ...overrides } satisfies ClientConfig;

  if (!config.projectId) {
    console.warn("Sanity project ID is missing. Add NEXT_PUBLIC_SANITY_PROJECT_ID env variable.");
  }

  return createClient(config);
}
