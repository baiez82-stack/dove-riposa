import Link from 'next/link';

export const metadata = {
  title: 'Privacy e trasparenza | Dove Riposa - Povegliano Veronese',
  description: 'Principi privacy by design adottati nella demo Dove Riposa per Povegliano Veronese.'
};

export default function PrivacyPage(){
  return <main>
    <header className="citizen-header">
      <Link href="/povegliano-veronese" className="citizen-brand"><span className="mark">DR</span><div><strong>Dove Riposa</strong><small>Povegliano Veronese</small></div></Link>
      <nav><Link href="/povegliano-veronese">Torna alla ricerca</Link></nav>
    </header>

    <section className="privacy-page wrap">
      <div className="privacy-hero">
        <span className="eyebrow">PRIVACY BY DESIGN · DEMO PILOTA</span>
        <h1>Privacy e trasparenza</h1>
        <p>Questa pagina descrive le scelte privacy già incorporate nella demo e i requisiti da formalizzare prima di collegare archivi comunali reali. Non sostituisce l'informativa definitiva del Comune né la validazione del DPO.</p>
      </div>

      <div className="privacy-summary">
        <div><b>Nessuna registrazione</b><span>La ricerca pubblica non richiede account, email, telefono o identità del cittadino.</span></div>
        <div><b>Nessun profilo commemorativo</b><span>La scheda serve solo a localizzare la sepoltura. Niente social, dediche o servizi commerciali collegati al defunto.</span></div>
        <div><b>Analytics minimizzati</b><span>Gli eventi tecnici non contengono il nome o cognome digitato nella ricerca.</span></div>
        <div><b>Fotocamera locale</b><span>La demo richiede il permesso del browser solo quando viene avviata la navigazione con fotocamera.</span></div>
      </div>

      <div className="privacy-sections">
        <section className="privacy-section">
          <h2>1. Ricerca senza identificazione</h2>
          <p>Il cittadino può cercare una sepoltura senza creare un account. La demo non richiede nome dell'utente, email, numero di telefono o autenticazione. Questa scelta segue il principio di minimizzazione e l'indicazione espressa dal Garante secondo cui la semplice consultazione dell'ubicazione di una sepoltura non richiede l'identificazione dell'utente.</p>
        </section>

        <section className="privacy-section">
          <h2>2. Dati mostrati sul defunto</h2>
          <p>La finalità prevista è esclusivamente individuare la sepoltura. La versione reale dovrà pubblicare solo i dati strettamente necessari e autorizzati dal Comune, ad esempio nominativo, riferimenti temporali essenziali e posizione della sepoltura. Non sono previsti profili social, commenti, dediche, fotografie caricate automaticamente, fiori virtuali o servizi commerciali collegati alla scheda.</p>
        </section>

        <section className="privacy-section">
          <h2>3. Analytics di utilizzo</h2>
          <p>Per misurare l'utilità del servizio registriamo solo categorie di evento come apertura pagina, ingresso da QR, ricerca effettuata, apertura di un risultato e avvio della navigazione. L'endpoint della demo non riceve il nominativo cercato né un identificatore persistente dell'utente. L'infrastruttura di hosting può comunque generare log tecnici di rete: fornitori, tempi di conservazione e configurazione dei log dovranno essere definiti e documentati prima della produzione.</p>
          <div className="privacy-code">Esempio: search · povegliano-veronese · qr-ingresso · timestamp<br/>Non: "Mario Rossi cercato dall'utente X"</div>
        </section>

        <section className="privacy-section">
          <h2>4. Fotocamera e futura geolocalizzazione</h2>
          <p>La fotocamera viene attivata solo dopo una scelta dell'utente e dopo il consenso richiesto dal browser. La demo non registra né carica il flusso video sui nostri server. La geolocalizzazione non è attiva nella demo; se introdotta, dovrà essere usata solo durante la navigazione, previa autorizzazione del dispositivo e senza creare uno storico degli spostamenti salvo diversa base giuridica e informativa.</p>
        </section>

        <section className="privacy-section">
          <h2>5. Ruoli e responsabilità</h2>
          <p>L'assetto previsto per un progetto comunale è da formalizzare con l'ente e il DPO. In linea generale il Comune, quale soggetto che determina finalità e modalità del servizio istituzionale, potrà assumere il ruolo di titolare del trattamento e il fornitore tecnico quello di responsabile ai sensi dell'art. 28 GDPR, nei limiti stabiliti dal contratto. Questa configurazione dovrà essere verificata sul flusso reale prima dell'attivazione.</p>
        </section>

        <section className="privacy-section">
          <h2>6. Rettifica, segnalazioni e diritti</h2>
          <p>La versione reale includerà un canale per segnalare dati errati o posizioni da verificare. Una segnalazione non modificherà automaticamente l'archivio: passerà da un operatore autorizzato. Dovrà inoltre essere definita la procedura per le richieste esercitate dai soggetti legittimati ai sensi dell'art. 2-terdecies del Codice Privacy, comprese le ragioni familiari meritevoli di protezione.</p>
        </section>

        <section className="privacy-section">
          <h2>7. Protezione da interrogazioni massive</h2>
          <p>Prima della produzione il motore pubblico dovrà prevedere misure anti-abuso proporzionate, come rate limiting, rilevamento bot e, quando necessario, CAPTCHA. L'obiettivo è permettere la ricerca puntuale senza rendere semplice l'estrazione automatizzata dell'intero archivio cimiteriale.</p>
        </section>

        <section className="privacy-section">
          <h2>8. Area operatori</h2>
          <p>L'area amministrativa mostrata nella demo non è destinata a dati reali. La produzione dovrà usare autenticazione lato server, credenziali individuali, ruoli, sessioni sicure, audit delle modifiche, limitazione dei privilegi e procedure di revoca degli accessi. Il PIN della demo non costituisce una misura di sicurezza di produzione.</p>
        </section>

        <section className="privacy-section">
          <h2>9. Cosa manca prima dei dati reali</h2>
          <ul>
            <li>validazione del Comune e del DPO;</li>
            <li>definizione dei ruoli privacy e degli eventuali sub-responsabili;</li>
            <li>contratto e istruzioni sul trattamento;</li>
            <li>informativa definitiva e contatti del titolare/DPO;</li>
            <li>politiche di conservazione e cancellazione dei log;</li>
            <li>misure di sicurezza, backup, incident response e gestione accessi;</li>
            <li>valutazione della necessità di una DPIA in base al trattamento effettivo.</li>
          </ul>
        </section>
      </div>

      <div className="privacy-sources">
        <h2>Riferimenti utilizzati per il progetto</h2>
        <p><a href="https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10225702" target="_blank" rel="noreferrer">Garante Privacy - Provvedimento 12 febbraio 2026, doc. web 10225702</a></p>
        <p><a href="https://garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/10228173" target="_blank" rel="noreferrer">Garante Privacy - Cimiteri digitali, newsletter 9 marzo 2026</a></p>
        <p><a href="https://www.normattiva.it/atto/caricaDettaglioAtto?atto.articolo.numero=2&atto.articolo.sottoArticolo=1&atto.articolo.tipoArticolo=0&atto.codiceRedazionale=18G00129&atto.dataPubblicazioneGazzetta=2018-09-04" target="_blank" rel="noreferrer">Normattiva - art. 2-terdecies, diritti riguardanti le persone decedute</a></p>
      </div>
    </section>

    <footer><div><b>Dove Riposa</b><span>Povegliano Veronese · progetto pilota</span></div><p><Link href="/povegliano-veronese">Torna al servizio cittadino</Link></p></footer>
  </main>
}
