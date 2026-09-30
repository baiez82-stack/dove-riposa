'use client';

import { useEffect, useRef, useState } from 'react';

function markerFromValue(value,markers){
  const list=Array.isArray(markers)?markers:Object.values(markers||{});
  const raw=String(value||'');
  const direct=list.find(m=>m.code===raw.trim().toUpperCase());
  if(direct) return direct;
  try{
    const url=new URL(raw,window.location.origin);
    const id=url.searchParams.get('cal');
    if(id) return list.find(m=>m.id===id)||null;
  }catch{}
  return null;
}

export default function StandardPrecisionNavigator({
  selected,
  routeMode,
  calibrated,
  markers,
  municipalityLabel,
  onCalibrate,
  onArrivalConfirmed,
  onClose,
  liveNotice=''
}){
  const videoRef=useRef(null);
  const detectorRef=useRef(null);
  const onCalibrateRef=useRef(onCalibrate);
  const [error,setError]=useState('');
  const [scanInfo,setScanInfo]=useState('');
  const [step,setStep]=useState(0);
  const [arrivalStatus,setArrivalStatus]=useState('');

  const instructions=routeMode==='assist'
    ? selected.assistInstructions
    : routeMode==='accessible'
      ? selected.accessibleInstructions
      : selected.instructions;
  const distance=routeMode==='assist'
    ? selected.assistDistance
    : routeMode==='accessible'
      ? selected.accessibleDistance
      : selected.shortDistance;
  const modeLabel=routeMode==='assist'
    ? 'Percorso assistito'
    : routeMode==='accessible'
      ? 'Percorso accessibile'
      : 'Percorso più breve';

  useEffect(()=>{onCalibrateRef.current=onCalibrate;},[onCalibrate]);

  useEffect(()=>{
    const next=Math.min(Math.max(Number(calibrated?.stepIndex)||0,0),Math.max(instructions.length-1,0));
    setStep(next);
    setArrivalStatus('');
  },[calibrated?.id,routeMode,selected?.id,instructions.length]);

  function speak(){
    if(!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(instructions[step]);
    utterance.lang='it-IT';
    utterance.rate=.88;
    window.speechSynthesis.speak(utterance);
  }

  useEffect(()=>{
    let stream;
    let timer;

    navigator.mediaDevices?.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false})
      .then(async s=>{
        stream=s;
        if(videoRef.current){
          videoRef.current.srcObject=s;
          await videoRef.current.play();
        }

        if('BarcodeDetector' in window){
          detectorRef.current=new window.BarcodeDetector({formats:['qr_code']});
          timer=setInterval(async()=>{
            if(!videoRef.current||videoRef.current.readyState<2) return;
            try{
              const found=await detectorRef.current.detect(videoRef.current);
              const marker=markerFromValue(found?.[0]?.rawValue,markers);
              if(marker){
                onCalibrateRef.current(marker);
                setStep(Math.min(Math.max(Number(marker.stepIndex)||0,0),Math.max(instructions.length-1,0)));
                setScanInfo('Marker riconosciuto: '+marker.label);
              }
            }catch{}
          },900);
        }else{
          setScanInfo('Scansione QR automatica non supportata: usa i marker demo.');
        }
      })
      .catch(()=>setError('Impossibile accedere alla fotocamera. Verifica i permessi del browser.'));

    return()=>{
      clearInterval(timer);
      stream?.getTracks().forEach(t=>t.stop());
      if('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  },[markers]);

  return <div className="camera-modal precision-modal">
    <video ref={videoRef} playsInline muted/>
    <div className="camera-overlay">
      <button className="camera-close" onClick={onClose} aria-label="Chiudi">×</button>
      <div className="camera-top">
        <b>Dove Riposa Precision</b>
        <span>{municipalityLabel} · {selected.nome} {selected.cognome}</span>
      </div>

      <div className="precision-cal-chip">
        {calibrated ? '✓ QR calibrato · '+calibrated.label : 'Inquadra un QR di calibrazione'}
      </div>
      {liveNotice&&<div className="precision-live-chip">↻ {liveNotice}</div>}
      <div className="ar-arrow">{step>=instructions.length-1?'●':'↑'}</div>
      <div className="ar-instruction">{instructions[step]}</div>
      <div className="ar-distance">{modeLabel} · {distance}</div>
      <button className="voice-guide" onClick={speak}>🔊 Leggi indicazione</button>

      <div className="step-progress">
        {instructions.map((_,i)=><span key={i} className={i<=step?'done':''}></span>)}
      </div>
      {step===instructions.length-1&&<div className="arrival-check">
        <span className="arrival-kicker">DOVE RIPOSA CHECK</span>
        <b>{selected.settore} · {selected.fila} · {selected.posizione}</b>
        <small>{calibrated?'Ultimo riferimento verificato: '+calibrated.label:'Scansiona il QR più vicino per aumentare la precisione dell’ultimo tratto.'}</small>
        {!arrivalStatus&&<div className="arrival-actions">
          <button onClick={()=>{setArrivalStatus('found');onArrivalConfirmed?.();}}>✓ Ho trovato la sepoltura</button>
          <button onClick={()=>{setArrivalStatus('missing');setScanInfo('Ricalibra dal QR più vicino e ricontrolla settore, fila e posizione.');}}>Non la trovo</button>
        </div>}
        {arrivalStatus==='found'&&<div className="arrival-outcome found">✓ Posizione finale confermata da te sul dispositivo.</div>}
        {arrivalStatus==='missing'&&<div className="arrival-outcome missing">Ricalibra dal marker più vicino: Dove Riposa non dichiara l’arrivo finché non lo confermi tu.</div>}
      </div>}

      <div className="precision-controls">
        <button disabled={step===0} onClick={()=>{setArrivalStatus('');setStep(Math.max(0,step-1));}}>← Indietro</button>
        <button disabled={step===instructions.length-1} onClick={()=>{setArrivalStatus('');setStep(Math.min(instructions.length-1,step+1));}}>Prossima →</button>
      </div>

      {(step<instructions.length-1||arrivalStatus==='missing')&&<div className="marker-fallback">
        <span>{arrivalStatus==='missing'?'Ricalibra da un marker vicino':'Calibrazione demo'}</span>
        {(Array.isArray(markers)?markers:Object.values(markers||{})).slice(0,3).map(m=>
          <button key={m.id} onClick={()=>{onCalibrateRef.current(m);setStep(Math.min(Math.max(Number(m.stepIndex)||0,0),Math.max(instructions.length-1,0)));setArrivalStatus('');setScanInfo('Marker demo: '+m.label);}}>{m.code}</button>
        )}
      </div>}

      {scanInfo&&<div className="scan-info">{scanInfo}</div>}
      <div className="ar-note">Demo tecnica: percorso, accessibilità e marker diventano operativi solo dopo planimetria e sopralluogo validati.</div>
      {error&&<div className="camera-error">{error}</div>}
    </div>
  </div>;
}
