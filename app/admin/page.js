'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import BrandLockup from '../components/BrandLockup';

const initial=[
  {id:1,nome:'Mario',cognome:'Rossi',settore:'Settore B',fila:'7',posizione:'Loculo 18',stato:'Pubblicato'},
  {id:2,nome:'Anna',cognome:'Bianchi',settore:'Campo A',fila:'3',posizione:'Tomba 42',stato:'Pubblicato'},
  {id:3,nome:'Giuseppe',cognome:'Verdi',settore:'Campo C',fila:'11',posizione:'Cippo 9',stato:'Da verificare'}
];

export default function AdminPage(){
  const [logged,setLogged]=useState(false);
  const [pin,setPin]=useState('');
  const [loginError,setLoginError]=useState('');
  const [rows,setRows]=useState(initial);
  const [editing,setEditing]=useState(null);
  const [tab,setTab]=useState('dashboard');
  const [importMsg,setImportMsg]=useState('');

  function login(e){e?.preventDefault();if(pin==='PV-DR-26'){setLogged(true);setLoginError('');}else{setLoginError('Codice non valido.');}}
  if(!logged) return <main className="admin-login"><form className="admin-login-card" onSubmit={login}><div className="admin-login-brand"><BrandLockup subtitle="Area riservata"/></div><h1>Area riservata Comune</h1><p>Povegliano Veronese · accesso operatori</p><label>Codice di accesso<input type="password" value={pin} onChange={e=>{setPin(e.target.value);setLoginError('');}} placeholder="Inserisci il codice" autoComplete="current-password"/></label>{loginError&&<div className="login-error">{loginError}</div>}<button className="primary" type="submit">Accedi</button><small className="login-note">Accesso riservato al personale autorizzato. Le credenziali per l’ambiente dimostrativo vengono fornite separatamente.</small><Link href="/povegliano-veronese">← Torna al servizio cittadino</Link></form></main>;

  return <main className="admin-shell">
    <aside className="admin-sidebar"><div className="citizen-brand admin-brand"><BrandLockup compact inverse subtitle="Comune di Povegliano Veronese"/></div>
      {['dashboard','archivio','import','qualita','mappa','segnalazioni','privacy','utenti'].map(x=><button key={x} className={tab===x?'active':''} onClick={()=>setTab(x)}>{x[0].toUpperCase()+x.slice(1)}</button>)}
      <button onClick={()=>setLogged(false)}>Esci</button>
    </aside>
    <section className="admin-content">
      {tab==='dashboard'&&<Dashboard/>}
      {tab==='archivio'&&<Archivio rows={rows} setRows={setRows} editing={editing} setEditing={setEditing}/>}
      {tab==='import'&&<Import setRows={setRows} message={importMsg} setMessage={setImportMsg}/>}
      {tab==='qualita'&&<DataQuality rows={rows}/>}
      {tab==='mappa'&&<PrecisionAdmin/>}
      {tab==='segnalazioni'&&<Panel title="Segnalazioni"><div className="admin-list"><p><b>Posizione da verificare</b> · 1 segnalazione demo</p><p><b>Nominativo errato</b> · 0</p><p><b>Trasferimento</b> · 0</p></div></Panel>}
      {tab==='privacy'&&<PrivacyPanel/>}
      {tab==='utenti'&&<Panel title="Utenti e ruoli"><p>Amministratore ente · Operatore cimiteriale · Sola lettura.</p><div className="admin-warning">Questo ambiente è dimostrativo. La versione di produzione userà autenticazione lato server, ruoli, sessioni sicure e audit degli accessi.</div></Panel>}
    </section>
  </main>
}

function Dashboard(){
  return <><div className="admin-head"><div><span className="eyebrow">DASHBOARD</span><h1>Povegliano Veronese</h1></div><span className="status">● Demo</span></div>
    <div className="stats admin-stats"><div><b>1.284</b><span>visite demo</span></div><div><b>734</b><span>ricerche</span></div><div><b>295</b><span>navigazioni</span></div><div><b>61%</b><span>da QR</span></div></div>
    <div className="admin-two"><Panel title="Archivio"><p><b>3</b> record demo · <b>1</b> da verificare</p></Panel><Panel title="Privacy analytics"><p>Gli eventi previsti non includono nominativi cercati né identificatori persistenti. I numeri mostrati qui sono demo.</p></Panel></div>
  </>
}

function Archivio({rows,setRows,editing,setEditing}){
  const empty={nome:'',cognome:'',settore:'',fila:'',posizione:'',stato:'Pubblicato'};
  const [form,setForm]=useState(empty);
  const startEdit=r=>{setEditing(r.id);setForm({...r});};
  const save=()=>{if(!form.nome||!form.cognome)return;if(editing){setRows(rows.map(r=>r.id===editing?{...form,id:editing}:r));}else{setRows([...rows,{...form,id:Date.now()}]);}setForm(empty);setEditing(null);};
  return <Panel title="Archivio sepolture"><div className="admin-form"><input placeholder="Nome" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})}/><input placeholder="Cognome" value={form.cognome} onChange={e=>setForm({...form,cognome:e.target.value})}/><input placeholder="Settore" value={form.settore} onChange={e=>setForm({...form,settore:e.target.value})}/><input placeholder="Fila" value={form.fila} onChange={e=>setForm({...form,fila:e.target.value})}/><input placeholder="Posizione" value={form.posizione} onChange={e=>setForm({...form,posizione:e.target.value})}/><button className="primary" onClick={save}>{editing?'Salva modifica':'Aggiungi record'}</button></div>
    <div className="admin-table">{rows.map(r=><div className="admin-row" key={r.id}><div><b>{r.nome} {r.cognome}</b><span>{r.settore} · Fila {r.fila} · {r.posizione}</span></div><span>{r.stato}</span><button className="secondary" onClick={()=>startEdit(r)}>Modifica</button></div>)}</div>
  </Panel>
}

function Import({setRows,message,setMessage}){
  function file(e){const f=e.target.files?.[0];if(!f)return;const reader=new FileReader();reader.onload=()=>{const lines=String(reader.result).split(/\r?\n/).filter(Boolean);setMessage(`File letto: ${lines.length} righe. Import demo pronto per anteprima.`);};reader.readAsText(f);}
  return <Panel title="Import CSV / Excel"><p>Per la demo leggiamo il file localmente senza inviarlo a un server. In produzione verrà aggiunta un’anteprima con validazione colonne, errori e conferma prima della pubblicazione.</p><input type="file" accept=".csv,.txt" onChange={file}/>{message&&<div className="import-message">{message}</div>}</Panel>
}


function DataQuality({rows}){
  const published=rows.filter(r=>r.stato==='Pubblicato').length;
  const pending=rows.length-published;
  return <Panel title="Data Quality Engine">
    <p>Controllo preliminare dell’archivio prima della pubblicazione. La demo evidenzia record incompleti o da verificare senza modificarli automaticamente.</p>
    <div className="quality-grid">
      <div><b>{rows.length}</b><span>record analizzati</span></div>
      <div><b>{published}</b><span>localizzati</span></div>
      <div><b>{pending}</b><span>da verificare</span></div>
      <div><b>0</b><span>duplicati demo</span></div>
    </div>
    <div className="quality-list">
      <div className="quality-ok"><b>✓ Coordinate e posizione</b><span>2 record demo coerenti con settore/fila/posizione.</span></div>
      <div className="quality-warn"><b>! Giuseppe Verdi</b><span>Record marcato “Da verificare”: richiede conferma dell’operatore prima della pubblicazione.</span></div>
      <div className="quality-ok"><b>✓ Campi minimi</b><span>Nessun record senza nome o cognome nella demo.</span></div>
    </div>
  </Panel>
}

function PrecisionAdmin(){
  const initialSegments=[
    {id:'A1',label:'Ingresso → viale centrale',surface:'Pavimentato',slope:'2',width:'2.4',stairs:false,ramp:false,rest:true,status:'Da verificare',source:'Cartografia'},
    {id:'A2',label:'Viale centrale → area est',surface:'Ghiaia compatta',slope:'4',width:'1.8',stairs:false,ramp:false,rest:true,status:'Da verificare',source:'Immagini'},
    {id:'A3',label:'Accesso porticato est',surface:'Pavimentato',slope:'6',width:'1.4',stairs:false,ramp:true,rest:false,status:'Da verificare',source:'Ipotesi demo'},
    {id:'A4',label:'Area ovest',surface:'Ghiaia',slope:'3',width:'1.5',stairs:false,ramp:false,rest:false,status:'Da verificare',source:'Immagini'},
    {id:'A5',label:'Scalinata interna',surface:'Pietra',slope:'',width:'1.2',stairs:true,ramp:false,rest:false,status:'Da verificare',source:'Planimetria'}
  ];
  const [segments,setSegments]=useState(initialSegments);
  const [selectedId,setSelectedId]=useState('A1');
  const [surveyMode,setSurveyMode]=useState(false);
  const [saved,setSaved]=useState('');

  useEffect(()=>{
    try{
      const savedSegments=localStorage.getItem('dr-accessibility-demo');
      if(savedSegments) setSegments(JSON.parse(savedSegments));
    }catch{}
  },[]);

  const selected=segments.find(s=>s.id===selectedId)||segments[0];

  function patch(field,value){
    setSegments(rows=>rows.map(r=>r.id===selectedId?{...r,[field]:value}:r));
    setSaved('');
  }

  function saveVerification(){
    setSegments(rows=>{
      const next=rows.map(r=>r.id===selectedId?{...r,status:'Verificato sul posto',source:'Sopralluogo operatore'}:r);
      try{localStorage.setItem('dr-accessibility-demo',JSON.stringify(next));}catch{}
      return next;
    });
    setSaved('Tratto verificato nella demo. In produzione la modifica sarà registrata nell’audit del Comune.');
  }

  const verified=segments.filter(s=>s.status==='Verificato sul posto').length;

  return <Panel title="Mappa & Dove Riposa Precision">
    <p>La mappa non dichiara un tratto accessibile solo perché appare tale in cartografia. Dove Riposa crea un <b>Accessibility Layer</b>: superficie, pendenza, larghezza, gradini, rampe e punti di sosta vengono precompilati quando possibile e poi validati sul posto.</p>

    <div className="survey-toolbar">
      <div><b>Accessibility Layer</b><span>{verified}/{segments.length} tratti verificati sul posto</span></div>
      <button className={surveyMode?'secondary survey-active':'secondary'} onClick={()=>setSurveyMode(!surveyMode)}>{surveyMode?'Chiudi sopralluogo':'Avvia modalità sopralluogo'}</button>
    </div>

    <div className="precision-admin-grid accessibility-admin-grid">
      <div className="access-map-demo">
        <div className="access-map-title"><b>Planimetria demo</b><span>Tocca un tratto per verificarlo</span></div>
        <svg viewBox="0 0 600 420" className="admin-access-svg" role="img" aria-label="Demo dei tratti accessibili del cimitero">
          <rect width="600" height="420" rx="18" className="admin-map-bg"/>
          <path d="M300 385 L300 300" className={selectedId==='A1'?'admin-segment selected':'admin-segment paved'} onClick={()=>setSelectedId('A1')}/>
          <path d="M300 300 L390 245" className={selectedId==='A2'?'admin-segment selected':'admin-segment gravel'} onClick={()=>setSelectedId('A2')}/>
          <path d="M390 245 L480 170" className={selectedId==='A3'?'admin-segment selected':'admin-segment paved'} onClick={()=>setSelectedId('A3')}/>
          <path d="M300 300 L210 235 L150 170" className={selectedId==='A4'?'admin-segment selected':'admin-segment gravel'} onClick={()=>setSelectedId('A4')}/>
          <path d="M390 245 L390 150" className={selectedId==='A5'?'admin-segment selected':'admin-segment stairs'} onClick={()=>setSelectedId('A5')}/>
          <circle cx="300" cy="385" r="14" className="admin-map-node"/><text x="300" y="414" textAnchor="middle">Ingresso</text>
          <circle cx="300" cy="300" r="10" className="admin-map-node"/>
          <circle cx="390" cy="245" r="10" className="admin-map-node"/>
          <text x="455" y="155">Porticato est</text><text x="95" y="150">Area ovest</text>
        </svg>
        <div className="surface-legend"><span><i className="legend-paved"></i>Pavimentato</span><span><i className="legend-gravel"></i>Ghiaia</span><span><i className="legend-stairs"></i>Gradini</span></div>
      </div>

      <div className="access-editor">
        <div className="access-editor-head"><div><span className="eyebrow">{selected.id}</span><h3>{selected.label}</h3></div><span className={selected.status==='Verificato sul posto'?'verify-chip ok':'verify-chip'}>{selected.status}</span></div>
        <label>Superficie
          <select value={selected.surface} onChange={e=>patch('surface',e.target.value)}>
            <option>Pavimentato</option><option>Asfalto</option><option>Cemento</option><option>Autobloccanti</option><option>Ghiaia compatta</option><option>Ghiaia</option><option>Terra</option><option>Erba</option><option>Pietra</option>
          </select>
        </label>
        <div className="access-form-two">
          <label>Pendenza %<input value={selected.slope} onChange={e=>patch('slope',e.target.value)} inputMode="decimal" placeholder="es. 4"/></label>
          <label>Larghezza m<input value={selected.width} onChange={e=>patch('width',e.target.value)} inputMode="decimal" placeholder="es. 1.8"/></label>
        </div>
        <div className="access-checks">
          <label><input type="checkbox" checked={selected.stairs} onChange={e=>patch('stairs',e.target.checked)}/> Gradini</label>
          <label><input type="checkbox" checked={selected.ramp} onChange={e=>patch('ramp',e.target.checked)}/> Rampa</label>
          <label><input type="checkbox" checked={selected.rest} onChange={e=>patch('rest',e.target.checked)}/> Punto di sosta vicino</label>
        </div>
        <div className="source-box"><b>Origine attuale</b><span>{selected.source}</span></div>
        <button className="primary" onClick={saveVerification}>✓ Conferma sopralluogo</button>
        {saved&&<div className="import-message">{saved}</div>}
      </div>
    </div>

    {surveyMode&&<div className="survey-mobile-card">
      <span className="eyebrow">MODALITÀ SOPRALLUOGO</span>
      <h3>Verifica dal telefono</h3>
      <p>Flusso previsto: apri il tratto → scegli superficie → inserisci pendenza/larghezza → marca gradini, rampa e punti di sosta → conferma. In produzione può usare anche posizione e fotocamera solo su richiesta dell’operatore.</p>
      <div className="survey-progress"><span style={{width:(verified/segments.length*100)+'%'}}></span></div>
      <small>{verified} tratti verificati · {segments.length-verified} ancora da controllare</small>
    </div>}

    <div className="admin-two">
      <div className="admin-panel mini"><h3>Percorso breve</h3><p>Ottimizza la distanza quando non sono presenti vincoli di accessibilità.</p></div>
      <div className="admin-panel mini"><h3>Percorso accessibile ♿</h3><p>Evita automaticamente tratti con gradini o caratteristiche non compatibili con i parametri verificati.</p></div>
      <div className="admin-panel mini"><h3>Dove Riposa Assist ♥</h3><p>Può privilegiare fondo regolare, pendenze ridotte, panchine, fontanelle e punti di sosta, senza creare profili sanitari dell’utente.</p></div>
    </div>
    <div className="admin-warning">I dati ricavati da planimetrie, immagini o stime restano “Da verificare”. Solo un controllo dell’ente sul posto può portarli allo stato “Verificato sul posto”.</div>
  </Panel>
}

function PrivacyPanel(){
  return <Panel title="Privacy & governance">
    <div className="privacy-checklist">
      <div><span className="check-ok">✓</span><p><b>Ricerca pubblica senza account</b><small>Nessuna registrazione richiesta al cittadino.</small></p></div>
      <div><span className="check-ok">✓</span><p><b>Analytics senza termini di ricerca</b><small>Eventi tecnici: page view, QR, ricerca, apertura risultato, navigazione.</small></p></div>
      <div><span className="check-ok">✓</span><p><b>Nessun profilo social del defunto</b><small>La scheda ha finalità esclusiva di localizzazione.</small></p></div>
      <div><span className="check-ok">✓</span><p><b>Fotocamera on demand</b><small>La demo non carica né registra il flusso video.</small></p></div>
      <div><span className="check-pending">!</span><p><b>Ruoli privacy da formalizzare</b><small>Comune, fornitore tecnico, eventuali sub-responsabili e istruzioni art. 28.</small></p></div>
      <div><span className="check-pending">!</span><p><b>Retention e log infrastrutturali</b><small>Da definire con l'ente e il DPO prima della produzione.</small></p></div>
      <div><span className="check-pending">!</span><p><b>Anti-scraping e sicurezza</b><small>Rate limiting, bot protection, autenticazione operatori e audit accessi.</small></p></div>
    </div>
    <div className="admin-warning">Stato: architettura privacy by design impostata. Nessun dato comunale reale deve essere caricato finché contratto, ruoli, informativa, sicurezza e validazione DPO non sono definiti.</div>
    <p><Link className="text-link" href="/povegliano-veronese/privacy" target="_blank">Apri la pagina pubblica Privacy e trasparenza →</Link></p>
  </Panel>
}

function Panel({title,children}){return <div className="admin-panel"><h2>{title}</h2>{children}</div>}
