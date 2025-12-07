import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import article from "./sanity/schemas/article";
import cluster from "./sanity/schemas/cluster";
import siteSettings from "./sanity/schemas/siteSettings";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset =
  process.env.SANITY_STUDIO_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  console.warn("Missing Sanity project ID. Set SANITY_STUDIO_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID.");
}

export default defineConfig({
  name: "newsrisparmio24",
  title: "NewsRisparmio24 CMS",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [article, cluster, siteSettings],
  },
});
