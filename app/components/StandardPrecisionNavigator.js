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
  onClose,
  liveNotice=''
}){
  const videoRef=useRef(null);
  const streamRef=useRef(null);
  const detectorTimerRef=useRef(null);
  const onCalibrateRef=useRef(onCalibrate);
  const hapticsEnabledRef=useRef(false);

  const [cameraActive,setCameraActive]=useState(false);
  const [error,setError]=useState('');
  const [scanInfo,setScanInfo]=useState('');
  const [step,setStep]=useState(0);
  const [arrivalStatus,setArrivalStatus]=useState('');
  const [hapticsEnabled,setHapticsEnabled]=useState(false);

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
  const hapticsSupported=typeof navigator!=='undefined'&&typeof navigator.vibrate==='function';

  useEffect(()=>{onCalibrateRef.current=onCalibrate;},[onCalibrate]);

  useEffect(()=>{
    const next=Math.min(Math.max(Number(calibrated?.stepIndex)||0,0),Math.max(instructions.length-1,0));
    setStep(next);
    setArrivalStatus('');
  },[calibrated?.id,routeMode,selected?.id,instructions.length]);

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

  function stopCamera(){
    clearInterval(detectorTimerRef.current);
    detectorTimerRef.current=null;
    streamRef.current?.getTracks().forEach(track=>track.stop());
    streamRef.current=null;
    if(videoRef.current) videoRef.current.srcObject=null;
    setCameraActive(false);
  }

  async function startCamera(){
    setError('');
    setScanInfo('');

    if(!navigator.mediaDevices?.getUserMedia){
      setError('La fotocamera non è disponibile su questo browser.');
      return;
    }

    try{
      const stream=await navigator.mediaDevices.getUserMedia({
        video:{facingMode:{ideal:'environment'}},
        audio:false
      });
      streamRef.current=stream;
      setCameraActive(true);

      if(videoRef.current){
        videoRef.current.srcObject=stream;
        await videoRef.current.play();
      }

      if(!('BarcodeDetector' in window)){
        setScanInfo('Questo browser non supporta la lettura QR dentro la pagina. Puoi usare la fotocamera del telefono per aprire direttamente il QR Dove Riposa.');
        return;
      }

      const detector=new window.BarcodeDetector({formats:['qr_code']});
      detectorTimerRef.current=setInterval(async()=>{
        if(!videoRef.current||videoRef.current.readyState<2) return;
        try{
          const found=await detector.detect(videoRef.current);
          const marker=markerFromValue(found?.[0]?.rawValue,markers);
          if(!marker) return;

          onCalibrateRef.current(marker);
          const markerStep=Math.min(Math.max(Number(marker.stepIndex)||0,0),Math.max(instructions.length-1,0));
          setStep(markerStep);
          vibrate('recalibrate');
          setScanInfo('Riferimento riconosciuto: '+marker.label);
          stopCamera();
        }catch{}
      },900);
    }catch{
      setError('Permesso fotocamera non concesso o fotocamera non disponibile. La navigazione testuale resta utilizzabile.');
      stopCamera();
    }
  }

  useEffect(()=>{
    return()=>{
      clearInterval(detectorTimerRef.current);
      streamRef.current?.getTracks().forEach(track=>track.stop());
      navigator.vibrate?.(0);
    };
  },[]);

  function close(){
    stopCamera();
    navigator.vibrate?.(0);
    onClose();
  }

  return <div className={cameraActive?'camera-modal precision-modal camera-on':'camera-modal precision-modal camera-off'}>
    <video ref={videoRef} playsInline muted aria-hidden={!cameraActive}/>
    <div className="camera-overlay">
      <button className="camera-close" onClick={close} aria-label="Chiudi">×</button>

      <div className="camera-top">
        <b>Percorso verso la sepoltura</b>
        <span>{municipalityLabel} · {selected.nome} {selected.cognome}</span>
      </div>

      <div className="precision-cal-row">
        <div className={calibrated?'precision-cal-chip calibrated':'precision-cal-chip'}>
          {calibrated ? '✓ Posizione aggiornata · '+calibrated.label : 'Posizione non ancora aggiornata con QR'}
        </div>
        {!cameraActive
          ? <button type="button" className="scan-qr-button" onClick={startCamera}>Scansiona un QR</button>
          : <button type="button" className="scan-qr-button active" onClick={stopCamera}>Chiudi fotocamera</button>}
      </div>

      {cameraActive&&<div className="camera-local-note">Fotocamera attiva solo per leggere il QR. Il video non viene salvato o inviato a Dove Riposa.</div>}
      {liveNotice&&<div className="precision-live-chip">↻ {liveNotice}</div>}

      <div className="ar-arrow">{step>=instructions.length-1?'●':'↑'}</div>
      <div className="ar-instruction" aria-live="polite">{instructions[step]}</div>
      <div className="ar-distance">{modeLabel} · {distance}</div>

      {step<instructions.length-1&&<div className="haptic-guide">
        <div className="haptic-guide-head">
          <div>
            <span>VIBRAZIONI DURANTE IL PERCORSO</span>
            <b>{hapticsEnabled?'Vibrazioni attive':'Vibrazioni disattivate'}</b>
          </div>
          <button
            type="button"
            className={hapticsEnabled?'haptic-toggle active':'haptic-toggle'}
            onClick={()=>{
              if(hapticsEnabled){
                hapticsEnabledRef.current=false;
                setHapticsEnabled(false);
                navigator.vibrate?.(0);
              }else{
                enableHaptics();
              }
            }}
          >
            {hapticsEnabled?'Disattiva':'Attiva'}
          </button>
        </div>

        {hapticsEnabled&&<div className="haptic-legend">
          <span>1 impulso · Dritto</span>
          <span>2 impulsi · Sinistra</span>
          <span>3 impulsi · Destra</span>
          <span>Lungo · Arrivo</span>
        </div>}

        <small className="haptic-note">{hapticsEnabled?'Funzione sperimentale: le vibrazioni non sostituiscono la segnaletica o altri ausili.':'Facoltative e senza audio.'}</small>
      </div>}

      <div className="step-progress" aria-hidden="true">
        {instructions.map((_,i)=><span key={i} className={i<=step?'done':''}></span>)}
      </div>

      {step===instructions.length-1&&<div className="arrival-check">
        <span className="arrival-kicker">SEI ARRIVATO</span>
        <b>{selected.settore} · {selected.fila} · {selected.posizione}</b>
        <small>{calibrated?'Posizione aggiornata con QR: '+calibrated.label:'Controlla settore, fila e posizione indicati qui sopra.'}</small>

        {!arrivalStatus&&<div className="arrival-actions">
          <button onClick={()=>{vibrate('arrival');setArrivalStatus('found');}}>Ho trovato la sepoltura</button>
          <button onClick={()=>{vibrate('recalibrate');setArrivalStatus('missing');setScanInfo('Se disponibile, scansiona il QR più vicino e ricontrolla settore, fila e posizione.');}}>Non la trovo</button>
        </div>}

        {arrivalStatus==='found'&&<div className="arrival-outcome found">✓ Arrivo confermato da te sul dispositivo.</div>}
        {arrivalStatus==='missing'&&<div className="arrival-outcome missing">Prova a scansionare un QR vicino oppure torna al passaggio precedente.</div>}
      </div>}

      {step<instructions.length-1&&<div className="precision-controls">
        <button disabled={step===0} onClick={()=>moveTo(step-1)}>← Indietro</button>
        <button onClick={()=>moveTo(step+1)}>Prossima indicazione →</button>
      </div>}

      {arrivalStatus==='missing'&&<div className="arrival-recovery">
        <button type="button" onClick={()=>moveTo(Math.max(step-1,0))}>← Torna indietro</button>
        {!cameraActive&&<button type="button" onClick={startCamera}>Scansiona un QR vicino</button>}
      </div>}

      {scanInfo&&<div className="scan-info" aria-live="polite">{scanInfo}</div>}
      {error&&<div className="camera-error" aria-live="assertive">{error}</div>}

      <div className="ar-note">Demo: percorso e posizioni devono essere verificati sul posto prima dell’uso reale.</div>
    </div>
  </div>;
}
