import Link from 'next/link';
import BrandLockup from '../components/BrandLockup';

export default function EntiPage(){
  return <main>
    <header className="citizen-header"><Link href="/" className="citizen-brand"><BrandLockup subtitle="Per Comuni e gestori"/></Link><nav><Link href="/povegliano-veronese">Demo cittadino</Link><Link href="/admin">Area riservata</Link></nav></header>
    <section className="info-page wrap">
      <div className="info-hero"><span className="eyebrow">DOVE RIPOSA PER GLI ENTI</span><h1>Un servizio semplice da pilotare, progettato per crescere Comune dopo Comune.</h1><p>La demo valida già ricerca, QR, mappa, Precision, Accessibility Layer e Live. Database multi-ente, autenticazione di produzione, audit e integrazioni gestionali fanno parte della fase successiva del pilot reale.</p></div>
      <div className="info-grid">
        <article><h3>QR dedicato</h3><p>Ogni Comune può posizionare QR all’ingresso, sulle bacheche o nei settori. Il cittadino entra direttamente nell’area del proprio Comune.</p></article>
        <article><h3>Archivio flessibile</h3><p>La demo supporta inserimento manuale e lettura CSV. Excel, persistenza e sincronizzazione API con il gestionale esistente saranno attivati nella fase di produzione.</p></article>
        <article><h3>Mappa e navigazione</h3><p>Planimetria interattiva, percorso fino alla sepoltura e navigazione con fotocamera calibrabile tramite QR/marker.</p></article>
        <article><h3>Statistiche aggregate</h3><p>Accessi, ricerche, risultati aperti, navigazioni e ingressi da QR, senza registrazione del cittadino e senza inviare i nomi cercati agli analytics.</p></article>
        <article><h3>Privacy by design</h3><p>Nessun account per la ricerca pubblica, nessun profilo commemorativo automatico, fotocamera attivata solo su richiesta e separazione netta tra servizio istituzionale e area gestionale.</p></article>
        <article><h3>Audit operativo · roadmap</h3><p>Previsto nella versione di produzione: storico di accessi, modifiche, importazioni e correzioni per sapere chi ha aggiornato cosa e quando.</p></article>
        <article><h3>Multi-Comune · roadmap</h3><p>Architettura prevista: dati separati per ente e possibilità di gestire più cimiteri nello stesso Comune senza creare applicazioni isolate.</p></article>
      </div>
      <div className="business-note"><b>Posizionamento Dove Riposa</b><p>Il progetto resta volutamente essenziale: accesso web immediato, nessuna app obbligatoria, nessuna registrazione per cercare una sepoltura, nessun profilo social o commemorativo automatico e nessun commercio collegato alla scheda del defunto. Ogni Comune ha la propria area raggiungibile anche da QR e può gestire dati, mappa, importazioni e statistiche aggregate.</p></div>
      <div className="business-note"><b>Pilot Povegliano Veronese</b><p>La demo pubblica è già disponibile. Per passare alla sperimentazione reale servono planimetria ufficiale, archivio autorizzato e validazione dei flussi con l’ente e il DPO. La configurazione privacy, i ruoli, i fornitori, i tempi di conservazione e le misure di sicurezza verranno formalizzati prima di caricare dati reali.</p><p><Link className="text-link" href="/povegliano-veronese/privacy">Privacy by design →</Link> · <Link className="text-link" href="/povegliano-veronese/termini">Termini d’uso demo →</Link></p></div>
    </section>
  </main>
}
