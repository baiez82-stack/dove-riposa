'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { municipalities } from '../data/municipalities';

const AUTO_OPEN_RADIUS_METERS = 900;

function toRad(value){ return value*Math.PI/180; }

function distanceMeters(aLat,aLng,bLat,bLng){
  const R=6371000;
  const dLat=toRad(bLat-aLat);
  const dLng=toRad(bLng-aLng);
  const x=Math.sin(dLat/2)**2+
    Math.cos(toRad(aLat))*Math.cos(toRad(bLat))*Math.sin(dLng/2)**2;
  return 2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}

export default function NearbyCemeteryDetector(){
  const router=useRouter();
  const [state,setState]=useState('idle');
  const [message,setMessage]=useState('');

  const cemeteries=useMemo(()=>municipalities.flatMap(m=>
    m.cemeteries
      .filter(c=>Number.isFinite(c.geo?.lat)&&Number.isFinite(c.geo?.lng))
      .map(c=>({...c,municipalityId:m.id,municipalityName:m.name,province:m.province}))
  ),[]);

  function locate(silent=false){
    if(!navigator.geolocation){
      if(!silent){
        setState('error');
        setMessage('La posizione non è disponibile su questo dispositivo. Usa la scelta manuale.');
      }
      return;
    }

    setState('loading');
    setMessage('Rilevo il cimitero più vicino…');

    navigator.geolocation.getCurrentPosition(
      position=>{
        const {latitude,longitude}=position.coords;
        const ranked=cemeteries
          .map(c=>({...c,distance:distanceMeters(latitude,longitude,c.geo.lat,c.geo.lng)}))
          .sort((a,b)=>a.distance-b.distance);
        const nearest=ranked[0];

        if(!nearest){
          setState('error');
          setMessage('Nessun cimitero attivo dispone ancora della posizione. Usa la scelta manuale.');
          return;
        }

        if(nearest.distance<=AUTO_OPEN_RADIUS_METERS){
          setState('found');
          setMessage('Rilevato: '+nearest.name+' · '+nearest.municipalityName);
          const params=new URLSearchParams({cem:nearest.id,src:'geo'});
          setTimeout(()=>router.push('/'+nearest.municipalityId+'?'+params.toString()),550);
          return;
        }

        setState('far');
        setMessage('Non risulti vicino a un cimitero attivo. Scegli il Comune manualmente.');
      },
      error=>{
        if(silent){
          setState('idle');
          setMessage('');
          return;
        }
        setState('error');
        setMessage(error.code===1
          ? 'Posizione non autorizzata. Puoi continuare scegliendo il Comune.'
          : 'Non riesco a rilevare la posizione. Puoi continuare scegliendo il Comune.');
      },
      {enableHighAccuracy:true,timeout:9000,maximumAge:120000}
    );
  }

  useEffect(()=>{
    let cancelled=false;
    if(!navigator.permissions?.query) return;
    navigator.permissions.query({name:'geolocation'}).then(result=>{
      if(!cancelled&&result.state==='granted') locate(true);
    }).catch(()=>{});
    return()=>{cancelled=true;};
  },[]);

  return <div className={'nearby-cemetery '+state}>
    <button type="button" onClick={()=>locate(false)} disabled={state==='loading'}>
      <span aria-hidden="true">◎</span>
      {state==='loading'?'Rilevamento in corso…':'Rileva il cimitero vicino a me'}
    </button>
    {message&&<p>{message}</p>}
    <small>La posizione viene confrontata nel browser e non viene salvata da Dove Riposa.</small>
  </div>;
}
