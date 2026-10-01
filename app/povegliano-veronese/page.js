'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import BrandLockup from '../components/BrandLockup';
import StandardPrecisionNavigator from '../components/StandardPrecisionNavigator';
import { getPrecisionConfig } from '../data/precision';

const markers=getPrecisionConfig('povegliano-veronese').markers;

const accessibilitySegments = [
  {id:'A1',label:'Ingresso → viale centrale',surface:'Da rilevare',slope:'Da rilevare',width:'Da rilevare',stairs:false,ramp:false,rest:false,status:'Da verificare sul posto',confidence:'Demo',path:'M520 620 L520 545'},
  {id:'A2',label:'Viale centrale → area est',surface:'Da rilevare',slope:'Da rilevare',width:'Da rilevare',stairs:false,ramp:false,rest:false,status:'Da verificare sul posto',confidence:'Demo',path:'M555 445 L650 445'},
  {id:'A3',label:'Accesso porticato est',surface:'Da rilevare',slope:'Da rilevare',width:'Da rilevare',stairs:false,ramp:false,rest:false,status:'Da verificare sul posto',confidence:'Demo',path:'M650 445 L700 415 L700 350'},
  {id:'A4',label:'Area ovest',surface:'Da rilevare',slope:'Da rilevare',width:'Da rilevare',stairs:false,ramp:false,rest:false,status:'Da verificare sul posto',confidence:'Demo',path:'M470 510 L405 445 L365 370'},
  {id:'A5',label:'Tratto interno',surface:'Da rilevare',slope:'Da rilevare',width:'Da rilevare',stairs:false,ramp:false,rest:false,status:'Da verificare sul posto',confidence:'Demo',path:'M600 420 L600 350'}
];

const records = [
  {
    id:1,nome:'Mario',cognome:'Rossi',anno:'1941',morte:'2024',settore:'Settore B',fila:'Fila 7',posizione:'Loculo 18',
    mapX:735,mapY:325,
    route:'M 520 635 L 520 555 L 555 520 L 555 440 L 635 440 L 635 365 L 735 325',
    accessibleRoute:'M 520 635 L 520 570 L 590 570 L 590 500 L 650 500 L 650 415 L 700 415 L 700 350 L 735 325',
    shortDistance:'Demo 35 m',accessibleDistance:'Demo 52 m',assistDistance:'Demo 58 m',
    assistRoute:'M 520 635 L 520 590 L 575 590 L 575 545 L 620 545 L 620 470 L 675 470 L 675 390 L 735 325',
    instructions:[
      'Entra dal cancello principale',
      'Prosegui diritto fino all’incrocio centrale',
      'Svolta a destra verso il porticato est',
      'Raggiungi la Fila 7',
      'Loculo 18 sulla destra'
    ],
    accessibleInstructions:[
      'Entra dal cancello principale',
      'Segui il percorso accessibilità demo verso destra',
      'Continua sul tracciato indicato',
      'Raggiungi la Fila 7',
      'Loculo 18 sulla destra'
    ],
    assistInstructions:[
      'Entra dal cancello principale',
      'Segui il percorso assistito demo',
      'Continua sul tracciato indicato',
      'Raggiungi la Fila 7',
      'Loculo 18 sulla destra'
    ]
  },
  {
    id:2,nome:'Anna',cognome:'Bianchi',anno:'1936',morte:'2022',settore:'Campo A',fila:'Fila 3',posizione:'Tomba 42',
    mapX:365,mapY:370,
    route:'M 520 635 L 520 555 L 470 520 L 470 445 L 405 445 L 365 370',
    accessibleRoute:'M 520 635 L 520 570 L 455 570 L 455 510 L 405 510 L 405 430 L 365 370',
    shortDistance:'Demo 31 m',accessibleDistance:'Demo 44 m',assistDistance:'Demo 49 m',
    assistRoute:'M 520 635 L 520 590 L 475 590 L 475 545 L 430 545 L 430 485 L 395 485 L 395 420 L 365 370',
    instructions:[
      'Entra dal cancello principale',
      'Prosegui fino al bivio',
      'Svolta a sinistra verso l’area ovest',
      'Raggiungi la Fila 3',
      'Tomba 42 sul lato interno'
    ],
    accessibleInstructions:[
      'Entra dal cancello principale',
      'Segui il percorso accessibilità demo verso sinistra',
      'Continua sul tracciato indicato',
      'Raggiungi la Fila 3',
      'Tomba 42 sul lato interno'
    ],
    assistInstructions:[
      'Entra dal cancello principale',
      'Segui il percorso assistito demo verso sinistra',
      'Continua sul tracciato indicato',
      'Raggiungi la Fila 3',
      'Tomba 42 sul lato interno'
    ]
  },
  {
    id:3,nome:'Giuseppe',cognome:'Verdi',anno:'1952',morte:'2025',settore:'Campo C',fila:'Fila 11',posizione:'Cippo 9',
    mapX:650,mapY:505,
    route:'M 520 635 L 520 570 L 590 570 L 590 525 L 650 505',
    accessibleRoute:'M 520 635 L 520 590 L 610 590 L 610 540 L 650 505',
    shortDistance:'Demo 24 m',accessibleDistance:'Demo 29 m',assistDistance:'Demo 34 m',
    assistRoute:'M 520 635 L 520 595 L 575 595 L 575 555 L 620 555 L 620 525 L 650 505',
    instructions:[
      'Entra dal cancello principale',
      'Mantieni il viale centrale',
      'Svolta a destra al secondo passaggio',
      'Raggiungi la Fila 11',
      'Cippo 9 davanti a te'
    ],
    accessibleInstructions:[
      'Entra dal cancello principale',
      'Segui il percorso accessibilità demo centrale',
      'Continua sul tracciato indicato',
      'Raggiungi la Fila 11',
      'Cippo 9 davanti a te'
    ],
    assistInstructions:[
      'Entra dal cancello principale',
      'Segui il percorso assistito demo centrale',
      'Continua sul tracciato indicato',
      'Raggiungi la Fila 11',
      'Cippo 9 davanti a te'
    ]
  }
];

export default function PoveglianoPage(){
  const [q,setQ]=useState('');
  const [searched,setSearched]=useState(false);
  const [selected,setSelected]=useState(null);
  const [cameraOpen,setCameraOpen]=useState(false);
  const [source,setSource]=useState('');
  const [routeMode,setRouteMode]=useState('short');
  const [calibrated,setCalibrated]=useState(null);
  const [liveDemo,setLiveDemo]=useState(false);

  useEffect(()=>{
    const p=new URLSearchParams(window.location.search);
    const src=p.get('src')||'direct';
    const cal=p.get('cal');
    setLiveDemo(p.get('live')==='1');
    setSource(src);
    if(cal && markers[cal]) setCalibrated(markers[cal]);
  },[]);

  const results=useMemo(()=>{
    const terms=q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if(!terms.length) return records;
    return records.filter(r=>{
      const haystack=`${r.nome} ${r.cognome} ${r.anno} ${r.morte}`.toLowerCase();
      return terms.every(term=>haystack.includes(term));
    });
  },[q]);

  function submit(e){
    e.preventDefault();
    setSearched(true);
    setSelected(null);
  }

  function openRecord(r){
    setSelected(r);
    setCameraOpen(false);
    setRouteMode('short');
    setTimeout(()=>document.getElementById('mappa')?.scrollIntoView({behavior:'smooth'}),50);
  }

  function calibrate(marker){
    setCalibrated(marker);
  }

  const precisionSelected=selected&&liveDemo&&routeMode==='short'
    ? {...selected,instructions:selected.accessibleInstructions,shortDistance:selected.accessibleDistance}
    : selected;

  return <main>
    <header className="citizen-header">
      <Link href="/povegliano-veronese" className="citizen-brand"><BrandLockup subtitle="Povegliano Veronese"/></Link>
      <nav><Link href="/">Cambia Comune</Link><a href="#cerca">Cerca</a><a href="#mappa">Mappa</a></nav>
    </header>

    <section className="municipality-hero" id="cerca">
      <div>
        <span className="eyebrow">CIMITERO COMUNALE · POVEGLIANO VERONESE</span>
        <h1>Trova una sepoltura.</h1>
        <p>Cerca gratuitamente e senza registrazione. Questa è una demo indipendente non ancora adottata dal Comune e utilizza nominativi dimostrativi.</p>
        <div className="hero-badges">
          {source.startsWith('qr-') && <span className="qr-arrival">Accesso diretto dal QR del cimitero</span>}
          {calibrated && source.startsWith('qr-') && <span className="offline-badge">Riferimento QR acquisito: {calibrated.label}</span>}
        </div>
      </div>
      <form className="search-card public-search simple-citizen-search" onSubmit={submit}>
        <label className="public-search-main">Nome e cognome
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="es. Mario Rossi" autoComplete="off" />
        </label>
        <button className="primary" type="submit">Cerca</button>
        <p className="micro">Puoi scrivere anche solo il cognome. Nessun account. Nessuna profilazione. <Link href="/povegliano-veronese/privacy">Privacy</Link></p>
      </form>
    </section>

    {liveDemo && <section className="wrap live-public-wrap"><div className="live-public-alert"><div><span className="live-dot"></span><b>Dove Riposa Live · evento demo</b></div><h3>Passaggio est temporaneamente chiuso</h3><p>Lavori in corso fino alle 13:00. I percorsi che attraversano il porticato est vengono deviati sul viale centrale.</p><button className="secondary" onClick={()=>setLiveDemo(false)}>Nascondi simulazione</button></div></section>}

    {searched && <section className="wrap public-results">
      <div className="section-head"><span className="eyebrow">RISULTATI DEMO</span><h2>{results.length} corrispondenze</h2></div>
      <div className="result-grid">
      {results.map(r=><article className="result-card" key={r.id}>
        <div className="person-icon">+</div>
        <div className="result-main"><h3>{r.nome} {r.cognome}</h3><p>{r.anno}–{r.morte}</p><div className="place"><b>{r.settore}</b><span>{r.fila} · {r.posizione}</span></div><div className="source">Dati dimostrativi fittizi</div></div>
        <button className="secondary" onClick={()=>openRecord(r)}>Guidami</button>
      </article>)}
      {results.length===0 && <div className="empty">Nessuna corrispondenza nei dati demo.</div>}
      </div>
    </section>}

    {selected&&<section className="wrap" id="mappa">
      <div className="section-head public-route-head">
        <span className="eyebrow">PERCORSO</span>
        <h2>{selected.nome} {selected.cognome}</h2>
        <p>{selected.settore} · {selected.fila} · {selected.posizione}</p>
      </div>
      <div className="map-card">
        <CemeteryMap selected={selected} routeMode={routeMode} calibrated={calibrated} liveDemo={liveDemo}/>
        <div className="map-info citizen-route-panel">
          <span className="eyebrow">IL TUO PERCORSO</span>
          <h3>Pronto a partire</h3>
          <p>Ti guidiamo dall’ingresso fino a <b>{selected.settore} · {selected.fila} · {selected.posizione}</b>, un passaggio alla volta.</p>
          <div className="simple-destination">
            <span>Destinazione</span>
            <b>{selected.nome} {selected.cognome}</b>
            <small>{selected.settore} · {selected.fila} · {selected.posizione}</small>
          </div>
          <div className="public-access-note">Le informazioni dettagliate sull’accessibilità non sono ancora verificate sul posto in questa demo.</div>
          <button className="primary precision-button citizen-start-button" onClick={()=>setCameraOpen(true)}>Inizia il percorso</button>
          <div className="camera-privacy">Puoi seguire le indicazioni senza fotocamera. Se vuoi migliorare la precisione, potrai scansionare un QR lungo il percorso.</div>
        </div>
      </div>
    </section>}

    {cameraOpen && precisionSelected && <StandardPrecisionNavigator
      selected={precisionSelected}
      routeMode={routeMode}
      calibrated={calibrated}
      markers={markers}
      municipalityLabel="Povegliano Veronese"
      onCalibrate={calibrate}
      onClose={()=>setCameraOpen(false)}
      liveNotice={liveDemo?'Percorso ricalcolato per chiusura temporanea':''}
    />}

    <footer><div className="footer-brand"><BrandLockup compact subtitle="Povegliano Veronese · demo pilota"/></div><p><Link href="/povegliano-veronese/privacy">Privacy</Link> · <Link href="/povegliano-veronese/termini">Termini d’uso</Link> · <Link href="/povegliano-veronese/accessibilita">Accessibilità</Link></p></footer>
  </main>
}

function CemeteryMap({selected,routeMode,calibrated,liveDemo}){
  const standardPath=selected ? (routeMode==='assist'?selected.assistRoute:(routeMode==='accessible'?selected.accessibleRoute:selected.route)) : '';
  const path=selected && liveDemo && routeMode==='short' ? selected.accessibleRoute : standardPath;
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
        <path className="map-walk" d="M520 620 L520 545 L555 510 L555 445 L600 420 L600 350"/>
        <path className="map-walk" d="M520 545 L465 510 L430 455"/>
        <path className="map-walk" d="M555 445 L650 445"/>
        {liveDemo && <path d="M555 445 L650 445" className="live-blocked-segment"/>}
      </g>

      {Object.values(markers).map(m=><g className={calibrated?.id===m.id?'precision-marker active':'precision-marker'} key={m.id} transform={`translate(${m.x} ${m.y})`}>
        <rect x="-17" y="-17" width="34" height="34" rx="7"/>
        <text textAnchor="middle" y="5">QR</text>
      </g>)}

      <g className="entrance-marker"><circle cx="520" cy="635" r="20"/><text x="520" y="641" textAnchor="middle">↟</text></g>
      <text x="520" y="676" textAnchor="middle" className="map-label">Ingresso demo</text>

      {selected && <>
        <path d={path} className={routeMode==='assist'?'selected-route assist-route':(routeMode==='accessible'?'selected-route accessible-route':'selected-route')}/>
        <g className="selected-pin" transform={`translate(${selected.mapX} ${selected.mapY})`}><circle r="18"/><circle r="7" className="pin-core"/></g>
      </>}
    </svg>
    <div className="map-demo-badge">{liveDemo?'Live demo: deviazione attiva · ':''}Ricostruzione demo · marker e percorsi da validare con il Comune</div>
  </div>
}
