# DPIA screening - Dove Riposa

Aggiornamento: 30/09/2026

## Esito preliminare

La demo non contiene dati comunali reali. Prima del pilot reale deve essere documentato un **DPIA screening** con il DPO del Comune.

Non viene dichiarato qui che una DPIA sia sempre obbligatoria. Tuttavia è prudente valutarla formalmente perché il progetto combina:
- dati cimiteriali resi ricercabili online;
- nuova tecnologia di navigazione/QR/fotocamera;
- area amministrativa multi-ente;
- possibilità futura di geolocalizzazione;
- pubblicazione di informazioni potenzialmente soggette a interrogazioni massive.

## Domande da chiudere

1. Quali dati saranno pubblicati esattamente?
2. La data completa di nascita/morte è necessaria o bastano gli anni?
3. La ricerca è indicizzabile dai motori? Default consigliato: no per le pagine nominative.
4. Quante sepolture e quanti Comuni saranno coinvolti?
5. Esistono dati riferiti a persone viventi (concessionari, eredi, contatti) nel gestionale sorgente? Se sì, NON importarli nel layer pubblico senza specifica necessità.
6. Sarà usata geolocalizzazione? Verrà memorizzata? Default consigliato: no storico.
7. La fotocamera resta locale? Default: sì.
8. Quali log conserva l'hosting e per quanto?
9. Quali sub-responsabili e trasferimenti extra SEE esistono?
10. Quali misure anti-scraping limitano interrogazioni massive?
11. Come si gestiscono esercizio diritti/rettifiche e art. 2-terdecies?
12. Come viene gestita la cessazione del contratto?

## Misure di riduzione del rischio già previste

- nessun account per la ricerca pubblica;
- nessun profilo social/commerciale del defunto;
- minimizzazione dei campi;
- analytics senza termini di ricerca;
- RLS e multi-tenancy;
- account operatori nominativi;
- QR che identificano luoghi, non utenti;
- fotocamera on demand e senza upload applicativo;
- accessibility metadata separati da profili personali;
- anti-scraping da completare prima dei dati reali.

## Decisione

[ ] DPIA non necessaria - motivazione documentata
[ ] DPIA necessaria - avviata
[ ] DPIA completata - rischio residuo accettato
[ ] Rischio residuo elevato - valutare art. 36 GDPR
