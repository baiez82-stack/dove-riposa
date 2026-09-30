'use server';

import { createClient } from '../../../lib/supabase/server';

const MAX_ROWS=5000;
const INSERT_CHUNK=400;
const LOOKUP_CHUNK=300;

function cleanText(value,max=180){
  const text=String(value??'').trim().replace(/\s+/g,' ');
  return text ? text.slice(0,max) : null;
}

function cleanYear(value){
  const match=String(value??'').match(/\b(1[0-9]{3}|20[0-9]{2}|2100)\b/);
  if(!match) return null;
  const year=Number(match[1]);
  return year>=1000 && year<=2100 ? year : null;
}

function cleanNumber(value){
  if(value===null||value===undefined||value==='') return null;
  const normalized=String(value).trim().replace(',','.');
  const number=Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function keyPart(value){
  return String(value??'')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,' ')
    .trim();
}

function makeDedupeKey(row){
  const ref=keyPart(row.source_ref);
  if(ref) return ('ref|'+ref).slice(0,500);
  return [
    row.first_name,row.last_name,row.birth_year,row.death_year,
    row.sector,row.row_label,row.position_label
  ].map(keyPart).join('|').slice(0,500);
}

function cleanDate(value){
  if(!value) return null;
  const date=new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function getAuthorizedContext(supabase,cemeteryId){
  const {data:{user},error:userError}=await supabase.auth.getUser();
  if(userError||!user) return {error:'Sessione amministratore non valida.'};

  const {data:cemetery,error:cemeteryError}=await supabase
    .from('cemeteries')
    .select('id,organization_id,name,municipality,province')
    .eq('id',cemeteryId)
    .maybeSingle();

  if(cemeteryError||!cemetery) return {error:'Cimitero non disponibile per questo account.'};

  const {data:membership,error:membershipError}=await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id',cemetery.organization_id)
    .eq('user_id',user.id)
    .in('role',['admin','operator'])
    .maybeSingle();

  if(membershipError||!membership) return {error:'Non hai permessi di importazione per questo ente.'};

  return {user,cemetery,membership};
}

export async function getImportTargets(){
  const supabase=await createClient();
  const {data:{user},error:userError}=await supabase.auth.getUser();
  if(userError||!user) return {ok:false,error:'Sessione non valida.',targets:[]};

  const {data:memberships,error:membershipError}=await supabase
    .from('organization_members')
    .select('organization_id,role')
    .eq('user_id',user.id)
    .in('role',['admin','operator']);

  if(membershipError) return {ok:false,error:'Impossibile leggere gli enti abilitati.',targets:[]};

  const orgIds=[...new Set((memberships||[]).map(x=>x.organization_id))];
  if(!orgIds.length) return {ok:true,targets:[]};

  const [{data:orgs},{data:cemeteries,error:cemError}]=await Promise.all([
    supabase.from('organizations').select('id,name,slug').in('id',orgIds),
    supabase.from('cemeteries').select('id,organization_id,name,municipality,province,slug').in('organization_id',orgIds)
  ]);

  if(cemError) return {ok:false,error:'Impossibile leggere i cimiteri abilitati.',targets:[]};

  const orgMap=Object.fromEntries((orgs||[]).map(o=>[o.id,o]));
  const targets=(cemeteries||[]).map(c=>({
    cemeteryId:c.id,
    cemeteryName:c.name,
    municipality:c.municipality||orgMap[c.organization_id]?.name||'Comune',
    province:c.province||'',
    organizationId:c.organization_id,
    organizationName:orgMap[c.organization_id]?.name||'Ente'
  })).sort((a,b)=>a.municipality.localeCompare(b.municipality,'it'));

  return {ok:true,targets};
}

export async function importBurials(payload){
  const supabase=await createClient();

  const cemeteryId=String(payload?.cemeteryId||'');
  const filename=cleanText(payload?.filename,240)||'import';
  const inputRows=Array.isArray(payload?.rows)?payload.rows:[];

  if(!cemeteryId) return {ok:false,error:'Seleziona un cimitero.'};
  if(!inputRows.length) return {ok:false,error:'Il file non contiene righe importabili.'};
  if(inputRows.length>MAX_ROWS) return {ok:false,error:`Massimo ${MAX_ROWS} righe per importazione.`};

  const context=await getAuthorizedContext(supabase,cemeteryId);
  if(context.error) return {ok:false,error:context.error};

  const {user,cemetery}=context;
  const valid=[];
  const invalid=[];

  inputRows.forEach((raw,index)=>{
    const row={
      first_name:cleanText(raw?.first_name,120),
      last_name:cleanText(raw?.last_name,120),
      birth_year:cleanYear(raw?.birth_year),
      death_year:cleanYear(raw?.death_year),
      sector:cleanText(raw?.sector,140),
      row_label:cleanText(raw?.row_label,140),
      position_label:cleanText(raw?.position_label,180),
      map_x:cleanNumber(raw?.map_x),
      map_y:cleanNumber(raw?.map_y),
      source_ref:cleanText(raw?.source_ref,240),
      source_updated_at:cleanDate(raw?.source_updated_at)
    };

    if(!row.first_name||!row.last_name){
      invalid.push({row:index+2,reason:'Nome o cognome mancante'});
      return;
    }

    row.dedupe_key=makeDedupeKey(row);
    if(!row.dedupe_key){
      invalid.push({row:index+2,reason:'Chiave record non valida'});
      return;
    }
    valid.push(row);
  });

  if(!valid.length){
    return {ok:false,error:'Nessuna riga valida da importare.',invalid:invalid.slice(0,30)};
  }

  const uniqueMap=new Map();
  for(const row of valid){
    if(!uniqueMap.has(row.dedupe_key)) uniqueMap.set(row.dedupe_key,row);
  }
  const uniqueRows=[...uniqueMap.values()];
  const duplicateInFile=valid.length-uniqueRows.length;

  const existingKeys=new Set();
  for(let i=0;i<uniqueRows.length;i+=LOOKUP_CHUNK){
    const keys=uniqueRows.slice(i,i+LOOKUP_CHUNK).map(r=>r.dedupe_key);
    const {data,error}=await supabase
      .from('burials')
      .select('dedupe_key')
      .eq('cemetery_id',cemetery.id)
      .in('dedupe_key',keys);
    if(error) return {ok:false,error:'Controllo duplicati non riuscito.'};
    (data||[]).forEach(r=>existingKeys.add(r.dedupe_key));
  }

  const newRows=uniqueRows.filter(r=>!existingKeys.has(r.dedupe_key));

  const {data:batch,error:batchError}=await supabase
    .from('import_batches')
    .insert({
      organization_id:cemetery.organization_id,
      cemetery_id:cemetery.id,
      filename,
      row_count:inputRows.length,
      imported_count:0,
      skipped_count:existingKeys.size+duplicateInFile,
      error_count:invalid.length,
      status:'processing',
      created_by:user.id
    })
    .select('id')
    .single();

  if(batchError||!batch) return {ok:false,error:'Impossibile creare il registro di importazione.'};

  let imported=0;
  try{
    for(let i=0;i<newRows.length;i+=INSERT_CHUNK){
      const chunk=newRows.slice(i,i+INSERT_CHUNK).map(row=>({
        organization_id:cemetery.organization_id,
        cemetery_id:cemetery.id,
        first_name:row.first_name,
        last_name:row.last_name,
        birth_year:row.birth_year,
        death_year:row.death_year,
        sector:row.sector,
        row_label:row.row_label,
        position_label:row.position_label,
        map_x:row.map_x,
        map_y:row.map_y,
        status:'draft',
        source_ref:row.source_ref,
        source_updated_at:row.source_updated_at,
        dedupe_key:row.dedupe_key,
        import_batch_id:batch.id
      }));

      const {data,error}=await supabase
        .from('burials')
        .upsert(chunk,{onConflict:'cemetery_id,dedupe_key',ignoreDuplicates:true})
        .select('id');

      if(error) throw error;
      imported+=(data||[]).length;
    }

    const skipped=inputRows.length-imported-invalid.length;
    await supabase
      .from('import_batches')
      .update({
        imported_count:imported,
        skipped_count:Math.max(0,skipped),
        error_count:invalid.length,
        status:'completed',
        completed_at:new Date().toISOString()
      })
      .eq('id',batch.id);

    return {
      ok:true,
      batchId:batch.id,
      imported,
      skipped:Math.max(0,skipped),
      invalidCount:invalid.length,
      invalid:invalid.slice(0,30),
      total:inputRows.length,
      message:`${imported} record importati come bozza. ${Math.max(0,skipped)} duplicati saltati. ${invalid.length} righe non valide.`
    };
  }catch(error){
    await supabase
      .from('import_batches')
      .update({
        imported_count:imported,
        error_count:invalid.length+1,
        status:'failed',
        completed_at:new Date().toISOString()
      })
      .eq('id',batch.id);

    return {
      ok:false,
      error:'Importazione interrotta. I record già inseriti restano in bozza e sono collegati al batch per la revisione.'
    };
  }
}
