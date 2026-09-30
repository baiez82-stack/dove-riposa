'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { municipalities } from '../data/municipalities';

const SUGGEST_RADIUS_METERS = 5000;

function toRad(value){ return value*Math.PI/180; }

function distanceMeters(aLat,aLng,bLat,bLng){
  const R=6371000;
  const dLat=toRad(bLat-aLat);
  const dLng=toRad(bLng-aLng);
  const x=Math.sin(dLat/2)**2+
    Math.cos(toRad(aLat))*Math.cos(toRad(bLat))*Math.sin(dLng/2)**2;
  return 2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}

function formatDistance(value){
  if(value<1000) return Math.max(50,Math.round(value/50)*50)+' m';
  return (Math.round(value/100)/10).toFixed(1).replace('.',',')+' km';
}

export default function NearbyCemeteryDetector(){
  const router=useRouter();
  const [state,setState]=useState('idle');
  const [message,setMessage]=useState('');
  const [suggestion,setSuggestion]=useState(null);

  const cemeteries=useMemo(()=>municipalities.flatMap(m=>
    m.cemeteries
      .filter(c=>Number.isFinite(c.geo?.lat)&&Number.isFinite(c.geo?.lng))
      .map(c=>({...c,municipalityId:m.id,municipalityName:m.name,province:m.province}))
  ),[]);

  function locate(){
    setSuggestion(null);

    if(!navigator.geolocation){
      setState('error');
      setMessage('La posizione non è disponibile. Cerca il Comune manualmente.');
      return;
    }

    setState('loading');
    setMessage('');

    navigator.geolocation.getCurrentPosition(
      position=>{
        const {latitude,longitude}=position.coords;
        const nearest=cemeteries
          .map(c=>({...c,distance:distanceMeters(latitude,longitude,c.geo.lat,c.geo.lng)}))
          .sort((a,b)=>a.distance-b.distance)[0];

        if(!nearest){
          setState('error');
          setMessage('Nessun cimitero geolocalizzato nella demo. Cerca il Comune manualmente.');
          return;
        }

        if(nearest.distance>SUGGEST_RADIUS_METERS){
          setState('far');
          setMessage('Non risulti vicino a un cimitero attivo. Cerca il Comune manualmente.');
          return;
        }

        setSuggestion(nearest);
        setState('found');
      },
      error=>{
        setState('error');
        setMessage(error.code===1
          ? 'Posizione non autorizzata. Puoi cercare il Comune qui sotto.'
          : 'Non riesco a rilevare la posizione. Puoi cercare il Comune qui sotto.');
      },
      {enableHighAccuracy:true,timeout:9000,maximumAge:120000}
    );
  }

  function openSuggestion(){
    if(!suggestion) return;
    const params=new URLSearchParams({cem:suggestion.id,src:'geo'});
    router.push('/'+suggestion.municipalityId+'?'+params.toString());
  }

  return <div className={'nearby-cemetery '+state}>
    <button className="geo-primary" type="button" onClick={locate} disabled={state==='loading'}>
      <span className="geo-icon" aria-hidden="true">◎</span>
      <span>{state==='loading'?'Sto cercando il cimitero…':'Rileva il cimitero vicino a me'}</span>
      <span className="geo-arrow" aria-hidden="true">↗</span>
    </button>

    {suggestion&&<div className="nearby-result" aria-live="polite">
      <div className="nearby-result-icon" aria-hidden="true">⌖</div>
      <div className="nearby-result-copy">
        <span className="nearby-result-kicker">Potresti essere qui</span>
        <strong>{suggestion.name}</strong>
        <p>{suggestion.municipalityName} · {suggestion.province} · circa {formatDistance(suggestion.distance)}</p>
      </div>
      <button type="button" className="nearby-open" onClick={openSuggestion}>Apri <span>→</span></button>
    </div>}

    {message&&<p className="nearby-message" aria-live="polite">{message}</p>}
    <small>Usiamo la posizione solo per confrontarla con i cimiteri disponibili. Non viene salvata.</small>
  </div>;
}
