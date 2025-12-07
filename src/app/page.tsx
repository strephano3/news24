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
            Guide evergreen per risparmiare su bollette, mutuo e budget familiare
          </h1>
          <p className="text-lg text-slate-600 sm:text-xl">
            Ogni settimana l&rsquo;IA analizza i trend delle famiglie italiane e pubblica solo guide
            evergreen, approfondite e facili da mettere in pratica.
          </p>
          <div />
        </header>

        <ArticleShowcase />

        <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl bg-white/80 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-900">
              Cosa trovi ogni giorno su NewsRisparmio24
            </h2>
            <ol className="mt-6 space-y-5 text-slate-600">
              {steps.map((step) => (
                <li key={step.title} className="flex gap-4">
                  <div className="mt-1 h-6 w-6 rounded-full bg-brand-100 text-center text-sm font-semibold text-brand-700">
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

        <section className="rounded-3xl bg-white/80 p-8 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Radar quotidiano</p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Ultime checklist pubblicate
              </h2>
            </div>
            <Link className="text-brand-600" href="/feed">
              RSS feed
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-600">
            Il feed RSS verrà presto attivato con un estratto automatico delle nuove guide. Nel frattempo
            puoi salvare questa pagina nei preferiti per vedere ogni giorno gli aggiornamenti.
          </p>
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
