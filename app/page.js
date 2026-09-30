import Link from 'next/link';
import BrandLockup from './components/BrandLockup';
import MunicipalityFinder from './components/MunicipalityFinder';
import NearbyCemeteryDetector from './components/NearbyCemeteryDetector';
import { municipalities } from './data/municipalities';

export default function Home(){
  return <main className="directory-home">
    <header className="citizen-header directory-header">
      <Link href="/" className="citizen-brand"><BrandLockup subtitle="Trova una sepoltura"/></Link>
    </header>

    <section className="directory-shell">
      <div className="directory-intro">
        <span className="eyebrow">DOVE RIPOSA · DEMO</span>
        <h1>Trova il cimitero.</h1>
        <p>Puoi rilevarlo dalla tua posizione oppure scegliere il Comune manualmente.</p>
        <NearbyCemeteryDetector/>
        <div className="directory-divider"><span>oppure</span></div>
        <MunicipalityFinder/>
      </div>

      <div className="active-municipalities">
        <div className="directory-section-head">
          <h2>Comuni attivi</h2>
          <span>{municipalities.length} demo</span>
        </div>

        <div className="municipality-directory-grid">
          {municipalities.map(m=>
            <Link className="municipality-directory-card" href={'/'+m.id} key={m.id}>
              <div>
                <span className="municipality-directory-status">{m.status}</span>
                <h3>{m.name}</h3>
                <p>{m.province} · {m.cemeteries.length===1?'1 cimitero':m.cemeteries.length+' cimiteri'}</p>
              </div>
              <span className="municipality-directory-arrow" aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
    </section>

    <footer className="directory-footer">
      <span>Demo dimostrativa · dati fittizi</span>
    </footer>
  </main>
}
