import Link from 'next/link';
import BrandLockup from '../../components/BrandLockup';

export const metadata = {
  title: 'Privacy e trasparenza | Dove Riposa - Povegliano Veronese',
  description: 'Informazioni privacy della demo pilota Dove Riposa per Povegliano Veronese.'
};

export default function PrivacyPage(){
  return <main>
    <header className="citizen-header">
      <Link href="/povegliano-veronese" className="citizen-brand"><BrandLockup subtitle="Povegliano Veronese"/></Link>
      <nav><Link href="/povegliano-veronese">Torna alla ricerca</Link></nav>
    </header>

    <section className="privacy-page wrap">
      <div className="privacy-hero">
        <span className="eyebrow">DEMO PILOTA · ULTIMO AGGIORNAMENTO 28/09/2026</span>
        <h1>Privacy e trasparenza</h1>
        <p>Questa pagina descrive i trattamenti attivi nella demo e le scelte privacy già incorporate nel progetto. La demo non è ancora un servizio ufficiale del Comune di Povegliano Veronese e non contiene archivi comunali reali.</p>
      </div>

      <div className="privacy-summary">
        <div><b>Nessuna registrazione</b><span>La ricerca pubblica non richiede account, email, telefono o identificazione del cittadino.</span></div>
        <div><b>Nessun profilo social</b><span>La finalità è localizzare la sepoltura, senza dediche, community o servizi commerciali collegati al defunto.</span></div>
        <div><b>Analytics minimizzati</b><span>Non inviamo all’endpoint analytics il nome, cognome o anno digitati nella ricerca.</span></div>
        <div><b>Fotocamera su richiesta</b><span>La fotocamera si attiva solo dopo una scelta dell’utente e il permesso del browser.</span></div>
      </div>

      <div className="privacy-sections">
        <section className="privacy-section">
          <h2>1. Stato della demo e soggetti coinvolti</h2>
          <p>Questa è una sperimentazione tecnica indipendente, non ancora adottata dal Comune. Finché non vengono caricati dati reali, la piattaforma usa nominativi e posizioni dimostrativi. Prima della produzione dovranno essere identificati formalmente il titolare del trattamento, il responsabile tecnico, gli eventuali sub-responsabili e i relativi contatti.</p>
        </section>

        <section className="privacy-section">
          <h2>2. Ricerca senza account</h2>
          <p>Il cittadino può cercare una sepoltura senza creare un profilo. Non chiediamo nome dell’utente, email, numero di telefono o credenziali per usare la funzione pubblica. È una scelta intenzionale di minimizzazione: la ricerca istituzionale non viene condizionata alla registrazione.</p>
        </section>

        <section className="privacy-section">
          <h2>3. Dati relativi alle sepolture</h2>
          <p>Nella futura versione reale saranno mostrati solo i dati necessari alla finalità di ricerca e localizzazione, nei limiti stabiliti dall’ente competente: ad esempio nominativo, riferimenti temporali essenziali e posizione della sepoltura. Dove Riposa non prevede la creazione automatica di profili commemorativi, community, dediche, classifiche di popolarità, ceri virtuali o vendita di servizi collegati alla scheda del defunto.</p>
        </section>

        <section className="privacy-section">
          <h2>4. Analytics e statistiche di utilizzo</h2>
          <p>La demo registra categorie tecniche di evento utili a valutare il servizio: apertura pagina, ingresso da QR, ricerca effettuata, apertura risultato e avvio della navigazione. L’endpoint applicativo non riceve i termini digitati nella ricerca né un identificatore persistente del visitatore.</p>
          <div className="privacy-code">Esempio previsto: search · povegliano-veronese · qr-ingresso · timestamp<br/>Dato escluso: nome/cognome digitato nella ricerca</div>
          <p>I sistemi di hosting e sicurezza possono comunque trattare log tecnici di rete, inclusi dati necessari al funzionamento e alla protezione del servizio. Prima della produzione saranno documentati fornitori, configurazioni e tempi di conservazione.</p>
        </section>

        <section className="privacy-section">
          <h2>5. Cookie e tecnologie analoghe</h2>
          <p>La demo non utilizza deliberatamente cookie di marketing, profilazione pubblicitaria o strumenti di retargeting. Eventuali cookie o memorie tecniche strettamente necessarie al funzionamento dell’infrastruttura o dell’area riservata saranno documentati nella versione definitiva. Se in futuro verranno introdotti strumenti non tecnici soggetti a consenso, verrà implementata la relativa gestione delle preferenze prima dell’attivazione.</p>
        </section>

        <section className="privacy-section">
          <h2>6. Fotocamera e navigazione</h2>
          <p>La navigazione con fotocamera è facoltativa. Il browser richiede il permesso prima dell’accesso e la demo non invia né salva il flusso video sui server applicativi. La funzione serve esclusivamente come sovrapposizione visiva dimostrativa al percorso.</p>
        </section>

        <section className="privacy-section">
          <h2>7. Geolocalizzazione e preferenze di percorso</h2>
          <p>La geolocalizzazione non è attualmente attiva. Se verrà introdotta, sarà richiesta solo quando necessaria alla navigazione e previa autorizzazione del dispositivo. L’architettura prevista non richiede la creazione di uno storico degli spostamenti del cittadino. Le scelte di percorso, incluse le modalità accessibile o assistita, sono preferenze funzionali della singola visita e non richiedono la creazione di un profilo sanitario o personale.</p>
        </section>

        <section className="privacy-section">
          <h2>8. Ruoli privacy nella versione reale</h2>
          <p>L’assetto dovrà essere concordato con l’ente e il DPO sulla base del servizio effettivamente attivato. In un modello tipico, il Comune che determina finalità e modalità del servizio istituzionale può operare come titolare e il fornitore tecnico come responsabile del trattamento ai sensi dell’art. 28 GDPR. Tale configurazione non viene data per scontata: sarà formalizzata contrattualmente prima dell’uso di dati reali.</p>
        </section>

        <section className="privacy-section">
          <h2>9. Rettifica, segnalazioni e richieste</h2>
          <p>La produzione includerà un canale per segnalare dati o posizioni da verificare. Le segnalazioni non modificheranno automaticamente l’archivio ma saranno sottoposte a un operatore autorizzato. Saranno inoltre definite con l’ente le procedure per le richieste previste dalla normativa italiana sui dati delle persone decedute, incluso l’art. 2-terdecies del Codice Privacy.</p>
        </section>

        <section className="privacy-section">
          <h2>10. Sicurezza e anti-scraping</h2>
          <p>Prima della produzione saranno attivate misure proporzionate contro interrogazioni massive e abusi, tra cui rate limiting, protezione bot e controlli automatici. L’area operatori utilizzerà autenticazione lato server, credenziali individuali, ruoli, sessioni sicure, audit delle modifiche e procedure di revoca.</p>
        </section>

        <section className="privacy-section">
          <h2>11. Conservazione</h2>
          <p>Nella demo gli eventi analytics applicativi non sono associati a profili utente. Per la produzione saranno stabiliti tempi di conservazione distinti per log tecnici, statistiche aggregate, audit amministrativi e segnalazioni, applicando il principio di limitazione della conservazione.</p>
        </section>

        <section className="privacy-section">
          <h2>12. Cosa deve essere completato prima della produzione</h2>
          <ul>
            <li>identificazione formale di titolare, responsabile ed eventuali sub-responsabili;</li>
            <li>base giuridica e finalità dei singoli trattamenti;</li>
            <li>contratto e istruzioni ex art. 28 GDPR ove applicabile;</li>
            <li>informativa definitiva con contatti del titolare e del DPO;</li>
            <li>registro dei trattamenti e politiche di conservazione;</li>
            <li>misure tecniche e organizzative, backup e gestione incidenti;</li>
            <li>valutazione della necessità di una DPIA sulla configurazione effettiva;</li>
            <li>verifica delle condizioni di pubblicazione e riuso dei dati cimiteriali.</li>
          </ul>
        </section>
      </div>

      <div className="privacy-sources">
        <h2>Riferimenti normativi e istituzionali</h2>
        <p><a href="https://garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/10228173" target="_blank" rel="noreferrer">Garante per la protezione dei dati personali - Newsletter 9 marzo 2026 sui cimiteri digitali</a></p>
        <p><a href="https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10225673" target="_blank" rel="noreferrer">Garante Privacy - Provvedimento 12 febbraio 2026, doc. web 10225673</a></p>
        <p><a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj/?locale=it" target="_blank" rel="noreferrer">Regolamento (UE) 2016/679 - GDPR</a></p>
        <p><a href="https://www.normattiva.it/" target="_blank" rel="noreferrer">Codice Privacy italiano - art. 2-terdecies</a></p>
      </div>

      <div className="legal-box"><b>Documento provvisorio</b><p>Questa pagina descrive la demo e le scelte progettuali attuali. Non costituisce l’informativa privacy definitiva di un eventuale servizio comunale in produzione.</p></div>
    </section>

    <footer><div className="footer-brand"><BrandLockup compact subtitle="Povegliano Veronese · demo pilota"/></div><p><Link href="/povegliano-veronese/termini">Termini d’uso</Link> · <Link href="/povegliano-veronese">Torna alla ricerca</Link></p></footer>
  </main>
}
