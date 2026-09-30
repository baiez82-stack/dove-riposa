'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const municipalities=[
  {
    id:'povegliano-veronese',
    name:'Povegliano Veronese',
    province:'VR',
    status:'Demo',
    cemeteries:['Cimitero comunale']
  },
  {
    id:'pescantina',
    name:'Pescantina',
    province:'VR',
    status:'Demo',
    cemeteries:['Cimitero comunale']
  }
];

export default function MunicipalityFinder(){
  const router=useRouter();
  const inputRef=useRef(null);
  const [query,setQuery]=useState('');
  const [open,setOpen]=useState(false);
  const [active,setActive]=useState(0);

  const matches=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q) return municipalities;
    return municipalities.filter(m=>
      m.name.toLowerCase().includes(q) ||
      m.province.toLowerCase().includes(q) ||
      m.cemeteries.some(c=>c.toLowerCase().includes(q))
    );
  },[query]);

  function choose(item){
    setQuery(item.name);
    setOpen(false);
    router.push('/'+item.id);
  }

  function onKeyDown(e){
    if(!open && (e.key==='ArrowDown'||e.key==='ArrowUp')){
      setOpen(true);
      return;
    }
    if(e.key==='ArrowDown'){
      e.preventDefault();
      setActive(v=>Math.min(v+1,matches.length-1));
    }else if(e.key==='ArrowUp'){
      e.preventDefault();
      setActive(v=>Math.max(v-1,0));
    }else if(e.key==='Enter' && open && matches[active]){
      e.preventDefault();
      choose(matches[active]);
    }else if(e.key==='Escape'){
      setOpen(false);
    }
  }

  return <div className="municipality-finder">
    <span className="eyebrow">SCEGLI IL COMUNE</span>
    <h2>Cerca il tuo Comune</h2>
    <p>Scrivi il nome del Comune. Se ha più cimiteri, cercheremo automaticamente in tutti e potrai restringere il risultato solo se serve.</p>

    <div className="municipality-autocomplete">
      <div className="municipality-input-wrap">
        <span aria-hidden="true" className="municipality-search-icon">⌕</span>
        <input
          ref={inputRef}
          value={query}
          onChange={e=>{setQuery(e.target.value);setOpen(true);setActive(0);}}
          onFocus={()=>setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Es. Pescantina"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="municipality-list"
          autoComplete="off"
        />
      </div>

      {open && <div className="municipality-suggestions" id="municipality-list" role="listbox">
        {matches.length>0 ? matches.map((m,i)=>
          <button
            key={m.id}
            type="button"
            role="option"
            aria-selected={i===active}
            className={i===active?'municipality-option active':'municipality-option'}
            onMouseDown={e=>e.preventDefault()}
            onMouseEnter={()=>setActive(i)}
            onClick={()=>choose(m)}
          >
            <span className="municipality-option-main">
              <b>{m.name}</b>
              <small>{m.province} · {m.cemeteries.length===1?'1 cimitero':m.cemeteries.length+' cimiteri'}</small>
            </span>
            <span className="municipality-option-status">{m.status}</span>
          </button>
        ) : <div className="municipality-no-result">
          <b>Comune non ancora disponibile</b>
          <span>Stiamo ampliando Dove Riposa ad altri Comuni.</span>
        </div>}
      </div>}
    </div>

    <div className="municipality-quick">
      <span>Disponibili ora:</span>
      {municipalities.map(m=><button key={m.id} type="button" onClick={()=>choose(m)}>{m.name}</button>)}
    </div>
  </div>;
}
