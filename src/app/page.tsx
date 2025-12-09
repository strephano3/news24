export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import Link from "next/link";
import { ArticleShowcase } from "@/components/ArticleShowcase";
import { SeoScoreCard } from "@/components/SeoScoreCard";

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl space-y-16">
        <header className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-600">
            NewsRisparmio24
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
            Il tuo risparmio, intelligente.
          </h1>
          <nav
            aria-label="Categorie principali"
            className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            {mainNavItems.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 px-3 py-1 text-slate-700"
              >
                {item}
              </span>
            ))}
          </nav>
        </header>

        <ArticleShowcase />
        <div className="text-center">
          <Link
            href="/articoli"
            className="inline-flex items-center justify-center rounded-full border border-brand-200 px-6 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Tutti gli articoli →
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="rounded-2xl bg-white/90 p-6 shadow-md lg:max-w-xl lg:self-start">
            <h2 className="text-2xl font-semibold text-slate-900">
              Cosa trovi ogni giorno su NewsRisparmio24
            </h2>
            <ol className="mt-6 space-y-4 text-slate-600">
              {steps.map((step) => (
                <li key={step.title} className="flex gap-4">
                  <div className="mt-1 h-6 w-6 rounded-full bg-brand-100 text-center text-xs font-semibold uppercase text-brand-700">
                    {step.id}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{step.title}</p>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <SeoScoreCard />
        </section>

      </div>
    </main>
  );
}

const steps = [
  {
    id: "01",
    title: "Bollette e fornitori",
    description:
      "Checklist per cambiare fornitore luce/gas, capire i contratti e ridurre i consumi con strumenti di monitoraggio.",
  },
  {
    id: "02",
    title: "Mutuo e acquisto casa",
    description:
      "Strategie evergreen su tassi, LTV e documenti per chi compra casa o rinegozia il mutuo.",
  },
  {
    id: "03",
    title: "Budget familiare e carte",
    description:
      "Guide su app finance, tabelle di spesa e carte fintech a canone zero per gestire il budget annuale.",
  },
];

const mainNavItems = ["News", "I migliori conti", "Consigli", "Esperienze"];
