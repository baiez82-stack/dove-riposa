'use client';
// deploy-trigger-povegliano

import { useMemo, useState } from 'react';

const demoRecords = [
  {
    id: 1,
    nome: 'Mario',
    cognome: 'Rossi',
    anno: '1941',
    morte: '2024',
    comune: 'Povegliano Veronese',
    cimitero: 'Cimitero comunale di Povegliano Veronese — DEMO',
    settore: 'Settore B',
    fila: 'Fila 7',
    posizione: 'Loculo 18',
    fonte: 'Dato dimostrativo fittizio — non proveniente dagli archivi comunali',
    aggiornato: '27/09/2026'
  },
  {
    id: 2,
    nome: 'Anna',
    cognome: 'Bianchi',
    anno: '1936',
    morte: '2022',
    comune: 'Povegliano Veronese',
    cimitero: 'Cimitero comunale di Povegliano Veronese — DEMO',
    settore: 'Campo A',
    fila: 'Fila 3',
    posizione: 'Tomba 42',
    fonte: 'Dato dimostrativo fittizio — non proveniente dagli archivi comunali',
    aggiornato: '27/09/2026'
  },
  {
    id: 3,
    nome: 'Giuseppe',
    cognome: 'Verdi',
    anno: '1952',
    morte: '2025',
    comune: 'Povegliano Veronese',
    cimitero: 'Cimitero comunale di Povegliano Veronese — DEMO',
    settore: 'Campo C',
    fila: 'Fila 11',
    posizione: 'Cippo 9',
    fonte: 'Dato dimostrativo fittizio — non proveniente dagli archivi comunali',
    aggiornato: '27/09/2026'
  }
];

const nav = [
  ['cerca', 'Cerca'],
  ['comuni', 'Per Comuni'],
  ['business', 'Business'],
  ['fonti', 'Fonti dati'],
  ['privacy', 'Privacy']
];

export default function Home() {
  const [tab, setTab] = useState('cerca');
  const [q, setQ] = useState({ nome: '', cognome: '', comune: '', anno: '' });
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState(null);

  const results = useMemo(() => {
    const norm = (s) => s.trim().toLowerCase();
    return demoRecords.filter((r) => {
      return (!norm(q.nome) || r.nome.toLowerCase().includes(norm(q.nome))) &&
        (!norm(q.cognome) || r.cognome.toLowerCase().includes(norm(q.cognome))) &&
        (!norm(q.comune) || r.comune.toLowerCase().includes(norm(q.comune))) &&
        (!norm(q.anno) || r.anno.includes(norm(q.anno)) || r.morte.includes(norm(q.anno)));
    });
  }, [q]);

  function search(e) {
    e.preventDefault();
    setSearched(true);
    setSelected(null);
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand" onClick={() => setTab('cerca')}>
          <span className="mark">DR</span>
          <div><strong>Dove Riposa</strong><small>MVP nazionale federato</small></div>
        </div>
        <nav>
          {nav.map(([id, label]) => (
            <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>
          ))}
        </nav>
      </header>

      {tab === 'cerca' && (
        <>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow">PROGETTO PILOTA · POVEGLIANO VERONESE · NESSUN ACCOUNT</span>
              <h1>Trova una sepoltura, anche se non sai da dove iniziare.</h1>
              <p>Demo preparata per un possibile progetto pilota con il Comune di Povegliano Veronese. Nessun archivio comunale reale è collegato: tutti i nominativi mostrati sono fittizi.</p>
            </div>
            <form className="search-card" onSubmit={search}>
              <label>Nome<input value={q.nome} onChange={e => setQ({...q, nome:e.target.value})} placeholder="es. Mario" /></label>
              <label>Cognome<input value={q.cognome} onChange={e => setQ({...q, cognome:e.target.value})} placeholder="es. Rossi" /></label>
              <label>Comune <span>(facoltativo)</span><input value={q.comune} onChange={e => setQ({...q, comune:e.target.value})} placeholder="Povegliano Veronese" /></label>
              <label>Anno nascita/morte <span>(facoltativo)</span><input value={q.anno} onChange={e => setQ({...q, anno:e.target.value})} inputMode="numeric" placeholder="es. 1941" /></label>
              <button className="primary" type="submit">Cerca sepoltura</button>
              <p className="micro">La ricerca base non richiede registrazione. Nessuna profilazione.</p>
            </form>
          </section>

          <section className="trust-strip">
            <div><b>Fonte visibile</b><span>Ogni risultato indica provenienza e data di aggiornamento.</span></div>
            <div><b>Privacy by design</b><span>Solo dati necessari alla localizzazione della sepoltura.</span></div>
            <div><b>Interoperabile</b><span>Progettato per API, open data e gestionali esistenti.</span></div>
          </section>

          {searched && (
            <section className="results wrap">
              <div className="section-head"><span className="eyebrow">RISULTATI DEMO</span><h2>{results.length} corrispondenze</h2></div>
              <div className="result-grid">
                {results.map(r => (
                  <article className="result-card" key={r.id}>
                    <div className="person-icon">+</div>
                    <div className="result-main">
                      <h3>{r.nome} {r.cognome}</h3>
                      <p>{r.anno}–{r.morte} · {r.comune}</p>
                      <div className="place"><b>{r.cimitero}</b><span>{r.settore} · {r.fila} · {r.posizione}</span></div>
                      <div className="source">Fonte: {r.fonte} · Agg. {r.aggiornato}</div>
                    </div>
                    <button className="secondary" onClick={() => setSelected(r)}>Vedi posizione</button>
                  </article>
                ))}
                {results.length === 0 && <div className="empty">Nessuna corrispondenza nei dati demo. In produzione verrebbero interrogate le fonti aderenti.</div>}
              </div>
            </section>
          )}

          {selected && (
            <section className="map-section wrap">
              <div className="section-head"><span className="eyebrow">MAPPA INTERNA · DEMO</span><h2>{selected.cimitero}</h2><p>{selected.nome} {selected.cognome} — {selected.settore}, {selected.fila}, {selected.posizione}</p></div>
              <div className="map-card">
                <div className="map-grid">
                  <div className="gate">INGRESSO</div>
                  <div className="path p1"></div><div className="path p2"></div><div className="path p3"></div>
                  <div className="block b1">A</div><div className="block b2">B</div><div className="block b3">C</div><div className="block b4">D</div>
                  <div className="pin">●<span>Sepoltura</span></div>
                </div>
                <div className="map-info">
                  <h3>Percorso pedonale</h3>
                  <p>In produzione la mappa può usare planimetrie georeferenziate fornite dall’ente. La posizione dell’utente verrebbe richiesta solo su consenso e usata per la navigazione, senza conservarla come impostazione predefinita.</p>
                  <button className="primary">Avvia percorso demo</button>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {tab === 'comuni' && <InfoPage title="Per Comuni e gestori" kicker="B2G / B2B" intro="Proposta pilota per Povegliano Veronese: collegare gli archivi e le planimetrie già gestiti dall’ente a un motore di ricerca semplice per i cittadini, senza imporre la sostituzione del gestionale esistente." cards={[
        ['Widget istituzionale', 'Motore di ricerca incorporabile nel sito del Comune o del gestore.'],
        ['Importazione dati', 'CSV, Excel, API o feed concordati con schema di validazione.'],
        ['Mappatura digitale', 'Digitalizzazione di settori, campi, loculi e percorsi interni.'],
        ['Dashboard aggiornamenti', 'Controllo importazioni, anomalie, record da verificare e log.'],
        ['API interoperabili', 'Endpoint per integrare portali civici, totem e app del Comune.'],
        ['Statistiche aggregate', 'Solo dati di servizio aggregati, senza profilazione del cittadino.']
      ]} extra={<><PilotPlan/><Dashboard/></>}/>} 

      {tab === 'business' && <InfoPage title="Modello business" kicker="RICAVI" intro="Il cittadino cerca gratis. Il valore economico nasce dalla digitalizzazione, dall’integrazione e dalla gestione del servizio per enti e operatori." cards={[
        ['1 · Integrazione', 'Ricerca federata, feed/API, widget istituzionale e assistenza. Su preventivo.'],
        ['2 · Digitalizzazione', 'Censimento/mappatura iniziale, normalizzazione dati e import storico. Su preventivo.'],
        ['3 · Servizio completo', 'Dashboard, API, sincronizzazioni, monitoraggio qualità dati e supporto continuativo. Su preventivo.']
      ]} extra={<div className="business-note"><b>Componenti di costo possibili</b><p>Per Povegliano Veronese la prima proposta sarebbe una sperimentazione limitata: audit dati, import iniziale, mappatura e pubblicazione controllata. Il prezzo definitivo va definito solo dopo aver verificato formato e qualità degli archivi disponibili.</p></div>}/>} 

      {tab === 'fonti' && <InfoPage title="Fonti dati ammesse" kicker="TRACCIABILITÀ" intro="La fonte non è un dettaglio tecnico: è parte del prodotto. Ogni record deve sapere da dove arriva e con quale titolo è riutilizzato." cards={[
        ['Feed/API ufficiale', 'Prima scelta: flusso concordato direttamente con Comune o gestore.'],
        ['Open data', 'Solo dataset pubblicati con condizioni e licenza di riuso verificate.'],
        ['Import autorizzato', 'CSV/Excel consegnato dall’ente con tracciamento della versione.'],
        ['Censimento commissionato', 'Rilievo e digitalizzazione svolti nell’ambito di un incarico formale.'],
        ['No scraping come standard', 'Niente raccolta massiva da portali pubblici senza una base di riuso chiara.'],
        ['Correzioni controllate', 'Segnalazioni di cittadini/familiari entrano in coda di verifica, non direttamente online.']
      ]}/>} 

      {tab === 'privacy' && <InfoPage title="Privacy e trasparenza" kicker="PRIVACY BY DESIGN" intro="Il flusso pubblico deve restare essenziale: trovare una sepoltura, senza trasformare automaticamente il defunto in un profilo social o commerciale." cards={[
        ['Nessun account obbligatorio', 'La ricerca base è anonima e non richiede registrazione.'],
        ['Minimizzazione', 'Nome, cognome, riferimenti temporali essenziali e localizzazione della sepoltura.'],
        ['Geolocalizzazione su consenso', 'Solo quando serve al percorso; niente conservazione predefinita.'],
        ['Memoriali separati', 'Nessun profilo commemorativo automatico. Futuri memoriali solo opt-in e separati.'],
        ['Rettifica e segnalazione', 'Canale dedicato per errori, aggiornamenti e contestazioni sul dato.'],
        ['Ruoli configurabili', 'Titolare, responsabile, tempi di conservazione e basi operative definiti per ciascun ente.']
      ]} extra={<div className="legal-box"><b>Nota per la messa in produzione</b><p>Questo MVP non è una certificazione di conformità. Prima di trattare dati reali servono validazione del flusso con l’ente competente, accordi sul trattamento/riuso dei dati, misure di sicurezza, registro dei trattamenti e verifica legale/DPO ove applicabile.</p></div>}/>} 

      <footer><div><b>Dove Riposa</b><span>Nome di lavoro · MVP dimostrativo</span></div><p>Demo dedicata a Povegliano Veronese. Solo dati fittizi: nessun dato reale proveniente dagli archivi comunali.</p></footer>
    </main>
  );
}

function InfoPage({title, kicker, intro, cards, extra}) {
  return <section className="info-page wrap"><div className="info-hero"><span className="eyebrow">{kicker}</span><h1>{title}</h1><p>{intro}</p></div><div className="info-grid">{cards.map(([t,d]) => <article key={t}><h3>{t}</h3><p>{d}</p></article>)}</div>{extra}</section>
}

function PilotPlan(){
  return <div className="business-note"><b>Pilot Povegliano Veronese — percorso proposto</b><p><strong>1. Audit:</strong> verifichiamo formato degli archivi, codifica di settori/loculi e disponibilità delle planimetrie. <strong>2. Import:</strong> normalizziamo una copia autorizzata dei dati. <strong>3. Mappa:</strong> colleghiamo ogni sepoltura alla posizione interna. <strong>4. Test:</strong> il Comune valida risultati e flussi di rettifica. <strong>5. Pubblicazione:</strong> attiviamo la ricerca sul sito istituzionale o su dominio dedicato.</p></div>
}

function Dashboard(){
  return <div className="dashboard"><div className="dash-head"><div><span className="eyebrow">DASHBOARD DEMO</span><h2>Povegliano Veronese</h2></div><span className="status">● Ambiente dimostrativo</span></div><div className="stats"><div><b>—</b><span>record reali da importare</span></div><div><b>0</b><span>dati comunali reali nella demo</span></div><div><b>Pilot</b><span>progetto da validare con l’ente</span></div><div><b>100%</b><span>dati mostrati fittizi</span></div></div><div className="log"><b>Passaggi prima della messa online</b><p>01 · Verifica archivi e responsabilità del trattamento/riuso</p><p>02 · Import di prova e controllo qualità</p><p>03 · Validazione planimetria e percorso di rettifica</p></div></div>
}
