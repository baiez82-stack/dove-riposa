'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

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
  if(!logged) return <main className="admin-login"><form className="admin-login-card" onSubmit={login}><span className="mark">DR</span><h1>Area riservata Comune</h1><p>Povegliano Veronese · accesso operatori</p><label>Codice di accesso<input type="password" value={pin} onChange={e=>{setPin(e.target.value);setLoginError('');}} placeholder="Inserisci il codice" autoComplete="current-password"/></label>{loginError&&<div className="login-error">{loginError}</div>}<button className="primary" type="submit">Accedi</button><small className="login-note">Accesso riservato al personale autorizzato. Le credenziali per l’ambiente dimostrativo vengono fornite separatamente.</small><Link href="/povegliano-veronese">← Torna al servizio cittadino</Link></form></main>;

  return <main className="admin-shell">
    <aside className="admin-sidebar"><div className="citizen-brand"><span className="mark">DR</span><div><strong>Dove Riposa</strong><small>Comune di Povegliano Veronese</small></div></div>
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
  const markerRows=[
    ['DR-PV-ING','Ingresso principale','Attivo'],
    ['DR-PV-CEN','Incrocio centrale','Attivo'],
    ['DR-PV-EST','Porticato est','Attivo'],
    ['DR-PV-OVEST','Area ovest','Bozza']
  ];
  return <Panel title="Mappa & Dove Riposa Precision">
    <p>I marker di calibrazione collegano un punto fisico noto alla mappa digitale. In produzione il Comune potrà definire settori, percorsi accessibili, ostacoli e marker senza applicare QR a ogni sepoltura.</p>
    <div className="precision-admin-grid">
      <div className="admin-placeholder">Editor planimetria · collegamento a cartografia ufficiale</div>
      <div className="marker-admin">
        <h3>Marker di calibrazione</h3>
        {markerRows.map(r=><div className="marker-admin-row" key={r[0]}><div><b>{r[0]}</b><span>{r[1]}</span></div><em>{r[2]}</em></div>)}
      </div>
    </div>
    <div className="admin-two">
      <div className="admin-panel mini"><h3>Percorso breve</h3><p>Ottimizza la distanza quando non sono presenti vincoli di accessibilità.</p></div>
      <div className="admin-panel mini"><h3>Percorso accessibile ♿</h3><p>Può evitare scale, ghiaia e passaggi non idonei usando i metadati inseriti dall’ente.</p></div>
    </div>
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
