'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import BrandLockup from '../components/BrandLockup';

const demoRecords=[
  {id:1,nome:'Lucia',cognome:'Ferrari',anno:'1948',morte:'2023',settore:'Settore A',fila:'Fila 4',posizione:'Loculo 12'},
  {id:2,nome:'Carlo',cognome:'Mantovani',anno:'1939',morte:'2021',settore:'Campo B',fila:'Fila 6',posizione:'Tomba 27'},
  {id:3,nome:'Gianna',cognome:'Rossi',anno:'1955',morte:'2025',settore:'Settore C',fila:'Fila 2',posizione:'Loculo 8'}
];

export default function PescantinaPage(){
  const [q,setQ]=useState({nome:'',cognome:'',anno:''});
  const [searched,setSearched]=useState(false);

  const results=useMemo(()=>{
    const n=s=>s.trim().toLowerCase();
    return demoRecords.filter(r=>
      (!n(q.nome)||r.nome.toLowerCase().includes(n(q.nome))) &&
      (!n(q.cognome)||r.cognome.toLowerCase().includes(n(q.cognome))) &&
      (!n(q.anno)||r.anno.includes(n(q.anno))||r.morte.includes(n(q.anno)))
    );
  },[q]);

  return <main>
    <header className="citizen-header">
      <Link href="/pescantina" className="citizen-brand"><BrandLockup subtitle="Pescantina"/></Link>
      <nav><a href="#cerca">Cerca</a><a href="#pilot">Pilot</a><a href="#info">Informazioni</a></nav>
    </header>

    <section className="municipality-hero" id="cerca">
      <div>
        <span className="eyebrow">PESCANTINA · DEMO PILOTA NON UFFICIALE</span>
        <h1>Trova una sepoltura.</h1>
        <p>Versione dimostrativa preparata per valutare un eventuale pilot con il Comune di Pescantina. Non contiene archivi comunali reali né una planimetria ufficiale.</p>
        <div className="hero-badges">
          <span className="offline-badge">Nessuna registrazione cittadino</span>
          <span className="layer-status">Dati demo fittizi</span>
        </div>
      </div>
      <form className="search-card public-search" onSubmit={e=>{e.preventDefault();setSearched(true);}}>
        <label>Nome<input value={q.nome} onChange={e=>setQ({...q,nome:e.target.value})} placeholder="es. Lucia"/></label>
        <label>Cognome<input value={q.cognome} onChange={e=>setQ({...q,cognome:e.target.value})} placeholder="es. Ferrari"/></label>
        <label>Anno <span>(facoltativo)</span><input value={q.anno} onChange={e=>setQ({...q,anno:e.target.value})} placeholder="es. 1948" inputMode="numeric"/></label>
        <button className="primary" type="submit">Cerca sepoltura</button>
        <p className="micro">Demo locale con dati fittizi. I dati reali potranno essere caricati solo dopo accordo con l’ente e verifica privacy. <Link href="/pescantina/privacy">Privacy →</Link></p>
      </form>
    </section>

    {searched && <section className="wrap public-results">
      <div className="section-head"><span className="eyebrow">RISULTATI DEMO</span><h2>{results.length} corrispondenze</h2></div>
      <div className="result-grid">
        {results.map(r=><article className="result-card" key={r.id}>
          <div className="person-icon">+</div>
          <div className="result-main"><h3>{r.nome} {r.cognome}</h3><p>{r.anno}–{r.morte}</p><div className="place"><b>{r.settore}</b><span>{r.fila} · {r.posizione}</span></div><div className="source">Dato dimostrativo fittizio</div></div>
          <span className="status">Mappa da validare</span>
        </article>)}
        {results.length===0&&<div className="empty">Nessuna corrispondenza nei dati demo.</div>}
      </div>
    </section>}

    <section className="wrap" id="pilot">
      <div className="section-head">
        <span className="eyebrow">PILOT READINESS</span>
        <h2>La struttura è pronta. La cartografia reale no.</h2>
        <p>Per Pescantina non mostriamo una mappa inventata: Precision, Accessibility Layer e Live verranno attivati solo su planimetria ufficiale o validata dall’ente.</p>
      </div>
      <div className="info-cards">
        <article><h3>Dove Riposa Precision</h3><p>QR di calibrazione nei punti strategici e percorso fino alla sepoltura. Da configurare dopo rilievo e validazione della mappa.</p></article>
        <article><h3>Accessibility Layer</h3><p>Superficie, pendenza, larghezza, gradini, rampe e punti di sosta. Ogni dato resta “da verificare” finché non viene confermato sul posto.</p></article>
        <article><h3>Dove Riposa Live</h3><p>Chiusure, lavori, accessi temporaneamente non disponibili e deviazioni. Il routing potrà reagire agli eventi pubblicati dagli operatori autorizzati.</p></article>
      </div>
    </section>

    <section className="wrap info-cards" id="info">
      <article><h3>Servizi cimiteriali</h3><p>Il Comune pubblica un ufficio Servizi Cimiteriali dedicato alla gestione delle sepolture, concessioni, registri e assistenza alle famiglie.</p><p><a className="text-link" href="https://www.comune.pescantina.vr.it/amministrazione/unita_organizzativa/servizi-cimiteriali/" target="_blank" rel="noreferrer">Pagina ufficiale del Comune →</a></p></article>
      <article><h3>Gestione operativa</h3><p>Il sito comunale indica Beta Società Cooperativa Sociale per la gestione cimiteriale e Sepulcra Vigilo Srl per le luci votive. Nel pilot reale andrà chiarita la catena di ruoli tra Comune, gestore e fornitore Dove Riposa.</p></article>
      <article><h3>Per partire</h3><p>Servono planimetria ufficiale, archivio autorizzato, referente tecnico/operativo, verifica DPO, accordi privacy e sopralluogo dei percorsi.</p></article>
    </section>

    <section className="wrap">
      <div className="business-note"><b>Stato della proposta</b><p>Pescantina è predisposto nel backend come ente pilot separato. Nessun dato reale è stato caricato e nessun servizio viene presentato come adottato dal Comune.</p></div>
    </section>

    <footer><div className="footer-brand"><BrandLockup compact subtitle="Pescantina · demo pilota"/></div><p><Link href="/pescantina/privacy">Privacy</Link> · <Link href="/pescantina/termini">Termini d’uso</Link> · <Link href="/pescantina/accessibilita">Accessibilità</Link></p></footer>
  </main>;
}
