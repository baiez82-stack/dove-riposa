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
    aggiornato: '27/09/2026',
    mapX: 735,
    mapY: 325,
    mapLabel: 'Area demo est',
    route: 'M 520 635 L 520 555 L 555 520 L 555 440 L 635 440 L 635 365 L 735 325'
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
    aggiornato: '27/09/2026',
    mapX: 365,
    mapY: 370,
    mapLabel: 'Area demo ovest',
    route: 'M 520 635 L 520 555 L 470 520 L 470 445 L 405 445 L 365 370'
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
    aggiornato: '27/09/2026',
    mapX: 650,
    mapY: 505,
    mapLabel: 'Area demo sud-est',
    route: 'M 520 635 L 520 570 L 590 570 L 590 525 L 650 505'
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
                <CemeteryMap selected={selected} />
                <div className="map-info">
                  <span className="eyebrow">RICOSTRUZIONE PRELIMINARE</span>
                  <h3>Percorso nel vero impianto</h3>
                  <p>La sagoma e la disposizione dei volumi sono ricostruite dalla vista satellitare fornita per la demo. Settori, numerazioni e posizione del nominativo sono dimostrativi e dovranno essere sostituiti con la cartografia ufficiale del Comune.</p>
                  <div className="map-legend">
                    <span><i className="legend-build"></i>Edifici / porticati</span>
                    <span><i className="legend-field"></i>Aree sepolture</span>
                    <span><i className="legend-route"></i>Percorso demo</span>
                  </div>
                  <button className="primary">Percorso demo attivo</button>
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


function CemeteryMap({ selected }) {
  return <div className="cemetery-map-shell">
    <svg className="cemetery-map" viewBox="0 0 1000 700" role="img" aria-label="Ricostruzione dimostrativa del cimitero comunale di Povegliano Veronese">
      <rect width="1000" height="700" className="map-ground" />

      <path className="map-road" d="M 610 55 C 720 55 830 72 955 118" />
      <text x="820" y="70" className="map-small-label">Parcheggio zona cimitero</text>
      <rect x="760" y="88" width="165" height="68" rx="16" className="map-parking" />
      <text x="842" y="128" textAnchor="middle" className="map-parking-label">P</text>

      <g className="cemetery-footprint">
        <path className="map-building" d="M150 92 L390 72 L450 132 L420 190 L242 190 L205 255 L125 220 Z" />
        <path className="map-building" d="M118 230 L225 260 L205 452 L278 505 L245 585 L105 525 Z" />
        <path className="map-building" d="M415 105 L530 118 L563 180 L530 268 L470 248 L440 168 Z" />
        <path className="map-building" d="M610 205 L760 245 L835 360 L810 540 L715 575 L625 520 L662 450 L605 405 Z" />
        <path className="map-building" d="M520 300 L603 312 L615 520 L555 555 L510 505 Z" />

        <rect x="235" y="205" width="180" height="112" rx="10" className="map-field field-a" />
        <rect x="260" y="335" width="145" height="132" rx="10" className="map-field field-b" />
        <rect x="430" y="280" width="92" height="225" rx="10" className="map-field field-c" />
        <rect x="625" y="270" width="128" height="110" rx="10" className="map-field field-d" />
        <rect x="630" y="400" width="145" height="105" rx="10" className="map-field field-e" />

        <g className="map-graves">
          {Array.from({length: 8}).map((_,i)=><rect key={'a'+i} x={250+i*19} y="225" width="12" height="70" rx="3" />)}
          {Array.from({length: 6}).map((_,i)=><rect key={'b'+i} x={275+i*21} y="356" width="13" height="88" rx="3" />)}
          {Array.from({length: 10}).map((_,i)=><rect key={'c'+i} x="448" y={292+i*20} width="55" height="11" rx="3" />)}
          {Array.from({length: 6}).map((_,i)=><rect key={'d'+i} x={640+i*18} y="289" width="11" height="70" rx="3" />)}
          {Array.from({length: 7}).map((_,i)=><rect key={'e'+i} x={646+i*18} y="420" width="11" height="62" rx="3" />)}
        </g>

        <path className="map-walk" d="M520 620 L520 545 L555 510 L555 445 L600 420 L600 350" />
        <path className="map-walk" d="M520 545 L465 510 L430 455" />
        <path className="map-walk" d="M555 445 L650 445" />
      </g>

      <g className="entrance-marker">
        <circle cx="520" cy="635" r="20" />
        <text x="520" y="641" textAnchor="middle">↟</text>
      </g>
      <text x="520" y="676" textAnchor="middle" className="map-label">Ingresso demo</text>

      <path d={selected.route} className="selected-route" />
      <g className="selected-pin" transform={`translate(${selected.mapX} ${selected.mapY})`}>
        <circle r="18" />
        <circle r="7" className="pin-core" />
      </g>
      <g className="selected-callout" transform={`translate(${Math.min(selected.mapX + 28, 770)} ${Math.max(selected.mapY - 34, 60)})`}>
        <rect width="190" height="58" rx="11" />
        <text x="14" y="22">{selected.nome} {selected.cognome} — DEMO</text>
        <text x="14" y="42" className="callout-small">{selected.settore} · {selected.posizione}</text>
      </g>

      <g className="map-zone-labels">
        <text x="320" y="200">Area demo ovest</text>
        <text x="690" y="260">Area demo est</text>
        <text x="695" y="520">Area demo sud-est</text>
      </g>
    </svg>
    <div className="map-demo-badge">Ricostruzione da immagine satellitare · non è la planimetria ufficiale</div>
  </div>
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
