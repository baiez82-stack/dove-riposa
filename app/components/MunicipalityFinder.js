'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { municipalities } from '../data/municipalities';

export default function MunicipalityFinder(){
  const router = useRouter();
  const [query,setQuery] = useState('');
  const [open,setOpen] = useState(false);
  const [active,setActive] = useState(0);

  const matches = useMemo(()=>{
    const q = query.trim().toLowerCase();
    if(!q) return [];
    return municipalities.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.province.toLowerCase().includes(q)
    );
  },[query]);

  function choose(item){
    setQuery(item.name);
    setOpen(false);
    router.push('/'+item.id);
  }

  function onKeyDown(e){
    if(e.key==='ArrowDown'){
      e.preventDefault();
      setOpen(true);
      setActive(v=>Math.min(v+1,matches.length-1));
    }else if(e.key==='ArrowUp'){
      e.preventDefault();
      setOpen(true);
      setActive(v=>Math.max(v-1,0));
    }else if(e.key==='Enter' && open && matches[active]){
      e.preventDefault();
      choose(matches[active]);
    }else if(e.key==='Escape'){
      setOpen(false);
    }
  }

  return <div className="directory-search">
    <div className="municipality-autocomplete">
      <div className="municipality-input-wrap">
        <span aria-hidden="true" className="municipality-search-icon">⌕</span>
        <input
          value={query}
          onChange={e=>{setQuery(e.target.value);setOpen(Boolean(e.target.value.trim()));setActive(0);}}
          onFocus={()=>{if(query.trim())setOpen(true);}}
          onBlur={()=>setTimeout(()=>setOpen(false),120)}
          onKeyDown={onKeyDown}
          placeholder="Cerca un Comune"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="municipality-list"
          autoComplete="off"
        />
        <span className="municipality-input-hint">Comune</span>
      </div>

      {open && <div className="municipality-suggestions" id="municipality-list" role="listbox">
        {matches.length ? matches.map((m,i)=>
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
            <span className="municipality-option-status">Apri →</span>
          </button>
        ) : <div className="municipality-no-result">
          <b>Comune non ancora disponibile</b>
          <span>La demo contiene per ora Pescantina e Povegliano Veronese.</span>
        </div>}
      </div>}
    </div>
  </div>;
}
