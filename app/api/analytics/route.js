const allowedEvents = new Set(['page_view','qr_entry','search','result_open','navigation_start','arrival_confirmed']);

function clean(value, max){
  return String(value || '').toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,max);
}

function json(data,status=200){
  return new Response(JSON.stringify(data),{
    status,
    headers:{
      'content-type':'application/json; charset=utf-8',
      'cache-control':'no-store, max-age=0'
    }
  });
}

export async function POST(request){
  try{
    const body = await request.json();
    const event = clean(body.event,40);
    if(!allowedEvents.has(event)) return json({ok:false},400);

    // Privacy-minimized analytics payload.
    // Intentionally excluded: searched name/surname, email, phone, account ID,
    // persistent client ID, exact location and free-text fields.
    const payload = {
      event,
      comune: clean(body.comune,80),
      source: clean(body.source,80),
      mode: clean(body.mode,30),
      ts: new Date().toISOString()
    };

    console.log('[aggregate-event]', payload);
    return json({ok:true});
  }catch{
    return json({ok:false},400);
  }
}
