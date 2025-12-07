const services = [
  { name: "Sanity", role: "CMS headless", status: "Ready" },
  { name: "Supabase", role: "Log segnali bonus & scheduling", status: "Planned" },
  { name: "OpenAI GPT-4o mini", role: "Generazione contenuti NewsRisparmio24", status: "Planned" },
  { name: "Vercel Cron", role: "Automazione daily", status: "Planned" },
];

export default function IntegrationsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">Stack tecnico NewsRisparmio24</h1>
      <p className="mt-4 text-slate-600">
        Vista ad alto livello sui servizi collegati al bot per intercettare trend su risparmio e
        bonus, generare contenuti e monetizzare in modo conforme.
      </p>
      <div className="mt-8 space-y-4">
        {services.map((service) => (
          <div key={service.name} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-lg font-semibold text-slate-900">{service.name}</p>
            <p className="text-sm text-slate-600">{service.role}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-600">{service.status}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
