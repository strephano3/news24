import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feed RSS",
  description: "Stream automatico di articoli NewsRisparmio24 su bonus, cashback e offerte legali.",
};

export default function FeedPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">Feed RSS NewsRisparmio24</h1>
      <p className="mt-4 text-slate-600">
        Qui verrà pubblicato il feed dinamico con gli ultimi alert su incentivi, carte con cashback e
        hack legali per risparmiare nelle spese quotidiane.
      </p>
    </main>
  );
}
