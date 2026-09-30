'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { precisionConfigs } from '../data/precision';

function safeBaseUrl(value){
  return String(value||'').trim().replace(/\/$/,'');
}

export default function AdminQrGenerator(){
  const municipalityIds=Object.keys(precisionConfigs);
  const [municipalityId,setMunicipalityId]=useState(municipalityIds[0]);
  const [baseUrl,setBaseUrl]=useState('');
  const [images,setImages]=useState({});
  const [error,setError]=useState('');

  const config=precisionConfigs[municipalityId];
  const markers=useMemo(()=>Object.values(config.markers),[config]);

  useEffect(()=>{
    setBaseUrl(window.location.origin);
  },[]);

  const qrEntries=useMemo(()=>{
    const base=safeBaseUrl(baseUrl);
    if(!base) return [];
    return markers.map(marker=>({
      ...marker,
      url:`${base}/${municipalityId}?cal=${encodeURIComponent(marker.id)}&src=qr-marker`
    }));
  },[baseUrl,municipalityId,markers]);

  useEffect(()=>{
    let cancelled=false;
    setImages({});
    setError('');
    if(!qrEntries.length) return;

    Promise.all(qrEntries.map(async entry=>{
      const dataUrl=await QRCode.toDataURL(entry.url,{
        errorCorrectionLevel:'H',
        margin:2,
        width:640,
        color:{dark:'#18342D',light:'#FFFDF8'}
      });
      return [entry.id,dataUrl];
    }))
      .then(pairs=>{if(!cancelled)setImages(Object.fromEntries(pairs));})
      .catch(()=>{if(!cancelled)setError('Non riesco a generare i QR. Riprova o verifica il dominio.');});

    return()=>{cancelled=true;};
  },[qrEntries]);

  function download(entry){
    const src=images[entry.id];
    if(!src) return;
    const a=document.createElement('a');
    a.href=src;
    a.download=`dove-riposa-${municipalityId}-${entry.id}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function copy(entry){
    try{
      await navigator.clipboard.writeText(entry.url);
    }catch{
      setError('Copia automatica non disponibile: usa il link mostrato sotto al QR.');
    }
  }

  return <div className="admin-panel qr-admin-panel">
    <div className="qr-admin-head">
      <div>
        <span className="eyebrow">DOVE RIPOSA PRECISION</span>
        <h2>QR di posizione</h2>
        <p>Genera i QR fisici per i marker di calibrazione. Ogni QR apre direttamente il Comune e comunica a Dove Riposa il punto in cui si trova l’utente.</p>
      </div>
      <span className="status">● Generazione locale</span>
    </div>

    <div className="qr-settings">
      <label>Comune
        <select value={municipalityId} onChange={e=>setMunicipalityId(e.target.value)}>
          {municipalityIds.map(id=><option key={id} value={id}>{precisionConfigs[id].municipalityName}</option>)}
        </select>
      </label>
      <label>Dominio usato nei QR
        <input value={baseUrl} onChange={e=>setBaseUrl(e.target.value)} placeholder="https://dove-riposa.onrender.com"/>
      </label>
    </div>

    <div className="admin-warning qr-warning">
      <b>Prima di stampare:</b> usa il dominio che rimarrà attivo. Se in futuro passi a un dominio definitivo, rigenera i QR. Il marker fisico va collocato esattamente nel punto a cui è associato.
    </div>

    {error&&<div className="login-error">{error}</div>}

    <div className="qr-grid">
      {qrEntries.map(entry=><article className="qr-card" key={entry.id}>
        <div className="qr-card-top">
          <div>
            <span>{entry.code}</span>
            <h3>{entry.label}</h3>
            <p>{config.cemeteryName} · {config.municipalityName}</p>
          </div>
          <span className="qr-marker-id">{entry.id}</span>
        </div>

        <div className="qr-image-wrap">
          {images[entry.id]
            ? <Image src={images[entry.id]} alt={`QR ${entry.label}`} width={260} height={260} unoptimized/>
            : <div className="qr-loading">Genero QR…</div>}
        </div>

        <code className="qr-url">{entry.url}</code>

        <div className="qr-actions">
          <button className="primary" type="button" onClick={()=>download(entry)} disabled={!images[entry.id]}>Scarica PNG</button>
          <a className="secondary qr-test-link" href={entry.url} target="_blank" rel="noreferrer">Testa QR</a>
          <button className="secondary" type="button" onClick={()=>copy(entry)}>Copia link</button>
        </div>

        <small className="qr-note">Errore correzione alto (H) · adatto alla stampa demo. Verifica sempre il QR dal telefono prima di applicarlo sul posto.</small>
      </article>)}
    </div>
  </div>;
}
