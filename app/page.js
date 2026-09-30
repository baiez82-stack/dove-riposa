import Link from 'next/link';
import BrandLockup from './components/BrandLockup';
import MunicipalityFinder from './components/MunicipalityFinder';

export default function Home(){
  return <main>
    <header className="citizen-header">
      <Link href="/" className="citizen-brand"><BrandLockup subtitle="Trova una sepoltura"/></Link>
      <nav><Link href="/enti">Per gli enti</Link></nav>
    </header>

    <section className="national-hero">
      <div>
        <span className="eyebrow">SERVIZIO SENZA REGISTRAZIONE</span>
        <h1>Trova una sepoltura partendo dal Comune.</h1>
        <p>Un unico punto di accesso. Scegli il Comune e Dove Riposa ti porta alla ricerca corretta, senza chiederti di conoscere in anticipo il cimitero.</p>
      </div>
      <MunicipalityFinder/>
    </section>

    <section className="wrap municipality-flow">
      <div className="section-head">
        <span className="eyebrow">COME FUNZIONA</span>
        <h2>Comune prima. Cimitero solo se serve.</h2>
        <p>Se un Comune ha un solo cimitero, entri direttamente nella ricerca. Se ne ha più di uno, la ricerca parte su tutti i cimiteri del Comune e il cittadino può usare il cimitero come filtro facoltativo.</p>
      </div>
      <div className="info-cards">
        <article><span className="flow-number">1</span><h3>Cerca Comune</h3><p>Autocomplete per nome e provincia. Mostriamo solo i Comuni realmente disponibili su Dove Riposa.</p></article>
        <article><span className="flow-number">2</span><h3>Cerca il defunto</h3><p>La ricerca viene eseguita sull’intero Comune. Il cittadino non deve sapere dove si trova la sepoltura.</p></article>
        <article><span className="flow-number">3</span><h3>Affina se necessario</h3><p>Con più cimiteri mostriamo il cimitero nei risultati e un filtro facoltativo, senza aggiungere un passaggio obbligatorio.</p></article>
      </div>
    </section>

    <section className="trust-strip">
      <div><b>Nessun account</b><span>Il cittadino può cercare e navigare senza registrarsi.</span></div>
      <div><b>Multi-cimitero</b><span>Un Comune può gestire più cimiteri senza complicare la ricerca dell’utente.</span></div>
      <div><b>Analytics minimizzati</b><span>Misuriamo gli eventi di utilizzo senza inviare agli analytics i nomi cercati.</span></div>
    </section>

    <footer><div className="footer-brand"><BrandLockup compact subtitle="Progetto pilota"/></div><p><Link href="/enti">Soluzione per Comuni e gestori</Link></p></footer>
  </main>
}
