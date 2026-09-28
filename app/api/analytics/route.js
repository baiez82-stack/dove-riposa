const allowedEvents = new Set(['page_view','qr_entry','search','result_open','navigation_start']);

export async function POST(request){
  try{
    const body=await request.json();
    const event=String(body.event||'');
    if(!allowedEvents.has(event)) return Response.json({ok:false},{status:400});
    const payload={
      event,
      comune:String(body.comune||'').slice(0,80),
      source:String(body.source||'').slice(0,80),
      mode:String(body.mode||'').slice(0,30),
      ts:new Date().toISOString()
    };
    console.log('[aggregate-event]',payload);
    return Response.json({ok:true});
  }catch{
    return Response.json({ok:false},{status:400});
  }
}
