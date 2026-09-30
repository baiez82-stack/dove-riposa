'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import BrandLockup from '../components/BrandLockup';
import AdminQrGenerator from '../components/AdminQrGenerator';

const initial=[
  {id:1,nome:'Mario',cognome:'Rossi',settore:'Settore B',fila:'7',posizione:'Loculo 18',stato:'Pubblicato'},
  {id:2,nome:'Anna',cognome:'Bianchi',settore:'Campo A',fila:'3',posizione:'Tomba 42',stato:'Pubblicato'},
  {id:3,nome:'Giuseppe',cognome:'Verdi',settore:'Campo C',fila:'11',posizione:'Cippo 9',stato:'Da verificare'}
];

export default function AdminPage(){
  const [rows,setRows]=useState(initial);
  const [editing,setEditing]=useState(null);
  const [tab,setTab]=useState('dashboard');
  const [importMsg,setImportMsg]=useState('');


  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <div className="citizen-brand admin-brand"><BrandLockup compact inverse subtitle="Amministrazione demo"/></div>

      <div className="admin-mobile-nav">
        <label htmlFor="admin-section">Sezione</label>
        <select id="admin-section" value={tab} onChange={e=>setTab(e.target.value)}>
          <option value="dashboard">Dashboard</option>
          <option value="archivio">Archivio</option>
          <option value="import">Import</option>
          <option value="qualita">Qualità</option>
          <option value="mappa">Mappa & accessibilità</option>
          <option value="qr">QR Precision</option>
          <option value="live">Live</option>
          <option value="segnalazioni">Segnalazioni</option>
          <option value="privacy">Privacy</option>
          <option value="utenti">Utenti</option>
        </select>
      </div>

      <div className="admin-desktop-nav">
        {[
          ['dashboard','Dashboard'],
          ['archivio','Archivio'],
          ['import','Import'],
          ['qualita','Qualità'],
          ['mappa','Mappa & accessibilità'],
          ['qr','QR Precision'],
          ['live','Live'],
          ['segnalazioni','Segnalazioni'],
          ['privacy','Privacy'],
          ['utenti','Utenti']
        ].map(([id,label])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}>{label}</button>)}
      </div>

      <div className="admin-sidebar-actions">
        <Link className="admin-back-link" href="/">← Sito pubblico</Link>
        <form action="/admin/logout" method="post" className="admin-logout-form"><button type="submit">Esci</button></form>
      </div>
    </aside>
    <section className="admin-content">
      {tab==='dashboard'&&<Dashboard/>}
      {tab==='archivio'&&<Archivio rows={rows} setRows={setRows} editing={editing} setEditing={setEditing}/>}
      {tab==='import'&&<Import setRows={setRows} message={importMsg} setMessage={setImportMsg}/>}
      {tab==='qualita'&&<DataQuality rows={rows}/>}
      {tab==='mappa'&&<PrecisionAdmin/>}
      {tab==='qr'&&<AdminQrGenerator/>}
      {tab==='live'&&<LivePanel/>}
      {tab==='segnalazioni'&&<Panel title="Segnalazioni"><div className="admin-list"><p><b>Posizione da verificare</b> · 1 segnalazione demo</p><p><b>Nominativo errato</b> · 0</p><p><b>Trasferimento</b> · 0</p></div></Panel>}
      {tab==='privacy'&&<PrivacyPanel/>}
      {tab==='utenti'&&<Panel title="Utenti e ruoli"><p>Amministratore ente · Operatore cimiteriale · Sola lettura.</p><div className="admin-warning">Gli account operatori usano autenticazione server-side e ruoli per ente. Per questa demo non esistono ancora account operatori attivi: vanno creati e associati all’ente prima di usare l’area riservata in una presentazione autenticata.</div></Panel>}
    </section>
  </main>
}

function Dashboard(){
  return <><div className="admin-head"><div><span className="eyebrow">DASHBOARD DEMO</span><h1>Dove Riposa Admin</h1></div><span className="status">● Ambiente dimostrativo</span></div>
    <div className="pilot-banner"><b>Backend pilot attivo, dati reali non ancora caricati.</b><span>Autenticazione server-side e database multi-ente sono predisposti. Prima dei dati comunali reali restano da configurare gli account operatori, il referente/DPO e il flusso di import validato.</span></div>
    <div className="stats admin-stats"><div><b>2</b><span>Comuni demo</span></div><div><b>7</b><span>marker Precision</span></div><div><b>5</b><span>tratti accessibilità Povegliano</span></div><div><b>0</b><span>dati comunali reali</span></div></div>
    <div className="admin-two"><Panel title="Archivio"><p><b>3</b> record demo · <b>1</b> da verificare</p></Panel><Panel title="Stato pilot"><p>La demo serve a validare flusso, mappa, accessibilità e navigazione. Le metriche reali verranno mostrate solo quando esisterà un archivio analytics persistente.</p></Panel></div>
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
  return <Panel title="Import CSV"><p>Per la demo leggiamo il file localmente senza inviarlo a un server. In produzione verrà aggiunta un’anteprima con validazione colonne, errori e conferma prima della pubblicazione.</p><input type="file" accept=".csv,.txt" onChange={file}/>{message&&<div className="import-message">{message}</div>}</Panel>
}


function LivePanel(){
  const [active,setActive]=useState(true);
  const [type,setType]=useState('Lavori in corso');
  const [until,setUntil]=useState('13:00');
  const [message,setMessage]=useState('Passaggio est temporaneamente chiuso. Il percorso viene deviato sul viale centrale.');
  return <Panel title="Dove Riposa Live">
    <p>Gestione dimostrativa di chiusure, lavori e limitazioni temporanee che possono modificare il percorso del cittadino.</p>
    <div className="live-admin-card">
      <div className="live-admin-head"><div><b>Evento demo</b><span>Tratto: viale est → porticato</span></div><button className={active?'live-switch on':'live-switch'} onClick={()=>setActive(!active)}>{active?'Attivo':'Disattivo'}</button></div>
      <label>Tipo evento<select value={type} onChange={e=>setType(e.target.value)}><option>Lavori in corso</option><option>Passaggio chiuso</option><option>Accesso non disponibile</option><option>Area temporaneamente interdetta</option></select></label>
      <label>Messaggio<input value={message} onChange={e=>setMessage(e.target.value)}/></label>
      <label>Fino alle<input value={until} onChange={e=>setUntil(e.target.value)} inputMode="numeric"/></label>
      <div className="live-preview"><span>{active?'● ATTIVO':'○ NON ATTIVO'}</span><b>{type}</b><p>{message}</p><small>Fine prevista: {until}</small></div>
      <Link className="primary link-button" href={active?"/povegliano-veronese?live=1":"/povegliano-veronese"} target="_blank">Apri la simulazione cittadino →</Link>
    </div>
    <div className="admin-warning">In produzione gli eventi Live saranno salvati nel database, avranno data/ora di inizio e fine, audit dell’operatore e ricalcolo automatico dei percorsi. Questa sezione è solo dimostrativa.</div>
  </Panel>
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
  return <Panel title="Privacy, legal & governance">
    <div className="pilot-banner"><b>GO-LIVE BLOCCATO finché i punti critici non sono chiusi.</b><span>Non caricare archivi comunali reali solo perché il backend è pronto: la conformità dipende anche da contratti, fornitori, sicurezza, accessibilità e procedure operative.</span></div>
    <div className="privacy-checklist">
      <div><span className="check-ok">✓</span><p><b>Ricerca pubblica senza account</b><small>Coerente con minimizzazione e con le indicazioni del Garante sui servizi di localizzazione delle sepolture.</small></p></div>
      <div><span className="check-ok">✓</span><p><b>Separazione istituzionale</b><small>Nessun profilo social/commerciale automatico del defunto.</small></p></div>
      <div><span className="check-ok">✓</span><p><b>Database multi-ente + RLS</b><small>Separazione logica dei dati e ruoli operatori predisposti.</small></p></div>
      <div><span className="check-ok">✓</span><p><b>Autenticazione nominativa</b><small>Area operatori con Supabase Auth; niente PIN condiviso.</small></p></div>
      <div><span className="check-pending">!</span><p><b>Titolare, DPO e contatti ufficiali</b><small>Da pubblicare nell’informativa definitiva prima del pilot reale.</small></p></div>
      <div><span className="check-pending">!</span><p><b>Accordo art. 28 GDPR</b><small>Ruoli, istruzioni, sub-responsabili, restituzione/cancellazione e audit da formalizzare.</small></p></div>
      <div><span className="check-pending">!</span><p><b>Contratto hosting compatibile</b><small>La demo gira su Render Free. Prima dei dati reali va scelto un piano/contratto idoneo, verificati DPA, localizzazione, log e sub-responsabili.</small></p></div>
      <div><span className="check-pending">!</span><p><b>Anti-scraping</b><small>Rate limiting, protezione bot e limiti di interrogazione da attivare prima di pubblicare archivi reali.</small></p></div>
      <div><span className="check-pending">!</span><p><b>Retention, backup e incident response</b><small>Definire tempi, restore testato, revoca account e gestione data breach.</small></p></div>
      <div><span className="check-pending">!</span><p><b>DPIA / valutazione del rischio</b><small>Valutazione formale con il DPO prima del pilot; art. 35 GDPR se applicabile.</small></p></div>
      <div><span className="check-pending">!</span><p><b>Accessibilità AgID</b><small>Test formale, feedback e Dichiarazione di Accessibilità dell’ente.</small></p></div>
    </div>
    <div className="admin-warning">Regola operativa: nessun dato reale finché i punti con “!” non sono chiusi e documentati.</div>
    <p><Link className="text-link" href="/povegliano-veronese/privacy" target="_blank">Privacy e trasparenza →</Link> · <Link className="text-link" href="/povegliano-veronese/termini" target="_blank">Termini d’uso →</Link> · <Link className="text-link" href="/povegliano-veronese/accessibilita" target="_blank">Accessibilità →</Link></p>
  </Panel>
}

function Panel({title,children}){return <div className="admin-panel"><h2>{title}</h2>{children}</div>}
