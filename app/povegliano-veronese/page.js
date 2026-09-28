'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

const records = [
  {id:1,nome:'Mario',cognome:'Rossi',anno:'1941',morte:'2024',settore:'Settore B',fila:'Fila 7',posizione:'Loculo 18',mapX:735,mapY:325,route:'M 520 635 L 520 555 L 555 520 L 555 440 L 635 440 L 635 365 L 735 325'},
  {id:2,nome:'Anna',cognome:'Bianchi',anno:'1936',morte:'2022',settore:'Campo A',fila:'Fila 3',posizione:'Tomba 42',mapX:365,mapY:370,route:'M 520 635 L 520 555 L 470 520 L 470 445 L 405 445 L 365 370'},
  {id:3,nome:'Giuseppe',cognome:'Verdi',anno:'1952',morte:'2025',settore:'Campo C',fila:'Fila 11',posizione:'Cippo 9',mapX:650,mapY:505,route:'M 520 635 L 520 570 L 590 570 L 590 525 L 650 505'}
];

function track(event, meta={}) {
  fetch('/api/analytics',{
    method:'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify({event, comune:'povegliano-veronese', ...meta})
  }).catch(()=>{});
}

export default function PoveglianoPage(){
  const [q,setQ]=useState({nome:'',cognome:'',anno:''});
  const [searched,setSearched]=useState(false);
  const [selected,setSelected]=useState(null);
  const [cameraOpen,setCameraOpen]=useState(false);
  const [source,setSource]=useState('');

  useEffect(()=>{
    const p=new URLSearchParams(window.location.search);
    const src=p.get('src')||'direct';
    setSource(src);
    track('page_view',{source:src});
    if(src.startsWith('qr-')) track('qr_entry',{source:src});
  },[]);

  const results=useMemo(()=>{
    const n=s=>s.trim().toLowerCase();
    return records.filter(r=>
      (!n(q.nome)||r.nome.toLowerCase().includes(n(q.nome))) &&
      (!n(q.cognome)||r.cognome.toLowerCase().includes(n(q.cognome))) &&
      (!n(q.anno)||r.anno.includes(n(q.anno))||r.morte.includes(n(q.anno)))
    );
  },[q]);

  function submit(e){
    e.preventDefault();
    setSearched(true);
    setSelected(null);
    track('search',{source});
  }

  function openRecord(r){
    setSelected(r);
    setCameraOpen(false);
    track('result_open',{source});
    setTimeout(()=>document.getElementById('mappa')?.scrollIntoView({behavior:'smooth'}),50);
  }

  return <main>
    <header className="citizen-header">
      <Link href="/" className="citizen-brand"><span className="mark">DR</span><div><strong>Dove Riposa</strong><small>Povegliano Veronese</small></div></Link>
      <nav><a href="#cerca">Cerca</a><a href="#mappa">Mappa</a><a href="#info">Informazioni</a></nav>
    </header>

    <section className="municipality-hero" id="cerca">
      <div>
        <span className="eyebrow">CIMITERO COMUNALE · POVEGLIANO VERONESE</span>
        <h1>Trova una sepoltura.</h1>
        <p>Cerca gratuitamente e senza registrazione. La demo utilizza solo nominativi fittizi.</p>
        {source.startsWith('qr-') && <div className="qr-arrival">Accesso diretto dal QR del cimitero</div>}
      </div>
      <form className="search-card public-search" onSubmit={submit}>
        <label>Nome<input value={q.nome} onChange={e=>setQ({...q,nome:e.target.value})} placeholder="es. Mario"/></label>
        <label>Cognome<input value={q.cognome} onChange={e=>setQ({...q,cognome:e.target.value})} placeholder="es. Rossi"/></label>
        <label>Anno <span>(facoltativo)</span><input value={q.anno} onChange={e=>setQ({...q,anno:e.target.value})} placeholder="es. 1941" inputMode="numeric"/></label>
        <button className="primary" type="submit">Cerca sepoltura</button>
        <p className="micro">Nessun account. Nessuna profilazione. I termini cercati non vengono inviati agli analytics.</p>
      </form>
    </section>

    {searched && <section className="wrap public-results">
      <div className="section-head"><span className="eyebrow">RISULTATI DEMO</span><h2>{results.length} corrispondenze</h2></div>
      <div className="result-grid">
      {results.map(r=><article className="result-card" key={r.id}>
        <div className="person-icon">+</div>
        <div className="result-main"><h3>{r.nome} {r.cognome}</h3><p>{r.anno}–{r.morte}</p><div className="place"><b>{r.settore}</b><span>{r.fila} · {r.posizione}</span></div><div className="source">Dati dimostrativi fittizi</div></div>
        <button className="secondary" onClick={()=>openRecord(r)}>Vedi posizione</button>
      </article>)}
      {results.length===0 && <div className="empty">Nessuna corrispondenza nei dati demo.</div>}
      </div>
    </section>}

    <section className="wrap" id="mappa">
      <div className="section-head"><span className="eyebrow">MAPPA DEL CIMITERO</span><h2>{selected ? `${selected.nome} ${selected.cognome}` : 'Ricostruzione preliminare'}</h2><p>{selected ? `${selected.settore} · ${selected.fila} · ${selected.posizione}` : 'Seleziona un risultato per visualizzare il percorso.'}</p></div>
      <div className="map-card">
        <CemeteryMap selected={selected}/>
        <div className="map-info">
          <span className="eyebrow">NAVIGAZIONE</span>
          <h3>{selected ? 'Raggiungi la sepoltura' : 'Seleziona una sepoltura'}</h3>
          <p>La mappa riproduce la forma del cimitero sulla base della vista satellitare fornita per la demo. Settori e posizioni sono dimostrativi finché il Comune non valida la planimetria ufficiale.</p>
          {selected && <>
            <button className="primary" onClick={()=>{setCameraOpen(true);track('navigation_start',{source,mode:'camera'});}}>Apri navigazione con fotocamera</button>
            <div className="camera-privacy">La fotocamera resta sul dispositivo e non viene registrata né caricata.</div>
          </>}
        </div>
      </div>
    </section>

    {cameraOpen && selected && <CameraNavigator selected={selected} onClose={()=>setCameraOpen(false)}/>}

    <section className="wrap info-cards" id="info">
      <article><h3>Orari e contatti</h3><p>Nella versione reale il Comune potrà pubblicare qui orari, contatti e avvisi del cimitero.</p></article>
      <article><h3>Segnala un errore</h3><p>Previsto un modulo per segnalare posizione o dati da verificare, senza modifiche automatiche all’archivio.</p></article>
      <article><h3>Privacy</h3><p>Ricerca senza registrazione. Gli analytics raccolgono solo eventi tecnici aggregabili, mai il nominativo cercato.</p></article>
    </section>

    <footer><div><b>Dove Riposa</b><span>Povegliano Veronese · demo pilota</span></div><p><Link href="/enti">Area Enti</Link> · Privacy · Accessibilità</p></footer>
  </main>
}

function CameraNavigator({selected,onClose}){
  const videoRef=useRef(null);
  const [error,setError]=useState('');
  useEffect(()=>{
    let stream;
    navigator.mediaDevices?.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false})
      .then(s=>{stream=s;if(videoRef.current){videoRef.current.srcObject=s;videoRef.current.play();}})
      .catch(()=>setError('Impossibile accedere alla fotocamera. Verifica i permessi del browser.'));
    return()=>stream?.getTracks().forEach(t=>t.stop());
  },[]);
  return <div className="camera-modal">
    <video ref={videoRef} playsInline muted/>
    <div className="camera-overlay">
      <button className="camera-close" onClick={onClose}>×</button>
      <div className="camera-top"><b>{selected.nome} {selected.cognome}</b><span>{selected.settore} · {selected.posizione}</span></div>
      <div className="ar-arrow">↑</div>
      <div className="ar-instruction">Procedi lungo il percorso principale</div>
      <div className="ar-distance">circa 35 m · DEMO</div>
      <div className="ar-note">Navigazione AR dimostrativa: in produzione la precisione sarà calibrata con punti QR/marker nel cimitero.</div>
      {error && <div className="camera-error">{error}</div>}
    </div>
  </div>
}

function CemeteryMap({selected}){
  return <div className="cemetery-map-shell">
    <svg className="cemetery-map" viewBox="0 0 1000 700" role="img" aria-label="Ricostruzione dimostrativa del cimitero comunale di Povegliano Veronese">
      <rect width="1000" height="700" className="map-ground"/>
      <path className="map-road" d="M 610 55 C 720 55 830 72 955 118"/>
      <text x="820" y="70" className="map-small-label">Parcheggio zona cimitero</text>
      <rect x="760" y="88" width="165" height="68" rx="16" className="map-parking"/><text x="842" y="128" textAnchor="middle" className="map-parking-label">P</text>
      <g className="cemetery-footprint">
        <path className="map-building" d="M150 92 L390 72 L450 132 L420 190 L242 190 L205 255 L125 220 Z"/>
        <path className="map-building" d="M118 230 L225 260 L205 452 L278 505 L245 585 L105 525 Z"/>
        <path className="map-building" d="M415 105 L530 118 L563 180 L530 268 L470 248 L440 168 Z"/>
        <path className="map-building" d="M610 205 L760 245 L835 360 L810 540 L715 575 L625 520 L662 450 L605 405 Z"/>
        <path className="map-building" d="M520 300 L603 312 L615 520 L555 555 L510 505 Z"/>
        <rect x="235" y="205" width="180" height="112" rx="10" className="map-field field-a"/>
        <rect x="260" y="335" width="145" height="132" rx="10" className="map-field field-b"/>
        <rect x="430" y="280" width="92" height="225" rx="10" className="map-field field-c"/>
        <rect x="625" y="270" width="128" height="110" rx="10" className="map-field field-d"/>
        <rect x="630" y="400" width="145" height="105" rx="10" className="map-field field-e"/>
        <path className="map-walk" d="M520 620 L520 545 L555 510 L555 445 L600 420 L600 350"/><path className="map-walk" d="M520 545 L465 510 L430 455"/><path className="map-walk" d="M555 445 L650 445"/>
      </g>
      <g className="entrance-marker"><circle cx="520" cy="635" r="20"/><text x="520" y="641" textAnchor="middle">↟</text></g>
      <text x="520" y="676" textAnchor="middle" className="map-label">Ingresso demo</text>
      {selected && <><path d={selected.route} className="selected-route"/><g className="selected-pin" transform={`translate(${selected.mapX} ${selected.mapY})`}><circle r="18"/><circle r="7" className="pin-core"/></g></>}
    </svg>
    <div className="map-demo-badge">Ricostruzione da immagine satellitare · da validare con il Comune</div>
  </div>
}
