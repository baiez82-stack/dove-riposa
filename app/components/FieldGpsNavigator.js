'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import jsQR from 'jsqr';

const sequence=[
  {id:'ingresso',label:'Ingresso',markerId:'ingresso'},
  {id:'nodoA',label:'Nodo A',markerId:'centro'},
  {id:'nodoB',label:'Nodo B',markerId:'testata'},
  {id:'destinazione',label:'Destinazione',markerId:null}
];

function toRad(value){return value*Math.PI/180;}
function toDeg(value){return value*180/Math.PI;}
function normalize360(value){return (value%360+360)%360;}
function normalize180(value){
  const v=normalize360(value);
  return v>180?v-360:v;
}

function distanceMeters(a,b){
  if(!a||!b) return null;
  const R=6371000;
  const lat1=toRad(a.lat);
  const lat2=toRad(b.lat);
  const dLat=toRad(b.lat-a.lat);
  const dLon=toRad(b.lon-a.lon);
  const h=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2*R*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
}

function bearingDegrees(a,b){
  if(!a||!b) return null;
  const lat1=toRad(a.lat);
  const lat2=toRad(b.lat);
  const dLon=toRad(b.lon-a.lon);
  const y=Math.sin(dLon)*Math.cos(lat2);
  const x=Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
  return normalize360(toDeg(Math.atan2(y,x)));
}

function segmentDeviationMeters(point,start,end){
  if(!point||!start||!end) return null;

  const meanLat=toRad((start.lat+end.lat)/2);
  const metersPerLon=111320*Math.cos(meanLat);
  const metersPerLat=110540;

  const bx=(end.lon-start.lon)*metersPerLon;
  const by=(end.lat-start.lat)*metersPerLat;
  const px=(point.lon-start.lon)*metersPerLon;
  const py=(point.lat-start.lat)*metersPerLat;
  const lengthSq=bx*bx+by*by;

  if(lengthSq<0.01) return {distance:distanceMeters(point,start),progress:0};

  const rawT=(px*bx+py*by)/lengthSq;
  const t=Math.max(0,Math.min(1,rawT));
  const nearestX=bx*t;
  const nearestY=by*t;

  return {
    distance:Math.hypot(px-nearestX,py-nearestY),
    progress:t
  };
}

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

function anchorFromMarker(marker){
  if(!marker) return null;
  if(marker.id==='ingresso') return 'ingresso';
  if(marker.id==='centro') return 'nodoA';
  if(marker.id==='testata') return 'nodoB';
  return null;
}

function turnInstruction(points,currentId){
  const index=sequence.findIndex(item=>item.id===currentId);
  const next=sequence[index+1];
  if(index<0||!next) return 'Prosegui verso la destinazione';

  if(index===0) return 'Vai verso '+next.label;

  const previous=sequence[index-1];
  const prevPoint=points[previous.id];
  const currentPoint=points[currentId];
  const nextPoint=points[next.id];

  if(!prevPoint||!currentPoint||!nextPoint) return 'Prosegui verso '+next.label;

  const incoming=bearingDegrees(prevPoint,currentPoint);
  const outgoing=bearingDegrees(currentPoint,nextPoint);
  const delta=normalize180(outgoing-incoming);

  if(delta>35) return 'Gira a destra';
  if(delta<-35) return 'Gira a sinistra';
  return 'Continua dritto';
}

export default function FieldGpsNavigator({
  selected,
  calibrated,
  markers,
  municipalityLabel,
  onCalibrate,
  onClose
}){
  const videoRef=useRef(null);
  const streamRef=useRef(null);
  const watchRef=useRef(null);
  const orientationHandlerRef=useRef(null);
  const scannerTimerRef=useRef(null);
  const scanBusyRef=useRef(false);
  const alertedTargetRef=useRef('');
  const deviationTimerRef=useRef(null);
  const offRouteAlertedRef=useRef(false);
  const lastDistanceRef=useRef(null);
  const movingAwayCountRef=useRef(0);

  const [guideActive,setGuideActive]=useState(false);
  const [scannerOpen,setScannerOpen]=useState(false);
  const [starting,setStarting]=useState(false);
  const [position,setPosition]=useState(null);
  const [heading,setHeading]=useState(null);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [arrivalStatus,setArrivalStatus]=useState('');
  const [haptics,setHaptics]=useState(true);
  const [offRoute,setOffRoute]=useState(false);
  const [movingAway,setMovingAway]=useState(false);
  const [cameraStatus,setCameraStatus]=useState('idle');

  const points=selected.gpsPoints||{};
  const currentAnchor=anchorFromMarker(calibrated)||'ingresso';
  const currentIndex=Math.max(0,sequence.findIndex(item=>item.id===currentAnchor));
  const target=sequence[Math.min(currentIndex+1,sequence.length-1)];
  const targetPoint=points[target?.id]||null;
  const startPoint=points[currentAnchor]||null;
  const currentPoint=position?{lat:position.lat,lon:position.lon}:null;
  const distance=useMemo(()=>distanceMeters(currentPoint,targetPoint),[position?.lat,position?.lon,targetPoint?.lat,targetPoint?.lon]);
  const bearing=useMemo(()=>bearingDegrees(currentPoint,targetPoint),[position?.lat,position?.lon,targetPoint?.lat,targetPoint?.lon]);
  const segmentInfo=useMemo(
    ()=>segmentDeviationMeters(currentPoint,startPoint,targetPoint),
    [position?.lat,position?.lon,startPoint?.lat,startPoint?.lon,targetPoint?.lat,targetPoint?.lon]
  );
  const recoveryBearing=useMemo(()=>distanceMeters(currentPoint,startPoint)>2?bearingDegrees(currentPoint,startPoint):null,[position?.lat,position?.lon,startPoint?.lat,startPoint?.lon]);
  const relativeAngle=bearing!=null&&heading!=null?normalize180(bearing-heading):0;
  const recoveryAngle=recoveryBearing!=null&&heading!=null?normalize180(recoveryBearing-heading):0;
  const headingError=bearing!=null&&heading!=null?Math.abs(normalize180(bearing-heading)):null;
  const gpsAccuracy=position?.accuracy??null;
  const gpsGood=gpsAccuracy==null||gpsAccuracy<=20;
  const nearThreshold=Math.max(8,Math.min(15,gpsAccuracy||8));
  const routeCorridor=Math.max(7,Math.min(18,(gpsAccuracy||6)*1.4));
  const nearTarget=distance!=null&&distance<=nearThreshold&&gpsGood;
  const isDestination=target?.id==='destinazione';
  const currentLabel=sequence[currentIndex]?.label||'ultimo nodo';
  const instruction=turnInstruction(points,currentAnchor);
  const routeReady=Boolean(points.ingresso&&points.nodoA&&points.nodoB&&points.destinazione);
  const deviationCandidate=Boolean(
    guideActive&&gpsGood&&!nearTarget&&targetPoint&&startPoint&&(
      (segmentInfo?.distance??0)>routeCorridor||
      movingAway||
      (headingError!=null&&headingError>75&&distance!=null&&distance>nearThreshold+6)
    )
  );

  useEffect(()=>{
    if(!nearTarget||!target?.id||alertedTargetRef.current===target.id) return;
    alertedTargetRef.current=target.id;
    if(haptics&&typeof navigator!=='undefined'&&navigator.vibrate){
      navigator.vibrate(isDestination?[420]:[100,80,100,80,260]);
    }
  },[nearTarget,target?.id,haptics,isDestination]);

  useEffect(()=>{
    if(distance==null||!gpsGood||nearTarget){
      lastDistanceRef.current=distance;
      movingAwayCountRef.current=0;
      setMovingAway(false);
      return;
    }

    const previous=lastDistanceRef.current;
    const tolerance=Math.max(3,(gpsAccuracy||6)*0.45);

    if(previous!=null&&distance>previous+tolerance){
      movingAwayCountRef.current+=1;
    }else if(previous!=null&&distance<previous-tolerance/2){
      movingAwayCountRef.current=0;
    }

    lastDistanceRef.current=distance;
    setMovingAway(movingAwayCountRef.current>=2);
  },[distance,gpsGood,nearTarget,gpsAccuracy,target?.id]);

  useEffect(()=>{
    clearTimeout(deviationTimerRef.current);

    if(!deviationCandidate){
      setOffRoute(false);
      offRouteAlertedRef.current=false;
      return;
    }

    deviationTimerRef.current=setTimeout(()=>{
      setOffRoute(true);
      if(!offRouteAlertedRef.current){
        offRouteAlertedRef.current=true;
        if(haptics&&navigator.vibrate) navigator.vibrate([180,100,180,100,180]);
      }
    },1600);

    return()=>clearTimeout(deviationTimerRef.current);
  },[deviationCandidate,haptics,target?.id]);

  useEffect(()=>{
    alertedTargetRef.current='';
    offRouteAlertedRef.current=false;
    movingAwayCountRef.current=0;
    lastDistanceRef.current=null;
    setMovingAway(false);
    setOffRoute(false);
    setArrivalStatus('');
  },[calibrated?.id]);

  useEffect(()=>{
    if(!guideActive||!streamRef.current||!videoRef.current) return;

    const video=videoRef.current;
    let cancelled=false;

    video.srcObject=streamRef.current;
    video.muted=true;
    video.setAttribute('playsinline','');

    async function playVideo(){
      try{
        await video.play();
        if(!cancelled) setCameraStatus('ready');
      }catch{
        if(!cancelled){
          setCameraStatus('error');
          setError('La fotocamera è autorizzata ma il browser non riesce a mostrare il video. Chiudi e riapri il link direttamente in Chrome o Safari.');
        }
      }
    }

    if(video.readyState>=1) playVideo();
    else video.addEventListener('loadedmetadata',playVideo,{once:true});

    return()=>{
      cancelled=true;
      video.removeEventListener('loadedmetadata',playVideo);
    };
  },[guideActive]);

  function attachOrientation(){
    const handler=event=>{
      let next=null;
      if(typeof event.webkitCompassHeading==='number'){
        next=event.webkitCompassHeading;
      }else if(event.absolute&&typeof event.alpha==='number'){
        next=normalize360(360-event.alpha);
      }
      if(next!=null&&Number.isFinite(next)) setHeading(next);
    };
    orientationHandlerRef.current=handler;
    window.addEventListener('deviceorientationabsolute',handler,true);
    window.addEventListener('deviceorientation',handler,true);
  }

  function detachOrientation(){
    const handler=orientationHandlerRef.current;
    if(handler){
      window.removeEventListener('deviceorientationabsolute',handler,true);
      window.removeEventListener('deviceorientation',handler,true);
    }
    orientationHandlerRef.current=null;
  }

  function stopGuide(){
    clearInterval(scannerTimerRef.current);
    clearTimeout(deviationTimerRef.current);
    scannerTimerRef.current=null;
    deviationTimerRef.current=null;
    scanBusyRef.current=false;
    if(watchRef.current!=null&&navigator.geolocation){
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current=null;
    }
    streamRef.current?.getTracks().forEach(track=>track.stop());
    streamRef.current=null;
    if(videoRef.current) videoRef.current.srcObject=null;
    detachOrientation();
    setScannerOpen(false);
    setGuideActive(false);
    setStarting(false);
    setCameraStatus('idle');
    navigator.vibrate?.(0);
  }

  async function startGuide(){
    if(starting||guideActive) return;
    setError('');
    setNotice('');

    if(!routeReady){
      setError('Percorso non completo: registra Ingresso, Nodo A, Nodo B e Destinazione prima di avviare la prova.');
      return;
    }

    setStarting(true);

    try{
      if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){
        try{
          const result=await DeviceOrientationEvent.requestPermission();
          if(result==='granted') attachOrientation();
        }catch{}
      }else{
        attachOrientation();
      }

      if(!navigator.geolocation){
        throw new Error('GPS_UNAVAILABLE');
      }

      watchRef.current=navigator.geolocation.watchPosition(pos=>{
        setPosition({
          lat:pos.coords.latitude,
          lon:pos.coords.longitude,
          accuracy:Math.round(pos.coords.accuracy),
          heading:typeof pos.coords.heading==='number'?pos.coords.heading:null
        });
        if(heading==null&&typeof pos.coords.heading==='number') setHeading(pos.coords.heading);
      },geoError=>{
        if(geoError?.code===1) setError('Posizione non autorizzata. Abilita il GPS del browser.');
        else setNotice('Segnale GPS debole. La guida resta attiva e si aggiorna quando torna disponibile.');
      },{
        enableHighAccuracy:true,
        maximumAge:0,
        timeout:15000
      });

      if(!navigator.mediaDevices?.getUserMedia){
        throw new Error('CAMERA_UNAVAILABLE');
      }

      setCameraStatus('requesting');

      try{
        streamRef.current=await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},
          audio:false
        });
      }catch(firstError){
        if(firstError?.name==='NotAllowedError'||firstError?.name==='SecurityError') throw firstError;
        streamRef.current=await navigator.mediaDevices.getUserMedia({video:true,audio:false});
      }

      setGuideActive(true);
    }catch(error){
      if(error?.name==='NotAllowedError'||error?.name==='SecurityError'){
        setError('Permesso fotocamera non concesso. Abilitalo nel browser e riprova.');
      }else if(error?.message==='GPS_UNAVAILABLE'){
        setError('GPS non disponibile su questo browser.');
      }else if(error?.message==='CAMERA_UNAVAILABLE'){
        setError('Questo browser non consente l’accesso alla fotocamera. Apri il link direttamente in Chrome su Android oppure Safari su iPhone e riprova.');
      }else{
        setError('Non riesco ad avviare la guida. Controlla i permessi di Fotocamera e Posizione e riprova.');
      }
      stopGuide();
    }finally{
      setStarting(false);
    }
  }

  async function startQrScan(){
    if(!guideActive||!videoRef.current) return;
    setScannerOpen(true);
    setNotice('Inquadra un QR Dove Riposa. Qualsiasi nodo valido ricalibra subito il percorso.');

    let detector=null;
    try{
      if('BarcodeDetector' in window){
        let nativeOk=true;
        if(window.BarcodeDetector.getSupportedFormats){
          const formats=await window.BarcodeDetector.getSupportedFormats();
          nativeOk=formats.includes('qr_code');
        }
        if(nativeOk) detector=new window.BarcodeDetector({formats:['qr_code']});
      }
    }catch{}

    const canvas=detector?null:document.createElement('canvas');
    const context=canvas?.getContext('2d',{willReadFrequently:true});

    clearInterval(scannerTimerRef.current);
    scannerTimerRef.current=setInterval(async()=>{
      if(scanBusyRef.current||!videoRef.current||videoRef.current.readyState<2) return;
      scanBusyRef.current=true;

      try{
        let rawValue='';

        if(detector){
          const found=await detector.detect(videoRef.current);
          rawValue=found?.[0]?.rawValue||'';
        }else if(context){
          const width=videoRef.current.videoWidth;
          const height=videoRef.current.videoHeight;
          if(!width||!height) return;
          canvas.width=width;
          canvas.height=height;
          context.drawImage(videoRef.current,0,0,width,height);
          const frame=context.getImageData(0,0,width,height);
          const found=jsQR(frame.data,width,height,{inversionAttempts:'attemptBoth'});
          rawValue=found?.data||'';
        }

        if(!rawValue) return;
        const marker=markerFromValue(rawValue,markers);

        if(!marker){
          setNotice('Questo non è un QR di posizione Dove Riposa.');
          return;
        }

        onCalibrate(marker);
        clearInterval(scannerTimerRef.current);
        scannerTimerRef.current=null;
        setScannerOpen(false);
        setNotice('Posizione confermata · '+marker.label);
        if(haptics&&navigator.vibrate) navigator.vibrate([80,60,220]);
      }catch{}finally{
        scanBusyRef.current=false;
      }
    },450);
  }

  function stopQrScan(){
    clearInterval(scannerTimerRef.current);
    scannerTimerRef.current=null;
    scanBusyRef.current=false;
    setScannerOpen(false);
    setNotice('');
  }

  function closeAll(){
    stopGuide();
    onClose();
  }

  useEffect(()=>()=>{
    clearInterval(scannerTimerRef.current);
    clearTimeout(deviationTimerRef.current);
    if(watchRef.current!=null&&navigator.geolocation) navigator.geolocation.clearWatch(watchRef.current);
    streamRef.current?.getTracks().forEach(track=>track.stop());
    detachOrientation();
    navigator.vibrate?.(0);
  },[]);

  if(!guideActive){
    return <div className="field-guide-start" role="dialog" aria-modal="true" aria-label="Guida GPS Dove Riposa">
      <button className="precision-nav-close" onClick={closeAll} aria-label="Chiudi">×</button>
      <div className="field-guide-start-card">
        <span className="eyebrow">DOVE RIPOSA PRECISION</span>
        <h1>{selected.nome} {selected.cognome}</h1>
        <p>{municipalityLabel} · {selected.settore} · {selected.fila} · {selected.posizione}</p>

        <div className="field-guide-start-point">
          <span>PARTENZA</span>
          <b>{calibrated?'Posizione confermata · '+calibrated.label:'Ingresso principale'}</b>
          <small>{calibrated?'Il prossimo punto viene calcolato da qui.':'Per la prova migliore scansiona prima il QR all’ingresso.'}</small>
        </div>

        <button className="primary field-guide-launch" type="button" onClick={startGuide} disabled={starting}>
          {starting?'Attivazione…':'Attiva guida fotocamera'}
        </button>
        <small className="field-guide-permissions">
          {routeReady
            ? 'Consenti Fotocamera e Posizione quando il telefono lo chiede.'
            : 'Percorso non completo: sul telefono operatore registra prima Ingresso, Nodo A, Nodo B e Destinazione, poi ricondividi la prova.'}
        </small>
        {error&&<div className="precision-nav-error">{error}</div>}
      </div>
    </div>;
  }

  return <div className="field-camera-guide" role="dialog" aria-modal="true" aria-label="Navigazione visuale Dove Riposa">
    <video ref={videoRef} className="field-camera-video" playsInline muted autoPlay/>

    <div className="field-camera-shade"></div>
    {cameraStatus!=='ready'&&<div className="field-camera-loading">Avvio fotocamera…</div>}

    <div className="field-camera-top">
      <div>
        <span>DOVE RIPOSA</span>
        <b>{selected.nome} {selected.cognome}</b>
      </div>
      <div className="field-camera-top-actions">
        <button type="button" onClick={()=>setHaptics(v=>!v)}>{haptics?'Vibrazioni ON':'Vibrazioni OFF'}</button>
        <button type="button" onClick={closeAll} aria-label="Chiudi">×</button>
      </div>
    </div>

    {scannerOpen?<div className="field-camera-scan">
      <div className="precision-scan-frame" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      <h2>Inquadra il QR di posizione</h2>
      <p>Il nodo letto diventa immediatamente il nuovo punto certo.</p>
      <button className="secondary" type="button" onClick={stopQrScan}>Annulla scansione</button>
    </div>:<>
      <div className={offRoute?'field-camera-direction off-route':'field-camera-direction'}>
        <span className="field-camera-target">{offRoute?'FUORI PERCORSO':isDestination?'DESTINAZIONE':target?.label?.toUpperCase()}</span>
        <div
          className={heading==null?'field-camera-arrow no-heading':'field-camera-arrow'}
          style={heading==null?undefined:{transform:'rotate('+(offRoute?recoveryAngle:relativeAngle)+'deg)'}}
          aria-hidden="true"
        >↑</div>
        <h2>{offRoute
          ? movingAway?'Hai girato troppo presto':'Fuori percorso'
          : nearTarget
            ? isDestination?'Sei nella zona della sepoltura':'Nodo vicino: cerca il QR'
            : instruction}</h2>
        <div className="field-camera-distance">
          {distance!=null
            ? '~ '+Math.max(0,Math.round(distance))+' m'+(target?.label?' a '+target.label:'')
            : 'Calcolo distanza…'}
        </div>
        <small>{gpsAccuracy!=null
          ? 'GPS ±'+gpsAccuracy+' m'+(gpsGood?'':' · precisione bassa')
          : 'Ricerca posizione…'}</small>
      </div>

      <div className="field-camera-bottom">
        {offRoute&&<div className="field-camera-offroute">
          Torna all’ultimo punto certo: <b>{currentLabel}</b>. La freccia ora indica quel punto; da lì riparti verso {target?.label||'il prossimo nodo'}.
        </div>}
        {notice&&<div className="field-camera-notice">{notice}</div>}
        {error&&<div className="precision-nav-error">{error}</div>}

        {!isDestination&&<button className="primary field-scan-node" type="button" onClick={startQrScan}>
          {nearTarget?'Scansiona QR adesso':'Scansiona QR nodo'}
        </button>}

        {isDestination&&nearTarget&&<div className="field-camera-arrival">
          <span>CONTROLLA LA POSIZIONE</span>
          <b>{selected.settore} · {selected.fila} · {selected.posizione}</b>
          {!arrivalStatus&&<>
            <button className="primary" type="button" onClick={()=>{setArrivalStatus('found');navigator.vibrate?.([420]);}}>Ho trovato la sepoltura</button>
            <button className="secondary" type="button" onClick={()=>setArrivalStatus('missing')}>Non la trovo</button>
          </>}
          {arrivalStatus==='found'&&<div className="precision-arrival-result success">✓ Arrivo confermato.</div>}
          {arrivalStatus==='missing'&&<div className="field-camera-notice">Controlla settore, fila e posizione oppure torna al QR Nodo B per ricalibrare.</div>}
        </div>}

        {heading==null&&<div className="field-camera-help">La distanza è attiva. Per orientare la freccia abilita l’accesso alla bussola, se richiesto dal telefono.</div>}
        {!gpsGood&&<div className="field-camera-help">GPS poco preciso: non segnalo deviazioni finché l’accuratezza non migliora. Il QR resta il punto certo.</div>}
      </div>
    </>}
  </div>;
}
