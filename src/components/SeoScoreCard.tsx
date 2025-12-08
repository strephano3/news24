export function SeoScoreCard() {
  return (
    <div className="rounded-3xl bg-slate-900 p-8 text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-brand-200">
        Metodo evergreen
      </p>
      <h2 className="mt-2 text-3xl font-semibold">Perché possiamo pubblicare ogni giorno</h2>
      <div className="mt-6 space-y-4 text-slate-200">
        <p className="text-lg">
          Ogni articolo nasce da keyword evergreen e dati di consumo reali: aggiorniamo le guide quando
          cambiano le tariffe o i tassi, non solo quando appare un nuovo bonus.
        </p>
        <p className="text-lg">
          Scriviamo checklist replicabili: cambiare fornitore, controllare le fasce orarie, gestire
          il budget e confrontare carte fintech.
        </p>
      </div>
      <ul className="mt-8 space-y-3 text-sm text-slate-200">
        <li>• Audit mensili dei contenuti evergreen.</li>
        <li>• App e strumenti consigliati solo dopo test reali.</li>
        <li>• Fonti citate in chiaro (ARERA, istituti di credito, comunità utenti).</li>
      </ul>
    </div>
  );
}
