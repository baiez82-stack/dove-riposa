'use client';

import { useMemo, useState } from 'react';

const demoRecords = [
  {
    id: 1,
    nome: 'Mario',
    cognome: 'Rossi',
    anno: '1941',
    morte: '2024',
    comune: 'Verona',
    cimitero: 'Cimitero Monumentale — DEMO',
    settore: 'Settore B',
    fila: 'Fila 7',
    posizione: 'Loculo 18',
    fonte: 'Dataset dimostrativo fittizio',
    aggiornato: '27/09/2026'
  },
  {
    id: 2,
    nome: 'Anna',
    cognome: 'Bianchi',
    anno: '1936',
    morte: '2022',
    comune: 'Padova',
    cimitero: 'Cimitero Maggiore — DEMO',
    settore: 'Settore A',
    fila: 'Fila 3',
    posizione: 'Tomba 42',
    fonte: 'Dataset dimostrativo fittizio',
    aggiornato: '27/09/2026'
  },
  {
    id: 3,
    nome: 'Giuseppe',
    cognome: 'Verdi',
    anno: '1952',
    morte: '2025',
    comune: 'Vicenza',
    cimitero: 'Cimitero Maggiore — DEMO',
    settore: 'Campo C',
    fila: 'Fila 11',
    posizione: 'Cippo 9',
    fonte: 'Dataset dimostrativo fittizio',
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
              <span className="eyebrow">RICERCA GRATUITA · NESSUN ACCOUNT</span>
              <h1>Trova una sepoltura, anche se non sai da dove iniziare.</h1>
              <p>Un unico motore per interrogare, in futuro, fonti ufficiali di Comuni e gestori cimiteriali. Questo prototipo usa solo dati fittizi.</p>
            </div>
            <form className="search-card" onSubmit={search}>
              <label>Nome<input value={q.nome} onChange={e => setQ({...q, nome:e.target.value})} placeholder="es. Mario" /></label>
              <label>Cognome<input value={q.cognome} onChange={e => setQ({...q, cognome:e.target.value})} placeholder="es. Rossi" /></label>
              <label>Comune <span>(facoltativo)</span><input value={q.comune} onChange={e => setQ({...q, comune:e.target.value})} placeholder="es. Verona" /></label>
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

      {tab === 'comuni' && <InfoPage title="Per Comuni e gestori" kicker="B2G / B2B" intro="Dove Riposa non chiede di cambiare gestionale: si collega ai sistemi esistenti e rende il dato ricercabile in modo uniforme." cards={[
        ['Widget istituzionale', 'Motore di ricerca incorporabile nel sito del Comune o del gestore.'],
        ['Importazione dati', 'CSV, Excel, API o feed concordati con schema di validazione.'],
        ['Mappatura digitale', 'Digitalizzazione di settori, campi, loculi e percorsi interni.'],
        ['Dashboard aggiornamenti', 'Controllo importazioni, anomalie, record da verificare e log.'],
        ['API interoperabili', 'Endpoint per integrare portali civici, totem e app del Comune.'],
        ['Statistiche aggregate', 'Solo dati di servizio aggregati, senza profilazione del cittadino.']
      ]} extra={<Dashboard/>}/>} 

      {tab === 'business' && <InfoPage title="Modello business" kicker="RICAVI" intro="Il cittadino cerca gratis. Il valore economico nasce dalla digitalizzazione, dall’integrazione e dalla gestione del servizio per enti e operatori." cards={[
        ['1 · Integrazione', 'Ricerca federata, feed/API, widget istituzionale e assistenza. Su preventivo.'],
        ['2 · Digitalizzazione', 'Censimento/mappatura iniziale, normalizzazione dati e import storico. Su preventivo.'],
        ['3 · Servizio completo', 'Dashboard, API, sincronizzazioni, monitoraggio qualità dati e supporto continuativo. Su preventivo.']
      ]} extra={<div className="business-note"><b>Componenti di costo possibili</b><p>Numero di cimiteri, qualità dell’archivio iniziale, necessità di mappatura fisica, frequenza degli aggiornamenti, SLA, API e personalizzazioni. Evitiamo di fissare prezzi prima di validare un Comune pilota.</p></div>}/>} 

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

      <footer><div><b>Dove Riposa</b><span>Nome di lavoro · MVP dimostrativo</span></div><p>Solo dati fittizi. Nessun dato reale di defunti è contenuto in questa demo.</p></footer>
    </main>
  );
}

function InfoPage({title, kicker, intro, cards, extra}) {
  return <section className="info-page wrap"><div className="info-hero"><span className="eyebrow">{kicker}</span><h1>{title}</h1><p>{intro}</p></div><div className="info-grid">{cards.map(([t,d]) => <article key={t}><h3>{t}</h3><p>{d}</p></article>)}</div>{extra}</section>
}

function Dashboard(){
  return <div className="dashboard"><div className="dash-head"><div><span className="eyebrow">DASHBOARD DEMO</span><h2>Comune pilota</h2></div><span className="status">● Sincronizzazione OK</span></div><div className="stats"><div><b>12.480</b><span>record importati</span></div><div><b>37</b><span>da verificare</span></div><div><b>4</b><span>cimiteri gestiti</span></div><div><b>99,7%</b><span>campi validi</span></div></div><div className="log"><b>Ultimi aggiornamenti</b><p>09:42 · Import feed completato · 18 record aggiornati</p><p>08:10 · 2 segnalazioni inviate a verifica</p><p>Ieri · Planimetria Settore B aggiornata</p></div></div>
}
