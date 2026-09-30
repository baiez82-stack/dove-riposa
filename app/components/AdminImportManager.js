'use client';

import { useEffect, useMemo, useState } from 'react';
import { getImportTargets, importBurials } from '../admin/import/actions';

const sourceProfiles=[
  {id:'generic_csv',label:'CSV standard',desc:'File preparato con il template Dove Riposa.'},
  {id:'existing_management',label:'Gestionale esistente',desc:'Export CSV dal software già usato dal Comune.'},
  {id:'tombal_siscom',label:'Tombal / Siscom',desc:'Import da export CSV con mappatura assistita delle colonne. Nessuna integrazione ufficiale dichiarata.'},
  {id:'other',label:'Altro archivio',desc:'CSV proveniente da un altro gestionale o archivio storico.'}
];

const fields=[
  {key:'first_name',label:'Nome',required:true,synonyms:['nome','first name','firstname','given name']},
  {key:'last_name',label:'Cognome',required:true,synonyms:['cognome','last name','lastname','surname']},
  {key:'birth_year',label:'Anno nascita',synonyms:['anno nascita','anno di nascita','nascita','birth year','birthyear']},
  {key:'death_year',label:'Anno morte',synonyms:['anno morte','anno di morte','morte','death year','deathyear']},
  {key:'sector',label:'Settore / Campo',synonyms:['settore','campo','blocco','area','sector']},
  {key:'row_label',label:'Fila',synonyms:['fila','riga','row']},
  {key:'position_label',label:'Posizione',synonyms:['posizione','posto','loculo','tomba','cippo','numero','position']},
  {key:'map_x',label:'Coordinata X',synonyms:['map x','x','coord x','coordinata x']},
  {key:'map_y',label:'Coordinata Y',synonyms:['map y','y','coord y','coordinata y']},
  {key:'source_ref',label:'Riferimento sorgente',synonyms:['id','codice','matricola','source ref','riferimento']},
  {key:'source_updated_at',label:'Data aggiornamento sorgente',synonyms:['aggiornato il','data aggiornamento','updated at','last update']}
];


function parseDelimited(text){
  const firstLine=String(text||'').replace(/^\uFEFF/,'').split(/\r?\n/,1)[0]||'';
  const candidates=[';',',','\t'];
  let delimiter=';';
  let best=-1;
  for(const candidate of candidates){
    const count=firstLine.split(candidate).length-1;
    if(count>best){best=count;delimiter=candidate;}
  }

  const rows=[];
  let row=[];
  let cell='';
  let quoted=false;
  const source=String(text||'').replace(/^\uFEFF/,'');
  for(let i=0;i<source.length;i++){
    const ch=source[i];
    if(ch==='"'){
      if(quoted&&source[i+1]==='"'){cell+='"';i++;}
      else quoted=!quoted;
      continue;
    }
    if(!quoted&&ch===delimiter){row.push(cell);cell='';continue;}
    if(!quoted&&(ch==='\n'||ch==='\r')){
      if(ch==='\r'&&source[i+1]==='\n') i++;
      row.push(cell);cell='';
      if(row.some(value=>String(value).trim()!=='')) rows.push(row);
      row=[];
      continue;
    }
    cell+=ch;
  }
  row.push(cell);
  if(row.some(value=>String(value).trim()!=='')) rows.push(row);
  return rows;
}

function normalizeHeader(value){
  return String(value??'')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/[_-]+/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

function autoMap(headers){
  const result={};
  const normalized=headers.map(h=>normalizeHeader(h));

  for(const field of fields){
    const all=[field.label,...field.synonyms].map(normalizeHeader);
    let idx=normalized.findIndex(h=>all.includes(h));
    if(idx===-1){
      idx=normalized.findIndex(h=>all.some(s=>s.length>3 && h.includes(s)));
    }
    result[field.key]=idx>=0 ? String(idx) : '';
  }
  return result;
}

function cellText(value){
  if(value===null||value===undefined) return '';
  if(value instanceof Date) return value.toISOString();
  return String(value).trim();
}

function templateCsv(){
  const rows=[
    ['Nome','Cognome','Anno nascita','Anno morte','Settore','Fila','Posizione','Riferimento sorgente'],
    ['Mario','Rossi','1941','2024','Settore B','7','Loculo 18','ID-001'],
    ['Anna','Bianchi','1936','2022','Campo A','3','Tomba 42','ID-002']
  ];
  return rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(';')).join('\n');
}

export default function AdminImportManager(){
  const [sourceSystem,setSourceSystem]=useState('generic_csv');
  const [targets,setTargets]=useState([]);
  const [targetId,setTargetId]=useState('');
  const [loadingTargets,setLoadingTargets]=useState(true);
  const [fileName,setFileName]=useState('');
  const [headers,setHeaders]=useState([]);
  const [rows,setRows]=useState([]);
  const [mapping,setMapping]=useState({});
  const [sheetName,setSheetName]=useState('');
  const [parseError,setParseError]=useState('');
  const [result,setResult]=useState(null);
  const [importing,setImporting]=useState(false);
  const [profileName,setProfileName]=useState('');
  const [profiles,setProfiles]=useState([]);

  useEffect(()=>{
    try{
      const stored=JSON.parse(localStorage.getItem('dr-import-profiles')||'[]');
      if(Array.isArray(stored)) setProfiles(stored.slice(0,20));
    }catch{}
  },[]);

  useEffect(()=>{
    let active=true;
    getImportTargets().then(res=>{
      if(!active) return;
      if(res?.ok){
        setTargets(res.targets||[]);
        if(res.targets?.[0]) setTargetId(res.targets[0].cemeteryId);
      }else{
        setParseError(res?.error||'Impossibile leggere i cimiteri disponibili.');
      }
      setLoadingTargets(false);
    });
    return()=>{active=false;};
  },[]);

  async function readFile(file){
    setParseError('');
    setResult(null);
    setFileName(file?.name||'');
    setHeaders([]);
    setRows([]);
    setMapping({});

    if(!file) return;

    try{
      const text=await file.text();
      const matrix=parseDelimited(text);
      const firstSheet='CSV';

      const clean=matrix.filter(row=>Array.isArray(row)&&row.some(cell=>String(cell??'').trim()!==''));
      if(clean.length<2) throw new Error('Il file deve contenere intestazioni e almeno una riga dati.');

      const headerRow=clean[0].map((v,i)=>cellText(v)||`Colonna ${i+1}`);
      const body=clean.slice(1).slice(0,5000).map(row=>headerRow.map((_,i)=>cellText(row[i])));

      setSheetName(firstSheet);
      setHeaders(headerRow);
      setRows(body);
      setMapping(autoMap(headerRow));

      if(clean.length-1>5000){
        setParseError('Il file contiene più di 5.000 righe: questa versione importa al massimo le prime 5.000 per batch.');
      }
    }catch(error){
      setParseError(error?.message||'File non leggibile.');
    }
  }

  const mappedRows=useMemo(()=>rows.map(row=>{
    const out={};
    for(const field of fields){
      const idx=mapping[field.key];
      out[field.key]=idx===''||idx===undefined ? '' : row[Number(idx)] ?? '';
    }
    return out;
  }),[rows,mapping]);

  const validation=useMemo(()=>{
    let valid=0;
    let invalid=0;
    let missingLocation=0;
    for(const row of mappedRows){
      const hasName=String(row.first_name||'').trim()&&String(row.last_name||'').trim();
      if(!hasName){invalid++;continue;}
      valid++;
      if(!String(row.sector||'').trim()&&!String(row.row_label||'').trim()&&!String(row.position_label||'').trim()){
        missingLocation++;
      }
    }
    return {valid,invalid,missingLocation};
  },[mappedRows]);

  const requiredMapped=fields.filter(f=>f.required).every(f=>mapping[f.key]!==''&&mapping[f.key]!==undefined);
  const selectedTarget=targets.find(t=>t.cemeteryId===targetId);

  function currentColumnProfile(){
    const columns={};
    for(const field of fields){
      const idx=mapping[field.key];
      if(idx!==''&&idx!==undefined&&headers[Number(idx)]) columns[field.key]=headers[Number(idx)];
    }
    return columns;
  }

  function saveMappingProfile(){
    const name=profileName.trim();
    if(!name||!headers.length) return;
    const next=[
      {id:String(Date.now()),name,sourceSystem,columns:currentColumnProfile()},
      ...profiles.filter(p=>p.name.toLowerCase()!==name.toLowerCase())
    ].slice(0,20);
    setProfiles(next);
    try{localStorage.setItem('dr-import-profiles',JSON.stringify(next));}catch{}
  }

  function applyMappingProfile(profileId){
    const profile=profiles.find(p=>p.id===profileId);
    if(!profile) return;
    const next={};
    for(const field of fields){
      const wanted=normalizeHeader(profile.columns?.[field.key]||'');
      const idx=headers.findIndex(h=>normalizeHeader(h)===wanted);
      next[field.key]=idx>=0?String(idx):'';
    }
    setMapping(next);
    setSourceSystem(profile.sourceSystem||profile.sourceType||'existing_management');
    setProfileName(profile.name||'');
  }

  async function runImport(){
    if(!requiredMapped||!targetId||!mappedRows.length||validation.valid===0) return;

    setImporting(true);
    setResult(null);
    try{
      const response=await importBurials({
        cemeteryId:targetId,
        filename:fileName||'import',
        sourceSystem,
        sourceName:(sourceProfiles.find(x=>x.id===sourceSystem)||sourceProfiles[0]).label,
        mappingProfile:{
          name:profileName.trim()||'Mappatura corrente',
          sourceType:sourceSystem,
          columns:currentColumnProfile()
        },
        rows:mappedRows
      });
      setResult(response);
    }catch{
      setResult({ok:false,error:'Errore inatteso durante l’importazione.'});
    }finally{
      setImporting(false);
    }
  }

  function downloadTemplate(){
    const blob=new Blob([templateCsv()],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download='dove-riposa-template-import.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return <div className="admin-panel import-manager">
    <div className="import-manager-head">
      <div>
        <span className="eyebrow">DOVE RIPOSA CONNECT</span>
        <h2>Collega i dati che il Comune possiede già</h2>
        <p>Dove Riposa non richiede di sostituire il gestionale cimiteriale: importa un export CSV, memorizza la mappatura delle colonne e riutilizzala negli aggiornamenti successivi. I record entrano sempre come <b>bozza</b>.</p>
      </div>
      <button type="button" className="secondary" onClick={downloadTemplate}>Scarica template CSV</button>
    </div>

    <div className="connect-source-grid">
      <label>Profilo di mappatura salvato
        <select defaultValue="" onChange={e=>{if(e.target.value)applyMappingProfile(e.target.value);}}>
          <option value="">Nessun profilo</option>
          {profiles.map(profile=><option key={profile.id} value={profile.id}>{profile.name}</option>)}
        </select>
      </label>
      <div className="connect-source-note">
        <b>Interoperabilità prima del lock-in.</b>
        <span>Il Comune può continuare a usare il proprio gestionale. Dove Riposa importa l’export necessario a ricerca, accessibilità e navigazione senza sostituire il back-office.</span>
      </div>
    </div>

    <div className="import-step">
      <div className="import-step-number">1</div>
      <div className="import-step-body">
        <h3>Da dove arrivano i dati?</h3>
        <p>Dove Riposa non obbliga il Comune a cambiare gestionale: importa solo i dati necessari al servizio cittadino.</p>
        <div className="source-profile-grid">
          {sourceProfiles.map(profile=><button key={profile.id} type="button" className={sourceSystem===profile.id?'source-profile active':'source-profile'} onClick={()=>setSourceSystem(profile.id)}>
            <b>{profile.label}</b><span>{profile.desc}</span>
          </button>)}
        </div>
      </div>
    </div>

    <div className="import-step">
      <div className="import-step-number">2</div>
      <div className="import-step-body">
        <h3>Scegli Comune e cimitero</h3>
        {loadingTargets
          ? <p>Caricamento enti abilitati…</p>
          : <select className="import-target-select" value={targetId} onChange={e=>setTargetId(e.target.value)}>
              {targets.map(t=><option key={t.cemeteryId} value={t.cemeteryId}>
                {t.municipality}{t.province?' ('+t.province+')':''} · {t.cemeteryName}
              </option>)}
            </select>}
      </div>
    </div>

    <div className="import-step">
      <div className="import-step-number">3</div>
      <div className="import-step-body">
        <h3>Carica il file</h3>
        <label className="import-drop">
          <input type="file" accept=".csv,.txt" onChange={e=>readFile(e.target.files?.[0])}/>
          <span className="import-drop-icon">↑</span>
          <b>{fileName||'Scegli file CSV'}</b>
          <small>{fileName ? `${rows.length} righe · foglio ${sheetName}` : 'Massimo 5.000 righe per importazione · da Excel esporta in CSV'}</small>
        </label>
      </div>
    </div>

    {headers.length>0&&<div className="import-step">
      <div className="import-step-number">4</div>
      <div className="import-step-body">
        <h3>Associa le colonne</h3>
        <p>Abbiamo provato a riconoscerle automaticamente. Correggi solo quelle sbagliate.</p>
        <div className="mapping-grid">
          {fields.map(field=><label key={field.key}>
            <span>{field.label}{field.required&&<b> *</b>}</span>
            <select value={mapping[field.key]??''} onChange={e=>setMapping({...mapping,[field.key]:e.target.value})}>
              <option value="">Non importare</option>
              {headers.map((header,i)=><option key={i} value={String(i)}>{header}</option>)}
            </select>
          </label>)}
        </div>
        <div className="mapping-profile-save">
          <div>
            <b>Riutilizza questa mappatura</b>
            <span>Salvala con il nome del gestionale o dell’export ricevuto dal Comune.</span>
          </div>
          <input value={profileName} onChange={e=>setProfileName(e.target.value)} placeholder="es. Export gestionale Pescantina"/>
          <button type="button" className="secondary" onClick={saveMappingProfile} disabled={!profileName.trim()}>Salva profilo</button>
        </div>
      </div>
    </div>}

    {rows.length>0&&<div className="import-step">
      <div className="import-step-number">5</div>
      <div className="import-step-body">
        <div className="import-preview-head">
          <div><h3>Controlla prima di importare</h3><p>Anteprima delle prime 5 righe.</p></div>
          <div className="import-stats">
            <span className="ok">{validation.valid} valide</span>
            <span className={validation.invalid?'bad':''}>{validation.invalid} con errori</span>
            <span>{validation.missingLocation} senza posizione</span>
          </div>
        </div>

        <div className="import-preview-scroll">
          <table className="import-preview-table">
            <thead><tr><th>Nome</th><th>Cognome</th><th>Nascita</th><th>Morte</th><th>Settore</th><th>Fila</th><th>Posizione</th></tr></thead>
            <tbody>
              {mappedRows.slice(0,5).map((r,i)=><tr key={i} className={!String(r.first_name).trim()||!String(r.last_name).trim()?'invalid':''}>
                <td>{r.first_name||'—'}</td><td>{r.last_name||'—'}</td><td>{r.birth_year||'—'}</td><td>{r.death_year||'—'}</td><td>{r.sector||'—'}</td><td>{r.row_label||'—'}</td><td>{r.position_label||'—'}</td>
              </tr>)}
            </tbody>
          </table>
        </div>

        {!requiredMapped&&<div className="admin-warning">Associa almeno le colonne <b>Nome</b> e <b>Cognome</b>.</div>}
        {validation.missingLocation>0&&<div className="admin-warning">{validation.missingLocation} record non hanno settore, fila o posizione. Possono essere importati, ma resteranno da completare prima della pubblicazione.</div>}

        <div className="import-confirm">
          <div>
            <b>{selectedTarget ? selectedTarget.municipality+' · '+selectedTarget.cemeteryName : 'Seleziona il cimitero'}</b>
            <span>Origine: {(sourceProfiles.find(item=>item.id===sourceSystem)||sourceProfiles[0]).label}. Tutti i nuovi record saranno salvati come “bozza”; i duplicati vengono saltati.</span>
          </div>
          <button className="primary" type="button" disabled={importing||!requiredMapped||!targetId||validation.valid===0} onClick={runImport}>
            {importing?'Importazione in corso…':`Importa ${validation.valid} record`}
          </button>
        </div>
      </div>
    </div>}

    {parseError&&<div className="import-message">{parseError}</div>}

    {result&&<div className={result.ok?'import-result success':'import-result error'}>
      <b>{result.ok?'Importazione completata':'Importazione non completata'}</b>
      <p>{result.ok?result.message:result.error}</p>
      {result.ok&&<div className="import-result-grid">
        <span><strong>{result.imported}</strong> importati</span>
        <span><strong>{result.skipped}</strong> duplicati saltati</span>
        <span><strong>{result.invalidCount}</strong> righe non valide</span>
      </div>}
      {result.invalid?.length>0&&<details><summary>Vedi righe non valide</summary>
        <ul>{result.invalid.map((item,i)=><li key={i}>Riga {item.row}: {item.reason}</li>)}</ul>
      </details>}
    </div>}

    <div className="admin-warning">
      <b>Regola di sicurezza:</b> l’import non pubblica automaticamente nulla. Prima dell’uso con archivi comunali reali vanno completati accordi, informativa, ruoli privacy, hosting idoneo e procedura di validazione dell’ente.
    </div>
  </div>;
}
