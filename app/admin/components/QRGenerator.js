'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { getPrecisionConfig } from '../../data/precision';

export default function QRGenerator({municipalityId}){
  const config=useMemo(()=>getPrecisionConfig(municipalityId),[municipalityId]);
  const markers=useMemo(()=>Object.values(config.markers),[config]);
  const [origin,setOrigin]=useState('');
  const [items,setItems]=useState([]);
  const [error,setError]=useState('');

  useEffect(()=>{
    setOrigin(window.location.origin);
  },[]);

  useEffect(()=>{
    let cancelled=false;
    if(!origin) return;

    Promise.all(markers.map(async marker=>{
      const url=new URL('/'+municipalityId,origin);
      url.searchParams.set('cal',marker.id);
      url.searchParams.set('src','qr-marker');
      const target=url.toString();
      const dataUrl=await QRCode.toDataURL(target,{
        width:420,
        margin:2,
        errorCorrectionLevel:'H',
        color:{dark:'#18342D',light:'#FFFDF8'}
      });
      return {...marker,target,dataUrl};
    }))
      .then(rows=>{if(!cancelled){setItems(rows);setError('');}})
      .catch(()=>{if(!cancelled)setError('Impossibile generare i QR in questo browser.');});

    return()=>{cancelled=true;};
  },[origin,markers,municipalityId]);

  function download(item){
    const a=document.createElement('a');
    a.href=item.dataUrl;
    a.download=`dove-riposa-${municipalityId}-${item.code.toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function printAll(){
    if(!items.length) return;
    const win=window.open('','_blank','noopener,noreferrer');
    if(!win) return;
    const cards=items.map(item=>`
      <article>
        <img src="${item.dataUrl}" alt="">
        <h2>${item.label}</h2>
        <p class="code">${item.code}</p>
        <p>Dove Riposa Precision · ${config.municipalityName}</p>
        <small>Scansiona per calibrare la posizione in questo punto.</small>
      </article>`
    ).join('');
    win.document.write(`<!doctype html><html lang="it"><head><meta charset="utf-8"><title>QR Dove Riposa - ${config.municipalityName}</title><style>
      body{font-family:Arial,sans-serif;color:#18342D;margin:24px}main{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
      article{border:1px solid #bbb;border-radius:16px;padding:20px;text-align:center;break-inside:avoid}img{width:230px;height:230px}
      h2{margin:10px 0 4px}.code{font-weight:800;letter-spacing:.08em}p{margin:5px 0}small{color:#667}
      @media print{body{margin:0}article{page-break-inside:avoid}}
    </style></head><body><main>${cards}</main><script>window.onload=()=>window.print()<\/script></body></html>`);
    win.document.close();
  }

  return <div className="qr-admin">
    <div className="qr-admin-head">
      <div>
        <span className="eyebrow">MARKER FISICI</span>
        <h3>QR Dove Riposa Precision</h3>
        <p>Ogni QR identifica un punto di calibrazione del cimitero. Scansionandolo, la web app apre il Comune corretto e imposta quel marker come posizione di riferimento.</p>
      </div>
      <button className="secondary" type="button" onClick={printAll} disabled={!items.length}>Stampa tutti</button>
    </div>

    <div className="qr-domain-note">
      <b>Dominio attuale:</b> <span>{origin||'caricamento…'}</span>
      <small>Per cartelli definitivi rigenera i QR dopo aver attivato il dominio stabile di produzione.</small>
    </div>

    {error&&<div className="admin-warning">{error}</div>}

    <div className="qr-grid">
      {items.map(item=><article className="qr-card" key={item.id}>
        <div className="qr-image-wrap">
          <Image src={item.dataUrl} alt={'QR '+item.label} width={220} height={220} unoptimized/>
        </div>
        <div className="qr-card-copy">
          <span className="qr-code-chip">{item.code}</span>
          <h4>{item.label}</h4>
          <p>{config.cemeteryName} · {config.municipalityName}</p>
          <code>{item.target}</code>
          <div className="qr-actions">
            <button type="button" className="primary" onClick={()=>download(item)}>Scarica PNG</button>
            <a className="secondary" href={item.target} target="_blank" rel="noreferrer">Testa QR</a>
          </div>
        </div>
      </article>)}
    </div>

    <div className="admin-warning">
      I QR Precision vanno installati solo in punti realmente rilevati e validati. Non serve un QR su ogni tomba: servono marker strategici per ricalibrare la posizione durante il percorso.
    </div>
  </div>;
}
