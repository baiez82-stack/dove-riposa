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

  const [scannerOpen,setScannerOpen]=useState(false);
  const [scannerStarting,setScannerStarting]=useState(false);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
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
    const next=Math.min(
      Math.max(Number(calibrated?.stepIndex)||0,0),
      Math.max(instructions.length-1,0)
    );
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

  function toggleHaptics(){
    if(hapticsEnabled){
      hapticsEnabledRef.current=false;
      setHapticsEnabled(false);
      navigator.vibrate?.(0);
      return;
    }

    if(!hapticsSupported){
      setNotice('Le vibrazioni non sono supportate da questo browser. Le indicazioni visive restano disponibili.');
      return;
    }

    hapticsEnabledRef.current=true;
    setHapticsEnabled(true);
    navigator.vibrate(hapticPattern(directionFor(step)));
  }

  function stopScanner(){
    clearInterval(detectorTimerRef.current);
    detectorTimerRef.current=null;
    streamRef.current?.getTracks().forEach(track=>track.stop());
    streamRef.current=null;
    if(videoRef.current) videoRef.current.srcObject=null;
    setScannerOpen(false);
    setScannerStarting(false);
  }

  async function startScanner(){
    setError('');
    setNotice('');

    if(scannerStarting) return;

    if(!navigator.mediaDevices?.getUserMedia){
      setError('Fotocamera non disponibile su questo browser.');
      return;
    }

    if(!('BarcodeDetector' in window)){
      setNotice('La lettura QR dentro Dove Riposa non è supportata da questo browser. Puoi comunque aprire il QR con la fotocamera del telefono.');
      return;
    }

    try{
      if(window.BarcodeDetector.getSupportedFormats){
        const formats=await window.BarcodeDetector.getSupportedFormats();
        if(!formats.includes('qr_code')){
          setNotice('Questo browser non supporta la lettura dei QR dentro Dove Riposa. Puoi usare la fotocamera del telefono.');
          return;
        }
      }
    }catch{}

    setScannerStarting(true);

    try{
      let stream;
      try{
        stream=await navigator.mediaDevices.getUserMedia({
          video:{
            facingMode:{ideal:'environment'},
            width:{ideal:1280},
            height:{ideal:720}
          },
          audio:false
        });
      }catch(firstError){
        if(firstError?.name==='NotAllowedError'||firstError?.name==='SecurityError') throw firstError;
        stream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});
      }

      streamRef.current=stream;
      setScannerOpen(true);
    }catch(error){
      setScannerStarting(false);
      if(error?.name==='NotAllowedError'||error?.name==='SecurityError'){
        setError('Permesso fotocamera non concesso. Abilitalo nelle impostazioni del browser oppure continua senza QR.');
      }else{
        setError('Non riesco ad avviare la fotocamera. Puoi continuare il percorso senza QR.');
      }
    }
  }

  useEffect(()=>{
    if(!scannerOpen||!streamRef.current||!videoRef.current) return;

    let cancelled=false;

    async function attachAndScan(){
      try{
        videoRef.current.srcObject=streamRef.current;
        videoRef.current.muted=true;
        videoRef.current.setAttribute('playsinline','');
        await videoRef.current.play();

        const detector=new window.BarcodeDetector({formats:['qr_code']});
        detectorTimerRef.current=setInterval(async()=>{
          if(cancelled||!videoRef.current||videoRef.current.readyState<2) return;

          try{
            const found=await detector.detect(videoRef.current);
            const marker=markerFromValue(found?.[0]?.rawValue,markers);
            if(!marker) return;

            onCalibrateRef.current(marker);
            const markerStep=Math.min(
              Math.max(Number(marker.stepIndex)||0,0),
              Math.max(instructions.length-1,0)
            );
            setStep(markerStep);
            vibrate('recalibrate');
            setNotice('Posizione aggiornata: '+marker.label);
            stopScanner();
          }catch{}
        },650);
      }catch{
        setError('La fotocamera è stata autorizzata ma non riesce a mostrare il video. Chiudi e riprova.');
        stopScanner();
      }finally{
        setScannerStarting(false);
      }
    }

    attachAndScan();

    return()=>{
      cancelled=true;
      clearInterval(detectorTimerRef.current);
      detectorTimerRef.current=null;
    };
  },[scannerOpen,markers,instructions.length]);

  useEffect(()=>{
    return()=>{
      clearInterval(detectorTimerRef.current);
      streamRef.current?.getTracks().forEach(track=>track.stop());
      navigator.vibrate?.(0);
    };
  },[]);

  function closeNavigator(){
    stopScanner();
    navigator.vibrate?.(0);
    onClose();
  }

  if(scannerOpen){
    return <div className="precision-scanner" role="dialog" aria-modal="true" aria-label="Scansione QR Dove Riposa">
      <video ref={videoRef} className="precision-scanner-video" playsInline muted/>
      <div className="precision-scanner-overlay">
        <button className="precision-scanner-close" onClick={stopScanner} aria-label="Chiudi scanner">×</button>

        <div className="precision-scanner-title">
          <b>Inquadra il QR Dove Riposa</b>
          <span>Avvicina il codice al centro del riquadro.</span>
        </div>

        <div className="precision-scan-frame" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
        </div>

        <div className="precision-scanner-privacy">
          Il video resta sul dispositivo e serve solo a leggere il QR.
        </div>
      </div>
    </div>;
  }

  return <div className="precision-nav" role="dialog" aria-modal="true" aria-label="Navigazione Dove Riposa">
    <button className="precision-nav-close" onClick={closeNavigator} aria-label="Chiudi">×</button>

    <div className="precision-nav-head">
      <div>
        <span>DOVE RIPOSA</span>
        <b>{selected.nome} {selected.cognome}</b>
        <small>{municipalityLabel} · {selected.settore} · {selected.fila}</small>
      </div>
      <button
        type="button"
        className={hapticsEnabled?'precision-haptic-toggle active':'precision-haptic-toggle'}
        onClick={toggleHaptics}
      >
        {hapticsEnabled?'Vibrazione ON':'Vibrazione'}
      </button>
    </div>

    {liveNotice&&<div className="precision-nav-live">↻ {liveNotice}</div>}

    <div className="precision-nav-reference">
      <span>{calibrated?'Posizione aggiornata con QR':'QR facoltativo'}</span>
      <b>{calibrated?calibrated.label:'Puoi seguire il percorso anche senza fotocamera'}</b>
      <button type="button" onClick={startScanner} disabled={scannerStarting}>
        {scannerStarting?'Avvio fotocamera…':'Scansiona QR'}
      </button>
    </div>

    <div className="precision-nav-step">
      <span className="precision-step-count">{step+1} / {instructions.length}</span>
      <div className="precision-step-arrow" aria-hidden="true">{step>=instructions.length-1?'●':'↑'}</div>
      <h2 aria-live="polite">{instructions[step]}</h2>
      <p>{modeLabel} · {distance}</p>
    </div>

    {step<instructions.length-1&&<div className="precision-nav-actions">
      <button type="button" className="secondary" disabled={step===0} onClick={()=>moveTo(step-1)}>Indietro</button>
      <button type="button" className="primary" onClick={()=>moveTo(step+1)}>Prossima</button>
    </div>}

    {step===instructions.length-1&&<div className="precision-arrival">
      <span>CONTROLLA LA POSIZIONE</span>
      <h2>{selected.settore} · {selected.fila} · {selected.posizione}</h2>
      <p>{calibrated?'Ultimo QR: '+calibrated.label:'Verifica settore, fila e posizione sul posto.'}</p>

      {!arrivalStatus&&<div className="precision-arrival-actions">
        <button type="button" className="primary" onClick={()=>{vibrate('arrival');setArrivalStatus('found');}}>Ho trovato la sepoltura</button>
        <button type="button" className="secondary" onClick={()=>{vibrate('recalibrate');setArrivalStatus('missing');}}>Non la trovo</button>
      </div>}

      {arrivalStatus==='found'&&<div className="precision-arrival-result success">✓ Arrivo confermato.</div>}

      {arrivalStatus==='missing'&&<div className="precision-arrival-recovery">
        <p>Puoi tornare all’indicazione precedente oppure aggiornare la posizione con un QR vicino.</p>
        <button type="button" className="secondary" onClick={()=>moveTo(Math.max(step-1,0))}>Torna indietro</button>
        <button type="button" className="primary" onClick={startScanner} disabled={scannerStarting}>
          {scannerStarting?'Avvio fotocamera…':'Scansiona QR'}
        </button>
      </div>}
    </div>}

    {hapticsEnabled&&<div className="precision-haptic-note">
      1 impulso dritto · 2 sinistra · 3 destra · lungo arrivo
    </div>}

    {notice&&<div className="precision-nav-notice" aria-live="polite">{notice}</div>}
    {error&&<div className="precision-nav-error" aria-live="assertive">{error}</div>}

    <div className="precision-nav-demo">
      Demo: mappa, distanze e percorsi di Pescantina devono essere verificati sul posto prima dell’uso reale.
    </div>
  </div>;
}
