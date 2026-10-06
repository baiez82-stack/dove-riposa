'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import BrandLockup from '../components/BrandLockup';
import StandardPrecisionNavigator from '../components/StandardPrecisionNavigator';
import { getPrecisionConfig } from '../data/precision';

const markers=getPrecisionConfig('pescantina').markers;

const accessibilitySegments=[
  {id:'A1',label:'Ingresso → nodo centrale',surface:'Da rilevare',slope:'Da rilevare',width:'Da rilevare',rest:false,status:'Da verificare sul posto',path:'M360 470 L360 385'},
  {id:'A2',label:'Nodo centrale → area sinistra',surface:'Da rilevare',slope:'Da rilevare',width:'Da rilevare',rest:false,status:'Da verificare sul posto',path:'M360 385 L282 385 L282 260'},
  {id:'A3',label:'Nodo centrale → area destra',surface:'Da rilevare',slope:'Da rilevare',width:'Da rilevare',rest:false,status:'Da verificare sul posto',path:'M360 385 L438 385 L438 260'},
  {id:'A4',label:'Asse centrale → testata',surface:'Da rilevare',slope:'Da rilevare',width:'Da rilevare',rest:false,status:'Da verificare sul posto',path:'M360 385 L360 105'}
];

const demoRecords=[
  {
    id:1,nome:'Lucia',cognome:'Ferrari',anno:'1948',morte:'2023',settore:'Settore A',fila:'Fila 4',posizione:'Loculo 12',
    mapX:240,mapY:210,
    route:'M360 480 L360 385 L300 385 L300 270 L240 210',
    accessibleRoute:'M360 480 L360 385 L282 385 L282 245 L240 210',
    assistRoute:'M360 480 L360 405 L315 405 L315 305 L270 305 L240 210',
    shortDistance:'Distanza da verificare',accessibleDistance:'Distanza da verificare',assistDistance:'Distanza da verificare',
    instructions:['Vai dritto fino al nodo centrale','Raggiungi il nodo centrale','Svolta verso l’area sinistra','Prosegui fino alla Fila 4','Loculo 12'],
    accessibleInstructions:['Vai dritto lungo l’asse centrale','Mantieni l’asse centrale','Usa il ramo accessibile demo verso sinistra','Prosegui sul percorso da validare','Raggiungi Fila 4 · Loculo 12'],
    assistInstructions:['Vai dritto lungo il percorso più regolare della demo','Procedi lungo il percorso più regolare della demo','Raggiungi il nodo centrale','Prosegui verso l’area sinistra','Raggiungi Fila 4 · Loculo 12']
  },
  {
    id:2,nome:'Carlo',cognome:'Mantovani',anno:'1939',morte:'2021',settore:'Campo B',fila:'Fila 6',posizione:'Tomba 27',
    mapX:500,mapY:245,
    route:'M360 480 L360 385 L430 385 L430 300 L500 245',
    accessibleRoute:'M360 480 L360 385 L438 385 L438 285 L500 245',
    assistRoute:'M360 480 L360 410 L405 410 L405 320 L465 320 L500 245',
    shortDistance:'Distanza da verificare',accessibleDistance:'Distanza da verificare',assistDistance:'Distanza da verificare',
    instructions:['Vai dritto fino al nodo centrale','Raggiungi il nodo centrale','Svolta verso l’area destra','Prosegui fino alla Fila 6','Tomba 27'],
    accessibleInstructions:['Vai dritto lungo l’asse centrale','Mantieni l’asse centrale','Usa il ramo accessibile demo verso destra','Prosegui sul percorso da validare','Raggiungi Fila 6 · Tomba 27'],
    assistInstructions:['Vai dritto lungo il percorso più regolare della demo','Procedi lungo il percorso più regolare della demo','Raggiungi il nodo centrale','Prosegui verso l’area destra','Raggiungi Fila 6 · Tomba 27']
  },
  {
    id:3,nome:'Gianna',cognome:'Rossi',anno:'1955',morte:'2025',settore:'Settore C',fila:'Fila 2',posizione:'Loculo 8',
    mapX:250,mapY:350,
    route:'M360 480 L360 410 L300 410 L250 350',
    accessibleRoute:'M360 480 L360 385 L300 385 L250 350',
    assistRoute:'M360 480 L360 420 L320 420 L320 385 L275 385 L250 350',
    shortDistance:'Distanza da verificare',accessibleDistance:'Distanza da verificare',assistDistance:'Distanza da verificare',
    instructions:['Vai dritto fino al primo passaggio','Prosegui fino al primo passaggio','Svolta verso sinistra','Raggiungi la Fila 2','Loculo 8'],
    accessibleInstructions:['Vai dritto lungo l’asse centrale','Mantieni l’asse centrale fino al nodo','Usa il ramo accessibile demo verso sinistra','Raggiungi la Fila 2','Loculo 8'],
    assistInstructions:['Vai dritto lungo il percorso regolare della demo','Segui il percorso regolare della demo','Raggiungi il nodo centrale','Svolta verso la Fila 2','Loculo 8']
  }
];

export default function PescantinaPage(){
  const [q,setQ]=useState('');
  const [searched,setSearched]=useState(false);
  const [selected,setSelected]=useState(null);
  const [routeMode,setRouteMode]=useState('short');
  const [calibrated,setCalibrated]=useState(null);
  const [cameraOpen,setCameraOpen]=useState(false);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const cal=params.get('cal');
    if(cal && markers[cal]) setCalibrated(markers[cal]);
  },[]);

  const results=useMemo(()=>{
    const terms=q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if(!terms.length) return demoRecords;
    return demoRecords.filter(r=>{
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
    setRouteMode('short');
    setCameraOpen(false);
    setTimeout(()=>document.getElementById('mappa')?.scrollIntoView({behavior:'smooth'}),50);
  }

  function calibrate(marker){
    setCalibrated(marker);
  }

  return <main>
    <header className="citizen-header">
      <Link href="/" className="citizen-brand"><BrandLockup subtitle="Pescantina"/></Link>
      <nav><Link href="/">Cambia Comune</Link><a href="#cerca">Cerca</a><a href="#mappa">Mappa</a></nav>
    </header>

    <section className="municipality-hero" id="cerca">
      <div>
        <span className="eyebrow">PESCANTINA · DEMO</span>
        <h1>Trova una sepoltura.</h1>
        <p>Cerca senza registrazione e prova il percorso fino alla posizione. Nominativi, mappa e indicazioni sono dimostrativi e non sono dati ufficiali del Comune.</p>
      </div>
      <form className="search-card public-search simple-citizen-search" onSubmit={submit}>
        <label className="public-search-main">Nome e cognome
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="es. Lucia Ferrari" autoComplete="off" />
        </label>
        <button className="primary" type="submit">Cerca</button>
        <p className="micro">Puoi scrivere anche solo il cognome. Dati fittizi · nessun account cittadino · <Link href="/pescantina/privacy">Privacy</Link></p>
      </form>
    </section>

    {searched&&<section className="wrap public-results">
      <div className="section-head"><span className="eyebrow">RISULTATI DEMO</span><h2>{results.length} corrispondenze</h2></div>
      <div className="result-grid">
        {results.map(r=><article className="result-card" key={r.id}>
          <div className="person-icon">+</div>
          <div className="result-main">
            <h3>{r.nome} {r.cognome}</h3>
            <p>{r.anno}–{r.morte}</p>
            <div className="place"><b>{r.settore}</b><span>{r.fila} · {r.posizione}</span></div>
            <div className="source">Dato dimostrativo fittizio</div>
          </div>
          <button className="secondary" onClick={()=>openRecord(r)}>Guidami</button>
        </article>)}
        {results.length===0&&<div className="empty">Nessuna corrispondenza nei dati demo.</div>}
      </div>
    </section>}

    {selected&&<section className="wrap" id="mappa">
      <div className="section-head public-route-head">
        <span className="eyebrow">PERCORSO</span>
        <h2>{selected.nome} {selected.cognome}</h2>
        <p>{selected.settore} · {selected.fila} · {selected.posizione}</p>
      </div>

      <div className="map-card">
        <PescantinaMap selected={selected} routeMode={routeMode} calibrated={calibrated}/>
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
          <div className="camera-privacy">Il percorso parte dall’ingresso principale. I QR di posizione confermano un punto fisico certo e permettono di ripartire da lì.</div>
        </div>
      </div>
    </section>}

    {cameraOpen&&selected&&<StandardPrecisionNavigator
      selected={selected}
      routeMode={routeMode}
      calibrated={calibrated}
      markers={markers}
      municipalityLabel="Pescantina"
      onCalibrate={calibrate}
      onClose={()=>setCameraOpen(false)}
    />}

    <footer>
      <div className="footer-brand"><BrandLockup compact subtitle="Pescantina · demo"/></div>
      <p><Link href="/">Cambia Comune</Link> · <Link href="/pescantina/privacy">Privacy</Link> · <Link href="/pescantina/termini">Termini</Link> · <Link href="/pescantina/accessibilita">Accessibilità</Link></p>
    </footer>
  </main>;
}

function PescantinaMap({selected,routeMode,calibrated}){
  const selectedPath=selected
    ? routeMode==='assist'
      ? selected.assistRoute
      : routeMode==='accessible'
        ? selected.accessibleRoute
        : selected.route
    : '';

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
      </g>

      {Object.values(markers).map(m=><g className={calibrated?.id===m.id?'precision-marker active':'precision-marker'} key={m.id}>
        <circle cx={m.x} cy={m.y} r="11"/>
        <text x={m.x+18} y={m.y+5}>{m.id==='ingresso'?'QR ingresso':m.id==='centro'?'QR nodo':'QR testata'}</text>
      </g>)}

      {selected&&<>
        <path d={selectedPath} className={routeMode==='assist'?'selected-route assist-route':routeMode==='accessible'?'selected-route accessible-route':'selected-route'}/>
        <circle cx={selected.mapX} cy={selected.mapY} r="13" className="selected-pin"/>
        <circle cx={selected.mapX} cy={selected.mapY} r="4" className="selected-pin-core"/>
      </>}
    </svg>
    <div className="pescantina-map-legend">
      <span><i className="legend-line"></i> Percorso indicativo</span>
      <span><i className="legend-dot"></i> Nodi QR Precision</span>
    </div>
  </div>;
}
