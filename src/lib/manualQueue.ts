import fs from "fs/promises";
import path from "path";
import { CtaRecommendation } from "./bot/types";

export type ManualArticle = {
  title: string;
  slug?: string;
  summary: string;
  bodyMarkdown: string;
  heroImage?: string;
  targetKeyword: string;
  topicLabel?: string;
  isEvergreen?: boolean;
  monetizationHint?: string;
  trafficPotential?: number;
  faq?: Array<{ question: string; answer: string }>;
  cta?: CtaRecommendation;
};

const DEFAULT_QUEUE_FILE = process.env.MANUAL_QUEUE_FILE ?? "data/manual-queue.json";

export async function loadManualQueue(): Promise<ManualArticle[]> {
  const queuePath = path.join(process.cwd(), DEFAULT_QUEUE_FILE);
  try {
    const data = await fs.readFile(queuePath, "utf-8");
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      throw new Error("Manual queue file must be an array");
    }
    return parsed.filter((item) => typeof item?.title === "string" && typeof item?.bodyMarkdown === "string");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.warn(`Manual queue file not found at ${queuePath}`);
      return [];
    }
    console.error("Failed to load manual queue", error);
    return [];
  }
}
