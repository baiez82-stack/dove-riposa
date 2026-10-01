'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BrandLockup from '../components/BrandLockup';
import AdminQrGenerator from '../components/AdminQrGenerator';
import AdminImportManager from '../components/AdminImportManager';

const initial=[
  {id:1,nome:'Mario',cognome:'Rossi',settore:'Settore B',fila:'7',posizione:'Loculo 18',stato:'Pubblicato'},
  {id:2,nome:'Anna',cognome:'Bianchi',settore:'Campo A',fila:'3',posizione:'Tomba 42',stato:'Pubblicato'},
  {id:3,nome:'Giuseppe',cognome:'Verdi',settore:'Campo C',fila:'11',posizione:'Cippo 9',stato:'Da verificare'}
];

export default function AdminPage(){
  const [rows,setRows]=useState(initial);
  const [editing,setEditing]=useState(null);
  const [tab,setTab]=useState('dashboard');


  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <div className="citizen-brand admin-brand"><BrandLockup compact inverse subtitle="Amministrazione demo"/></div>

      <div className="admin-mobile-nav">
        <label htmlFor="admin-section">Sezione</label>
        <select id="admin-section" value={tab} onChange={e=>setTab(e.target.value)}>
          <option value="dashboard">Dashboard</option>
          <option value="archivio">Archivio</option>
          <option value="import">Connect / Import</option>
          <option value="mappa">Mappa & accessibilità</option>
          <option value="qr">QR Precision</option>
          <option value="live">Live</option>
          <option value="privacy">Privacy</option>
        </select>
      </div>

      <div className="admin-desktop-nav">
        {[
          ['dashboard','Dashboard'],
          ['archivio','Archivio'],
          ['import','Connect / Import'],
          ['mappa','Mappa & accessibilità'],
          ['qr','QR Precision'],
          ['live','Live'],
          ['privacy','Privacy'],
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
      {tab==='import'&&<AdminImportManager/>}

      {tab==='mappa'&&<PrecisionAdmin/>}
      {tab==='qr'&&<AdminQrGenerator/>}
      {tab==='live'&&<LivePanel/>}
      {tab==='privacy'&&<PrivacyPanel/>}
    </section>
  </main>
}

function Dashboard(){
  return <><div className="admin-head"><div><span className="eyebrow">DASHBOARD DEMO</span><h1>Dove Riposa Admin</h1></div><span className="status">● Ambiente dimostrativo</span></div>
    <div className="pilot-banner"><b>Backend pilot attivo, dati reali non ancora caricati.</b><span>Autenticazione server-side, database multi-ente e Data Bridge CSV con anteprima sono predisposti. Prima dei dati comunali reali restano da formalizzare referente/DPO, accordi e procedura di validazione dell’ente.</span></div>
    <div className="stats admin-stats"><div><b>2</b><span>Comuni demo</span></div><div><b>7</b><span>marker Precision</span></div><div><b>5</b><span>tratti accessibilità Povegliano</span></div><div><b>0</b><span>dati comunali reali</span></div></div>
    <div className="platform-core-grid">
      <div><span>BRIDGE</span><b>Usa i dati che il Comune ha già</b><p>Import da CSV e gestionali esistenti senza obbligare a sostituire il back-office.</p></div>
      <div><span>PRECISION</span><b>QR come nodi di posizione</b><p>I marker ricalibrano la navigazione nei punti strategici, non sono memoriali sulle tombe.</p></div>
      <div><span>ACCESS</span><b>Routing basato sui tratti reali</b><p>Superficie, pendenza, larghezza, gradini, rampe e punti di sosta verificabili sul posto.</p></div>
      <div><span>LIVE</span><b>Percorsi che possono cambiare</b><p>Chiusure e lavori possono deviare la navigazione invece di lasciare una mappa statica.</p></div>
      <div><span>CHECK</span><b>L’arrivo non viene dato per scontato</b><p>Il sistema mostra settore, fila e posizione e chiede una conferma finale dopo l’ultimo riferimento calibrato.</p></div>
    </div>
    <div className="admin-two"><Panel title="Archivio"><p><b>3</b> record demo · <b>1</b> da verificare</p></Panel><Panel title="Stato pilot"><p>La demo valida il flusso essenziale: import dati, mappa, accessibilità, QR Precision e navigazione. Le funzioni non operative non vengono mostrate come moduli attivi.</p></Panel></div>
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
    <p>La mappa non dichiara un tratto accessibile solo perché appare tale in cartografia. Dove Riposa crea <b>Dove Riposa Access</b>: superficie, pendenza, larghezza, gradini, rampe e punti di sosta vengono precompilati quando possibile e poi validati sul posto.</p>

    <div className="survey-toolbar">
      <div><b>Dove Riposa Access</b><span>{verified}/{segments.length} tratti verificati sul posto</span></div>
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
      <div><span className="check-ok">✓</span><p><b>Permessi pubblici minimizzati</b><small>Posizione, fotocamera e vibrazione sono facoltative e si attivano solo dopo un’azione esplicita dell’utente.</small></p></div>
      <div><span className="check-ok">✓</span><p><b>Demo senza analytics applicativi</b><small>Ricerca e navigazione demo non vengono salvate in un sistema analytics; restano solo gli inevitabili log tecnici dell’infrastruttura.</small></p></div>
      <div><span className="check-ok">✓</span><p><b>Demo non indicizzata</b><small>Le pagine dimostrative sono impostate noindex/nofollow per ridurre il rischio che dati fittizi vengano scambiati per informazioni ufficiali.</small></p></div>
      <div><span className="check-pending">!</span><p><b>Rotazione credenziali admin</b><small>Prima del pilot reale cambia la password amministratore usata durante la demo e non riutilizzarla su altri servizi.</small></p></div>
      <div><span className="check-pending">!</span><p><b>Protezione password compromesse</b><small>Supabase segnala “Leaked Password Protection” non attiva: abilitarla prima della produzione.</small></p></div>
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
