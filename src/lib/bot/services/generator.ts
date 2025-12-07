import { ArticleBrief, KeywordMetric } from "../types";
import { styledCopyFor } from "../styleGuide";

const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
let styleCursor = 0;

const STYLE_REFERENCES = [
  `1) "Ho risparmiato 300€ in 7 giorni: il metodo che non avevo mai provato" – diario pratico con esperimenti concreti`,
  `2) "L’errore che fa perdere soldi a chiunque (e non lo sa)" – smaschera un gesto quotidiano`,
  `3) "La verità sulle spese nascoste che nessuno controlla" – indagine su costi invisibili`,
  `4) "Quanto puoi vivere davvero con 200€ a settimana? La mia prova" – sfida personale sui numeri`,
  `5) "Ho confrontato 5 conti deposito: questo è l’unico che mi ha convinto" – confronto diretto`,
  `6) "Il trucco che mi ha fatto tagliare la spesa alimentare del 40%" – routine ottimizzata`,
  `7) "Se avessi saputo questo sui mutui prima… avrei risparmiato migliaia di euro" – errori da evitare`,
  `8) "La regola dei 10 minuti che ha cambiato il mio modo di gestire i soldi" – micro-habit`,
  `9) "Perché tutti stanno cambiando banca nel 2025 (e cosa significa per te)" – trend attuale`,
  `10) "Come ho eliminato 5 abbonamenti inutili senza accorgermene" – decluttering finanziario`,
  `11) "Il metodo 30-30-30 che semplifica la gestione delle finanze" – schema pratico`,
  `12) "Ho provato a vivere senza contanti per un mese: cosa ho scoperto" – esperienza realistica`,
  `13) "I tre acquisti che sembrano risparmio… ma ti fanno perdere soldi" – lista di falsi miti`,
  `14) "Come ho trovato 120€ nascosti nel mio conto (e puoi farlo anche tu)" – checklist concreta`,
  `15) "La tabella che uso ogni mese per non andare mai in rosso" – strumento operativo`,
  `16) "Perché spendiamo più di quanto crediamo: l’esperimento che lo dimostra" – focus sui bias`,
  `17) "Mezz’ora al giorno che ti cambia il portafoglio: la mia routine" – micro-abitudini quotidiane`,
  `18) "Il confronto che ha sorpreso anche me: investire 50€ vs 200€ al mese" – simulazione chiara`,
  `19) "Il trucco per risparmiare senza rinunciare a nulla (funziona davvero)" – ottimizzazione senza sacrifici`,
  `20) "Le 5 spese ‘invisibili’ che ti svuotano il conto ogni anno" – elenco di addebiti da eliminare`,
].join("\n");

export async function createArticleBrief(metric: KeywordMetric): Promise<ArticleBrief> {
  const styleSeed = nextStyleSeed();
  if (!OPENAI_API_KEY) {
    return fallbackBrief(metric, "API key missing", styleSeed);
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
              `Sei il caporedattore di NewsRisparmio24, portale italiano su bonus, cashback e trucchi legali. Prendi totale ispirazione dai seguenti 20 esempi (tono pop, storytelling verificato):\n${STYLE_REFERENCES}\nDevi ragionare come un giornalista umano e produrre da zero titoli e outline credibili in TERZA PERSONA (vietati "io", "noi", "ho", "abbiamo"). Rispondi sempre e solo con JSON valido e coerente con lo schema: {\n  "title": string con taglio giornalistico alla NewsRisparmio24,\n  "slug": string in kebab-case SEO friendly,\n  "summary": string hook (max 240 caratteri),\n  "outline": [{ "heading": string, "intent": string, "keywords": [string] }],\n  "faq": [{ "question": string, "answer": string }],\n  "ctaFocus": string (partner o monetizzazione),\n  "seoKeywords": [string]\n}. Usa dati ufficiali (INPS, MEF, ARERA) dove serve. Nessun testo fuori dal JSON.`,
          },
          {
            role: "user",
            content: `Keyword target: ${metric.keyword}\nVolume: ${metric.volume}\nDifficulty: ${metric.difficulty}\nCPC: ${metric.cpc}\nStyleId preferita: ${metric.styleId ?? "libera"}\nTopic: ${metric.topicLabel ?? metric.keyword}`,
          },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      console.warn("OpenAI request failed", message);
      return fallbackBrief(metric, message, styleSeed);
    }

    const payload = await response.json();
    const content: string = payload.choices?.[0]?.message?.content ?? "";
    return parseModelResponse(metric, content, styleSeed);
  } catch (error) {
    console.error("OpenAI error", error);
    return fallbackBrief(metric, error instanceof Error ? error.message : "Unknown error", styleSeed);
  }
}

function parseModelResponse(metric: KeywordMetric, response: string, styleSeed: number): ArticleBrief {
  const cleaned = response.replace(/```json|```/gi, "").trim();
  let parsed: any = {};

  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    console.warn("Failed to parse OpenAI JSON", error, cleaned);
  }

  const outlineFromModel: string[] = Array.isArray(parsed?.outline)
    ? parsed.outline.map((item: any) => {
        if (!item) return "Sezione";
        const keywords = Array.isArray(item.keywords) && item.keywords.length ? ` [${item.keywords.join(", ")}]` : "";
        return `${item.heading ?? "Sezione"} — ${item.intent ?? "Dettagli"}${keywords}`;
      })
    : ["Introduzione", "Analisi opportunità", "CTA"];

  const baseKeyword = metric.topicLabel ?? metric.keyword;
  const cleanedKeyword = humanizeKeyword(removeYearTokens(baseKeyword));
  const styledCopy = styledCopyFor(cleanedKeyword, styleSeed, metric.styleId);
  const outline = outlineFromModel.length ? outlineFromModel : styledCopy.outline;

  const faq = Array.isArray(parsed?.faq) && parsed.faq.length
    ? parsed.faq
    : [
        { question: `Cos'è ${cleanedKeyword}?`, answer: "Verifica requisiti e fonti ufficiali (INPS/MEF)." },
        { question: `Come ottenere ${cleanedKeyword}?`, answer: "Segui le modalità indicate sui portali istituzionali." },
      ];

  const candidateTitle = (parsed?.title ?? "").trim();
  const title = candidateTitle.length > 12 ? candidateTitle : styledCopy.title;
  const slug = parsed?.slug?.trim() || slugify(title);
  const summaryFromModel = (parsed?.summary ?? "").trim();
  const summary = summaryFromModel.length
    ? summaryFromModel
    : styledCopy.summary ?? `Ho testato ${cleanedKeyword} per vedere se regge la vita reale.`;

  return {
    title,
    slug,
    outline,
    targetKeyword: cleanedKeyword,
    cluster: parsed?.seoKeywords?.[0] ?? cleanedKeyword.split(" ")[0] ?? "trend",
    monetizationHint: parsed?.ctaFocus ?? "Affiliate Risparmio",
    faq,
    trafficPotential: metric.volume,
    summary,
    seoKeywords: parsed?.seoKeywords,
    heroImage: buildHeroImage(metric.heroQuery ?? cleanedKeyword),
    styleId: styledCopy.id,
    stylePrompt: styledCopy.prompt,
    topicLabel: cleanedKeyword,
    heroQuery: metric.heroQuery ?? cleanedKeyword,
  };
}

function fallbackBrief(metric: KeywordMetric, reason: string, styleSeed: number): ArticleBrief {
  console.info("Using fallback brief", reason);
  const baseKeyword = metric.topicLabel ?? metric.keyword;
  const cleanedKeyword = humanizeKeyword(baseKeyword);
  const styledCopy = styledCopyFor(cleanedKeyword, styleSeed, metric.styleId);

  return {
    title: styledCopy.title,
    outline: styledCopy.outline.length
      ? styledCopy.outline
      : ["Perché ho deciso di provarci", "Esperimento sul campo", "Numeri reali e confronti", "Checklist rapida"],
    targetKeyword: cleanedKeyword,
    cluster: cleanedKeyword.split(" ")[0] ?? "trend",
    monetizationHint: "Affiliate Risparmio",
    faq: [
      { question: `Perché ${cleanedKeyword} è rilevante?`, answer: "Trend in rapido aumento fra famiglie italiane, con forte intento informativo/commerciale." },
      { question: "Come monetizzare?", answer: "Inserisci CTA verso carte fintech, app cashback o comparatori bollette." },
    ],
    trafficPotential: metric.volume,
    summary: styledCopy.summary ?? `Ho messo alla prova ${cleanedKeyword} per capire quanto si può risparmiare davvero.`,
    heroImage: buildHeroImage(metric.heroQuery ?? cleanedKeyword),
    styleId: styledCopy.id,
    stylePrompt: styledCopy.prompt,
    topicLabel: cleanedKeyword,
    heroQuery: metric.heroQuery ?? cleanedKeyword,
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

function buildHeroImage(keyword: string) {
  const cleaned = encodeURIComponent(keyword.replace(/[^a-zA-Zàèéìòóù0-9 ]/g, "").trim() || "budget");
  return `https://source.unsplash.com/1600x1200/?${cleaned},risparmio`;
}

function nextStyleSeed() {
  styleCursor += 1;
  return styleCursor;
}
