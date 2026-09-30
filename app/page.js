import Link from 'next/link';
import BrandLockup from './components/BrandLockup';

export default function Home(){
  return <main>
    <header className="citizen-header">
      <Link href="/" className="citizen-brand"><BrandLockup subtitle="Trova una sepoltura"/></Link>
      <nav><Link href="/enti">Per gli enti</Link></nav>
    </header>
    <section className="national-hero">
      <div>
        <span className="eyebrow">SERVIZIO SENZA REGISTRAZIONE</span>
        <h1>Trova una sepoltura nel tuo Comune.</h1>
        <p>Dove Riposa nasce per collegare le aree cimiteriali aderenti in un’unica esperienza semplice, accessibile anche tramite QR direttamente all’ingresso del cimitero.</p>
      </div>
      <div className="municipality-card">
        <span className="eyebrow">DEMO MUNICIPALI</span>
        <h2>Povegliano Veronese</h2>
        <p>Demo completa con ricerca, mappa ricostruita, Precision, Accessibility Layer e Live.</p>
        <Link className="primary link-button" href="/povegliano-veronese">Apri Povegliano Veronese</Link>
        <hr/>
        <h2>Pescantina</h2>
        <p>Area pilot predisposta senza inventare una planimetria: ricerca demo e moduli pronti per dati e cartografia ufficiali.</p>
        <Link className="secondary link-button" href="/pescantina">Apri Pescantina</Link>
      </div>
    </section>
    <section className="trust-strip">
      <div><b>Nessun account</b><span>Il cittadino può cercare e navigare senza registrarsi.</span></div>
      <div><b>Area dedicata per Comune</b><span>Ogni ente dispone di URL, QR, mappa e contenuti propri.</span></div>
      <div><b>Analytics minimizzati</b><span>Misuriamo gli eventi di utilizzo senza inviare agli analytics i nomi cercati.</span></div>
    </section>
    <footer><div className="footer-brand"><BrandLockup compact subtitle="Progetto pilota"/></div><p><Link href="/enti">Soluzione per Comuni e gestori</Link></p></footer>
  </main>
}
