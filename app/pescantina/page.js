'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import BrandLockup from '../components/BrandLockup';

const demoRecords=[
  {id:1,nome:'Lucia',cognome:'Ferrari',anno:'1948',morte:'2023',settore:'Settore A',fila:'Fila 4',posizione:'Loculo 12',mapX:240,mapY:210,route:'M360 480 L360 385 L300 385 L300 270 L240 210'},
  {id:2,nome:'Carlo',cognome:'Mantovani',anno:'1939',morte:'2021',settore:'Campo B',fila:'Fila 6',posizione:'Tomba 27',mapX:500,mapY:245,route:'M360 480 L360 385 L430 385 L430 300 L500 245'},
  {id:3,nome:'Gianna',cognome:'Rossi',anno:'1955',morte:'2025',settore:'Settore C',fila:'Fila 2',posizione:'Loculo 8',mapX:250,mapY:350,route:'M360 480 L360 410 L300 410 L250 350'}
];

export default function PescantinaPage(){
  const [q,setQ]=useState({nome:'',cognome:'',anno:''});
  const [searched,setSearched]=useState(false);
  const [selected,setSelected]=useState(null);

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
          <button className="secondary" onClick={()=>{setSelected(r);setTimeout(()=>document.getElementById('mappa-pescantina')?.scrollIntoView({behavior:'smooth'}),50);}}>Vedi posizione demo</button>
        </article>)}
        {results.length===0&&<div className="empty">Nessuna corrispondenza nei dati demo.</div>}
      </div>
    </section>}

    <section className="wrap" id="mappa-pescantina">
      <div className="section-head">
        <span className="eyebrow">RICOSTRUZIONE PRELIMINARE · NON UFFICIALE</span>
        <h2>{selected ? `${selected.nome} ${selected.cognome}` : 'Schema del cimitero da immagine satellitare'}</h2>
        <p>Schema vettoriale ricostruito dalla schermata satellitare fornita per la demo. Serve solo a impostare il prodotto: settori, percorsi e misure dovranno essere sostituiti o validati con planimetria e sopralluogo dell’ente.</p>
      </div>
      <PescantinaMap selected={selected}/>
      <div className="map-demo-badge">Riferimento visivo demo · non è una planimetria comunale · orientamento e proporzioni da verificare</div>
    </section>

    <section className="wrap" id="pilot">
      <div className="section-head">
        <span className="eyebrow">PILOT READINESS</span>
        <h2>Ora abbiamo una base visiva, non ancora una cartografia ufficiale.</h2>
        <p>La schermata satellitare ci permette di predisporre il layout e i punti di calibrazione. Precision, Accessibility Layer e Live potranno diventare operativi solo dopo planimetria ufficiale o validazione sul posto.</p>
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

function PescantinaMap({selected}){
  return <div className="pescantina-map-card">
    <svg className="pescantina-map" viewBox="0 0 720 540" role="img" aria-label="Ricostruzione vettoriale dimostrativa del cimitero di Pescantina">
      <rect x="118" y="55" width="484" height="405" rx="10" className="cem-boundary"/>
      <rect x="138" y="76" width="163" height="292" rx="4" className="cem-zone dense"/>
      <rect x="420" y="76" width="162" height="292" rx="4" className="cem-zone open"/>
      <rect x="310" y="78" width="100" height="260" rx="5" className="cem-building"/>
      <rect x="315" y="405" width="90" height="48" rx="4" className="cem-building entrance"/>
      <rect x="136" y="387" width="148" height="58" rx="4" className="cem-building low"/>
      <rect x="436" y="387" width="148" height="58" rx="4" className="cem-building low"/>
      <path d="M360 480 L360 338" className="cem-path main"/>
      <path d="M360 385 L282 385 L282 130" className="cem-path"/>
      <path d="M360 385 L438 385 L438 130" className="cem-path"/>
      <path d="M138 370 L300 370" className="cem-path minor"/>
      <path d="M420 370 L582 370" className="cem-path minor"/>

      {Array.from({length:7}).map((_,i)=><line key={'l'+i} x1="160" y1={110+i*34} x2="278" y2={110+i*34} className="grave-row"/>)}
      {Array.from({length:4}).map((_,i)=><rect key={'r'+i} x={455+(i%2)*60} y={120+Math.floor(i/2)*95} width="34" height="64" rx="3" className="grave-block"/>)}

      <g className="map-label">
        <text x="220" y="95" textAnchor="middle">Area sinistra · demo</text>
        <text x="500" y="95" textAnchor="middle">Area destra · demo</text>
        <text x="360" y="205" textAnchor="middle">Asse centrale</text>
        <text x="360" y="505" textAnchor="middle">Ingresso principale · demo</text>
      </g>

      <g className="precision-marker demo"><circle cx="360" cy="470" r="11"/><text x="378" y="475">QR ingresso</text></g>
      <g className="precision-marker demo"><circle cx="360" cy="385" r="11"/><text x="378" y="390">QR nodo centrale</text></g>
      <g className="precision-marker demo"><circle cx="360" cy="105" r="11"/><text x="378" y="110">QR testata</text></g>

      {selected && <>
        <path d={selected.route} className="selected-route"/>
        <circle cx={selected.mapX} cy={selected.mapY} r="13" className="selected-pin"/>
        <circle cx={selected.mapX} cy={selected.mapY} r="4" className="selected-pin-core"/>
      </>}
    </svg>
    <div className="pescantina-map-legend">
      <span><i className="legend-box building"></i> Strutture visibili</span>
      <span><i className="legend-line"></i> Percorsi ipotizzati</span>
      <span><i className="legend-dot"></i> Marker Precision proposti</span>
    </div>
  </div>;
}
