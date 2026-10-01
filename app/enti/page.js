import Link from 'next/link';
import BrandLockup from '../components/BrandLockup';

export default function EntiPage(){
  return <main>
    <header className="citizen-header">
      <Link href="/" className="citizen-brand"><BrandLockup subtitle="Per Comuni e gestori"/></Link>
      <nav><Link href="/povegliano-veronese">Demo cittadino</Link><Link href="/admin">Area riservata</Link></nav>
    </header>

    <section className="info-page wrap">
      <div className="info-hero">
        <span className="eyebrow">DOVE RIPOSA PER GLI ENTI</span>
        <h1>Non un altro gestionale cimiteriale. Il layer di navigazione sopra i dati che il Comune possiede già.</h1>
        <p>Dove Riposa separa il back-office amministrativo dall’esperienza del cittadino: importa i dati necessari, costruisce una rete di percorsi verificabili e accompagna la persona fino a settore, fila e posizione senza richiedere un account.</p>
      </div>

      <div className="platform-core public-core">
        <article><span>BRIDGE</span><h3>Non sostituisce il gestionale</h3><p>Il Comune continua a usare il proprio software. Dove Riposa importa export CSV, memorizza la mappatura delle colonne e usa solo i dati necessari al servizio pubblico.</p></article>
        <article><span>PRECISION</span><h3>QR come nodi di posizione</h3><p>I QR non devono stare sulle tombe: possono essere installati in ingresso e nei nodi strategici per ricalibrare la navigazione quando il GPS non basta.</p></article>
        <article><span>ACCESS</span><h3>Accessibilità dentro il percorso</h3><p>Superficie, pendenza, larghezza, gradini, rampe e punti di sosta diventano attributi dei singoli tratti e possono influenzare il routing.</p></article>
        <article><span>LIVE</span><h3>La mappa non è statica</h3><p>Lavori, passaggi chiusi o limitazioni temporanee possono escludere un tratto e ricalcolare il percorso disponibile.</p></article>
        <article><span>CHECK</span><h3>L’arrivo viene confermato</h3><p>Alla fine Precision mostra settore, fila e posizione e chiede una conferma esplicita. Se la sepoltura non viene trovata, invita a ricalibrare dal marker più vicino.</p></article>
        <article><span>HAPTIC</span><h3>Guida silenziosa opzionale</h3><p>Sui browser compatibili, brevi pattern di vibrazione possono distinguere dritto, sinistra, destra e arrivo. È una funzione sperimentale da validare con utenti ciechi e ipovedenti, non uno standard internazionale.</p></article>
      </div>

      <div className="business-note">
        <b>Il principio che ci differenzia</b>
        <p>Dove Riposa non vuole diventare il software con cui il Comune gestisce concessioni, rinnovi, contratti, memoriali o servizi commerciali. Si concentra sul problema specifico del cittadino: <strong>trovare una sepoltura e raggiungerla con un percorso comprensibile, verificabile e adatto alle condizioni reali del cimitero.</strong></p>
      </div>

      <div className="info-grid">
        <article><h3>Web, non app obbligatoria</h3><p>Accesso immediato da browser, QR o sito comunale. Nessun download necessario per il cittadino.</p></article>
        <article><h3>Ricerca senza account</h3><p>La ricerca pubblica non richiede registrazione. I termini cercati non devono diventare profili o interessi dell’utente.</p></article>
        <article><h3>Multi-Comune e multi-cimitero</h3><p>Un’unica infrastruttura può separare enti e cimiteri senza creare applicazioni isolate per ogni amministrazione.</p></article>
        <article><h3>Data Bridge già operativo</h3><p>L’admin accetta CSV, associa le colonne, mostra un’anteprima, salta i duplicati e importa i record come bozza per la successiva verifica.</p></article>
        <article><h3>Sopralluogo accessibilità</h3><p>I dati stimati restano “da verificare”. Solo il controllo sul posto può trasformare un tratto in informazione operativa affidabile.</p></article>
        <article><h3>QR Precision</h3><p>L’admin genera QR di posizione per ogni nodo configurato, con download e test del link prima dell’installazione fisica.</p></article>
      </div>

      <div className="business-note">
        <b>Proposta Comune pilota fondatore · 12 mesi gratuiti</b>
        <p>Il Comune pilota utilizza Dove Riposa gratuitamente per 12 mesi dall’attivazione della versione reale. Il test misura ricerca, navigazione, QR, accessibilità, qualità dei dati, segnalazioni e deviazioni Live.</p>
        <p>Per partire servono planimetria ufficiale, archivio autorizzato, un referente operativo e validazione dei flussi con il DPO. Hosting, accordi, ruoli privacy, retention, backup e misure anti-abuso vanno chiusi prima di caricare dati reali.</p>
        <p><Link className="text-link" href="/povegliano-veronese/privacy">Privacy by design →</Link> · <Link className="text-link" href="/povegliano-veronese/accessibilita">Accessibilità →</Link></p>
      </div>
    </section>
  </main>
}
