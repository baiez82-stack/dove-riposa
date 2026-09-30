'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import BrandLockup from '../components/BrandLockup';

const markers = {
  ingresso:{id:'ingresso',code:'DR-PV-ING',label:'Ingresso principale',x:520,y:635},
  centro:{id:'centro',code:'DR-PV-CEN',label:'Incrocio centrale',x:555,y:445},
  est:{id:'est',code:'DR-PV-EST',label:'Porticato est',x:635,y:365},
  ovest:{id:'ovest',code:'DR-PV-OVEST',label:'Area ovest',x:405,y:445}
};

const accessibilitySegments = [
  {id:'A1',label:'Ingresso → viale centrale',surface:'Pavimentato',slope:'2%',width:'2,4 m',stairs:false,ramp:false,rest:true,status:'Da verificare sul posto',confidence:'Cartografia + demo',path:'M520 620 L520 545'},
  {id:'A2',label:'Viale centrale → area est',surface:'Ghiaia compatta',slope:'4%',width:'1,8 m',stairs:false,ramp:false,rest:true,status:'Da verificare sul posto',confidence:'Immagini + demo',path:'M555 445 L650 445'},
  {id:'A3',label:'Accesso porticato est',surface:'Pavimentato',slope:'6%',width:'1,4 m',stairs:false,ramp:true,rest:false,status:'Da verificare sul posto',confidence:'Ipotesi demo',path:'M650 445 L700 415 L700 350'},
  {id:'A4',label:'Area ovest',surface:'Ghiaia',slope:'3%',width:'1,5 m',stairs:false,ramp:false,rest:false,status:'Da verificare sul posto',confidence:'Immagini + demo',path:'M470 510 L405 445 L365 370'},
  {id:'A5',label:'Scalinata interna',surface:'Pietra',slope:'—',width:'1,2 m',stairs:true,ramp:false,rest:false,status:'Non accessibile in carrozzina',confidence:'Demo',path:'M600 420 L600 350'}
];

const records = [
  {
    id:1,nome:'Mario',cognome:'Rossi',anno:'1941',morte:'2024',settore:'Settore B',fila:'Fila 7',posizione:'Loculo 18',
    mapX:735,mapY:325,
    route:'M 520 635 L 520 555 L 555 520 L 555 440 L 635 440 L 635 365 L 735 325',
    accessibleRoute:'M 520 635 L 520 570 L 590 570 L 590 500 L 650 500 L 650 415 L 700 415 L 700 350 L 735 325',
    shortDistance:'35 m',accessibleDistance:'52 m',assistDistance:'58 m',
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
      'Segui il percorso pavimentato verso destra',
      'Continua lungo il corridoio est evitando i gradini',
      'Rientra verso la Fila 7 dalla rampa',
      'Loculo 18 sulla destra'
    ],
    assistInstructions:[
      'Entra dal cancello principale e mantieni il viale largo',
      'Raggiungi la panchina centrale: qui puoi fare una pausa',
      'Prosegui sul tratto pavimentato a bassa pendenza',
      'Supera la fontanella e continua verso il porticato est',
      'Raggiungi la Fila 7',
      'Loculo 18 sulla destra'
    ]
  },
  {
    id:2,nome:'Anna',cognome:'Bianchi',anno:'1936',morte:'2022',settore:'Campo A',fila:'Fila 3',posizione:'Tomba 42',
    mapX:365,mapY:370,
    route:'M 520 635 L 520 555 L 470 520 L 470 445 L 405 445 L 365 370',
    accessibleRoute:'M 520 635 L 520 570 L 455 570 L 455 510 L 405 510 L 405 430 L 365 370',
    shortDistance:'31 m',accessibleDistance:'44 m',assistDistance:'49 m',
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
      'Segui il percorso pavimentato verso sinistra',
      'Mantieni il corridoio largo fino all’area ovest',
      'Raggiungi la Fila 3 senza utilizzare gradini',
      'Tomba 42 sul lato interno'
    ],
    assistInstructions:[
      'Entra dal cancello principale e mantieni il viale largo',
      'Raggiungi la panchina centrale per una pausa se necessario',
      'Prosegui verso sinistra sul percorso più regolare',
      'Evita il tratto in ghiaia indicato sulla mappa',
      'Raggiungi la Fila 3',
      'Tomba 42 sul lato interno'
    ]
  },
  {
    id:3,nome:'Giuseppe',cognome:'Verdi',anno:'1952',morte:'2025',settore:'Campo C',fila:'Fila 11',posizione:'Cippo 9',
    mapX:650,mapY:505,
    route:'M 520 635 L 520 570 L 590 570 L 590 525 L 650 505',
    accessibleRoute:'M 520 635 L 520 590 L 610 590 L 610 540 L 650 505',
    shortDistance:'24 m',accessibleDistance:'29 m',assistDistance:'34 m',
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
      'Mantieni il percorso pavimentato centrale',
      'Prosegui fino al passaggio largo',
      'Raggiungi la Fila 11',
      'Cippo 9 davanti a te'
    ],
    assistInstructions:[
      'Entra dal cancello principale e procedi lentamente sul viale centrale',
      'Raggiungi la panchina e fai una pausa se necessario',
      'Continua sul percorso pavimentato',
      'Svolta a destra al passaggio largo',
      'Raggiungi la Fila 11',
      'Cippo 9 davanti a te'
    ]
  }
];

function track(event, meta={}) {
  fetch('/api/analytics',{
    method:'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify({event, comune:'povegliano-veronese', ...meta})
  }).catch(()=>{});
}

function markerFromValue(value){
  const raw=String(value||'');
  const direct=Object.values(markers).find(m=>m.code===raw.trim().toUpperCase());
  if(direct) return direct;
  try{
    const url=new URL(raw, window.location.origin);
    const id=url.searchParams.get('cal');
    if(id && markers[id]) return markers[id];
  }catch{}
  return null;
}

export default function PoveglianoPage(){
  const [q,setQ]=useState({nome:'',cognome:'',anno:''});
  const [searched,setSearched]=useState(false);
  const [selected,setSelected]=useState(null);
  const [cameraOpen,setCameraOpen]=useState(false);
  const [source,setSource]=useState('');
  const [routeMode,setRouteMode]=useState('short');
  const [calibrated,setCalibrated]=useState(null);
  const [offlineReady,setOfflineReady]=useState(false);
  const [liveDemo,setLiveDemo]=useState(false);

  useEffect(()=>{
    const p=new URLSearchParams(window.location.search);
    const src=p.get('src')||'direct';
    const cal=p.get('cal');
    setLiveDemo(p.get('live')==='1');
    setSource(src);
    if(cal && markers[cal]) setCalibrated(markers[cal]);
    track('page_view',{source:src});
    if(src.startsWith('qr-')) track('qr_entry',{source:src});

    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('/sw.js').then(()=>setOfflineReady(true)).catch(()=>{});
    }
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
    setCalibrated(markers.ingresso);
    setRouteMode('short');
    track('result_open',{source});
    setTimeout(()=>document.getElementById('mappa')?.scrollIntoView({behavior:'smooth'}),50);
  }

  function calibrate(marker){
    setCalibrated(marker);
    track('navigation_start',{source,mode:'precision'});
  }

  return <main>
    <header className="citizen-header">
      <Link href="/povegliano-veronese" className="citizen-brand"><BrandLockup subtitle="Povegliano Veronese"/></Link>
      <nav><a href="#cerca">Cerca</a><a href="#mappa">Mappa</a><a href="#info">Informazioni</a></nav>
    </header>

    <section className="municipality-hero" id="cerca">
      <div>
        <span className="eyebrow">CIMITERO COMUNALE · POVEGLIANO VERONESE</span>
        <h1>Trova una sepoltura.</h1>
        <p>Cerca gratuitamente e senza registrazione. Questa è una demo indipendente non ancora adottata dal Comune e utilizza nominativi dimostrativi.</p>
        <div className="hero-badges">
          {source.startsWith('qr-') && <span className="qr-arrival">Accesso diretto dal QR del cimitero</span>}
          {offlineReady && <span className="offline-badge">Disponibile offline dopo la prima apertura</span>}
        </div>
      </div>
      <form className="search-card public-search" onSubmit={submit}>
        <label>Nome<input value={q.nome} onChange={e=>setQ({...q,nome:e.target.value})} placeholder="es. Mario"/></label>
        <label>Cognome<input value={q.cognome} onChange={e=>setQ({...q,cognome:e.target.value})} placeholder="es. Rossi"/></label>
        <label>Anno <span>(facoltativo)</span><input value={q.anno} onChange={e=>setQ({...q,anno:e.target.value})} placeholder="es. 1941" inputMode="numeric"/></label>
        <button className="primary" type="submit">Cerca sepoltura</button>
        <p className="micro">Nessun account. Nessuna profilazione. I termini cercati non vengono inviati agli analytics. <Link href="/povegliano-veronese/privacy">Come proteggiamo i dati →</Link></p>
      </form>
    </section>

    {liveDemo && <section className="wrap live-public-wrap"><div className="live-public-alert"><div><span className="live-dot"></span><b>Dove Riposa Live · evento demo</b></div><h3>Passaggio est temporaneamente chiuso</h3><p>Lavori in corso fino alle 13:00. I percorsi che attraversano il porticato est vengono deviati sul viale centrale.</p><button className="secondary" onClick={()=>setLiveDemo(false)}>Nascondi simulazione</button></div></section>}

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
      <div className="section-head">
        <span className="eyebrow">DOVE RIPOSA PRECISION · DEMO</span>
        <h2>{selected ? `${selected.nome} ${selected.cognome}` : 'Ricostruzione preliminare'}</h2>
        <p>{selected ? `${selected.settore} · ${selected.fila} · ${selected.posizione}` : 'Seleziona un risultato per provare la navigazione di precisione.'}</p>
      </div>
      <div className="map-card">
        <CemeteryMap selected={selected} routeMode={routeMode} calibrated={calibrated} liveDemo={liveDemo}/>
        <div className="map-info">
          <span className="eyebrow">PRECISION NAVIGATION</span>
          <h3>{selected ? 'Dall’ingresso fino al loculo' : 'Seleziona una sepoltura'}</h3>
          <p>La posizione viene ricalibrata nei punti chiave tramite QR/marker. Questo riduce la dipendenza dal GPS nell’ultimo tratto e consente di guidare l’utente fino a fila e loculo.</p>

          {selected && <>
            <div className="route-mode">
              <button className={routeMode==='short'?'active':''} onClick={()=>setRouteMode('short')}>Più breve <small>{selected.shortDistance}</small></button>
              <button className={routeMode==='accessible'?'active':''} onClick={()=>setRouteMode('accessible')}>Accessibile ♿ <small>{selected.accessibleDistance}</small></button>
              <button className={routeMode==='assist'?'active':''} onClick={()=>setRouteMode('assist')}>Assistito ♥ <small>{selected.assistDistance}</small></button>
            </div>
            {routeMode==='assist' && <div className="assist-note"><b>Dove Riposa Assist</b><span>Priorità a percorso regolare, minore pendenza e punti di sosta. Nessun profilo personale viene salvato.</span></div>}

            <div className={calibrated?'calibration-card calibrated':'calibration-card'}>
              <div><b>{calibrated ? 'Posizione calibrata' : 'Calibrazione necessaria'}</b><span>{calibrated ? calibrated.label : 'Scansiona un marker Dove Riposa vicino a te'}</span></div>
              <span className="calibration-status">{calibrated?'✓':'QR'}</span>
            </div>

            <button className="primary precision-button" onClick={()=>{setCameraOpen(true);track('navigation_start',{source,mode:'camera'});}}>Apri Dove Riposa Precision</button>
            <div className="demo-calibration">
              <span>Demo marker:</span>
              {Object.values(markers).slice(0,3).map(m=><button key={m.id} onClick={()=>calibrate(m)}>{m.label}</button>)}
            </div>
            <div className="camera-privacy">La fotocamera resta sul dispositivo e non viene registrata né caricata. I QR di calibrazione identificano un punto del cimitero, non l’utente.</div>
          </>}
        </div>
      </div>

      <div className="accessibility-layer">
        <div className="accessibility-layer-head">
          <div><span className="eyebrow">ACCESSIBILITY LAYER</span><h3>Condizioni reali del percorso</h3></div>
          <span className="layer-status">Demo · da validare</span>
        </div>
        <p>Ogni tratto può contenere superficie, pendenza, larghezza, rampe, gradini e punti di sosta. I dati mostrati qui sono dimostrativi: nella versione reale vengono precompilati da cartografia/immagini e poi confermati con sopralluogo.</p>
        <div className="accessibility-segment-grid">
          {accessibilitySegments.slice(0,4).map(s=><div className="accessibility-segment-card" key={s.id}>
            <div className="segment-top"><b>{s.label}</b><span>{s.id}</span></div>
            <div className="segment-tags"><span>{s.surface}</span><span>Pendenza {s.slope}</span><span>{s.width}</span>{s.ramp&&<span>Rampa</span>}{s.stairs&&<span>Gradini</span>}{s.rest&&<span>Punto sosta</span>}</div>
            <small>{s.status} · {s.confidence}</small>
          </div>)}
        </div>
      </div>
    </section>

    {cameraOpen && selected && <PrecisionNavigator
      selected={selected}
      routeMode={routeMode}
      calibrated={calibrated}
      onCalibrate={calibrate}
      onClose={()=>setCameraOpen(false)}
    />}

    <section className="wrap precision-features">
      <div className="section-head"><span className="eyebrow">PERCHÉ PRECISION</span><h2>Non solo “sei nel settore giusto”.</h2></div>
      <div className="info-cards">
        <article><h3>QR di calibrazione</h3><p>I marker posizionati solo nei punti strategici dicono al sistema dove si trova esattamente l’utente, senza mettere un QR su ogni tomba.</p></article>
        <article><h3>Dove Riposa Assist</h3><p>Oltre al percorso accessibile, la modalità assistita può privilegiare pendenze ridotte, fondo regolare, panchine, fontanelle e punti di sosta per chi ha poca autonomia.</p></article>
        <article><h3>Continuità offline</h3><p>Dopo la prima apertura, la demo conserva localmente le risorse essenziali della web app per continuare a funzionare anche con segnale debole.</p></article>
      </div>
    </section>

    <section className="wrap info-cards" id="info">
      <article><h3>Orari e contatti</h3><p>Nella versione reale il Comune potrà pubblicare qui orari, contatti e avvisi del cimitero.</p></article>
      <article><h3>Segnala un errore</h3><p>Previsto un modulo per segnalare posizione o dati da verificare, senza modifiche automatiche all’archivio.</p></article>
      <article><h3>Privacy</h3><p>Ricerca senza registrazione, nessun profilo commemorativo e analytics minimizzati.</p><Link className="text-link" href="/povegliano-veronese/privacy">Privacy e trasparenza →</Link></article>
    </section>

    <footer><div className="footer-brand"><BrandLockup compact subtitle="Povegliano Veronese · demo pilota"/></div><p><Link href="/povegliano-veronese/privacy">Privacy</Link> · <Link href="/povegliano-veronese/termini">Termini d’uso</Link> · <Link href="/povegliano-veronese/accessibilita">Accessibilità</Link></p></footer>
  </main>
}

function PrecisionNavigator({selected,routeMode,calibrated,onCalibrate,onClose}){
  const videoRef=useRef(null);
  const detectorRef=useRef(null);
  const [error,setError]=useState('');
  const [scanInfo,setScanInfo]=useState('');
  const [step,setStep]=useState(0);
  const instructions=routeMode==='assist'?selected.assistInstructions:(routeMode==='accessible'?selected.accessibleInstructions:selected.instructions);
  const distance=routeMode==='assist'?selected.assistDistance:(routeMode==='accessible'?selected.accessibleDistance:selected.shortDistance);
  const modeLabel=routeMode==='assist'?'Percorso assistito ♥':(routeMode==='accessible'?'Percorso accessibile ♿':'Percorso più breve');

  function speak(){
    if(!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(instructions[step]);
    utterance.lang='it-IT';
    utterance.rate=.88;
    window.speechSynthesis.speak(utterance);
  }

  useEffect(()=>{
    let stream;
    let timer;
    navigator.mediaDevices?.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false})
      .then(async s=>{
        stream=s;
        if(videoRef.current){videoRef.current.srcObject=s;await videoRef.current.play();}
        if('BarcodeDetector' in window){
          detectorRef.current=new window.BarcodeDetector({formats:['qr_code']});
          timer=setInterval(async()=>{
            if(!videoRef.current||videoRef.current.readyState<2)return;
            try{
              const found=await detectorRef.current.detect(videoRef.current);
              const marker=markerFromValue(found?.[0]?.rawValue);
              if(marker){
                onCalibrate(marker);
                setScanInfo('Marker riconosciuto: '+marker.label);
              }
            }catch{}
          },900);
        }else{
          setScanInfo('Scansione QR automatica non supportata da questo browser: usa i marker demo qui sotto.');
        }
      })
      .catch(()=>setError('Impossibile accedere alla fotocamera. Verifica i permessi del browser.'));
    return()=>{clearInterval(timer);stream?.getTracks().forEach(t=>t.stop());};
  },[onCalibrate]);

  return <div className="camera-modal precision-modal">
    <video ref={videoRef} playsInline muted/>
    <div className="camera-overlay">
      <button className="camera-close" onClick={onClose}>×</button>
      <div className="camera-top"><b>Dove Riposa Precision</b><span>{selected.nome} {selected.cognome} · {selected.settore} · {selected.posizione}</span></div>

      <div className="precision-cal-chip">{calibrated ? '✓ '+calibrated.label : 'Inquadra un QR di calibrazione'}</div>
      <div className="ar-arrow">{step>=instructions.length-1?'●':'↑'}</div>
      <div className="ar-instruction">{instructions[step]}</div>
      <div className="ar-distance">{modeLabel} · {distance}</div>
      <button className="voice-guide" onClick={speak}>🔊 Leggi indicazione</button>

      <div className="step-progress">{instructions.map((_,i)=><span key={i} className={i<=step?'done':''}></span>)}</div>
      <div className="precision-controls">
        <button disabled={step===0} onClick={()=>setStep(Math.max(0,step-1))}>← Indietro</button>
        <button disabled={step===instructions.length-1} onClick={()=>setStep(Math.min(instructions.length-1,step+1))}>Prossima indicazione →</button>
      </div>

      <div className="marker-fallback">
        <span>Calibrazione demo</span>
        {Object.values(markers).slice(0,3).map(m=><button key={m.id} onClick={()=>{onCalibrate(m);setScanInfo('Marker demo: '+m.label);}}>{m.code}</button>)}
      </div>

      {scanInfo && <div className="scan-info">{scanInfo}</div>}
      <div className="ar-note">Demo tecnica: le indicazioni diventano operative solo dopo rilievo e validazione della planimetria ufficiale e dei marker fisici.</div>
      {error && <div className="camera-error">{error}</div>}
    </div>
  </div>
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
        <g className="accessibility-overlay">
          {accessibilitySegments.map(s=><path key={s.id} d={s.path} className={s.stairs?'surface-segment stairs':(s.surface.includes('Ghiaia')?'surface-segment gravel':'surface-segment paved')}/>)}
          {liveDemo && <path d="M555 445 L650 445" className="live-blocked-segment"/>}
        </g>
        <g className="assist-poi">
          <circle cx="575" cy="555" r="14"/><text x="575" y="560" textAnchor="middle">B</text>
          <circle cx="630" cy="470" r="14"/><text x="630" y="475" textAnchor="middle">W</text>
        </g>
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
