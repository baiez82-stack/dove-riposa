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
        <span className="eyebrow">DEMO PILOTA · ULTIMO AGGIORNAMENTO 28/09/2026</span>
        <h1>Termini d’uso</h1>
        <p>Questi termini regolano l’uso della versione dimostrativa di Dove Riposa. La demo non è ancora un servizio ufficiale del Comune di Povegliano Veronese e utilizza esclusivamente dati e posizioni dimostrativi.</p>
      </div>

      <div className="privacy-sections">
        <section className="privacy-section"><h2>1. Finalità della demo</h2><p>Dove Riposa è un prototipo destinato a mostrare come potrebbe funzionare un servizio digitale di ricerca e localizzazione delle sepolture. Le informazioni presenti nella demo non provengono dagli archivi ufficiali del Comune e non devono essere utilizzate come fonte amministrativa o certificativa.</p></section>

        <section className="privacy-section"><h2>2. Accesso al servizio</h2><p>La consultazione pubblica è gratuita e non richiede registrazione. L’accesso all’area riservata è separato ed è destinato esclusivamente a dimostrare le funzioni di gestione per gli enti. Le credenziali demo non devono essere considerate misure di sicurezza idonee alla produzione.</p></section>

        <section className="privacy-section"><h2>3. Uso consentito</h2><p>La demo può essere utilizzata per consultazione personale, valutazione del progetto e presentazione istituzionale. Non è consentito utilizzare il servizio per raccolte massive di dati, scraping automatizzato, aggiramento di limiti tecnici, tentativi di accesso non autorizzato o attività che possano compromettere il funzionamento della piattaforma.</p></section>

        <section className="privacy-section"><h2>4. Accuratezza delle informazioni</h2><p>Nella demo nomi, date, settori, file, loculi, distanze e percorsi sono esemplificativi. La ricostruzione grafica del cimitero deriva da una vista satellitare fornita per il prototipo e non costituisce planimetria ufficiale. Prima di un eventuale utilizzo reale, dati e cartografia dovranno essere forniti o validati dall’ente competente.</p></section>

        <section className="privacy-section"><h2>5. Navigazione e fotocamera</h2><p>La funzione con fotocamera è dimostrativa e non sostituisce la segnaletica presente sul posto. L’utente deve prestare attenzione all’ambiente circostante, ai percorsi accessibili e alle indicazioni dell’ente gestore. La fotocamera viene attivata solo previa autorizzazione del dispositivo.</p></section>

        <section className="privacy-section"><h2>6. Segnalazioni e correzioni</h2><p>Nella versione reale sarà previsto un canale per segnalare errori o incongruenze. Le segnalazioni non produrranno modifiche automatiche: ogni variazione dovrà essere verificata da un operatore autorizzato o dall’ente titolare dei dati.</p></section>

        <section className="privacy-section"><h2>7. Proprietà intellettuale e dati pubblici</h2><p>Il software, l’interfaccia, il marchio Dove Riposa e gli elementi grafici originali restano protetti secondo la normativa applicabile. I dati eventualmente forniti dagli enti manterranno il regime giuridico, le condizioni di riuso e le titolarità definite dalla fonte e dagli accordi con l’ente.</p></section>

        <section className="privacy-section"><h2>8. Disponibilità e modifiche</h2><p>Essendo una demo, il servizio può essere modificato, sospeso o aggiornato in qualsiasi momento. Funzioni, percorsi, layout e contenuti possono cambiare durante la sperimentazione. Non viene garantita continuità operativa tipica di un servizio pubblico in produzione.</p></section>

        <section className="privacy-section"><h2>9. Privacy</h2><p>Il trattamento dei dati tecnici e le scelte privacy della demo sono descritti nella pagina <Link className="text-link" href="/povegliano-veronese/privacy">Privacy e trasparenza</Link>. Prima di collegare archivi comunali reali saranno definiti con il Comune e il DPO ruoli, basi giuridiche, fornitori, misure di sicurezza, tempi di conservazione e informativa definitiva.</p></section>

        <section className="privacy-section"><h2>10. Legge applicabile</h2><p>La demo è sviluppata e resa disponibile in Italia. Per gli aspetti non disciplinati da questi termini si applica la normativa italiana ed europea pertinente. Eventuali condizioni specifiche del servizio in produzione saranno definite negli accordi con l’ente aderente e nella documentazione definitiva.</p></section>
      </div>

      <div className="legal-box"><b>Stato del documento</b><p>Questi termini sono predisposti per una demo tecnica e istituzionale. Prima della messa in produzione con dati reali dovranno essere completati con l’identificazione del soggetto gestore del servizio, i contatti ufficiali, le responsabilità contrattuali e la validazione legale necessaria.</p></div>
    </section>

    <footer><div className="footer-brand"><BrandLockup compact subtitle="Povegliano Veronese · demo pilota"/></div><p><Link href="/povegliano-veronese/privacy">Privacy</Link> · <Link href="/povegliano-veronese">Torna alla ricerca</Link></p></footer>
  </main>
}
