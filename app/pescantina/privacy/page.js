import Link from 'next/link';
import BrandLockup from '../../components/BrandLockup';

export const metadata = {
  title: 'Privacy e trasparenza | Dove Riposa - Pescantina',
  description: 'Informazioni privacy e trasparenza della demo pilota Dove Riposa.'
};

export default function PrivacyPage(){
  return <main>
    <header className="citizen-header">
      <Link href="/pescantina" className="citizen-brand"><BrandLockup subtitle="Pescantina"/></Link>
      <nav><Link href="/pescantina">Torna alla ricerca</Link></nav>
    </header>

    <section className="privacy-page wrap">
      <div className="privacy-hero">
        <span className="eyebrow">DEMO PILOTA · AGGIORNAMENTO 30/09/2026</span>
        <h1>Privacy e trasparenza</h1>
        <p>Questa pagina descrive esclusivamente la demo tecnica attuale. La demo non è un servizio ufficiale del Comune di Pescantina, non contiene archivi comunali reali e non deve essere confusa con l’informativa definitiva che sarà pubblicata dall’ente titolare prima di un eventuale pilot con dati reali.</p>
      </div>

      <div className="privacy-summary">
        <div><b>Ricerca senza account</b><span>La consultazione pubblica non richiede nome dell’utente, email, telefono o autenticazione.</span></div>
        <div><b>Niente profili commemorativi</b><span>La finalità è ricerca e localizzazione della sepoltura, senza funzioni social o commerciali collegate al defunto.</span></div>
        <div><b>Minimizzazione</b><span>I termini digitati nella ricerca demo restano nel browser e non vengono inviati all’endpoint analytics applicativo.</span></div>
        <div><b>Fotocamera facoltativa</b><span>Si attiva solo su richiesta e con permesso del browser; il flusso video non viene caricato dall’applicazione.</span></div>
      </div>

      <div className="legal-box"><b>Regola di sicurezza del pilot</b><p>Nessun dato comunale reale deve essere caricato finché non sono formalizzati titolare, DPO/contatti, accordi art. 28 GDPR, fornitori e sub-responsabili, tempi di conservazione, misure di sicurezza, anti-scraping e verifica dell’eventuale necessità di una DPIA.</p></div>

      <div className="privacy-sections">
        <section className="privacy-section">
          <h2>1. Chi tratta i dati nella demo</h2>
          <p>La demo è attualmente gestita come progetto tecnico indipendente. Non essendo ancora adottata dal Comune, il Comune di Pescantina non viene indicato come titolare di questa demo.</p>
          <p>Per un eventuale servizio istituzionale, le fonti pubbliche del Comune indicano attualmente il Comune di Pescantina, Via Madonna 49, 37026 Pescantina (VR), protocollo@comune.pescantina.vr.it, PEC pescantina.vr@cert.ip-veneto.net; il DPO pubblicato dal Comune è l’Avv. Veronica Dei Rossi, contattabile a dpo@veronicadeirossi.com. Questi riferimenti verranno riportati nell’informativa definitiva solo dopo l’adozione formale del servizio e la validazione dell’ente.</p>
        </section>

        <section className="privacy-section">
          <h2>2. Dati trattati oggi</h2>
          <p><b>Consultazione pubblica:</b> i nominativi presenti sono fittizi. La ricerca avviene nel browser sui dati demo; nome, cognome e anno inseriti non vengono inviati all’endpoint analytics applicativo.</p>
          <p><b>Dati tecnici:</b> l’infrastruttura di hosting può trattare informazioni necessarie a erogare e proteggere il servizio, come indirizzo IP, user-agent, data/ora, URL richiesto e log di sicurezza.</p>
          <p><b>Area operatori:</b> l’autenticazione usa Supabase Auth e può trattare email dell’operatore, identificativo account, dati di sessione, data/ora e log di accesso. Gli account sono riservati agli operatori autorizzati.</p>
        </section>

        <section className="privacy-section">
          <h2>3. Analytics della demo</h2>
          <p>L’applicazione prevede solo eventi funzionali minimizzati: apertura pagina, ingresso da QR, ricerca effettuata, apertura di un risultato e avvio della navigazione. Non vengono inviati i termini cercati, né un identificatore persistente creato dall’app per seguire il cittadino nel tempo.</p>
          <div className="privacy-code">Evento ammesso: search · comune · sorgente · timestamp<br/>Dato escluso: nome/cognome/anno digitati nella ricerca</div>
          <p>La demo non utilizza questi eventi per profilazione, pubblicità comportamentale o decisioni sul singolo visitatore.</p>
        </section>

        <section className="privacy-section">
          <h2>4. Cookie, sessione e memoria locale</h2>
          <p>La parte pubblica non utilizza deliberatamente cookie di marketing o profilazione. L’area riservata utilizza cookie tecnici di sessione necessari all’autenticazione. La funzione offline usa cache tecnica del browser/service worker per conservare risorse essenziali dell’app sul dispositivo. Questi strumenti non sono utilizzati per pubblicità o tracciamento cross-site.</p>
          <p>Se in futuro verranno introdotti cookie o strumenti non tecnici soggetti a consenso, dovranno essere bloccati fino alla scelta dell’utente e gestiti secondo le regole applicabili prima della loro attivazione.</p>
        </section>

        <section className="privacy-section">
          <h2>5. Fotocamera, QR e geolocalizzazione</h2>
          <p>La fotocamera è facoltativa e viene richiesta dal browser solo quando l’utente avvia Dove Riposa Precision. Nella demo il flusso video viene utilizzato localmente per mostrare l’anteprima e, se supportato dal browser, leggere i QR di calibrazione; l’app non lo salva né lo invia ai propri server.</p>
          <p>I QR identificano punti del cimitero, non persone. La geolocalizzazione non è attualmente attiva. Se verrà introdotta, dovrà essere richiesta solo durante la navigazione, con autorizzazione del dispositivo e senza creare uno storico degli spostamenti per finalità ulteriori.</p>
        </section>

        <section className="privacy-section">
          <h2>6. Dati cimiteriali e persone decedute</h2>
          <p>Nel pilot reale potranno essere trattati solo i dati necessari alla ricerca e localizzazione della sepoltura, nei limiti stabiliti dall’ente competente: ad esempio nome, cognome, riferimenti temporali essenziali, cimitero, settore, fila e posizione.</p>
          <p>Il GDPR precisa che non si applica direttamente ai dati delle persone decedute, lasciando agli Stati membri la possibilità di prevedere regole nazionali. In Italia l’art. 2-terdecies del Codice Privacy disciplina l’esercizio di alcuni diritti riferiti ai dati di persone decedute. Per questo Dove Riposa applica comunque minimizzazione, separazione delle finalità e controllo degli accessi anche ai dati cimiteriali.</p>
          <p>Non verranno creati automaticamente profili social o commemorativi, dediche, community, ceri virtuali, classifiche, pubblicità o servizi commerciali associati alla scheda del defunto.</p>
        </section>

        <section className="privacy-section">
          <h2>7. Perché la ricerca pubblica non richiede registrazione</h2>
          <p>La ricerca dell’ubicazione di una sepoltura è progettata senza identificare il cittadino. La registrazione non è necessaria per la consultazione e aumenterebbe i dati raccolti senza essere indispensabile alla finalità. La protezione da interrogazioni massive dovrà essere realizzata con limiti tecnici, rate limiting, protezioni anti-bot e, quando proporzionato, CAPTCHA, non obbligando il cittadino a creare un account.</p>
        </section>

        <section className="privacy-section">
          <h2>8. Base giuridica e ruoli nel servizio reale</h2>
          <p>La base giuridica definitiva non può essere stabilita dalla demo. In un servizio istituzionale, il Comune determina finalità e mezzi essenziali e valuterà la base giuridica applicabile, normalmente nell’ambito di un obbligo legale o di un compito di interesse pubblico ai sensi dell’art. 6 GDPR e della normativa nazionale pertinente.</p>
          <p>Il fornitore tecnico, se tratta dati per conto del Comune, dovrà essere formalmente nominato responsabile del trattamento con un atto conforme all’art. 28 GDPR. Eventuali ulteriori fornitori dovranno essere autorizzati e contrattualizzati come sub-responsabili quando applicabile.</p>
        </section>

        <section className="privacy-section">
          <h2>9. Fornitori tecnici e trasferimenti</h2>
          <p>La demo utilizza Vercel per hosting e distribuzione dell’app e Supabase per database/autenticazione. Il database Supabase del progetto è configurato in regione UE (Francoforte). I fornitori possono avvalersi di propri sub-responsabili e, secondo i rispettivi accordi, possono rendersi necessari trasferimenti internazionali soggetti alle garanzie previste dal GDPR.</p>
          <p>Prima del pilot reale verranno verificati piano contrattuale, DPA, lista dei sub-responsabili, localizzazione dei trattamenti e meccanismi di trasferimento. Nessun archivio comunale reale verrà caricato finché questa verifica non sarà completata.</p>
        </section>

        <section className="privacy-section">
          <h2>10. Conservazione</h2>
          <p>La demo non conserva nel database i termini di ricerca pubblica. I log tecnici dell’infrastruttura possono avere tempi di conservazione determinati dalle configurazioni dei fornitori. Prima della produzione verranno definiti e documentati periodi distinti per log di sicurezza, sessioni operatori, audit amministrativi, segnalazioni e statistiche aggregate, applicando minimizzazione e limitazione della conservazione.</p>
        </section>

        <section className="privacy-section">
          <h2>11. Sicurezza</h2>
          <p>Il backend è predisposto con database multi-ente, Row Level Security, ruoli operatori e autenticazione nominativa. Prima dei dati reali devono essere completati rate limiting/anti-bot, audit delle operazioni, procedure di revoca account, backup e ripristino, gestione incidenti e data breach, revisione periodica delle autorizzazioni e verifica delle misure dei fornitori.</p>
        </section>

        <section className="privacy-section">
          <h2>12. Segnalazioni, rettifiche e diritti</h2>
          <p>Nel servizio reale le segnalazioni su dati o posizioni non produrranno modifiche automatiche: saranno verificate da un operatore autorizzato. L’ente dovrà pubblicare un canale per esercitare i diritti applicabili e per le richieste relative ai dati di persone decedute ai sensi dell’art. 2-terdecies del Codice Privacy.</p>
          <p>I riferimenti pubblici del Comune e del DPO sono già individuati, ma questa demo non li presenta come contatti di un servizio Dove Riposa ufficiale finché l’ente non avrà adottato e validato il pilot. L’informativa definitiva dovrà essere approvata prima del caricamento dei dati reali.</p>
        </section>

        <section className="privacy-section">
          <h2>13. DPIA e accountability</h2>
          <p>Prima del trattamento di dati reali l’ente e il DPO dovranno valutare formalmente se le caratteristiche del servizio richiedono una valutazione d’impatto sulla protezione dei dati (DPIA) ai sensi dell’art. 35 GDPR. La decisione e le misure adottate dovranno essere documentate, insieme a ruoli, registro dei trattamenti, istruzioni agli operatori e procedure di sicurezza.</p>
        </section>
      </div>

      <div className="privacy-sources">
        <h2>Riferimenti ufficiali</h2>
        <p><a href="https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10228173" target="_blank" rel="noreferrer">Garante Privacy · Cimiteri digitali, newsletter 9 marzo 2026</a></p>
        <p><a href="https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10225702" target="_blank" rel="noreferrer">Garante Privacy · Provvedimento 12 febbraio 2026, doc. web 10225702</a></p>
        <p><a href="https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876" target="_blank" rel="noreferrer">Garante Privacy · Linee guida cookie e altri strumenti di tracciamento</a></p>
        <p><a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=it" target="_blank" rel="noreferrer">Regolamento (UE) 2016/679 · GDPR</a></p>
        <p><a href="https://www.normattiva.it/eli/id/2003/07/29/003G0218/CONSOLIDATED/" target="_blank" rel="noreferrer">D.lgs. 196/2003 · Codice Privacy</a></p>
      </div>

      <div className="legal-box"><b>Documento di demo, non informativa comunale definitiva</b><p>Questa pagina riduce l’ambiguità della fase dimostrativa ma non sostituisce l’informativa ex artt. 12-14 GDPR che dovrà essere approvata dal titolare effettivo prima dell’uso di dati reali.</p></div>
    </section>

    <footer><div className="footer-brand"><BrandLockup compact subtitle="Pescantina · demo pilota"/></div><p><Link href="/pescantina/termini">Termini d’uso</Link> · <Link href="/pescantina/accessibilita">Accessibilità</Link> · <Link href="/pescantina">Torna alla ricerca</Link></p></footer>
  </main>
}
