'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { precisionConfig, getPrecisionMarkerList } from '../data/precision-config';

function safeName(value){
  return String(value||'qr').toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-|-$/g,'');
}

export default function QrManager(){
  const municipalityIds=Object.keys(precisionConfig);
  const [municipalityId,setMunicipalityId]=useState(municipalityIds[0]);
  const [cemeteryId,setCemeteryId]=useState('cimitero-comunale');
  const [markerId,setMarkerId]=useState('');
  const [baseUrl,setBaseUrl]=useState('');
  const [preview,setPreview]=useState('');
  const [svg,setSvg]=useState('');
  const [message,setMessage]=useState('');

  const municipality=precisionConfig[municipalityId];
  const cemeteryIds=Object.keys(municipality?.cemeteries||{});
  const cemetery=municipality?.cemeteries?.[cemeteryId];
  const markers=useMemo(()=>getPrecisionMarkerList(municipalityId,cemeteryId),[municipalityId,cemeteryId]);
  const marker=markers.find(m=>m.id===markerId)||markers[0];

  useEffect(()=>{
    setBaseUrl(window.location.origin);
  },[]);

  useEffect(()=>{
    if(!cemeteryIds.includes(cemeteryId)) setCemeteryId(cemeteryIds[0]||'');
  },[municipalityId]);

  useEffect(()=>{
    if(markers.length&&!markers.some(m=>m.id===markerId)) setMarkerId(markers[0].id);
  },[municipalityId,cemeteryId,markers,markerId]);

  const destination=useMemo(()=>{
    if(!baseUrl||!marker) return '';
    const clean=baseUrl.replace(/\/+$/,'');
    const params=new URLSearchParams({
      cem:cemeteryId,
      cal:marker.id,
      src:'qr-marker'
    });
    return `${clean}/${municipalityId}?${params.toString()}`;
  },[baseUrl,municipalityId,cemeteryId,marker]);

  useEffect(()=>{
    let active=true;
    if(!destination){setPreview('');setSvg('');return;}
    Promise.all([
      QRCode.toDataURL(destination,{errorCorrectionLevel:'H',margin:2,width:520,color:{dark:'#18342D',light:'#FFFDF8'}}),
      QRCode.toString(destination,{type:'svg',errorCorrectionLevel:'H',margin:2,width:520,color:{dark:'#18342D',light:'#FFFDF8'}})
    ]).then(([png,svgText])=>{
      if(!active) return;
      setPreview(png);
      setSvg(svgText);
      setMessage('');
    }).catch(()=>setMessage('Non riesco a generare il QR.'));
    return()=>{active=false;};
  },[destination]);

  function downloadPng(){
    if(!preview||!marker) return;
    const a=document.createElement('a');
    a.href=preview;
    a.download=`dove-riposa-${safeName(municipalityId)}-${safeName(marker.code)}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function downloadSvg(){
    if(!svg||!marker) return;
    const blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download=`dove-riposa-${safeName(municipalityId)}-${safeName(marker.code)}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function copyLink(){
    try{
      await navigator.clipboard.writeText(destination);
      setMessage('Link copiato.');
    }catch{
      setMessage('Copia manualmente il link mostrato sotto.');
    }
  }

  return <div className="qr-admin">
    <div className="admin-head qr-admin-head">
      <div>
        <span className="eyebrow">DOVE RIPOSA PRECISION</span>
        <h1>Nodi QR Precision</h1>
      </div>
      <span className="status">QR reali · dati demo</span>
    </div>

    <div className="pilot-banner">
      <b>Questi QR sono realmente scansionabili.</b>
      <span>Ogni QR identifica un punto fisico del cimitero. Non identifica una persona: apre la pagina del Comune e conferma il nodo da cui Dove Riposa può ripartire.</span>
    </div>

    <div className="qr-admin-grid">
      <div className="admin-panel qr-config-panel">
        <h2>Genera QR</h2>

        <label>Comune
          <select value={municipalityId} onChange={e=>setMunicipalityId(e.target.value)}>
            {municipalityIds.map(id=><option key={id} value={id}>{precisionConfig[id].municipalityName}</option>)}
          </select>
        </label>

        <label>Cimitero
          <select value={cemeteryId} onChange={e=>setCemeteryId(e.target.value)}>
            {cemeteryIds.map(id=><option key={id} value={id}>{municipality?.cemeteries?.[id]?.name}</option>)}
          </select>
        </label>

        <label>Nodo di posizione
          <select value={marker?.id||''} onChange={e=>setMarkerId(e.target.value)}>
            {markers.map(m=><option key={m.id} value={m.id}>{m.code} · {m.label}</option>)}
          </select>
        </label>

        <label>Dominio base
          <input value={baseUrl} onChange={e=>setBaseUrl(e.target.value)} placeholder="https://dove-riposa.onrender.com"/>
        </label>

        <div className="qr-marker-meta">
          <span>Codice nodo</span>
          <b>{marker?.code||'—'}</b>
          <small>{marker?.label||'Nessun nodo'}</small>
        </div>

        <div className="admin-warning">Per una stampa definitiva usa un dominio stabile. Se cambi dominio dopo aver stampato i QR, dovrai rigenerarli oppure mantenere il vecchio dominio come redirect.</div>
      </div>

      <div className="admin-panel qr-preview-panel">
        <div className="qr-preview-title">
          <div><span className="eyebrow">ANTEPRIMA</span><h2>{marker?.label||'QR marker'}</h2></div>
          <span className="qr-code-chip">{marker?.code||'—'}</span>
        </div>

        <div className="qr-preview-box">
          {preview?<Image src={preview} width={260} height={260} alt={`QR ${marker?.label||'marker'}`} unoptimized/>:<span>Generazione QR…</span>}
        </div>

        <div className="qr-destination">
          <span>Destinazione</span>
          <code>{destination||'—'}</code>
        </div>

        <div className="qr-actions">
          <button className="primary" type="button" onClick={downloadPng}>Scarica PNG</button>
          <button className="secondary" type="button" onClick={downloadSvg}>Scarica SVG</button>
          <button className="secondary" type="button" onClick={copyLink}>Copia link</button>
          {destination&&<a className="secondary qr-test-link" href={destination} target="_blank" rel="noreferrer">Prova QR →</a>}
        </div>
        {message&&<div className="import-message">{message}</div>}
      </div>
    </div>

    <div className="admin-panel">
      <h2>Nodi disponibili</h2>
      <div className="qr-marker-list">
        {markers.map(m=><button key={m.id} className={marker?.id===m.id?'qr-marker-row active':'qr-marker-row'} onClick={()=>setMarkerId(m.id)}>
          <div><b>{m.label}</b><span>{m.code}</span></div>
          <span>{m.id===marker?.id?'Selezionato':'Genera →'}</span>
        </button>)}
      </div>
    </div>
  </div>;
}
