import Link from 'next/link';
import BrandLockup from '../../components/BrandLockup';

export const metadata = {
  title: 'Termini d’uso | Dove Riposa - Povegliano Veronese',
  description: 'Termini d’uso della demo pilota Dove Riposa per Povegliano Veronese.'
};

export default function TermsPage(){
  return <main>
    <header className="citizen-header">
      <Link href="/povegliano-veronese" className="citizen-brand"><BrandLockup subtitle="Povegliano Veronese"/></Link>
      <nav><Link href="/povegliano-veronese">Torna alla ricerca</Link></nav>
    </header>

    <section className="privacy-page wrap">
      <div className="privacy-hero">
        <span className="eyebrow">DEMO PILOTA · AGGIORNAMENTO 01/10/2026</span>
        <h1>Termini d’uso</h1>
        <p>Questi termini disciplinano esclusivamente la demo tecnica di Dove Riposa. La demo non è un servizio ufficiale del Comune di Povegliano Veronese e non contiene dati o planimetrie comunali ufficiali.</p>
      </div>

      <div className="legal-box"><b>Importante</b><p>La demo serve a valutare il progetto. Non rilascia certificazioni amministrative, non sostituisce registri cimiteriali, segnaletica, regolamenti comunali o indicazioni del gestore e non deve essere utilizzata per assumere decisioni che richiedano un dato ufficiale.</p></div>

      <div className="privacy-sections">
        <section className="privacy-section"><h2>1. Oggetto e stato del servizio</h2><p>Dove Riposa è una web app progettata per ricerca, localizzazione e navigazione verso una sepoltura. In questa fase le informazioni sono dimostrative e il Comune non ha ancora adottato il servizio. Un eventuale pilot reale sarà regolato da separati atti con l’ente e dalla documentazione privacy e tecnica approvata per la produzione.</p></section>

        <section className="privacy-section"><h2>2. Accesso pubblico</h2><p>La consultazione pubblica della demo è gratuita e non richiede registrazione. L’area operatori è separata, richiede autenticazione nominativa e deve essere utilizzata solo da soggetti autorizzati. È vietato condividere credenziali, tentare di accedere con account altrui o eludere i controlli di sicurezza.</p></section>

        <section className="privacy-section"><h2>3. Uso consentito e abusi</h2><p>È consentita la consultazione personale, la valutazione del progetto e la presentazione istituzionale. Non sono consentiti scraping o interrogazioni massive, bot non autorizzati, raccolta sistematica dei risultati, aggiramento di limiti tecnici, scansioni di sicurezza non autorizzate, tentativi di accesso a dati o funzioni riservate, interferenze con il servizio o usi contrari alla legge e ai diritti di terzi.</p></section>

        <section className="privacy-section"><h2>4. Dati e cartografia della demo</h2><p>Nomi, date, settori, file, loculi, distanze, marker, condizioni dei percorsi e indicazioni di accessibilità sono esemplificativi. La ricostruzione grafica non è una planimetria ufficiale. Nel servizio reale potranno essere pubblicati soltanto dati forniti o validati dall’ente competente e nei limiti delle finalità istituzionali definite dall’ente.</p></section>

        <section className="privacy-section"><h2>5. Navigazione, Precision e accessibilità fisica</h2><p>Le indicazioni di navigazione sono assistenza orientativa. Fotocamera e vibrazione sono facoltative e si attivano solo su scelta dell’utente. La guida aptica usa un pattern sperimentale Dove Riposa e non è uno standard assistivo certificato. Le indicazioni non sostituiscono segnaletica, recinzioni, divieti, personale o valutazioni sul posto. Le informazioni su rampe, pendenze, superfici, gradini e percorsi accessibili sono affidabili solo dopo validazione dell’ente tramite sopralluogo; in caso di contrasto prevalgono sempre le condizioni reali e le indicazioni ufficiali.</p></section>

        <section className="privacy-section"><h2>6. Dove Riposa Live</h2><p>Gli avvisi Live della demo sono simulazioni. Nel servizio reale eventuali chiusure, lavori, limitazioni o orari saranno pubblicati dagli operatori autorizzati. Un avviso digitale non garantisce che non possano esistere condizioni improvvise non ancora segnalate; l’utente deve rispettare la segnaletica e le disposizioni presenti sul posto.</p></section>

        <section className="privacy-section"><h2>7. Segnalazioni</h2><p>Le future segnalazioni dei cittadini avranno funzione informativa e non modificheranno automaticamente dati o percorsi. L’ente o l’operatore autorizzato dovrà verificare la segnalazione prima di aggiornare il servizio. Non devono essere inviati dati eccedenti, documenti, informazioni sanitarie o altri contenuti non necessari alla correzione richiesta.</p></section>

        <section className="privacy-section"><h2>8. Privacy</h2><p>Le modalità di trattamento della demo sono descritte in <Link className="text-link" href="/povegliano-veronese/privacy">Privacy e trasparenza</Link>. Nessun archivio comunale reale deve essere caricato prima della formalizzazione dei ruoli privacy, degli accordi con i fornitori, delle misure di sicurezza e dell’informativa definitiva.</p></section>

        <section className="privacy-section"><h2>9. Proprietà intellettuale e riuso dei dati</h2><p>Software, interfaccia, marchio e contenuti originali di Dove Riposa sono protetti nei limiti della normativa applicabile. I dati provenienti da enti pubblici restano soggetti al regime giuridico, alla licenza, alle limitazioni di riuso e agli obblighi previsti dalla fonte. La presenza di un dato nel servizio non attribuisce automaticamente un diritto di estrazione o riutilizzo massivo.</p></section>

        <section className="privacy-section"><h2>10. Servizi di terzi</h2><p>La demo dipende da infrastrutture e servizi di terzi, tra cui hosting, database e autenticazione. Malfunzionamenti, manutenzioni, indisponibilità di rete o modifiche dei fornitori possono incidere sulla disponibilità. Prima del pilot reale i rapporti con tali fornitori dovranno essere verificati anche sotto il profilo contrattuale e della protezione dei dati.</p></section>

        <section className="privacy-section"><h2>11. Disponibilità, modifiche e continuità</h2><p>Durante la fase demo il servizio può essere modificato, sospeso o disattivato. Non viene promessa continuità tipica di un servizio pubblico in produzione. Per il pilot reale dovranno essere definiti livelli di servizio, backup, ripristino, gestione incidenti e procedure di cessazione o migrazione dei dati.</p></section>

        <section className="privacy-section"><h2>12. Responsabilità</h2><p>Nei limiti consentiti dalla legge, chi utilizza la demo deve considerare tutte le informazioni come esemplificative. Dove Riposa non assume la funzione di certificare ubicazioni, accessibilità fisica, orari o disponibilità di percorsi finché tali dati non sono ufficialmente validati. Restano ferme le responsabilità che non possono essere escluse o limitate per legge.</p></section>

        <section className="privacy-section"><h2>13. Regole dell’ente nel servizio reale</h2><p>In caso di adozione da parte di un Comune, questi termini saranno integrati o sostituiti dalle condizioni del servizio, dai regolamenti cimiteriali, dalle informative e dalle disposizioni pubblicate dall’ente. In caso di contrasto, prevalgono gli atti e le disposizioni ufficiali applicabili.</p></section>

        <section className="privacy-section"><h2>14. Legge applicabile e tutela dell’utente</h2><p>Per la demo si applicano la normativa italiana e quella dell’Unione europea pertinenti. Nulla in questi termini limita diritti inderogabili riconosciuti dalla legge né modifica eventuali competenze territoriali inderogabili previste a tutela degli utenti.</p></section>

        <section className="privacy-section"><h2>15. Modifiche ai termini</h2><p>I termini possono essere aggiornati durante lo sviluppo. La data dell’ultima revisione è indicata in alto. Per un pilot reale, modifiche sostanziali che incidono sull’uso del servizio o sul trattamento dei dati dovranno essere gestite secondo gli atti e le responsabilità concordate con l’ente.</p></section>
      </div>

      <div className="legal-box"><b>Prima del pilot reale</b><p>Devono essere completati identificazione del gestore, contatti ufficiali, accordo con il Comune, disciplina privacy art. 28 ove applicabile, verifica dei fornitori, sicurezza, anti-scraping, accessibilità digitale e validazione della cartografia. Questi termini non rendono da soli il servizio “conforme”: la conformità dipende anche da come il sistema viene effettivamente gestito.</p></div>
    </section>

    <footer><div className="footer-brand"><BrandLockup compact subtitle="Povegliano Veronese · demo pilota"/></div><p><Link href="/povegliano-veronese/privacy">Privacy</Link> · <Link href="/povegliano-veronese/accessibilita">Accessibilità</Link> · <Link href="/povegliano-veronese">Torna alla ricerca</Link></p></footer>
  </main>
}
