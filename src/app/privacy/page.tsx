export const metadata = {
  title: "Privacy & Cookie Policy",
  description:
    "Informativa sul trattamento dei dati personali e uso dei cookie per il sito NewsRisparmio24.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 space-y-10 text-slate-800">
      <header>
        <p className="text-sm uppercase tracking-[0.35em] text-brand-600">Trasparenza</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Privacy & Cookie Policy</h1>
        <p className="mt-2 text-slate-500">Ultimo aggiornamento: dicembre 2025</p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Titolare del trattamento</h2>
        <p className="mt-2">
          Il titolare del trattamento dei dati personali è Stefano La Rosa (&ldquo;NewsRisparmio24&rdquo;)
          con sede operativa in Italia. Puoi contattarci all&rsquo;indirizzo email
          privacy@newsrisparmio24.it per qualsiasi richiesta sui dati trattati.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Tipologie di dati raccolti</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Dati tecnici: indirizzo IP, data/ora di accesso, user agent e pagine visitate.</li>
          <li>
            Dati forniti volontariamente: indirizzo email e contenuto del messaggio (form di contatto
            o iscrizione alla newsletter).
          </li>
          <li>
            Dati di analytics e marketing: cookie e identificativi anonimi raccolti tramite servizi
            terzi (Google Analytics, Google AdSense, network di affiliazione).
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Finalità e base giuridica</h2>
        <p className="mt-2">
          I dati vengono trattati per fornire i contenuti del sito, rilevare statistiche aggregate,
          inviare comunicazioni informative su risparmio e bonus (solo con consenso esplicito) e
          gestire programmi di affiliazione. La base giuridica è l&rsquo;esecuzione di misure
          precontrattuali, il legittimo interesse del titolare e il consenso quando richiesto.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Conservazione dei dati</h2>
        <p className="mt-2">
          I dati raccolti tramite moduli vengono conservati per il tempo necessario a rispondere alla
          richiesta e, per finalità di newsletter, fino alla revoca del consenso. I log tecnici e i
          dati anonimi di analytics vengono conservati per massimo 14 mesi.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Cookie</h2>
        <p className="mt-2">
          Il sito utilizza cookie tecnici e, previo consenso, cookie di profilazione forniti da
          terze parti. Puoi gestire le preferenze tramite il banner cookie o dalle impostazioni del
          tuo browser. Maggiori informazioni sui cookie dei nostri partner sono disponibili nelle
          relative policy (Google, partner di affiliazione, piattaforme newsletter).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Diritti dell&rsquo;utente</h2>
        <p className="mt-2">
          In qualunque momento puoi esercitare i diritti previsti dal Regolamento UE 2016/679:
          accesso, rettifica, cancellazione, limitazione, opposizione, portabilità e il diritto di
          proporre reclamo al Garante per la Protezione dei Dati Personali. Invia la richiesta a
          privacy@newsrisparmio24.it.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Modifiche</h2>
        <p className="mt-2">
          La presente informativa può essere aggiornata in qualsiasi momento. Eventuali modifiche
          sostanziali saranno comunicate attraverso il sito. Ti invitiamo a consultare regolarmente
          questa pagina per rimanere informato.
        </p>
      </section>
    </main>
  );
}
