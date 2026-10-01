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
  const hapticsEnabledRef=useRef(false);

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

  const [hapticsEnabled,setHapticsEnabled]=useState(false);
  const hapticsSupported=typeof navigator!=='undefined'&&typeof navigator.vibrate==='function';

  function hapticPattern(type){
    if(type==='left') return [80,70,80];
    if(type==='right') return [80,70,80,70,80];
    if(type==='arrival') return [420];
    if(type==='recalibrate') return [70,60,220];
    return [120];
  }

  function directionFor(index){
    if(index>=instructions.length-1) return 'arrival';
    const text=String(instructions[index]||'').toLowerCase();
    if(text.includes('sinistra')) return 'left';
    if(text.includes('destra')) return 'right';
    return 'straight';
  }

  function vibrate(type){
    if(!hapticsEnabledRef.current||!hapticsSupported) return;
    navigator.vibrate(hapticPattern(type));
  }

  function moveTo(index){
    const next=Math.min(Math.max(index,0),Math.max(instructions.length-1,0));
    setArrivalStatus('');
    setStep(next);
    vibrate(directionFor(next));
  }

  function enableHaptics(){
    if(!hapticsSupported){
      setScanInfo('Le vibrazioni web non sono supportate da questo browser. La guida visiva resta disponibile.');
      return;
    }
    hapticsEnabledRef.current=true;
    setHapticsEnabled(true);
    navigator.vibrate(hapticPattern(directionFor(step)));
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
                const markerStep=Math.min(Math.max(Number(marker.stepIndex)||0,0),Math.max(instructions.length-1,0));
                setStep(markerStep);
                vibrate('recalibrate');
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
      navigator.vibrate?.(0);
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
      <div className="ar-instruction" aria-live="polite">{instructions[step]}</div>
      <div className="ar-distance">{modeLabel} · {distance}</div>

      {step<instructions.length-1&&<div className="haptic-guide">
        <div className="haptic-guide-head">
          <div>
            <span>GUIDA APTICA SILENZIOSA</span>
            <b>{hapticsEnabled?'Vibrazioni attive':'Vibrazioni facoltative'}</b>
          </div>
          <button type="button" className={hapticsEnabled?'haptic-toggle active':'haptic-toggle'} onClick={()=>{if(hapticsEnabled){hapticsEnabledRef.current=false;setHapticsEnabled(false);navigator.vibrate?.(0);}else{enableHaptics();}}}>
            {hapticsEnabled?'Disattiva':'Attiva'}
          </button>
        </div>
        <div className="haptic-legend">
          <button type="button" onClick={()=>{if(hapticsSupported)navigator.vibrate(hapticPattern('straight'));}}>1 impulso <small>Dritto</small></button>
          <button type="button" onClick={()=>{if(hapticsSupported)navigator.vibrate(hapticPattern('left'));}}>2 impulsi <small>Sinistra</small></button>
          <button type="button" onClick={()=>{if(hapticsSupported)navigator.vibrate(hapticPattern('right'));}}>3 impulsi <small>Destra</small></button>
          <button type="button" onClick={()=>{if(hapticsSupported)navigator.vibrate(hapticPattern('arrival'));}}>Lungo <small>Arrivo</small></button>
        </div>
        <small className="haptic-note">Codice Dove Riposa Haptic: non è uno standard internazionale. È un supporto opzionale e non sostituisce le indicazioni accessibili.</small>
      </div>}

      <div className="step-progress">
        {instructions.map((_,i)=><span key={i} className={i<=step?'done':''}></span>)}
      </div>
      {step===instructions.length-1&&<div className="arrival-check">
        <span className="arrival-kicker">DOVE RIPOSA CHECK</span>
        <b>{selected.settore} · {selected.fila} · {selected.posizione}</b>
        <small>{calibrated?'Ultimo riferimento verificato: '+calibrated.label:'Scansiona il QR più vicino per aumentare la precisione dell’ultimo tratto.'}</small>
        {!arrivalStatus&&<div className="arrival-actions">
          <button onClick={()=>{vibrate('arrival');setArrivalStatus('found');onArrivalConfirmed?.();}}>✓ Ho trovato la sepoltura</button>
          <button onClick={()=>{vibrate('recalibrate');setArrivalStatus('missing');setScanInfo('Ricalibra dal QR più vicino e ricontrolla settore, fila e posizione.');}}>Non la trovo</button>
        </div>}
        {arrivalStatus==='found'&&<div className="arrival-outcome found">✓ Posizione finale confermata da te sul dispositivo.</div>}
        {arrivalStatus==='missing'&&<div className="arrival-outcome missing">Ricalibra dal marker più vicino: Dove Riposa non dichiara l’arrivo finché non lo confermi tu.</div>}
      </div>}

      {step<instructions.length-1&&<div className="precision-controls">
        <button disabled={step===0} onClick={()=>moveTo(step-1)}>← Indietro</button>
        <button onClick={()=>moveTo(step+1)}>Prossima →</button>
      </div>}

      {(step<instructions.length-1||arrivalStatus==='missing')&&<div className="marker-fallback">
        <span>{arrivalStatus==='missing'?'Ricalibra da un marker vicino':'Calibrazione demo'}</span>
        {(Array.isArray(markers)?markers:Object.values(markers||{})).slice(0,3).map(m=>
          <button key={m.id} onClick={()=>{onCalibrateRef.current(m);setStep(Math.min(Math.max(Number(m.stepIndex)||0,0),Math.max(instructions.length-1,0)));setArrivalStatus('');vibrate('recalibrate');setScanInfo('Marker demo: '+m.label);}}>{m.code}</button>
        )}
      </div>}

      {scanInfo&&<div className="scan-info" aria-live="polite">{scanInfo}</div>}
      <div className="ar-note">Demo tecnica: percorso, accessibilità e marker diventano operativi solo dopo planimetria e sopralluogo validati.</div>
      {error&&<div className="camera-error">{error}</div>}
    </div>
  </div>;
}
