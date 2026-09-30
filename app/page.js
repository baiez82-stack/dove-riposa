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
        <p>Dove Riposa collega le aree cimiteriali aderenti in un’unica esperienza semplice, accessibile anche tramite QR direttamente all’ingresso del cimitero.</p>
      </div>
      <div className="municipality-card">
        <span className="eyebrow">COMUNE PILOTA · DEMO</span>
        <h2>Povegliano Veronese</h2>
        <p>Ricerca demo, mappa ricostruita del cimitero e navigazione con fotocamera.</p>
        <Link className="primary link-button" href="/povegliano-veronese">Apri area Povegliano Veronese</Link>
        <Link className="qr-demo-link" href="/povegliano-veronese?src=qr-ingresso">Simula accesso dal QR all’ingresso →</Link>
      </div>
    </section>
    <section className="trust-strip">
      <div><b>Nessun account</b><span>Il cittadino può cercare e navigare senza registrarsi.</span></div>
      <div><b>Area dedicata per Comune</b><span>Ogni ente dispone di URL, QR, mappa e contenuti propri.</span></div>
      <div><b>Analytics minimizzati</b><span>Misuriamo gli eventi di utilizzo senza inviare agli analytics i nomi cercati.</span></div>
    </section>
    <footer><div className="footer-brand"><BrandLockup compact subtitle="Servizio digitale cimiteriale"/></div><p><Link href="/enti">Soluzione per Comuni e gestori</Link></p></footer>
  </main>
}
