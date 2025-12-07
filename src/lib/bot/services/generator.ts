import { ArticleBrief, KeywordMetric } from "../types";

const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function createArticleBrief(metric: KeywordMetric): Promise<ArticleBrief> {
  if (!OPENAI_API_KEY) {
    return fallbackBrief(metric, "API key missing");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "Sei il caporedattore di NewsRisparmio24, portale italiano su bonus, cashback e trucchi legali. Rispondi sempre SOLO con JSON valido secondo lo schema: {\n  \"title\": string con taglio giornalistico,\n  \"slug\": string in kebab-case SEO friendly,\n  \"summary\": string hook (massimo 240 caratteri),\n  \"outline\": [{\"heading\": string, \"intent\": string, \"keywords\": [string]}],\n  \"faq\": [{\"question\": string, \"answer\": string}],\n  \"ctaFocus\": string (partner o tema monetizzazione),\n  \"seoKeywords\": [string]\n}. Inserisci riferimenti a fonti autorevoli (INPS, MEF, ARERA) quando servono. Nessun testo fuori dal JSON.",
          },
          {
            role: "user",
            content: `Keyword target: ${metric.keyword}\nVolume: ${metric.volume}\nDifficulty: ${metric.difficulty}\nCPC: ${metric.cpc}`,
          },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      console.warn("OpenAI request failed", message);
      return fallbackBrief(metric, message);
    }

    const payload = await response.json();
    const content: string = payload.choices?.[0]?.message?.content ?? "";
    return parseModelResponse(metric, content);
  } catch (error) {
    console.error("OpenAI error", error);
    return fallbackBrief(metric, error instanceof Error ? error.message : "Unknown error");
  }
}

function parseModelResponse(metric: KeywordMetric, response: string): ArticleBrief {
  const cleaned = response.replace(/```json|```/gi, "").trim();
  let parsed: any = {};

  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    console.warn("Failed to parse OpenAI JSON", error, cleaned);
  }

  const outline: string[] = Array.isArray(parsed?.outline)
    ? parsed.outline.map((item: any) => {
        if (!item) return "Sezione";
        const keywords = Array.isArray(item.keywords) && item.keywords.length ? ` [${item.keywords.join(", ")}]` : "";
        return `${item.heading ?? "Sezione"} — ${item.intent ?? "Dettagli"}${keywords}`;
      })
    : ["Introduzione", "Analisi opportunità", "CTA"];

  const cleanedKeyword = humanizeKeyword(removeYearTokens(metric.keyword));

  const faq = Array.isArray(parsed?.faq) && parsed.faq.length
    ? parsed.faq
    : [
        { question: `Cos'è ${cleanedKeyword}?`, answer: "Verifica requisiti e fonti ufficiali (INPS/MEF)." },
        { question: `Come ottenere ${cleanedKeyword}?`, answer: "Segui le modalità indicate sui portali istituzionali." },
      ];

  const candidateTitle = parsed?.title?.trim()?.slice(0, 140);
  const title = ensureSeoTitle(candidateTitle, cleanedKeyword);
  const slug = parsed?.slug?.trim() || slugify(title);

  return {
    title,
    slug,
    outline,
    targetKeyword: cleanedKeyword,
    cluster: parsed?.seoKeywords?.[0] ?? cleanedKeyword.split(" ")[0] ?? "trend",
    monetizationHint: parsed?.ctaFocus ?? "Affiliate Risparmio",
    faq,
    trafficPotential: metric.volume,
    summary: parsed?.summary,
    seoKeywords: parsed?.seoKeywords,
  };
}

function fallbackBrief(metric: KeywordMetric, reason: string): ArticleBrief {
  console.info("Using fallback brief", reason);
  const cleanedKeyword = humanizeKeyword(metric.keyword);
  return {
    title: ensureSeoTitle(undefined, cleanedKeyword),
    outline: ["Hook emotivo", "Chi ha diritto/come funziona", "Passi per richiederlo", "CTA partner consigliata"],
    targetKeyword: cleanedKeyword,
    cluster: cleanedKeyword.split(" ")[0] ?? "trend",
    monetizationHint: "Affiliate Risparmio",
    faq: [
      { question: `Perché ${cleanedKeyword} è rilevante?`, answer: "Trend in rapido aumento fra famiglie italiane, con forte intento informativo/commerciale." },
      { question: "Come monetizzare?", answer: "Inserisci CTA verso carte fintech, app cashback o comparatori bollette." },
    ],
    trafficPotential: metric.volume,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function humanizeKeyword(keyword: string) {
  const cleaned = keyword
    .replace(/[_-]?topic/gi, "")
    .replace(/[-_]\d+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (!cleaned) {
    return "risparmio familiare";
  }
  return cleaned;
}

function removeYearTokens(value: string) {
  return value.replace(/20\d{2}/g, "").replace(/\s{2,}/g, " ").trim();
}

function ensureSeoTitle(candidate: string | undefined, keyword: string) {
  const normalizedKeyword = keyword ? capitalize(removeYearTokens(keyword)) : "Risparmio intelligente";
  let base = candidate && !(/[\d_]{6,}/.test(candidate)) && candidate.length > 10 ? candidate : "";

  if (!base) {
    const lower = normalizedKeyword.toLowerCase();
    if (lower.includes("bollett")) {
      base = `Trucchi per la bolletta: ${normalizedKeyword}`;
    } else if (lower.includes("bonus")) {
      base = `Bonus ${normalizedKeyword}: requisiti nascosti da conoscere`;
    } else if (lower.includes("cashback") || lower.includes("carta") || lower.includes("card")) {
      base = `${normalizedKeyword}: sfrutta adesso cashback e premi segreti`;
    } else {
      base = `${normalizedKeyword}: guida pratica per risparmiare subito`;
    }
  }

  return appendMonthYearSuffix(makeClickbait(base));
}

function makeClickbait(title: string) {
  if (/come|scopri|perch/i.test(title)) return title;
  return `Scopri ${title.replace(/^[A-Z]/, (char) => char.toUpperCase())}`;
}

function appendMonthYearSuffix(title: string) {
  const label = new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric" }).format(new Date());
  const normalizedLabel = capitalize(label);
  if (new RegExp(`-\\s*${normalizedLabel}$`, "i").test(title)) {
    return title;
  }
  return `${title.trim()} - ${normalizedLabel}`;
}

function capitalize(value: string) {
  if (!value) return value;
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
