'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
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

const emptyFieldTest={nome:'',cognome:'',anno:'',morte:'',settore:'',fila:'',posizione:'',gpsPoints:{}};

const gpsSlots=[
  ['ingresso','Ingresso'],
  ['nodoA','Nodo A'],
  ['nodoB','Nodo B'],
  ['destinazione','Destinazione']
];

function fieldInstructions(points={}){
  return [
    points.nodoA?'Vai verso il Nodo A':'Parti dall’ingresso principale',
    points.nodoB?'Dal Nodo A prosegui verso il Nodo B':'Prosegui verso la zona della sepoltura',
    points.destinazione?'Dal Nodo B prosegui verso la destinazione':'Raggiungi settore, fila e posizione',
    'Controlla settore, fila e posizione'
  ];
}

function encodeSharedTest(record){
  const points=record.gpsPoints||{};
  const compact={
    v:2,
    n:record.nome||'',
    c:record.cognome||'',
    s:record.settore||'',
    f:record.fila||'',
    p:record.posizione||'',
    g:{}
  };

  const refs=[
    ['i','ingresso'],
    ['a','nodoA'],
    ['b','nodoB'],
    ['d','destinazione']
  ];

  refs.forEach(([shortKey,id])=>{
    const point=points[id];
    if(point) compact.g[shortKey]=[point.lat,point.lon,point.accuracy];
  });

  const bytes=new TextEncoder().encode(JSON.stringify(compact));
  let binary='';
  bytes.forEach(byte=>{binary+=String.fromCharCode(byte);});
  return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}

function decodeSharedTest(value){
  try{
    const base64=String(value||'').replace(/-/g,'+').replace(/_/g,'/');
    const padded=base64+'='.repeat((4-base64.length%4)%4);
    const binary=atob(padded);
    const bytes=Uint8Array.from(binary,ch=>ch.charCodeAt(0));
    const data=JSON.parse(new TextDecoder().decode(bytes));

    if(data?.v===2&&data.n&&data.c){
      const gpsPoints={};
      const refs={
        i:['ingresso','Ingresso'],
        a:['nodoA','Nodo A'],
        b:['nodoB','Nodo B'],
        d:['destinazione','Destinazione']
      };

      Object.entries(data.g||{}).forEach(([shortKey,value])=>{
        const ref=refs[shortKey];
        if(!ref||!Array.isArray(value)) return;
        const [id,label]=ref;
        gpsPoints[id]={
          id,
          label,
          lat:value[0],
          lon:value[1],
          accuracy:value[2]
        };
      });

      const instructions=fieldInstructions(gpsPoints);
      return {
        id:'field-test-pescantina',
        fieldTest:true,
        nome:data.n,
        cognome:data.c,
        anno:'',
        morte:'',
        settore:data.s||'Da rilevare',
        fila:data.f||'Da rilevare',
        posizione:data.p||'Da rilevare',
        gpsPoints,
        mapX:null,
        mapY:null,
        route:'',
        accessibleRoute:'',
        assistRoute:'',
        shortDistance:'',
        accessibleDistance:'',
        assistDistance:'',
        instructions,
        accessibleInstructions:instructions,
        assistInstructions:instructions
      };
    }

    return data;
  }catch{return null;}
}

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
  const [fieldTestMode,setFieldTestMode]=useState(false);
  const [fieldTestRecord,setFieldTestRecord]=useState(null);
  const [fieldForm,setFieldForm]=useState(emptyFieldTest);
  const [fieldSaved,setFieldSaved]=useState(false);
  const [gpsBusy,setGpsBusy]=useState('');
  const [gpsMessage,setGpsMessage]=useState('');
  const [shareUrl,setShareUrl]=useState('');
  const [shareQr,setShareQr]=useState('');
  const [precisionQrs,setPrecisionQrs]=useState({});

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const cal=params.get('cal');
    if(cal && markers[cal]) setCalibrated(markers[cal]);
    setFieldTestMode(params.get('fieldtest')==='1');

    try{
      const hashValue=window.location.hash.startsWith('#ft=')?window.location.hash.slice(4):'';
      const shared=hashValue?decodeSharedTest(hashValue):null;
      const localRaw=localStorage.getItem('dr-pescantina-field-test');
      const local=localRaw?JSON.parse(localRaw):null;
      const record=shared?.nome&&shared?.cognome?shared:local;

      if(record?.nome&&record?.cognome){
        if(shared) localStorage.setItem('dr-pescantina-field-test',JSON.stringify(record));
        setFieldTestRecord(record);
        setFieldForm({
          nome:record.nome||'',
          cognome:record.cognome||'',
          anno:record.anno||'',
          morte:record.morte||'',
          settore:record.settore||'',
          fila:record.fila||'',
          posizione:record.posizione||'',
          gpsPoints:record.gpsPoints||{}
        });

        if(shared){
          setQ(record.cognome);
          setSearched(true);
        }
      }
    }catch{}
  },[]);

  useEffect(()=>{
    if(!fieldTestMode) return;

    let active=true;
    const entries=[
      ['ingresso','Ingresso'],
      ['centro','Nodo A'],
      ['testata','Nodo B']
    ];

    Promise.all(entries.map(async([id,label])=>{
      const url=window.location.origin+'/pescantina?cal='+encodeURIComponent(id)+'&src=qr-marker';
      const dataUrl=await QRCode.toDataURL(url,{errorCorrectionLevel:'H',margin:2,width:360});
      return [id,{label,url,dataUrl}];
    })).then(items=>{
      if(active) setPrecisionQrs(Object.fromEntries(items));
    }).catch(()=>{
      if(active) setPrecisionQrs({});
    });

    return()=>{active=false;};
  },[fieldTestMode]);

  const results=useMemo(()=>{
    const records=fieldTestRecord?[fieldTestRecord,...demoRecords]:demoRecords;
    const terms=q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if(!terms.length) return records;
    return records.filter(r=>{
      const haystack=`${r.nome} ${r.cognome} ${r.anno||""} ${r.morte||""}`.toLowerCase();
      return terms.every(term=>haystack.includes(term));
    });
  },[q,fieldTestRecord]);

  function captureGps(id,label){
    setGpsMessage('');

    if(!navigator.geolocation){
      setGpsMessage('GPS non disponibile su questo browser.');
      return;
    }

    setGpsBusy(id);
    navigator.geolocation.getCurrentPosition(position=>{
      const point={
        id,
        label,
        lat:Number(position.coords.latitude.toFixed(7)),
        lon:Number(position.coords.longitude.toFixed(7)),
        accuracy:Math.round(position.coords.accuracy),
        capturedAt:new Date().toISOString()
      };

      setFieldForm(current=>({
        ...current,
        gpsPoints:{...(current.gpsPoints||{}),[id]:point}
      }));
      setGpsBusy('');
      setFieldSaved(false);
      setGpsMessage(label+' registrato · accuratezza stimata ±'+point.accuracy+' m');
    },error=>{
      setGpsBusy('');
      if(error?.code===1) setGpsMessage('Permesso posizione non concesso. Abilita la posizione nel browser e riprova.');
      else setGpsMessage('Non riesco a rilevare la posizione. Spostati all’aperto e riprova.');
    },{
      enableHighAccuracy:true,
      timeout:15000,
      maximumAge:0
    });
  }

  async function buildShare(record){
    const encoded=encodeSharedTest(record);
    const url=window.location.origin+'/pescantina#ft='+encoded;
    setShareUrl(url);
    try{
      const qr=await QRCode.toDataURL(url,{errorCorrectionLevel:'M',margin:2,width:420});
      setShareQr(qr);
    }catch{
      setShareQr('');
    }
    return url;
  }

  function downloadPrecisionQr(id){
    const item=precisionQrs[id];
    if(!item?.dataUrl) return;
    const a=document.createElement('a');
    a.href=item.dataUrl;
    a.download='dove-riposa-pescantina-'+id+'.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function saveFieldTest(){
    if(!fieldForm.nome.trim()||!fieldForm.cognome.trim()) return;

    const points=fieldForm.gpsPoints||{};
    const instructions=fieldInstructions(points);

    const record={
      id:'field-test-pescantina',
      fieldTest:true,
      nome:fieldForm.nome.trim(),
      cognome:fieldForm.cognome.trim(),
      anno:fieldForm.anno.trim(),
      morte:fieldForm.morte.trim(),
      settore:fieldForm.settore.trim()||'Da rilevare',
      fila:fieldForm.fila.trim()||'Da rilevare',
      posizione:fieldForm.posizione.trim()||'Da rilevare',
      gpsPoints:points,
      mapX:null,
      mapY:null,
      route:'',
      accessibleRoute:'',
      assistRoute:'',
      shortDistance:'',
      accessibleDistance:'',
      assistDistance:'',
      instructions,
      accessibleInstructions:instructions,
      assistInstructions:instructions
    };

    try{
      localStorage.setItem('dr-pescantina-field-test',JSON.stringify(record));
      setFieldTestRecord(record);
      setFieldSaved(true);
      setQ(record.cognome);
      setSearched(true);
      await buildShare(record);
    }catch{}
  }

  async function shareFieldTest(){
    if(!shareUrl) return;
    if(navigator.share){
      try{
        await navigator.share({title:'Dove Riposa · test Pescantina',url:shareUrl});
        return;
      }catch{}
    }

    try{
      await navigator.clipboard.writeText(shareUrl);
      setGpsMessage('Link prova copiato. Aprilo sul secondo telefono.');
    }catch{
      setGpsMessage('Copia il link mostrato sotto e aprilo sul secondo telefono.');
    }
  }

  function clearFieldTest(){
    try{localStorage.removeItem('dr-pescantina-field-test');}catch{}
    setFieldTestRecord(null);
    setFieldForm(emptyFieldTest);
    setFieldSaved(false);
    setShareUrl('');
    setShareQr('');
    setGpsMessage('');
  }

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

    {fieldTestMode&&<section className="wrap" style={{paddingTop:'20px'}}>
      <div className="admin-panel">
        <span className="eyebrow">FIELD TEST · PESCANTINA</span>
        <h2>Prepara la prova in pochi tocchi</h2>
        <p>Inserisci il defunto e registra le posizioni con il GPS. Non devi misurare metri né scrivere il percorso a mano.</p>
        <Link className="primary link-button field-print-qrs" href="/pescantina/qr-test" target="_blank">Apri i 3 QR da stampare →</Link>

        <div className="field-test-form">
          <div className="field-test-person">
            <input placeholder="Nome" value={fieldForm.nome} onChange={e=>{setFieldForm({...fieldForm,nome:e.target.value});setFieldSaved(false);}}/>
            <input placeholder="Cognome" value={fieldForm.cognome} onChange={e=>{setFieldForm({...fieldForm,cognome:e.target.value});setFieldSaved(false);}}/>
            <input placeholder="Settore / campo (se lo sai)" value={fieldForm.settore} onChange={e=>setFieldForm({...fieldForm,settore:e.target.value})}/>
            <input placeholder="Fila (se la sai)" value={fieldForm.fila} onChange={e=>setFieldForm({...fieldForm,fila:e.target.value})}/>
            <input placeholder="Posizione / loculo (se lo sai)" value={fieldForm.posizione} onChange={e=>setFieldForm({...fieldForm,posizione:e.target.value})}/>
          </div>

          <div className="field-gps-box">
            <div>
              <b>Registra 4 punti</b>
              <p>Vai fisicamente nel punto e tocca il pulsante. Il telefono salva coordinate e accuratezza GPS.</p>
            </div>

            <div className="field-gps-grid">
              {gpsSlots.map(([id,label])=>{
                const point=fieldForm.gpsPoints?.[id];
                return <button
                  key={id}
                  type="button"
                  className={point?'secondary field-gps-point saved':'secondary field-gps-point'}
                  onClick={()=>captureGps(id,label)}
                  disabled={gpsBusy===id}
                >
                  <span>{point?'✓':'+'}</span>
                  <b>{gpsBusy===id?'Rilevamento…':label}</b>
                  <small>{point?point.lat+', '+point.lon+' · ±'+point.accuracy+' m':'Tocca quando sei sul posto'}</small>
                </button>;
              })}
            </div>
            {gpsMessage&&<div className="import-message">{gpsMessage}</div>}
          </div>

          <button className="primary field-save-test" type="button" onClick={saveFieldTest}>Salva e prepara la prova</button>
          <button className="secondary" type="button" onClick={clearFieldTest}>Azzera prova</button>
        </div>

        {fieldSaved&&<div className="field-share-box">
          <div>
            <span className="eyebrow">SECONDO TELEFONO</span>
            <b>Passa la prova al secondo telefono</b>
            <p>Inquadra il QR qui sotto oppure usa il pulsante di condivisione. Il link tecnico resta nascosto.</p>
          </div>
          {shareQr
            ? <img className="field-share-qr" src={shareQr} alt="QR per aprire la prova Dove Riposa su un altro telefono"/>
            : <div className="admin-warning">QR di condivisione non disponibile. Usa il pulsante Condividi prova.</div>}
          <button className="primary" type="button" onClick={shareFieldTest}>Invia al secondo telefono</button>
        </div>}

        <div className="field-precision-box">
          <div>
            <span className="eyebrow">QR FISICI PER DOMANI</span>
            <h3>Questi sono i 3 QR da stampare</h3>
            <p>Ingresso è già definito. Nodo A e Nodo B li appoggerai nei due punti strategici scelti durante il sopralluogo.</p>
            <Link className="secondary link-button" href="/pescantina/qr-test" target="_blank">Apri versione stampa →</Link>
          </div>

          <div className="field-precision-grid">
            {[
              ['ingresso','1 · Ingresso'],
              ['centro','2 · Nodo A'],
              ['testata','3 · Nodo B']
            ].map(([id,label])=>{
              const item=precisionQrs[id];
              return <article className="field-precision-card" key={id}>
                <b>{label}</b>
                {item?.dataUrl
                  ? <img src={item.dataUrl} alt={'QR '+label}/>
                  : <div className="qr-loading">Genero QR…</div>}
                <button className="secondary" type="button" onClick={()=>downloadPrecisionQr(id)} disabled={!item?.dataUrl}>Scarica QR</button>
              </article>;
            })}
          </div>
        </div>
      </div>
    </section>}

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
            <div className="source">{r.fieldTest?'TEST SUL CAMPO · configurazione condivisibile':'Dato dimostrativo fittizio'}</div>
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
        {selected.fieldTest
          ? <FieldTestRouteSummary selected={selected}/>
          : <PescantinaMap selected={selected} routeMode={routeMode} calibrated={calibrated}/>}
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

      {selected&&selected.mapX!=null&&selected.mapY!=null&&<>
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


function FieldTestRouteSummary({selected}){
  const points=selected.gpsPoints||{};
  const rows=gpsSlots.map(([id,label])=>points[id]&&{...points[id],fallbackLabel:label}).filter(Boolean);

  return <div className="field-route-summary">
    <span className="eyebrow">RILIEVO GPS TEST</span>
    <h3>Punti registrati</h3>
    <p>Questa prova usa i punti rilevati sul posto. La planimetria demo non viene mostrata.</p>
    <div className="field-route-points">
      {rows.map((point,index)=><div className="field-route-point" key={point.id||index}>
        <span>{index+1}</span>
        <div>
          <b>{point.label||point.fallbackLabel}</b>
          <small>{point.lat}, {point.lon} · accuratezza ±{point.accuracy} m</small>
        </div>
      </div>)}
      {!rows.length&&<div className="empty">Nessun punto GPS registrato. Puoi comunque provare ricerca, QR e Check.</div>}
    </div>
  </div>;
}
