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
        <span className="eyebrow">DEMO · AGGIORNAMENTO 01/10/2026</span>
        <h1>Accessibilità</h1>
        <p>Questa pagina descrive lo stato della demo. Non è la Dichiarazione di Accessibilità ufficiale prevista per un sito o un’app di una Pubblica Amministrazione.</p>
      </div>

      <div className="privacy-sections">
        <section className="privacy-section">
          <h2>Accessibilità digitale</h2>
          <p>Dove Riposa è progettato per funzionare anche senza fotocamera, geolocalizzazione o vibrazione. Le azioni principali sono disponibili con testo e controlli standard, ma la demo non è ancora stata sottoposta a una verifica formale completa secondo le metodologie AgID e non viene dichiarata “conforme”.</p>
        </section>

        <section className="privacy-section">
          <h2>Guida aptica</h2>
          <p>La guida tramite vibrazioni è facoltativa, dipende dal supporto del browser e utilizza un pattern sperimentale Dove Riposa. Non è uno standard internazionale per persone cieche o ipovedenti e non sostituisce screen reader, segnaletica, accompagnamento o altri ausili. Prima di presentarla come funzione assistiva dovrà essere testata con utenti reali e specialisti dell’accessibilità.</p>
        </section>

        <section className="privacy-section">
          <h2>Accessibilità dei percorsi fisici</h2>
          <p>Il modulo Dove Riposa Access distingue tra dati stimati e dati verificati sul posto. Superficie, pendenza, larghezza, gradini, rampe e punti di sosta non devono essere presentati come certificati finché non sono validati dall’ente tramite sopralluogo. Le condizioni reali del cimitero e la segnaletica prevalgono sempre sulla rappresentazione digitale.</p>
        </section>

        <section className="privacy-section">
          <h2>Obblighi in caso di adozione da parte di una PA</h2>
          <p>Prima della pubblicazione come servizio istituzionale, l’ente dovrà effettuare le verifiche previste, predisporre il meccanismo di feedback e pubblicare tramite AgID la propria Dichiarazione di Accessibilità. Per le PA la dichiarazione va riesaminata e, se necessario, aggiornata ogni anno entro il 23 settembre; il link ufficiale generato da AgID deve essere esposto nel footer del servizio.</p>
        </section>

        <section className="privacy-section">
          <h2>Feedback</h2>
          <p>La demo non espone ancora un canale ufficiale dell’ente per segnalazioni di inaccessibilità. Tale canale deve essere definito e pubblicato prima dell’attivazione istituzionale.</p>
        </section>
      </div>

      <div className="privacy-sources">
        <h2>Riferimenti ufficiali</h2>
        <p><a href="https://www.agid.gov.it/it/linee-guida" target="_blank" rel="noreferrer">AgID · Linee guida sull’accessibilità degli strumenti informatici</a></p>
        <p><a href="https://www.agid.gov.it/it/design-servizi/accessibilita/dichiarazione-accessibilita" target="_blank" rel="noreferrer">AgID · Dichiarazione di accessibilità</a></p>
      </div>

      <div className="legal-box">
        <b>Stato attuale</b>
        <p>La demo non viene presentata come conforme o accessibile in senso normativo finché non saranno completati test tecnici, test con tecnologie assistive e verifica formale richiesta dall’ente.</p>
      </div>
    </section>

    <footer>
      <div className="footer-brand"><BrandLockup compact subtitle="Povegliano Veronese · demo"/></div>
      <p><Link href="/povegliano-veronese/privacy">Privacy</Link> · <Link href="/povegliano-veronese/termini">Termini d’uso</Link> · <Link href="/povegliano-veronese">Torna alla ricerca</Link></p>
    </footer>
  </main>
}
