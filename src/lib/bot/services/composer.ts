import { ArticleBrief, GeneratedArticle } from "../types";

const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function composeArticle(brief: ArticleBrief): Promise<GeneratedArticle> {
  const evergreenMatch = /(guida|come|checklist|strategie)/i.test(brief.title);
  const aiBody = await generateRichContent(brief);
  const safeBody = enforceCurrentContext(aiBody);

  const body = (safeBody?.trim().length ? safeBody : null)
    ?? brief.outline
      .map((section) => `## ${section}\n\nParagrafo generato automaticamente per ${brief.targetKeyword}.`)
      .join("\n\n");

  const summaryBlock = brief.summary ? `> ${brief.summary}\n\n` : "";

  const finalBody = summaryBlock +
    body
      .concat(
        "\n\n> Nota: verifica sempre requisiti e scadenze sui portali ufficiali (INPS, MEF, ARERA) prima di agire.",
      );

  return {
    ...brief,
    body: finalBody,
    metaDescription:
      brief.summary ?? `Analisi aggiornata su ${brief.targetKeyword}, dalle opportunità di traffico fino alla monetizzazione.`,
    cta: null,
    isEvergreen: evergreenMatch,
  };
}

async function generateRichContent(brief: ArticleBrief): Promise<string | null> {
  if (!OPENAI_API_KEY) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const currentMonthYear = new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric" }).format(new Date());

  const normalizedKeyword = brief.targetKeyword.replace(/20\\d{2}/g, "").trim();
  const prompt = `Scrivi un articolo in italiano per il sito NewsRisparmio24 sul tema "${normalizedKeyword}".
Tono: giornalistico, autorevole ma accessibile, orientato all'azione.
Obiettivo: massimizzare il posizionamento SEO per le keyword ${brief.seoKeywords?.join(", ") ?? brief.targetKeyword} e offrire consigli concreti alle famiglie italiane.
Contestualizza ogni dato al mese di ${currentMonthYear} (anno ${currentYear}), citando scadenze e normative aggiornate ed evitando riferimenti obsoleti (come "le migliori offerte 2023"). Se un incentivo non è confermato per ${currentMonthYear}, dichiaralo apertamente e invita a verificare sui portali ufficiali.

Regole di struttura:
- Usa Markdown.
- Aggiungi una sezione iniziale "## Sintesi rapida" con 3 bullet point (beneficio immediato, importi medi, scadenza).
- Per ogni elemento della scaletta seguente crea una sezione \`##\` con sottotitoli \`###\` e liste puntate, includendo cifre (€, %, date) e citazioni "Fonte: ...".
- Inserisci almeno un elenco numerato e un blocco evidenziato \`> Fonte ufficiale: ...\`.
- Chiudi con due sezioni: "## Checklist finale" (to-do list) e "## Fonti ufficiali" con link/testo alle istituzioni citate.

Scaletta da seguire:
${brief.outline.map((o, index) => `${index + 1}. ${o}`).join("\n")}

CTA: collega il discorso a partner/strumenti ${brief.monetizationHint ?? "Affiliate Risparmio"} evitando toni spam.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.3,
        messages: [
          { role: "system", content: "Sei un redattore esperto di bonus e risparmio legale in Italia." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      console.warn("OpenAI article generation failed", await response.text());
      return null;
    }

    const payload = await response.json();
    return payload.choices?.[0]?.message?.content ?? null;
  } catch (error) {
    console.error("OpenAI article generation error", error);
    return null;
  }
}

function enforceCurrentContext(content: string | null) {
  if (!content) return null;
  const currentYear = new Date().getFullYear();
  const threshold = currentYear - 1;
  const paragraphs = content.split("\n");
  const filtered = paragraphs.filter((paragraph) => {
    const matches = paragraph.match(/20\d{2}/g);
    if (!matches) return true;
    return matches.every((match) => {
      const year = Number(match);
      return Number.isNaN(year) || year >= threshold;
    });
  });
  if (!filtered.length) {
    return null;
  }
  return filtered.join("\n");
}
