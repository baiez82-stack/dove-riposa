import Link from 'next/link';

export default function EntiPage(){
  return <main>
    <header className="citizen-header"><Link href="/" className="citizen-brand"><span className="mark">DR</span><div><strong>Dove Riposa</strong><small>Per Comuni e gestori</small></div></Link><nav><Link href="/povegliano-veronese">Demo cittadino</Link><Link href="/admin">Area riservata</Link></nav></header>
    <section className="info-page wrap">
      <div className="info-hero"><span className="eyebrow">DOVE RIPOSA PER GLI ENTI</span><h1>Un unico servizio, ogni Comune con la propria area.</h1><p>Dove Riposa mantiene un marchio nazionale ma crea un ambiente dedicato per ogni ente: URL, QR, mappa, archivio, dashboard e contenuti locali.</p></div>
      <div className="info-grid">
        <article><h3>QR dedicato</h3><p>Ogni Comune può posizionare QR all’ingresso, sulle bacheche o nei settori. Il cittadino entra direttamente nell’area del proprio Comune.</p></article>
        <article><h3>Archivio flessibile</h3><p>Inserimento e modifica manuale, import CSV/Excel e, in seguito, sincronizzazione API con il gestionale esistente.</p></article>
        <article><h3>Mappa e navigazione</h3><p>Planimetria interattiva, percorso fino alla sepoltura e navigazione con fotocamera calibrabile tramite QR/marker.</p></article>
        <article><h3>Statistiche aggregate</h3><p>Accessi, ricerche, risultati aperti, navigazioni e ingressi da QR, senza registrazione del cittadino e senza inviare i nomi cercati agli analytics.</p></article>
        <article><h3>Privacy by design</h3><p>Nessun account per la ricerca pubblica, nessun profilo commemorativo automatico, fotocamera attivata solo su richiesta e separazione netta tra servizio istituzionale e area gestionale.</p></article>
        <article><h3>Audit operativo</h3><p>Storico delle modifiche, importazioni e correzioni per sapere chi ha aggiornato cosa e quando.</p></article>
        <article><h3>Multi-Comune</h3><p>Un’unica piattaforma tecnica, dati separati per ente e possibilità di gestire più cimiteri nello stesso Comune.</p></article>
      </div>
      <div className="business-note"><b>Pilot Povegliano Veronese</b><p>La demo pubblica è già disponibile. Per passare alla sperimentazione reale servono planimetria ufficiale, archivio autorizzato e validazione dei flussi con l’ente e il DPO. La configurazione privacy, i ruoli, i fornitori, i tempi di conservazione e le misure di sicurezza verranno formalizzati prima di caricare dati reali.</p><p><Link className="text-link" href="/povegliano-veronese/privacy">Vedi la privacy by design già incorporata nella demo →</Link></p></div>
    </section>
  </main>
}
