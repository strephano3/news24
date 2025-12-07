# Content Model

## Articolo
- **title** – Titolo principale generato dall'LLM dopo analisi SERP (es. bonus/cashback).
- **slug** – Derivato dal titolo, usato per la rotta `/articoli/[slug]`.
- **description** – Meta description/estratto.
- **mainCluster** – Reference al documento Cluster per creare silos interni.
- **body** – Portable Text, popolato dal bot tramite Studio API.
- **keywords** – Lista keyword principali monitorate.
- **faq** – Domande/risposte usate anche per schema FAQ.
- **ctaBlock** – CTA dinamica per AdSense/Affiliazioni (carte, cashback, switching bollette).
- **eeatScore** – Valutazione interna del modello.
- **publishedAt** – Timestamp pubblicazione.
- **targetKeyword** – Keyword primaria usata dal bot per generare/aggiornare il contenuto.
- **isEvergreen** – Flag per indicare se l'articolo deve essere aggiornato periodicamente.
- **lastAuditAt** – Ultimo refresh effettuato dal bot sugli articoli evergreen.
- **trafficPotential** – Volume stimato (derivato da Google Trends) usato per priorizzare.

## Cluster
- **title** – Nome cluster/pillar.
- **slug** – URL friendly slug.
- **searchIntent** – Informational/Commercial/Transactional.
- **priorityScore** – Valuta opportunità per la pipeline.

## Site Settings
- **siteTitle / tagline** – Branding.
- **primaryColor** – Tailwind token per UI.
- **monetizationBlocks** – Copie per CTA globali.

### API / Bot hints
- Next.js chiama `fetchFeaturedArticles` che usa Sanity GROQ e ritorna `MetadataArticle` per la home.
- Il cron giornaliero scriverà i documenti `article` usando token con permesso `editor`.
- Gli articoli evergreen vengono rinfrescati dopo 30 giorni sfruttando `targetKeyword` e `lastAuditAt`.
