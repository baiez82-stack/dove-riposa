import Link from 'next/link';
import BrandLockup from '../../components/BrandLockup';

export const metadata = {
  title: 'Accessibilità | Dove Riposa - Povegliano Veronese',
  description: 'Stato di accessibilità della demo Dove Riposa e requisiti previsti per un eventuale servizio comunale.'
};

export default function AccessibilityPage(){
  return <main>
    <header className="citizen-header">
      <Link href="/povegliano-veronese" className="citizen-brand"><BrandLockup subtitle="Povegliano Veronese"/></Link>
      <nav><Link href="/povegliano-veronese">Torna alla ricerca</Link></nav>
    </header>

    <section className="privacy-page wrap">
      <div className="privacy-hero">
        <span className="eyebrow">DEMO · AGGIORNAMENTO 30/09/2026</span>
        <h1>Accessibilità</h1>
        <p>Questa pagina descrive lo stato della demo. Non è la Dichiarazione di Accessibilità ufficiale prevista per un sito o un’app di una Pubblica Amministrazione.</p>
      </div>

      <div className="privacy-sections">
        <section className="privacy-section"><h2>Accessibilità digitale</h2><p>Dove Riposa è progettato con interfaccia responsive, navigazione testuale e funzioni che non richiedono obbligatoriamente fotocamera o geolocalizzazione. La demo non è stata ancora sottoposta a una verifica formale completa secondo le metodologie AgID e non viene quindi dichiarata “conforme” in questa fase.</p></section>

        <section className="privacy-section"><h2>Accessibilità dei percorsi fisici</h2><p>Il modulo Accessibility Layer distingue tra dati stimati e dati verificati sul posto. Superficie, pendenza, larghezza, gradini, rampe e punti di sosta non devono essere presentati come certificati finché non sono validati dall’ente. Le condizioni reali del cimitero e la segnaletica sul posto prevalgono sempre sulla rappresentazione digitale.</p></section>

        <section className="privacy-section"><h2>Obblighi in caso di adozione da parte di una PA</h2><p>Prima della pubblicazione come servizio istituzionale, l’ente dovrà effettuare le verifiche previste, predisporre il meccanismo di feedback e pubblicare tramite AgID la propria Dichiarazione di Accessibilità, aggiornandola secondo le scadenze applicabili. Il link ufficiale generato da AgID dovrà essere inserito nel footer del servizio.</p></section>

        <section className="privacy-section"><h2>Feedback</h2><p>La demo non espone ancora un canale ufficiale dell’ente per segnalazioni di inaccessibilità. Tale canale deve essere definito e pubblicato prima del pilot istituzionale.</p></section>
      </div>

      <div className="privacy-sources">
        <h2>Riferimenti ufficiali</h2>
        <p><a href="https://www.agid.gov.it/it/design-servizi/accessibilita/linee-guida-accessibilita-pa" target="_blank" rel="noreferrer">AgID · Linee guida accessibilità per le PA</a></p>
        <p><a href="https://www.agid.gov.it/it/design-servizi/accessibilita/dichiarazione-accessibilita" target="_blank" rel="noreferrer">AgID · Dichiarazione di accessibilità</a></p>
      </div>

      <div className="legal-box"><b>Stato</b><p>Il servizio non sarà presentato come conforme o accessibile in senso normativo finché non sarà completata la verifica formale richiesta dall’ente.</p></div>
    </section>

    <footer><div className="footer-brand"><BrandLockup compact subtitle="Povegliano Veronese · demo pilota"/></div><p><Link href="/povegliano-veronese/privacy">Privacy</Link> · <Link href="/povegliano-veronese/termini">Termini d’uso</Link> · <Link href="/povegliano-veronese">Torna alla ricerca</Link></p></footer>
  </main>
}
