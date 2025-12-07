# Bot Pipeline

## Flusso giornaliero
1. **Trend ingestion** – `fetchTrendSignals` usa `google-trends-api` per raccogliere i trending search italiani relativi a bonus/cashback (con fallback locale).
2. **Keyword scoring** – `enrichWithKeywordMetrics` calcola il volume con `interestOverTime` e, se presente `SERPAPI_API_KEY`, interroga la SERP reale per stimare difficoltà/CPC. `selectHighLeverageKeywords` sceglie i topic più scalabili.
3. **Brief SEO** – `createArticleBrief` chiama OpenAI con prompt NewsRisparmio24 per titoli pop, outline e FAQ conformi. In assenza di API key viene usato un fallback deterministico.
4. **Composizione** – `composeArticle` genera body Markdown con CTA affiliate dinamiche e nota di compliance.
5. **Publishing** – `publishArticles` salva i documenti in Sanity, registra `targetKeyword`, `isEvergreen` e `lastAuditAt`.
6. **Evergreen refresh** – `refreshEvergreenArticles` rigenera automaticamente gli evergreen più datati (30+ giorni) aggiornando CTA e FAQ.

## API route / Cron
- Endpoint: `GET /api/cron/daily`
- Autenticazione: header `Authorization: Bearer <CRON_SECRET>` opzionale.
- Output: `{ status: "ok", result: { signals, briefs, published } }`
- Schedulazione: su Vercel Cron imposta `0 7 * * * https://<domain>/api/cron/daily?secret=...` e aggiungi header custom.

## Env vars
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` – ID progetto Studio.
- `SANITY_WRITE_TOKEN` – token con ruolo *editor* per creare articoli.
- `OPENAI_API_KEY`, `OPENAI_MODEL` – modello per generare brief.
- `CRON_SECRET` – protezione minima per la route cron.
- `SERPAPI_API_KEY` – opzionale ma consigliato per arricchire le analisi competitive nelle SERP.

## Estensioni
- Memorizzare i segnali su database (es. Supabase) per training e storicizzare i bonus lanciati.
- Triggerare webhook verso Slack/Notion dopo pubblicazione.
- Integrare controllo plagio/fact-check verso fonti ufficiali prima di `publishArticles`.
