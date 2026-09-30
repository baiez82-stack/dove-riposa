import Link from 'next/link';
import BrandLockup from './components/BrandLockup';
import MunicipalityFinder from './components/MunicipalityFinder';
import NearbyCemeteryDetector from './components/NearbyCemeteryDetector';

export default function Home(){
  return <main className="directory-home">
    <header className="citizen-header directory-header">
      <Link href="/" className="citizen-brand"><BrandLockup subtitle="Navigazione cimiteriale"/></Link>
    </header>

    <section className="directory-shell">
      <div className="directory-intro">
        <span className="eyebrow">DOVE RIPOSA · DEMO</span>
        <h1>Trova il cimitero.<br/><em>Poi ti guidiamo fino alla sepoltura.</em></h1>
        <p>Rileva il cimitero vicino a te oppure cerca il Comune. Nessuna app obbligatoria, nessuna registrazione.</p>

        <NearbyCemeteryDetector/>

        <div className="directory-divider"><span>oppure cerca manualmente</span></div>

        <MunicipalityFinder/>

        <div className="directory-trust">
          <span>● Posizione non salvata</span>
          <span>● QR di posizione</span>
          <span>● Percorsi accessibili</span>
          <span>● Nessun account cittadino</span>
        </div>
      </div>
    </section>

    <footer className="directory-footer">
      <span>Demo dimostrativa · dati fittizi</span>
    </footer>
  </main>
}
