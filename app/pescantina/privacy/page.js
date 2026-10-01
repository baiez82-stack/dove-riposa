import Link from 'next/link';
import BrandLockup from '../../components/BrandLockup';

export const metadata = {
  title: 'Privacy e trasparenza | Dove Riposa - Pescantina',
  description: 'Informazioni privacy e trasparenza della demo Dove Riposa.'
};

export default function PrivacyPage(){
  return <main>
    <header className="citizen-header">
      <Link href="/pescantina" className="citizen-brand"><BrandLockup subtitle="Pescantina"/></Link>
      <nav><Link href="/pescantina">Torna alla ricerca</Link></nav>
    </header>

    <section className="privacy-page wrap">
      <div className="privacy-hero">
        <span className="eyebrow">DEMO · AGGIORNAMENTO 01/10/2026</span>
        <h1>Privacy e trasparenza</h1>
        <p>Questa pagina riguarda esclusivamente la demo tecnica di Dove Riposa. La demo non è un servizio ufficiale del Comune di Pescantina, usa dati fittizi e non contiene archivi cimiteriali reali.</p>
      </div>

      <div className="privacy-summary">
        <div><b>Ricerca senza account</b><span>La consultazione pubblica non richiede registrazione, email, telefono o identificazione del cittadino.</span></div>
        <div><b>Niente social o commercio</b><span>Nessun profilo commemorativo automatico, dedica, community, pubblicità o servizio commerciale collegato al defunto.</span></div>
        <div><b>Permessi solo su scelta</b><span>Posizione, fotocamera e vibrazione si attivano solo dopo un’azione esplicita dell’utente e restano facoltative.</span></div>
        <div><b>Analytics disattivati nella demo</b><span>La demo non salva eventi applicativi di ricerca o navigazione e non invia i termini cercati a un sistema analytics.</span></div>
      </div>

      <div className="legal-box">
        <b>Blocco dati reali</b>
        <p>Nessun archivio comunale reale deve essere caricato finché non sono formalizzati titolare, contatti/DPO, accordo con il fornitore ai sensi dell’art. 28 GDPR ove applicabile, sub-responsabili, tempi di conservazione, misure di sicurezza, anti-scraping e verifica dell’eventuale necessità di una DPIA.</p>
      </div>

      <div className="privacy-sections">
        <section className="privacy-section">
          <h2>1. Stato della demo e ruoli</h2>
          <p>La demo è un progetto tecnico indipendente e non attribuisce al Comune alcun ruolo di titolare del trattamento per questa fase dimostrativa. In un eventuale servizio istituzionale, l’ente dovrà definire formalmente finalità, base giuridica, ruoli, contatti, DPO e istruzioni al fornitore prima di utilizzare dati reali.</p>
          <p>L’infrastruttura tecnica può trattare i normali dati necessari a consegnare e proteggere una pagina web, come indirizzo IP, user-agent, URL richiesto, data/ora e log di sicurezza, secondo le configurazioni e i termini dei fornitori.</p>
        </section>

        <section className="privacy-section">
          <h2>2. Ricerca pubblica</h2>
          <p>I nominativi della demo sono fittizi. Nome, cognome e anno digitati vengono filtrati nel browser e non vengono inviati a Dove Riposa per finalità di analytics o profilazione.</p>
          <p>Nel servizio reale la consultazione dovrà restare separata da eventuali servizi non istituzionali e non richiederà la creazione di un account solo per conoscere l’ubicazione di una sepoltura.</p>
        </section>

        <section className="privacy-section">
          <h2>3. Posizione, fotocamera, QR e vibrazione</h2>
          <p><b>Geolocalizzazione:</b> viene richiesta solo quando l’utente preme il comando per rilevare il cimitero vicino. Il confronto con le coordinate dei cimiteri disponibili avviene nel browser; Dove Riposa non salva uno storico degli spostamenti.</p>
          <p><b>Fotocamera:</b> viene richiesta solo scegliendo “Scansiona QR” dentro Precision. Il flusso video serve localmente alla lettura del codice e non viene salvato o caricato da Dove Riposa.</p>
          <p><b>QR:</b> identifica un punto fisico del cimitero, non l’identità dell’utente. <b>Guida aptica:</b> se il browser la supporta, usa vibrazioni locali opzionali; il pattern è sperimentale e non costituisce uno standard assistivo certificato.</p>
        </section>

        <section className="privacy-section">
          <h2>4. Cookie e memoria locale</h2>
          <p>La parte pubblica non utilizza deliberatamente cookie di marketing o profilazione. L’area amministrativa usa cookie tecnici necessari all’autenticazione. Nell’admin, eventuali profili di mappatura dell’import possono essere memorizzati localmente sul browser dell’operatore.</p>
          <p>Se in futuro verranno introdotti strumenti di tracciamento non tecnici, dovranno essere bloccati fino alla scelta dell’utente quando il consenso è richiesto dalla normativa applicabile.</p>
        </section>

        <section className="privacy-section">
          <h2>5. Dati cimiteriali e persone decedute</h2>
          <p>Nel pilot reale dovranno essere utilizzati solo i dati necessari alla finalità di ricerca e localizzazione, nei limiti stabiliti dall’ente: ad esempio nome, cognome, riferimenti temporali essenziali, cimitero, settore, fila e posizione.</p>
          <p>Il GDPR non si applica direttamente ai dati delle persone decedute, ma l’ordinamento italiano disciplina l’esercizio di determinati diritti tramite l’art. 2-terdecies del Codice Privacy. Il Garante ha inoltre richiamato la necessità di mantenere separato il servizio istituzionale di ricerca da funzioni social o commerciali.</p>
        </section>

        <section className="privacy-section">
          <h2>6. Protezione da abusi</h2>
          <p>Nel servizio reale la protezione contro scraping, bot e interrogazioni massive dovrà essere realizzata con misure tecniche proporzionate, come rate limiting e sistemi anti-bot, senza trasformare la semplice consultazione in un obbligo di registrazione del cittadino.</p>
        </section>

        <section className="privacy-section">
          <h2>7. Fornitori e sicurezza</h2>
          <p>La demo utilizza Render per l’hosting e Supabase per database e autenticazione amministrativa. Il progetto Supabase è configurato in regione UE (Francoforte). Prima del pilot reale devono essere verificati piano contrattuale, DPA, sub-responsabili, localizzazione dei trattamenti, trasferimenti, retention dei log, backup, ripristino, gestione incidenti e revoca degli accessi.</p>
        </section>

        <section className="privacy-section">
          <h2>8. Diritti, rettifiche e accessibilità</h2>
          <p>Nel servizio istituzionale dovranno essere pubblicati i canali dell’ente per richieste, rettifiche e diritti applicabili, incluse le richieste relative ai dati di persone decedute nei casi previsti dalla legge. Le segnalazioni non dovranno modificare automaticamente l’archivio.</p>
          <p>Gli obblighi di accessibilità digitale e il meccanismo di feedback sono descritti nella pagina <Link className="text-link" href="/pescantina/accessibilita">Accessibilità</Link>.</p>
        </section>
      </div>

      <div className="privacy-sources">
        <h2>Riferimenti ufficiali</h2>
        <p><a href="https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10228173" target="_blank" rel="noreferrer">Garante Privacy · Cimiteri digitali, newsletter 9 marzo 2026</a></p>
        <p><a href="https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10225702" target="_blank" rel="noreferrer">Garante Privacy · Provvedimento 12 febbraio 2026, doc. web 10225702</a></p>
        <p><a href="https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876" target="_blank" rel="noreferrer">Garante Privacy · Linee guida cookie e altri strumenti di tracciamento</a></p>
        <p><a href="https://www.normattiva.it/eli/id/2003/07/29/003G0218/CONSOLIDATED/" target="_blank" rel="noreferrer">D.lgs. 196/2003 · Codice Privacy</a></p>
      </div>

      <div className="legal-box">
        <b>Non è una certificazione di conformità</b>
        <p>Queste scelte riducono i rischi della demo, ma la conformità del servizio reale dipenderà anche da contratti, configurazioni, procedure dell’ente, sicurezza, accessibilità, retention e modalità effettive di trattamento.</p>
      </div>
    </section>

    <footer>
      <div className="footer-brand"><BrandLockup compact subtitle="Pescantina · demo"/></div>
      <p><Link href="/pescantina/termini">Termini d’uso</Link> · <Link href="/pescantina/accessibilita">Accessibilità</Link> · <Link href="/pescantina">Torna alla ricerca</Link></p>
    </footer>
  </main>
}
