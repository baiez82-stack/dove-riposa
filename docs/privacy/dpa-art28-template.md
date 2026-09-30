# Bozza accordo sul trattamento dati - Art. 28 GDPR

> Modello operativo da adattare con il Comune/DPO e sottoporre a validazione legale prima del pilot reale. Non firmare senza completare i campi tra parentesi quadre.

## 1. Parti e ruoli

- **Titolare del trattamento:** [Comune / ente titolare]
- **Responsabile del trattamento:** [fornitore Dove Riposa - ragione sociale, sede, P.IVA/C.F., PEC/email]
- **DPO del titolare:** [contatti]
- **Referente sicurezza/tecnico del responsabile:** [contatti]

Se il servizio è gestito da una municipalizzata o altro gestore cimiteriale per conto del Comune, verificare la catena titolare → responsabile → sub-responsabile prima della firma.

## 2. Oggetto e durata

Il Responsabile tratta i dati esclusivamente per erogare e manutenere Dove Riposa: ricerca e localizzazione delle sepolture, navigazione, gestione cartografia/Accessibility Layer, QR Precision, eventi Live, segnalazioni, area operatori, sicurezza e statistiche aggregate.

Durata: [durata pilot/contratto] più il periodo strettamente necessario a restituzione/cancellazione e chiusura tecnica.

## 3. Categorie di dati

### Dati cimiteriali
- nome e cognome del defunto;
- anno/data di nascita e morte solo se necessari;
- cimitero, settore/campo, fila, loculo/tomba/cippo;
- coordinate/posizione sulla planimetria;
- stato di verifica del record.

### Dati di persone viventi
- operatori autorizzati: email, user id, ruolo, log di accesso e audit;
- eventuali segnalanti: solo dati strettamente necessari se l'ente decide di raccoglierli;
- dati tecnici: IP, user-agent, timestamp e log di sicurezza nella misura necessaria.

### Dati esclusi per impostazione
- nessun account del cittadino per la ricerca;
- nessuna cronologia nominativa delle ricerche;
- nessun profilo sanitario;
- nessun profilo commemorativo/social automatico;
- nessun dato commerciale collegato al defunto.

## 4. Interessati

- operatori comunali/gestore;
- cittadini che utilizzano il servizio limitatamente ai dati tecnici inevitabili;
- persone che inviano segnalazioni, se la funzione viene attivata;
- soggetti legittimati a esercitare diritti riferiti ai dati di persone decedute ai sensi della normativa italiana.

## 5. Istruzioni documentate

Il Responsabile:
- tratta i dati solo su istruzioni documentate del Titolare;
- non riutilizza dati cimiteriali per finalità proprie, marketing, social, profilazione o addestramento di modelli;
- non crea servizi commerciali agganciati alle schede;
- non comunica o cede i dati salvo istruzione/base legale;
- segnala istruzioni che ritiene in contrasto con la normativa.

## 6. Sicurezza

Misure minime da allegare al contratto:
- autenticazione nominativa e least privilege;
- RLS/multi-tenancy;
- MFA per ruoli amministrativi, se tecnicamente disponibile;
- cifratura in transito e a riposo secondo i servizi utilizzati;
- audit delle operazioni amministrative;
- rate limiting e anti-bot per ricerca pubblica;
- backup e test di ripristino;
- procedure di revoca/offboarding;
- gestione vulnerabilità e patching;
- logging di sicurezza minimizzato;
- incident response e data-breach procedure;
- separazione ambiente demo/produzione.

## 7. Sub-responsabili

Il Titolare autorizza [specificamente / in via generale] i sub-responsabili elencati nel registro allegato. Ogni variazione deve seguire la procedura di notifica/opposizione concordata.

Nessun sub-responsabile può essere utilizzato per dati reali senza adeguate garanzie contrattuali.

## 8. Trasferimenti extra SEE

Eventuali trasferimenti sono ammessi solo nel rispetto del Capo V GDPR e devono essere documentati con base del trasferimento, garanzie applicabili e, se necessario, valutazione del trasferimento.

## 9. Assistenza al Titolare

Il Responsabile assiste il Titolare per:
- richieste degli interessati;
- richieste ex art. 2-terdecies Codice Privacy;
- DPIA e consultazione preventiva;
- incidenti e data breach;
- audit e verifiche;
- restituzione/cancellazione dati.

## 10. Cessazione

Alla cessazione:
- interrompere sincronizzazioni e connettori;
- revocare credenziali e accessi;
- restituire i dati nel formato concordato;
- cancellare copie operative e backup secondo tempi documentati, salvo obblighi di legge;
- produrre evidenza della chiusura.

## 11. Audit

Il Titolare può verificare le misure concordate con modalità proporzionate, inclusa documentazione, report di sicurezza e audit concordati.

## 12. Allegati da completare

- Allegato A: descrizione trattamenti;
- Allegato B: misure tecniche e organizzative;
- Allegato C: sub-responsabili;
- Allegato D: retention;
- Allegato E: procedura incidenti/data breach;
- Allegato F: export/restituzione a fine rapporto.
