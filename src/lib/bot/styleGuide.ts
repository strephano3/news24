type TextFactory = (keyword: string, seed: number) => string;
type OutlineFactory = (keyword: string) => string[];

export type StyleArchetype = {
  id: string;
  reference: string;
  description: string;
  prompt: string;
  buildTitle: TextFactory;
  buildSummary: TextFactory;
  buildOutline: OutlineFactory;
};

type StyledCopy = {
  id: string;
  title: string;
  summary: string;
  outline: string[];
  prompt: string;
};

const STYLE_ARCHETYPES: StyleArchetype[] = [
  {
    id: "diario-tagli-intelligenti",
    reference: "Ho risparmiato 300€ in 7 giorni: il metodo che non avevo mai provato",
    description: "Diario pratico con esempi concreti di tagli intelligenti.",
    prompt: "diario lampo che mostra come un esperimento reale ha sbloccato risparmio immediato",
    buildTitle: (keyword, seed) => {
      const saving = euroValue(seed, 180, 420, 20);
      const days = numberValue(seed + 3, 5, 9);
      return `Risparmio di ${saving}€ in ${days} giorni: il metodo che mette sotto controllo ${inlineKeyword(keyword)}`;
    },
    buildSummary: (keyword) =>
      `Diario pratico: tagli mirati ${withPreposition(keyword, "su")} per liberare budget in una settimana.`,
    buildOutline: (keyword) => [
      `Situazione iniziale e sprechi collegati ${withPreposition(keyword, "a")}`,
      "Le tre mosse giornaliere applicate senza scuse",
      "Numeri finali e cosa ha funzionato davvero",
      "Come replicare il metodo in 10 minuti netti",
    ],
  },
  {
    id: "errore-quotidiano",
    reference: "L’errore che fa perdere soldi a chiunque (e non lo sa)",
    description: "Comportamento quotidiano che aumenta spese e sprechi.",
    prompt: "inchiesta breve su un errore invisibile che drena soldi ogni giorno",
    buildTitle: (keyword) =>
      `L'errore legato ${withPreposition(keyword, "a")} che fa perdere soldi a chiunque (e non lo nota)`,
    buildSummary: (keyword) =>
      `Comportamento apparentemente innocuo che gonfia i costi ${withPreposition(keyword, "di")} mese dopo mese.`,
    buildOutline: (keyword) => [
      `Perché ${inlineKeyword(keyword)} è diventato un costo nascosto`,
      "Il gesto quotidiano che amplifica le spese",
      "Quanto pesa in bolletta o estratto conto",
      "Come correggerlo subito con una regola facile",
    ],
  },
  {
    id: "spese-nascoste",
    reference: "La verità sulle spese nascoste che nessuno controlla",
    description: "Bollette, abbonamenti e piccoli costi ricorrenti da scovare.",
    prompt: "indagine sulle spese invisibili legate al tema e su come eliminarle",
    buildTitle: (keyword) =>
      `La verità sulle spese nascoste dietro ${inlineKeyword(keyword)} che nessuno controlla`,
    buildSummary: (keyword) =>
      `Check-up rapido ${withPreposition(keyword, "su")} per stanare costi ricorrenti dimenticati.`,
    buildOutline: (keyword) => [
      `Dove si nascondono i costi extra ${withPreposition(keyword, "di")}`,
      "Gli importi medi che sfuggono e perché",
      "La checklist mensile da spuntare",
      "Strumenti per bloccare addebiti inutili",
    ],
  },
  {
    id: "budget-settimanale",
    reference: "Quanto puoi vivere davvero con 200€ a settimana? La mia prova",
    description: "Test pratico su budget minimo e gestione spese reali.",
    prompt: "sfida budget settimanale con risultati realistici e numeri verificabili",
    buildTitle: (keyword, seed) => {
      const budget = euroValue(seed + 5, 160, 260, 10);
      return `Quanto si può vivere davvero con ${budget}€ a settimana concentrandosi su ${inlineKeyword(keyword)}?`;
    },
    buildSummary: (keyword) =>
      `Sfida budget reale: cosa resta scegliendo ${inlineKeyword(keyword)} come priorità assoluta.`,
    buildOutline: (keyword) => [
      "Da dove parte il budget settimanale",
      `Come sono state ridistribuite le spese per gestire ${inlineKeyword(keyword)}`,
      "Le rinunce reali e i numeri finali",
      "Consigli pratici per restare sotto soglia",
    ],
  },
  {
    id: "confronto-diretto",
    reference: "Ho confrontato 5 conti deposito: questo è l’unico che mi ha convinto",
    description: "Confronto rapido e diretto tra opzioni simili.",
    prompt: "confronto secco tra più soluzioni, con vincitore dichiarato e motivazioni",
    buildTitle: (keyword, seed) => {
      const count = numberValue(seed + 7, 3, 6);
      return `Confronto tra ${count} soluzioni per ${inlineKeyword(keyword)}: ecco l'unica davvero convincente`;
    },
    buildSummary: (keyword) =>
      `Match testa a testa: confronto fra offerte legate ${withPreposition(keyword, "a")} per trovare l'opzione davvero conveniente.`,
    buildOutline: (keyword) => [
      `I criteri usati per confrontare le proposte ${withPreposition(keyword, "su")}`,
      "Vantaggi e limiti delle alternative in gara",
      "Perché il vincitore fa risparmiare di più",
      "Come replicare il confronto sul proprio conto",
    ],
  },
  {
    id: "spesa-tagliata",
    reference: "Il trucco che mi ha fatto tagliare la spesa alimentare del 40%",
    description: "Routine della spesa ottimizzata con esempi immediati.",
    prompt: "trucco quotidiano raccontato come routine per tagliare la spesa",
    buildTitle: (keyword, seed) => {
      const percent = percentValue(seed, 25, 45, 5);
      return `Il trucco che mi ha fatto tagliare ${inlineKeyword(keyword)} del ${percent}%`;
    },
    buildSummary: (keyword) =>
      `Routine settimanale: organizzare ${inlineKeyword(keyword)} con micro-regole che abbattono la spesa.`,
    buildOutline: (keyword) => [
      `Analisi del carrello legato ${withPreposition(keyword, "a")}`,
      "Le tre mosse salva budget",
      "Come monitorare gli effetti dopo 30 giorni",
      "Lista rapida per iniziare subito",
    ],
  },
  {
    id: "mutuo-errori",
    reference: "Se avessi saputo questo sui mutui prima… avrei risparmiato migliaia di euro",
    description: "Errori comuni nella scelta del mutuo.",
    prompt: "articolo confessione su errori di valutazione del mutuo e come evitarli",
    buildTitle: (keyword) =>
      `I dettagli che nessuno spiega ${withPreposition(keyword, "su")}: così si evitano migliaia di euro di errori`,
    buildSummary: (keyword) =>
      `Errori di valutazione ${withPreposition(keyword, "su")} che costano caro e come prevenirli.`,
    buildOutline: (keyword) => [
      `False credenze diffuse ${withPreposition(keyword, "su")}`,
      "Costi extra che emergono troppo tardi",
      "Strategie per rinegoziare o scegliere meglio",
      "Checklist dei documenti e delle soglie da monitorare",
    ],
  },
  {
    id: "regola-dieci-minuti",
    reference: "La regola dei 10 minuti che ha cambiato il mio modo di gestire i soldi",
    description: "Principio semplice per controllare impulsi e spese.",
    prompt: "micro-habit di 10 minuti applicata ai soldi con prova concreta",
    buildTitle: (keyword) =>
      `La regola dei 10 minuti che sta rivoluzionando la gestione di ${inlineKeyword(keyword)}`,
    buildSummary: (keyword) =>
      `Principio di 10 minuti per bloccare gli impulsi legati ${withPreposition(keyword, "a")} prima che diventino spesa.`,
    buildOutline: (keyword) => [
      "Come funziona la regola dei 10 minuti",
      `Perché aiuta proprio con ${inlineKeyword(keyword)}`,
      "Numeri dopo un mese di applicazione",
      "Template per applicarla immediatamente",
    ],
  },
  {
    id: "trend-banche",
    reference: "Perché tutti stanno cambiando banca nel 2025 (e cosa significa per te)",
    description: "Trend attuale con impatto pratico per l’utente.",
    prompt: "pezzo di scenario che spiega il trend e come approfittarne",
    buildTitle: (keyword) =>
      `Perché tutti stanno cambiando ${inlineKeyword(keyword)} nel 2025 (e cosa significa per te)`,
    buildSummary: (keyword) =>
      `Trend nazionale: perché ${inlineKeyword(keyword)} sta accelerando e come sfruttarlo senza rischi.`,
    buildOutline: (keyword) => [
      `I numeri aggiornati sul fenomeno ${inlineKeyword(keyword)}`,
      "Vantaggi concreti per chi si muove ora",
      "Come scegliere l'opzione giusta in tre step",
      "Avvisi di compliance e fonti ufficiali",
    ],
  },
  {
    id: "abbonamenti-tagliati",
    reference: "Come ho eliminato 5 abbonamenti inutili senza accorgermene",
    description: "Lista di servizi ricorrenti e come disattivarli.",
    prompt: "racconto di decluttering finanziario concentrato sugli abbonamenti",
    buildTitle: (keyword, seed) => {
      const count = numberValue(seed + 9, 4, 6);
      return `Come eliminare ${count} servizi legati ${withPreposition(keyword, "a")} senza nemmeno accorgersene`;
    },
    buildSummary: (keyword) =>
      `Decluttering digitale: quanti soldi si recuperano cancellando ${inlineKeyword(keyword)} duplicati.`,
    buildOutline: (keyword) => [
      `Identificare gli addebiti ricorrenti legati ${withPreposition(keyword, "a")}`,
      "Gli strumenti per catalogarli",
      "Strategia di disdetta passo passo",
      "Quanto si risparmia dopo 30 giorni",
    ],
  },
  {
    id: "metodo-30-30-30",
    reference: "Il metodo 30-30-30 che semplifica la gestione delle finanze",
    description: "Schema pratico per dividere le entrate.",
    prompt: "spiegazione pratica del metodo 30-30-30 applicato al tema",
    buildTitle: (keyword) =>
      `Il metodo 30-30-30 che semplifica la gestione ${withPreposition(keyword, "di")} senza stress`,
    buildSummary: (keyword) =>
      `Schema immediato per dividere entrate e spese legate ${withPreposition(keyword, "a")} senza errori.`,
    buildOutline: (keyword) => [
      "Da dove nasce il metodo 30-30-30",
      `Come applicarlo alle spese collegate ${withPreposition(keyword, "a")}`,
      "Automazioni utili per non uscire dal budget",
      "Tabella rapida da compilare ogni mese",
    ],
  },
  {
    id: "senza-contanti",
    reference: "Ho provato a vivere senza contanti per un mese: cosa ho scoperto",
    description: "Analisi dei pro e contro di un’esperienza reale.",
    prompt: "esperimento senza contanti legato al tema e alle sue frizioni",
    buildTitle: (keyword) =>
      `Un mese senza contanti dedicato a ${inlineKeyword(keyword)}: cosa cambia davvero`,
    buildSummary: (keyword) =>
      `Esperimento cashless: vantaggi e errori quando ${inlineKeyword(keyword)} passa solo da app e carte.`,
    buildOutline: (keyword) => [
      "Setup iniziale e strumenti scelti",
      `Cosa è andato storto con ${inlineKeyword(keyword)} nei primi giorni`,
      "Bilancio finale tra risparmio e stress",
      "Le regole che consiglierei a chi prova",
    ],
  },
  {
    id: "falsi-risparmi",
    reference: "I tre acquisti che sembrano risparmio… ma ti fanno perdere soldi",
    description: "Errori di consumo travestiti da convenienza.",
    prompt: "smonta tre falsi miti di risparmio collegati al topic",
    buildTitle: (keyword) =>
      `I tre acquisti ${withPreposition(keyword, "su")} che sembrano risparmio... ma ti fanno perdere soldi`,
    buildSummary: (keyword) =>
      `Lista di errori comuni: offerte ${withPreposition(keyword, "su")} che in realtà aumentano le spese.`,
    buildOutline: (keyword) => [
      "Perché certi sconti non funzionano",
      `Tre esempi concreti legati ${withPreposition(keyword, "a")}`,
      "Quanto costano davvero nel medio periodo",
      "Come sostituirli con alternative furbe",
    ],
  },
  {
    id: "soldi-nascosti",
    reference: "Come ho trovato 120€ nascosti nel mio conto (e puoi farlo anche tu)",
    description: "Controlli rapidi e utili che molti non fanno.",
    prompt: "tutorial per scovare fondi dormienti o addebiti invertiti",
    buildTitle: (keyword, seed) => {
      const amount = euroValue(seed + 11, 90, 180, 10);
      return `Dove trovare ${amount}€ nascosti controllando ${inlineKeyword(keyword)} (e come replicarlo)`;
    },
    buildSummary: (keyword) =>
      `Check-list da 15 minuti per scoprire soldi dimenticati legati ${withPreposition(keyword, "a")}.`,
    buildOutline: (keyword) => [
      "Dove guardare prima",
      `Incrociare ${inlineKeyword(keyword)} con alert bancari`,
      "Come contestare o recuperare in tempo",
      "Routine mensile per non dimenticarlo più",
    ],
  },
  {
    id: "tabella-budget",
    reference: "La tabella che uso ogni mese per non andare mai in rosso",
    description: "Strumento pratico di budgeting veloce.",
    prompt: "spiega una tabella operativa e condividi istruzioni passo passo",
    buildTitle: (keyword) =>
      `La tabella che uso ogni mese per tenere ${inlineKeyword(keyword)} sotto controllo e non andare mai in rosso`,
    buildSummary: (keyword) =>
      `Foglio operativo: colonne e soglie per avere ${inlineKeyword(keyword)} sempre sotto controllo.`,
    buildOutline: (keyword) => [
      "Setup della tabella e colonne indispensabili",
      `Come inserire ${inlineKeyword(keyword)} e le sue variabili`,
      "Alert automatici e formule semplici",
      "Download mentale: come aggiornarla in 5 minuti",
    ],
  },
  {
    id: "bias-spese",
    reference: "Perché spendiamo più di quanto crediamo: l’esperimento che lo dimostra",
    description: "Bias psicologici collegati alle spese quotidiane.",
    prompt: "racconto di esperimento che smaschera un bias di spesa",
    buildTitle: (keyword) =>
      `Perché spendiamo più di quanto crediamo ${withPreposition(keyword, "su")}: l'esperimento che lo dimostra`,
    buildSummary: (keyword) =>
      `Test psicologico: come il bias ci porta a sovrastimare o sottovalutare ${inlineKeyword(keyword)}.`,
    buildOutline: (keyword) => [
      "Setup dell'esperimento",
      `Le reazioni tipiche quando si parla ${withPreposition(keyword, "di")}`,
      "I numeri che mostrano lo scarto reale",
      "Come difendersi dal bias con micro-azioni",
    ],
  },
  {
    id: "routine-mezzora",
    reference: "Mezz’ora al giorno che ti cambia il portafoglio: la mia routine",
    description: "Micro-abitudini quotidiane con impatto tangibile.",
    prompt: "routine giornaliera di 30 minuti con impatto sul portafoglio",
    buildTitle: (keyword) =>
      `Mezz'ora al giorno che rivoluziona la gestione di ${inlineKeyword(keyword)}: la routine provata`,
    buildSummary: (keyword) =>
      `Routine di 30 minuti per mettere ordine a ${inlineKeyword(keyword)} e liberare liquidità.`,
    buildOutline: (keyword) => [
      "Come organizzare la mezz'ora",
      `Le tre azioni fisse ${withPreposition(keyword, "su")}`,
      "Strumenti digitali consigliati",
      "Risultati dopo una settimana di costanza",
    ],
  },
  {
    id: "investimento-confronto",
    reference: "Il confronto che ha sorpreso anche me: investire 50€ vs 200€ al mese",
    description: "Simulazione semplice e comprensibile.",
    prompt: "mettere a confronto due cifre investite con outcome numerici chiari",
    buildTitle: (keyword, seed) => {
      const low = euroValue(seed + 13, 40, 70, 10);
      const high = low * 4;
      return `Il confronto inatteso: investire ${low}€ vs ${high}€ al mese ${withPreposition(keyword, "su")}`;
    },
    buildSummary: (keyword) =>
      `Simulazione lampo: cosa cambia mettendo cifre diverse ${withPreposition(keyword, "su")} ogni mese.`,
    buildOutline: (keyword) => [
      "Ipotesi e durata dell'investimento",
      `Come rende ${inlineKeyword(keyword)} con due budget diversi`,
      "Break-even e rischi da conoscere",
      "Come scegliere la cifra sostenibile",
    ],
  },
  {
    id: "trucco-senza-rinunce",
    reference: "Il trucco per risparmiare senza rinunciare a nulla (funziona davvero)",
    description: "Ottimizzazione di costi senza sacrifici percepiti.",
    prompt: "trucco concreto per risparmiare mantenendo lo stesso stile di vita",
    buildTitle: (keyword) =>
      `Il trucco per risparmiare ${withPreposition(keyword, "su")} senza rinunciare a nulla (funziona davvero)`,
    buildSummary: (keyword) =>
      `Ottimizzazione soft: tagliare i costi ${withPreposition(keyword, "di")} senza cambiare abitudini.`,
    buildOutline: (keyword) => [
      `Cosa fa lievitare i costi ${withPreposition(keyword, "di")}`,
      "Il trucco che riduce il prezzo percepito",
      "Quanto si risparmia dopo 30 giorni",
      "Come automatizzare il processo",
    ],
  },
  {
    id: "spese-invisibili",
    reference: "Le 5 spese ‘invisibili’ che ti svuotano il conto ogni anno",
    description: "Elenco rapido con suggerimenti immediati per correggersi.",
    prompt: "listicle su cinque spese invisibili da attaccare una per una",
    buildTitle: (keyword, seed) => {
      const count = numberValue(seed + 15, 4, 6);
      return `Le ${count} spese invisibili ${withPreposition(keyword, "su")} che ti svuotano il conto ogni anno`;
    },
    buildSummary: (keyword) =>
      `Mappa degli addebiti invisibili collegati ${withPreposition(keyword, "a")} con contromisure immediate.`,
    buildOutline: (keyword) => [
      "Come individuarle nello storico movimenti",
      `Il peso annuale ${withPreposition(keyword, "su")}`,
      "L'ordine giusto per eliminarle",
      "Controllo trimestrale per non farle tornare",
    ],
  },
];

export function styledCopyFor(keyword: string, offset = 0, forcedStyleId?: string): StyledCopy {
  const safeKeyword = keyword?.trim() || "risparmio";
  const hash = hashString(`${safeKeyword}:${offset}`);
  const archetype =
    (forcedStyleId ? STYLE_ARCHETYPES.find((style) => style.id === forcedStyleId) : null) ??
    STYLE_ARCHETYPES[(hash + offset) % STYLE_ARCHETYPES.length];
  const variantSeed = hashString(`${safeKeyword}:${archetype.id}:${offset}`);

  return {
    id: archetype.id,
    title: archetype.buildTitle(safeKeyword, variantSeed),
    summary: archetype.buildSummary(safeKeyword, variantSeed),
    outline: archetype.buildOutline(safeKeyword),
    prompt: archetype.prompt,
  };
}

function euroValue(seed: number, min: number, max: number, step: number) {
  const steps = Math.floor((max - min) / step) + 1;
  return min + (Math.abs(seed) % steps) * step;
}

function numberValue(seed: number, min: number, max: number) {
  return min + (Math.abs(seed) % (max - min + 1));
}

function percentValue(seed: number, min: number, max: number, step: number) {
  return euroValue(seed, min, max, step);
}

function inlineKeyword(keyword: string) {
  const cleaned = tidyKeyword(keyword);
  return topicLabelFor(cleaned);
}

function titleKeyword(keyword: string) {
  const inline = inlineKeyword(keyword);
  return inline.charAt(0).toUpperCase() + inline.slice(1);
}

function withPreposition(keyword: string, prep: "a" | "di" | "su") {
  const base = inlineKeyword(keyword);
  const lower = base.toLowerCase();
  if (lower.startsWith("l'")) {
    return `${prep} ${base}`;
  }

  const articleMatch = lower.match(/^(il|lo|la|i|gli|le)\s/);
  if (!articleMatch) {
    return `${prep} ${base}`;
  }

  const article = articleMatch[1];
  const remainder = base.slice(article.length + 1);
  const table: Record<string, Record<string, string>> = {
    a: { il: "al", lo: "allo", la: "alla", i: "ai", gli: "agli", le: "alle" },
    di: { il: "del", lo: "dello", la: "della", i: "dei", gli: "degli", le: "delle" },
    su: { il: "sul", lo: "sullo", la: "sulla", i: "sui", gli: "sugli", le: "sulle" },
  };

  const contraction = table[prep]?.[article];
  if (contraction) {
    return `${contraction} ${remainder}`;
  }

  return `${prep} ${base}`;
}

function tidyKeyword(keyword: string) {
  if (!keyword) return "";
  const sanitized = keyword.replace(/[“”"']/g, "").replace(/\s{2,}/g, " ").trim();
  const firstClause = sanitized.split(/[–—:.;!?]/)[0]?.trim() ?? "";
  const limited = firstClause
    .split(/\s+/)
    .slice(0, 8)
    .join(" ")
    .trim();
  return limited;
}

function topicLabelFor(cleaned: string) {
  if (!cleaned) return "il budget familiare";
  const lower = cleaned.toLowerCase();
  for (const rule of TOPIC_RULES) {
    if (rule.test.test(lower)) {
      return rule.label;
    }
  }
  if (lower.includes("contanti")) return "la vita senza contanti";
  if (lower.includes("bolletta")) return "le bollette luce e gas";
  if (lower.includes("mutuo")) return "la rata del mutuo";
  return cleaned;
}

const TOPIC_RULES = [
  { test: /(contant|cashless|solo app|bancomat|fintech|pos)/i, label: "la vita senza contanti" },
  { test: /(spesa|carrello|supermercat|food prep|meal prep)/i, label: "la spesa settimanale" },
  { test: /(bollett|energia|gas|kwh|arera)/i, label: "le bollette luce e gas" },
  { test: /(mutuo|casa|rata|affitto)/i, label: "la rata del mutuo" },
  { test: /(abbonament|subscription|streaming|netflix|prime|spotify)/i, label: "gli abbonamenti ricorrenti" },
  { test: /(conto deposito|conto|banca|tasso|rendimen)/i, label: "i conti deposito migliori" },
  { test: /(bonus|cashback|isee|inps|nido|sussidio)/i, label: "i bonus attivi" },
  { test: /(invest|etf|piano|pac|azioni)/i, label: "gli investimenti mensili" },
  { test: /(routine|tabella|metodo|budget|regola)/i, label: "il budget familiare" },
];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
