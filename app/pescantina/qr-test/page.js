'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import BrandLockup from '../../components/BrandLockup';

const entries=[
  {id:'ingresso',title:'1 · INGRESSO',subtitle:'Posizionalo all’ingresso principale'},
  {id:'centro',title:'2 · NODO A',subtitle:'Primo punto strategico scelto durante il sopralluogo'},
  {id:'testata',title:'3 · NODO B',subtitle:'Secondo punto strategico scelto durante il sopralluogo'}
];

export default function QrTestPage(){
  const [qrs,setQrs]=useState({});

  useEffect(()=>{
    let active=true;
    Promise.all(entries.map(async entry=>{
      const url=window.location.origin+'/pescantina?cal='+encodeURIComponent(entry.id)+'&src=qr-marker';
      const dataUrl=await QRCode.toDataURL(url,{errorCorrectionLevel:'H',margin:2,width:900});
      return [entry.id,{...entry,url,dataUrl}];
    })).then(items=>{
      if(active) setQrs(Object.fromEntries(items));
    });
    return()=>{active=false;};
  },[]);

  return <main className="qr-print-page">
    <header className="qr-print-header">
      <Link href="/pescantina?fieldtest=1" className="citizen-brand"><BrandLockup subtitle="Pescantina · field test"/></Link>
      <div className="qr-print-actions">
        <button className="primary" type="button" onClick={()=>window.print()}>Stampa i 3 QR</button>
        <Link className="secondary link-button" href="/pescantina?fieldtest=1">← Torna alla prova</Link>
      </div>
    </header>

    <section className="qr-print-intro">
      <span className="eyebrow">DOVE RIPOSA PRECISION · TEST</span>
      <h1>QR da stampare per il sopralluogo</h1>
      <p>Stampa questi tre fogli. Non fissarli in modo permanente: domani servono solo per validare ingresso, ricalibrazione e percorso.</p>
    </section>

    <section className="qr-print-grid">
      {entries.map(entry=>{
        const item=qrs[entry.id];
        return <article className="qr-print-card" key={entry.id}>
          <div className="qr-print-label">
            <span>DOVE RIPOSA PRECISION</span>
            <h2>{entry.title}</h2>
            <p>{entry.subtitle}</p>
          </div>
          {item?.dataUrl
            ? <img src={item.dataUrl} alt={'QR '+entry.title}/>
            : <div className="qr-loading">Genero QR…</div>}
          <div className="qr-print-code">PESCANTINA · {entry.id.toUpperCase()}</div>
        </article>;
      })}
    </section>
  </main>;
}
