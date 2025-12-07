# NewsRisparmio24

Piattaforma Next.js + Tailwind ospitabile su Vercel con CMS headless Sanity. Il bot pubblica ogni giorno news su bonus, cashback e trucchi legali per risparmiare, con CTA affiliate dinamiche e refresh evergreen automatici.

## Setup locale

1. Installare dipendenze (Node >= 18):
   ```bash
   npm install
   ```
2. Creare `.env.local` copiando da `.env.example` e valorizzare credenziali:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_WRITE_TOKEN`
   - `OPENAI_API_KEY` / opzionale `OPENAI_MODEL`
   - `CRON_SECRET` se vuoi proteggere la route programmata
   - `SERPAPI_API_KEY` (consigliato) per arricchire i dati competitivi sulle keyword
3. Avviare i servizi:
   - `npm run dev` per Next.js
   - `npm run cms` per il Studio (facoltativo, richiede `sanity` CLI)

## Struttura principale

- `src/app` – App Router e API route `api/cron/daily` pensata per Vercel Cron.
- `src/lib/cms` – client Sanity e query per articoli visibili in home.
- `src/lib/bot` – servizi trend/keyword, generazione prompt LLM, composizione articolo e pubblicazione nel CMS.
- `sanity/` – Schemi Studio (articoli, cluster, impostazioni).
- `docs/` – Content model e manuale pipeline.

## Automazione bot

La funzione `runDailyPipeline` esegue:
1. `fetchTrendSignals` → usa Google Trends (API non ufficiale) per ottenere i topic giornalieri (con fallback locale).
2. `enrichWithKeywordMetrics` + `selectHighLeverageKeywords` → calcola il volume con `interestOverTime` e, se `SERPAPI_API_KEY` è presente, analizza la SERP reale per dedurre difficoltà e CPC.
3. `createArticleBrief` → prompt LLM tarato su tono pop/compliant NewsRisparmio24.
4. `composeArticle` → produce body e meta description orientati al risparmio con CTA affiliate suggerite automaticamente.
5. `publishArticles` → salva su Sanity, marca `isEvergreen`, registra `lastAuditAt`.
6. `refreshEvergreenArticles` → ogni cron aggiorna i contenuti evergreen più vecchi di 30 giorni rigenerando testo e CTA.

L'endpoint `GET /api/cron/daily` richiama la pipeline e risponde con un payload JSON; collegalo a un cron job (es. Vercel Cron) e passa `Authorization: Bearer <CRON_SECRET>` se configurato.

## Prossimi passi

1. Inserire le API key SerpApi e rimpiazzare gli URL placeholder in `src/lib/bot/services/cta.ts` con i tuoi link affiliati.
2. Agganciare Supabase/Postgres per logging e alert (es. webhook Slack su fallimenti).
3. Collegare newsletter o canali social inviando notifiche quando `runDailyPipeline` termina.
